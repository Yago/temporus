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
  sidebarOpen: false,

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
        settings.scales[getQuery('scale') as keyof typeof settings.scales]
          ?.start ?? undefined,
      end:
        settings.scales[getQuery('scale') as keyof typeof settings.scales]
          ?.end ?? undefined,
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
    this.timeline.on('click', e => this.onItemClick(e));
  },

  onRangeChange(range: { end: number; start: number }) {
    const viewport = range.end - range.start;
    const filteredItems = items.filter(item => {
      const itemRange = +item.end! - +item.start!;
      return itemRange > viewport / 1000;
    });
    this.timeline!.setItems(new DataSet(filteredItems));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onItemClick(e: any) {
    const lng = getLng();
    if (isNotNil(e.item)) {
      this.toggleSidebar(true);
      const item = items.find(i => i.id === e.item);
      if (isNotNil(item)) {
        const result: Item = item;
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

  goToScale(slug: string) {
    if (isNotNil(this.timeline)) {
      const scale = window.settings.scales[slug];
      if (isNotNil(scale)) {
        setQuery('scale', slug);
        this.timeline.setWindow(scale.start, scale.end);
      }
    }
  },

  toggleSidebar(state?: boolean) {
    this.sidebarOpen = state ?? !this.sidebarOpen;
  },
};

export default timelineStore;
