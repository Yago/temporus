import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import periods from './sources/periods.csv';

const lng = getLng();

const items: Item[] = periods.map((item: CSVItem) => formatCsvItem(item, lng));

const parent: Group = {
  id: 'periods',
  content: t('groups.periods.label'),
  nestedGroups: ['periods-europe'],
};

const groups: Group[] = [
  {
    id: 'periods-europe',
    content: t('groups.periods.groups.europe'),
  },
];

export default {
  items,
  parent,
  groups,
};
