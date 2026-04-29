import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import innovations from './sources/innovations.csv';

const lng = getLng();

const items: Item[] = innovations.map((item: CSVItem) =>
  formatCsvItem(item, lng)
);

const parent: Group = {
  id: 'innovations',
  content: t('groups.innovations.label'),
  nestedGroups: [],
  showNested: false,
};

const groups: Group[] = [];

export default {
  items,
  parent,
  groups,
};
