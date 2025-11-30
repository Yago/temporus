import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cultures from './sources/cultures.csv';

const lng = getLng();

const items: Item[] = cultures.map((item: CSVItem) => formatCsvItem(item, lng));

const nestedGroups = [
  'cultures-africa',
  'cultures-middle-east',
  'cultures-europe',
  'cultures-asia',
  'cultures-north-america',
  'cultures-middle-america',
  'cultures-south-america',
  'cultures-oceania',
];

const parent: Group = {
  id: 'cultures',
  content: t('groups.cultures.label'),
  nestedGroups,
};

const groups: Group[] = [
  {
    id: 'cultures-africa',
    content: t('groups.cultures.groups.africa'),
  },
  {
    id: 'cultures-middle-east',
    content: t('groups.cultures.groups.middle-east'),
  },
  {
    id: 'cultures-europe',
    content: t('groups.cultures.groups.europe'),
  },
  {
    id: 'cultures-asia',
    content: t('groups.cultures.groups.asia'),
  },
  {
    id: 'cultures-north-america',
    content: t('groups.cultures.groups.north-america'),
  },
  {
    id: 'cultures-middle-america',
    content: t('groups.cultures.groups.middle-america'),
  },
  {
    id: 'cultures-south-america',
    content: t('groups.cultures.groups.south-america'),
  },
  {
    id: 'cultures-oceania',
    content: t('groups.cultures.groups.oceania'),
  },
];

export default {
  items,
  parent,
  groups,
};
