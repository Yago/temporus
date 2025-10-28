import { isNotEmpty, isNotNil } from 'ramda';
import type { DataGroup } from 'vis-timeline';

import type { HomoItem, Item } from '../types';
import { getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import homo from './sources/homo.csv';

const lng = getLng();

const items: Item[] = [];

// process each chart recursively
homo.forEach((item: HomoItem) => {
  items.push({
    id: item.id,
    content: `${item[`name_${lng}` as keyof HomoItem]} ${item.name_latin ? `<i>(${item.name_latin})</i>` : ''}`,
    start: +item.start,
    end: item.end ? +item.end : undefined,
    group: item.group,
    subgroup: item.id,
    type: item.type,
    style: `background-color: ${isNotNil(item.background) && isNotEmpty(item.background) ? item.background : '#000'};color: ${isNotNil(item.foreground) && isNotEmpty(item.foreground) ? item.foreground : '#fff'};border-color: ${isNotNil(item.border) && isNotEmpty(item.border) ? item.border : '#000'};`,
    properties: {
      wikiName:
        isNotNil(item.wiki_fr) || isNotNil(item.wiki_en)
          ? (item[`wiki_${lng}` as keyof HomoItem] as string)
          : undefined,
      description:
        (item[`description_${lng}` as keyof HomoItem] as string) ?? undefined,
    },
  });
});

const groups: DataGroup[] = [
  {
    id: 'homo',
    content: t('homo.label'),
    nestedGroups: [
      'homo-early',
      'homo-australopithecus',
      'homo-paranthropus',
      'homo-homo',
    ],
  },
  {
    id: 'homo-early',
    content: t('homo.groups.early'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'homo-australopithecus',
    content: t('homo.groups.australopithecus'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'homo-paranthropus',
    content: t('homo.groups.paranthropus'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'homo-homo',
    content: t('homo.groups.homo'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
];

export default {
  items,
  groups,
};
