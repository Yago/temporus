import type { Group, Item } from '../types';
import homo from './homo';
import periods from './periods';
import stratigraphy from './stratigraphy';

const items: Item[] = [...stratigraphy.items, ...periods.items, ...homo.items];
const parents: Group[] = [stratigraphy.parent, periods.parent, homo.parent];
const groups: Group[] = [
  ...parents,
  ...stratigraphy.groups,
  ...periods.groups,
  ...homo.groups,
];
const spacingGroups = [
  {
    id: 'spacing-bottom',
    content: '&nbsp;',
  },
  {
    id: 'spacing-bottom2',
    content: '&nbsp;',
  },
];

const data: {
  items: Item[];
  groups: Group[];
} = {
  items,
  groups: window.innerWidth < 1024 ? [...groups, ...spacingGroups] : groups,
};

export default data;
