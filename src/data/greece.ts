import type { CSVItem, Group, Item } from '../types';
import { formatCsvItem, getLng, t } from '../utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import greece from './sources/greece.csv';

const lng = getLng();

const items: Item[] = greece.map((item: CSVItem) => formatCsvItem(item, lng));

const parent: Group = {
  id: 'greece',
  content: t('groups.greece.label'),
  nestedGroups: [
    'greece-wars',
    'greece-city-states',
    'greece-people',
    'greece-monuments',
  ],
  showNested: true,
};

const groups: Group[] = [
  {
    id: 'greece-wars',
    content: t('groups.greece.groups.wars'),
  },
  {
    id: 'greece-city-states',
    content: t('groups.greece.groups.cityStates'),
  },
  {
    id: 'greece-people',
    content: t('groups.greece.groups.people'),
  },
  {
    id: 'greece-monuments',
    content: t('groups.greece.groups.monuments'),
  },
];

export default {
  items,
  parent,
  groups,
};
