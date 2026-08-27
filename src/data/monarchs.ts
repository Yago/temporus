import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import monarchs from './sources/monarchs.csv';

const lng = getLng();

const items: Item[] = monarchs.map((item: CSVItem) => formatCsvItem(item, lng));

const parent: Group = {
  id: 'monarchs',
  content: t('groups.monarchs.label'),
  nestedGroups: [
    'monarchs-france-houses',
    'monarchs-france',
    'monarchs-england-houses',
    'monarchs-england',
  ],
  showNested: true,
};

const groups: Group[] = [
  {
    id: 'monarchs-france-houses',
    content: t('groups.monarchs.groups.franceHouses'),
  },
  {
    id: 'monarchs-france',
    content: t('groups.monarchs.groups.france'),
  },
  {
    id: 'monarchs-england-houses',
    content: t('groups.monarchs.groups.englandHouses'),
  },
  {
    id: 'monarchs-england',
    content: t('groups.monarchs.groups.england'),
  },
];

export default {
  items,
  parent,
  groups,
};
