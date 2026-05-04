import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import megaliths from './sources/megaliths.csv';

const lng = getLng();

const items: Item[] = megaliths.map((item: CSVItem) => formatCsvItem(item, lng));

const nestedGroups = [
  'megaliths-africa',
  'megaliths-middle-east',
  'megaliths-europe',
  'megaliths-asia',
  'megaliths-north-america',
  'megaliths-south-america',
  'megaliths-oceania',
];

const parent: Group = {
  id: 'megaliths',
  content: t('groups.megaliths.label'),
  nestedGroups,
};

const groups: Group[] = [
  {
    id: 'megaliths-africa',
    content: t('groups.megaliths.groups.africa'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'megaliths-middle-east',
    content: t('groups.megaliths.groups.middle-east'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'megaliths-europe',
    content: t('groups.megaliths.groups.europe'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'megaliths-asia',
    content: t('groups.megaliths.groups.asia'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'megaliths-north-america',
    content: t('groups.megaliths.groups.north-america'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'megaliths-south-america',
    content: t('groups.megaliths.groups.south-america'),
    subgroupOrder(a, b) {
      return a.start! - b.start!;
    },
  },
  {
    id: 'megaliths-oceania',
    content: t('groups.megaliths.groups.oceania'),
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
