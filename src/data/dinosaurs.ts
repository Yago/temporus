import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dinosaurs from './sources/dinosaurs.csv';

const lng = getLng();

const items: Item[] = dinosaurs.map((item: CSVItem) =>
  formatCsvItem(item, lng)
);

const parent: Group = {
  id: 'dinosaurs',
  content: t('groups.dinosaurs.label'),
  nestedGroups: [
    'dinosaurs-carnivorous',
    'dinosaurs-omnivorous',
    'dinosaurs-herbivorous',
  ],
};

const groups: Group[] = [
  {
    id: 'dinosaurs-carnivorous',
    content: t('groups.dinosaurs.groups.carnivorous'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'dinosaurs-omnivorous',
    content: t('groups.dinosaurs.groups.omnivorous'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'dinosaurs-herbivorous',
    content: t('groups.dinosaurs.groups.herbivorous'),
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
