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
  nestedGroups: ['periods-great-period', 'periods-period', 'periods-age'],
};

const groups: Group[] = [
  {
    id: 'periods-great-period',
    content: t('groups.periods.groups.great-period'),
  },
  {
    id: 'periods-period',
    content: t('groups.periods.groups.period'),
  },
  {
    id: 'periods-age',
    content: t('groups.periods.groups.age'),
  },
];

export default {
  items,
  parent,
  groups,
};
