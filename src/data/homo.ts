import type { DataGroup } from 'vis-timeline';

import type { HomoItem, Item } from '../types';
import { getLng, t } from '../utils';
import homo from './sources/homo.json';

const lng = getLng();

const items: Item[] = [];

// process each chart recursively
homo.forEach((item: HomoItem) => {
  items.push({
    id: item.id,
    content: `${item.name[lng as keyof typeof item.name]} ${item.name.latin ? `<i>(${item.name.latin})</i>` : ''}`,
    start: item.start,
    end: item.end,
    group: item.group,
    subgroup: item.id,
    type: item.type,
    style: `background-color: ${item.colors.background ?? '#000'};color: ${item.colors.foreground ?? '#fff'};border-color: ${item.colors.border ?? '#000'};`,
    properties: {
      wikiName: item.wiki
        ? item.wiki[lng as keyof typeof item.wiki]
        : undefined,
      description:
        item.description?.[lng as keyof typeof item.description] ?? undefined,
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
