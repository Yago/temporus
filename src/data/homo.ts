import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import homo from './sources/homo.csv';

const lng = getLng();

const items: Item[] = homo.map((item: CSVItem) => formatCsvItem(item, lng));

const parent: Group = {
  id: 'homo',
  content: t('groups.homo.label'),
  nestedGroups: [
    'homo-early',
    'homo-australopithecus',
    'homo-paranthropus',
    'homo-homo',
  ],
};

const groups: Group[] = [
  {
    id: 'homo-early',
    content: t('groups.homo.groups.early'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'homo-australopithecus',
    content: t('groups.homo.groups.australopithecus'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'homo-paranthropus',
    content: t('groups.homo.groups.paranthropus'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'homo-homo',
    content: t('groups.homo.groups.homo'),
    subgroupStack: true,
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
];

export default {
  items,
  parent,
  groups,
};
