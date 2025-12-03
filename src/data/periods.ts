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
  nestedGroups: [
    'periods-africa',
    'periods-asia',
    'periods-middle-east',
    'periods-europe',
    'periods-america',
  ],
  showNested: false,
};

const groups: Group[] = [
  {
    id: 'periods-africa',
    content: t('groups.periods.groups.africa'),
  },
  {
    id: 'periods-middle-east',
    content: t('groups.periods.groups.middle-east'),
  },
  {
    id: 'periods-asia',
    content: t('groups.periods.groups.asia'),
  },
  {
    id: 'periods-europe',
    content: t('groups.periods.groups.europe'),
  },
  {
    id: 'periods-america',
    content: t('groups.periods.groups.america'),
  },
];

export default {
  items,
  parent,
  groups,
};
