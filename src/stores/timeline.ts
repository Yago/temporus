/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Moment } from 'moment';
import { equals, isNotNil, move } from 'ramda';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import type { TimelineOptions } from 'vis-timeline';

import data from '../data';
import type { Group, Item, WikiSummary } from '../types';
import { formatNumber, getLng, getQuery, setQuery } from '../utils';

import 'vis-timeline/styles/vis-timeline-graph2d.css';

const getScale = () =>
  window.settings.scales[
    getQuery('scale') as keyof typeof window.settings.scales
  ];

const timelineStore = {
  items: new DataSet(data.items),
  groups: data.groups,
  timeline: null as Timeline | null,
  currentItem: null as Item | null,
  sidebarOpen: true,
  searchOpen: false,
  fullscreen: false,
  searchResults: [] as Item[],

  create() {
    const container = document.getElementById('visualization');

    const options: TimelineOptions = {
      verticalScroll: true,
      horizontalScroll: true,
      horizontalScrollKey: 'shiftKey',
      horizontalScrollInvert: true,
      zoomKey: 'ctrlKey',
      maxHeight: '100vh',
      height: '100vh',
      max: 200000000,
      min: -6000000000,
      start: getScale()?.start ?? undefined,
      end: getScale()?.end ?? undefined,
      // zoomMax: 31536000000000000,
      // zoomMin: 10,
      orientation: {
        axis: 'both',
        item: 'top',
      },
      margin: {
        axis: 0,
        item: {
          horizontal: 0,
          vertical: 0,
        },
      },
      showMajorLabels: false,
      format: {
        minorLabels(date) {
          return String(formatNumber(+(date as unknown as Moment).format('x')));
        },
      },
      groupTemplate: group => {
        if (group.nestedGroups?.length === undefined) return group.content;
        const parentsAmount = this.groups.filter(
          g => g.nestedGroups !== undefined && g.previousPosition === undefined
        ).length;
        const id = this.groups.findIndex(g => g.id === group.id);
        const isHidden = group.previousPosition !== undefined;
        const container = document.createElement('div');
        // Strange fix to avoid huge height on click
        container.addEventListener('click', e => e.stopPropagation());
        container.classList.add('flex', 'w-full', 'gap-1', 'items-center');

        const label = document.createElement('span');
        label.innerHTML = group.content + ' ';
        label.classList.add('pr-2');
        label.classList.add('mr-auto');
        container.append(label);

        const up = document.createElement('button');
        up.innerHTML = '↑';
        up.addEventListener('click', () => this.moveGroup(group, 'up'));
        if (id > 0 && !isHidden) container.append(up);

        const down = document.createElement('button');
        down.innerHTML = '↓';
        down.addEventListener('click', () => this.moveGroup(group, 'down'));
        if (id < parentsAmount - 1 && !isHidden) container.append(down);

        const hide = document.createElement('button');
        hide.innerHTML = isHidden ? '+' : '×';
        hide.style.fontSize = '18px';
        hide.addEventListener('click', () => this.toggleGroupVisibility(group));
        container.append(hide);

        return container;
      },
    };

    this.timeline = new Timeline(
      container as HTMLElement,
      this.items,
      new DataSet(this.groups),
      options
    );

    this.setScaleGroupVisibility();
    this.refresh();

    this.timeline.on('rangechange', range => this.onRangeChange(range));
    this.timeline.on('click', e => {
      if (e?.item) this.onItemClick(e.item);
      this.highlightItems([e?.item]);
    });

    // Add keyboard controls and fullscreen toggle
    document.addEventListener('keydown', e => {
      const id = (e.target as HTMLElement).id;
      if (id === 'searchInput') {
        if (e.key === 'Escape') {
          this.searchOpen = false;
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        this.move(0.5);
      } else if (e.key === 'ArrowRight') {
        this.move(-0.5);
      } else if (e.key === 'ArrowUp') {
        this.zoomIn(1);
      } else if (e.key === 'ArrowDown') {
        this.zoomOut(1);
      } else if (e.key === 'f') {
        if (this.fullscreen) {
          this.exitFullscreen();
        } else {
          this.launchFullscreen();
        }
        this.fullscreen = !this.fullscreen;
      } else if (e.key === 's') {
        this.searchOpen = !this.searchOpen;
        if (this.searchOpen) {
          setTimeout(() => document.getElementById('searchInput')?.focus(), 0);
        }
      }
    });
  },

  refresh() {
    if (isNotNil(this.timeline)) {
      const initialRange = this.timeline.getWindow();
      this.onRangeChange({
        end: +initialRange.end,
        start: +initialRange.start,
      });
    }
  },

  onRangeChange(range: { end: number; start: number }) {
    if (isNotNil(this.timeline)) {
      const viewport = range.end - range.start;
      const filteredItems = data.items.filter(item => {
        const itemRange = +item.end! - +item.start!;
        return item.type === 'point' || itemRange > viewport / 1000;
      });
      this.timeline.setItems(new DataSet(filteredItems));
    }
  },

  async onItemClick(id: string) {
    const lng = getLng();
    this.toggleSidebar(true);
    this.searchOpen = false;
    const item = data.items.find(i => i.id === id);
    if (isNotNil(item)) {
      const result: Item = item;
      if (isNotNil(item.properties?.wikiName)) {
        try {
          const data: WikiSummary = await fetch(
            `https://${lng ?? 'fr'}.wikipedia.org/api/rest_v1/page/summary/${item.properties?.wikiName ?? item.content}`
          ).then(res => res.json());
          if (isNotNil(data)) {
            result.properties!.description = data.extract_html;
            result.properties!.wikiUrl = data.content_urls.desktop.page;
            result.properties!.cover = data.thumbnail?.source ?? undefined;
          }
        } finally {
          this.currentItem = result;
        }
      } else {
        this.currentItem = result;
      }
    }
  },

  highlightItems(ids: string[]) {
    if (isNotNil(this.timeline)) {
      const styledItems = data.items.map(i => {
        i.className = ids.includes(i.id as string)
          ? `bg-white! text-black! border-black! outline-2 outline-dashed outline-offset-4 outline-white z-10!`
          : undefined;
        return i;
      });
      this.timeline.setItems(new DataSet(styledItems));
      this.timeline.redraw();
    }
  },

  moveGroup(group: Group, direction: 'up' | 'down') {
    if (isNotNil(this.timeline)) {
      const id = this.groups.findIndex(g => g.id === group.id);
      this.groups = move(id, id + (direction === 'up' ? -1 : 1), this.groups);
      // Dirty hack to avoid nested groups being toggle
      this.timeline.setGroups([]);
      setTimeout(() => {
        this.timeline!.setGroups(new DataSet(this.groups));
        this.refresh();
      }, 0);
    }
  },

  toggleGroupVisibility(group: Group) {
    if (isNotNil(this.timeline)) {
      const isHidden = group.previousPosition !== undefined;
      const parentsAmount = this.groups.filter(
        g => g.nestedGroups !== undefined && g.previousPosition === undefined
      ).length;
      const id = this.groups.findIndex(g => g.id === group.id);
      this.groups = move(
        id,
        isHidden ? group.previousPosition! : parentsAmount - 1,
        this.groups
      ).map(g => {
        if (g.id === group.id) {
          return {
            ...g,
            showNested: false,
            style: isHidden ? undefined : 'opacity: 0.4;',
            previousPosition: isHidden ? undefined : id,
          };
        }
        return g;
      });
      // Dirty hack to avoid nested groups being toggle
      this.timeline.setGroups([]);
      setTimeout(() => {
        this.timeline!.setGroups(new DataSet(this.groups));
        this.refresh();
      }, 0);
    }
  },

  setScaleGroupVisibility() {
    if (isNotNil(this.timeline)) {
      const parents = this.groups.filter(g => g.nestedGroups !== undefined);
      parents?.forEach(group => {
        const isVisible = getScale()?.groups?.includes(group.id as string);
        const currentIndex = this.groups.findIndex(g => g.id === group.id);
        const originalIndex = data.groups.findIndex(g => g.id === group.id);
        const visibleIndex = getScale()?.groups?.indexOf(group.id as string);
        const lastIndex = parents.length - 1;
        this.groups = move(
          currentIndex,
          isVisible ? visibleIndex! : lastIndex,
          this.groups
        ).map(g => {
          if (g.id === group.id) {
            return {
              ...g,
              showNested: isVisible,
              style: isVisible ? undefined : 'opacity: 0.4;',
              previousPosition: isVisible ? undefined : originalIndex,
            };
          }
          return g;
        });
      });
      // Dirty hack to avoid nested groups being toggle
      this.timeline.setGroups([]);
      setTimeout(() => {
        this.timeline!.setGroups(new DataSet(this.groups));
        this.refresh();
      }, 0);
    }
  },

  destroy() {
    this.timeline?.destroy();
  },

  goTo(start: number, end: number) {
    if (isNotNil(this.timeline)) {
      this.timeline.setWindow(start, end);
    }
  },

  goToScale(slug: string) {
    if (isNotNil(this.timeline)) {
      const previousScale = getScale();
      const scale = window.settings.scales[slug];
      if (isNotNil(scale)) {
        setQuery('scale', slug);
        this.timeline.setWindow(scale.start, scale.end);

        if (!equals(previousScale.groups, scale.groups)) {
          this.setScaleGroupVisibility();
        }
      }
    }
  },

  focus(elements: string[]) {
    if (isNotNil(this.timeline)) {
      this.timeline.focus(elements);
    }
  },

  select(elements: string[]) {
    if (isNotNil(this.timeline)) {
      this.timeline.setSelection(elements);
    }
  },

  toggleSidebar(state?: boolean) {
    this.sidebarOpen = state ?? !this.sidebarOpen;
  },

  move(percentage: number) {
    if (isNotNil(this.timeline)) {
      const range = this.timeline.getWindow();
      const interval = Number(range.end) - Number(range.start);

      this.timeline?.setWindow(
        Number(range.start) - interval * percentage,
        Number(range.end) - interval * percentage
      );
    }
  },

  zoomIn(percentage: number) {
    if (isNotNil(this.timeline)) {
      this.timeline.zoomIn(percentage);
    }
  },

  zoomOut(percentage: number) {
    if (isNotNil(this.timeline)) {
      this.timeline.zoomOut(percentage);
    }
  },

  launchFullscreen() {
    const elem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
    };

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    }
  },

  exitFullscreen() {
    if (document.exitFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      }
    }
  },

  search(keyword: string) {
    if (keyword.length > 2) {
      const results = data.items.filter((item: Item) =>
        item.content.toLowerCase().includes(keyword.toLowerCase())
      );
      this.searchResults = results;
    } else {
      this.searchResults = [];
    }
  },
};

export default timelineStore;
