import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rome from './sources/rome.csv';

const lng = getLng();

const items: Item[] = rome.map((item: CSVItem) => formatCsvItem(item, lng));

const parent: Group = {
  id: 'rome',
  content: t('groups.rome.label'),
  nestedGroups: ['rome-kings', 'rome-emperors', 'rome-campaigns'],
  showNested: true,
};

const groups: Group[] = [
  {
    id: 'rome-kings',
    content: t('groups.rome.groups.kings'),
  },
  {
    id: 'rome-emperors',
    content: t('groups.rome.groups.emperors'),
  },
  {
    id: 'rome-campaigns',
    content: t('groups.rome.groups.campaigns'),
  },
];

export default {
  items,
  parent,
  groups,
};
