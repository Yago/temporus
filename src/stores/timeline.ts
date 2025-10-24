import type { Moment } from 'moment';
import { isNotNil } from 'ramda';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import type { TimelineOptions } from 'vis-timeline';
import wiki from 'wikipedia';

import data from '../data';
import type { Item } from '../types';
import { formatNumber, getLng } from '../utils';

import 'vis-timeline/styles/vis-timeline-graph2d.css';

const { items, groups } = data;

const timelineStore = {
  timeline: null as Timeline | null,
  currentItem: null as Item | null,

  create() {
    const lng = getLng();
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
          return String(
            formatNumber(+(date as unknown as Moment).format('x'), lng)
          );
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

    this.currentItem = items[0];
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
      const item = items.find(i => i.id === e.item);
      if (isNotNil(item)) {
        await wiki.setLang(lng);
        const page = await wiki.page(item.content);
        const summary = await page.summary();
        this.currentItem = {
          ...item,
          properties: {
            description: summary?.extract_html ?? item.properties?.description,
            wikiUrl: page?.fullurl,
          },
        };
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
};

export default timelineStore;
