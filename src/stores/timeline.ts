/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Moment } from 'moment';
import { isNotNil } from 'ramda';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import type { TimelineOptions } from 'vis-timeline';

import data from '../data';
import type { Item, WikiSummary } from '../types';
import { formatNumber, getLng, getQuery, setQuery } from '../utils';

import 'vis-timeline/styles/vis-timeline-graph2d.css';

const { items, groups } = data;

const timelineStore = {
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
      start:
        window.settings.scales[
          getQuery('scale') as keyof typeof window.settings.scales
        ]?.start ?? undefined,
      end:
        window.settings.scales[
          getQuery('scale') as keyof typeof window.settings.scales
        ]?.end ?? undefined,
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
    };

    this.timeline = new Timeline(
      container as HTMLElement,
      new DataSet(items),
      new DataSet(groups),
      options
    );

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

  onRangeChange(range: { end: number; start: number }) {
    const viewport = range.end - range.start;
    const filteredItems = items.filter(item => {
      const itemRange = +item.end! - +item.start!;
      return item.type === 'point' || itemRange > viewport / 1000;
    });
    this.timeline!.setItems(new DataSet(filteredItems));
  },

  async onItemClick(id: string) {
    const lng = getLng();
    this.toggleSidebar(true);
    this.searchOpen = false;
    const item = items.find(i => i.id === id);
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
      const styledItems = items.map(i => {
        i.className = ids.includes(i.id as string)
          ? `bg-white! text-black! border-black! outline-2 outline-dashed outline-offset-4 outline-white z-10!`
          : undefined;
        return i;
      });
      this.timeline.setItems(new DataSet(styledItems));
      this.timeline.redraw();
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
      const scale = window.settings.scales[slug];
      if (isNotNil(scale)) {
        setQuery('scale', slug);
        this.timeline.setWindow(scale.start, scale.end);
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
      const results = items.filter(item =>
        item.content.toLowerCase().includes(keyword.toLowerCase())
      );
      this.searchResults = results;
    } else {
      this.searchResults = [];
    }
  },
};

export default timelineStore;
