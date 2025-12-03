/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Moment } from 'moment';
import { isNil, isNotNil, move } from 'ramda';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import type { TimelineOptions } from 'vis-timeline';

import data from '../data';
import type { Item, WikiSummary } from '../types';
import { formatNumber, getQuery, setQuery } from '../utils';

import 'vis-timeline/styles/vis-timeline-graph2d.css';

const getScale = () =>
  window.settings.scales[
    getQuery('scale') as keyof typeof window.settings.scales
  ];

const timelineStore = {
  items: new DataSet(data.items),
  groups: data.groups,
  parents: data.parents,
  defaultParents: data.parents,
  sortedParents: data.parents,
  timeline: null as Timeline | null,
  currentItem: null as Item | null,
  sidebarOpen: true,
  searchOpen: true,
  settingsOpen: false,
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
      template: (item: Item, element: HTMLElement) => {
        element.id = (item.id as string).replace(/[^a-zA-Z0-9]/g, '_');
        return `${item.content}`;
      },
    };

    this.timeline = new Timeline(
      container as HTMLElement,
      this.items,
      new DataSet(this.groups),
      options
    );

    if (isNotNil(getScale())) {
      const groups = getScale()!.groups!;
      this.defaultParents = this.defaultParents
        .filter(p => groups.includes(p.id as string))
        .sort(
          (a, b) =>
            groups.indexOf(a.id as string) - groups.indexOf(b.id as string)
        );
      this.sortedParents = this.defaultParents;
    }

    this.updateGroups();
    this.refresh();

    this.timeline.on('rangechanged', range => this.updateItems(range));
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
      } else if (e.key === '0') {
        this.goTo(-3000, +new Date().getFullYear() + 5000);
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
      this.updateItems({
        end: +initialRange.end,
        start: +initialRange.start,
      });
    }
  },

  updateItems(range: { end: number; start: number }) {
    if (isNil(this.timeline)) return;

    const viewport = range.end - range.start;
    const filteredItems = data.items.filter(item => {
      const itemRange = +item.end! - +item.start!;
      return item.type === 'point' || itemRange > viewport / 1000;
    });
    this.timeline.setItems(new DataSet(filteredItems));
  },

  async onItemClick(id: string) {
    this.toggleSidebar(true);
    this.searchOpen = false;
    const item = data.items.find(i => i.id === id);
    if (isNotNil(item)) {
      const result: Item = item;
      if (isNotNil(item.properties?.wikiName)) {
        try {
          const data: WikiSummary = await fetch(
            `https://${item.properties?.wikiLng ?? 'fr'}.wikipedia.org/api/rest_v1/page/summary/${item.properties?.wikiName ?? item.content}`
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
      this.refresh();
    }
  },

  moveParent(id: string, index: number) {
    const previousIndex = this.sortedParents.findIndex(p => p.id === id);
    this.sortedParents = move(previousIndex, index, this.sortedParents);
    this.updateGroups();
  },

  removeParent(id: string) {
    this.sortedParents = this.sortedParents.filter(p => p.id !== id);
    this.defaultParents = this.sortedParents;
    this.updateGroups();
  },

  addParent(id: string) {
    this.sortedParents = [
      ...this.sortedParents,
      this.parents.find(p => p.id === id)!,
    ];
    this.defaultParents = this.sortedParents;
    this.updateGroups();
  },

  updateGroups() {
    if (isNil(this.timeline)) return;

    const updatedGroups = this.groups
      .filter(g => {
        // If is parent
        if (isNil(g.nestedInGroup)) {
          return this.sortedParents.some(p => p.id === g.id);
        } else {
          return this.sortedParents.some(p =>
            p.nestedGroups?.includes(g.id as string)
          );
        }
      })
      .sort(
        (a, b) =>
          this.sortedParents.findIndex(p => p.id === a.id) -
          this.sortedParents.findIndex(p => p.id === b.id)
      );

    this.timeline.setGroups([]);
    setTimeout(() => {
      this.timeline!.setGroups(new DataSet(updatedGroups));
      this.refresh();
    }, 10);
  },

  updateScale(slug: string) {
    if (isNotNil(this.timeline)) {
      const scale = window.settings.scales[slug];
      if (isNotNil(scale)) {
        setQuery('scale', slug);
        this.timeline.setWindow(scale.start, scale.end);
        this.defaultParents = this.groups
          .filter(p => scale?.groups?.includes(p.id as string))
          .sort(
            (a, b) =>
              scale!.groups!.indexOf(a.id as string) -
              scale!.groups!.indexOf(b.id as string)
          );
        this.sortedParents = this.defaultParents;
        this.updateGroups();
      }
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

  focus(elements: string[]) {
    if (isNotNil(this.timeline)) {
      this.timeline.focus(elements);
    }
  },

  select(elements: string[]) {
    if (isNotNil(this.timeline)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.timeline.setSelection(elements, { focus: true });
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
      const results = data.items.filter(
        (item: Item) =>
          item.content.toLowerCase().includes(keyword.toLowerCase()) &&
          this.sortedParents.some(
            p =>
              p.id === item.group ||
              p.nestedGroups?.includes(item.group as string)
          )
      );
      this.searchResults = results;
    } else {
      this.searchResults = [];
    }
  },
};

export default timelineStore;
