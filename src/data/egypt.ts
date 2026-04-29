import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import egypt from './sources/egypt.csv';

const lng = getLng();

const items: Item[] = egypt.map((item: CSVItem) => formatCsvItem(item, lng));

const parent: Group = {
  id: 'egypt',
  content: t('groups.egypt.label'),
  nestedGroups: ['egypt-dynasties', 'egypt-pharaohs', 'egypt-buildings'],
  showNested: true,
};

const groups: Group[] = [
  {
    id: 'egypt-dynasties',
    content: t('groups.egypt.groups.dynasties'),
  },
  {
    id: 'egypt-pharaohs',
    content: t('groups.egypt.groups.pharaohs'),
  },
  {
    id: 'egypt-buildings',
    content: t('groups.egypt.groups.buildings'),
  },
];

export default {
  items,
  parent,
  groups,
};
