import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import stratigraphy from './sources/stratigraphy.csv';

const lng = getLng();

const items: Item[] = stratigraphy.map((item: CSVItem) =>
  formatCsvItem(item, lng)
);

const parent: Group = {
  id: 'geology',
  content: t('groups.geology.label'),
  nestedGroups: [
    'geology-super-eon',
    'geology-eon',
    'geology-era',
    'geology-period',
    'geology-epoch',
    'geology-age',
    'geology-sub-period',
  ],
};

const groups: Group[] = [
  {
    id: 'geology-super-eon',
    content: t('groups.geology.groups.super-eon'),
  },
  {
    id: 'geology-eon',
    content: t('groups.geology.groups.eon'),
  },
  {
    id: 'geology-era',
    content: t('groups.geology.groups.era'),
  },
  {
    id: 'geology-period',
    content: t('groups.geology.groups.period'),
  },
  {
    id: 'geology-sub-period',
    content: t('groups.geology.groups.sub-period'),
    visible: false,
  },
  {
    id: 'geology-epoch',
    content: t('groups.geology.groups.epoch'),
  },
  {
    id: 'geology-age',
    content: t('groups.geology.groups.age'),
  },
];

export default {
  items,
  parent,
  groups,
};
