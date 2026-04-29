import type { Group, Item } from '../types';
import cultures from './cultures';
import dinosaurs from './dinosaurs';
import egypt from './egypt';
import homo from './homo';
import innovations from './innovations';
import periods from './periods';
import rome from './rome';
import stratigraphy from './stratigraphy';

const items: Item[] = [
  ...stratigraphy.items,
  ...periods.items,
  ...innovations.items,
  ...homo.items,
  ...cultures.items,
  ...dinosaurs.items,
  ...egypt.items,
  ...rome.items,
];
const parents: Group[] = [
  stratigraphy.parent,
  dinosaurs.parent,
  periods.parent,
  innovations.parent,
  homo.parent,
  cultures.parent,
  egypt.parent,
  rome.parent,
];
const groups: Group[] = [
  ...parents,
  ...stratigraphy.groups,
  ...dinosaurs.groups,
  ...periods.groups,
  ...innovations.groups,
  ...homo.groups,
  ...cultures.groups,
  ...egypt.groups,
  ...rome.groups,
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
  parents: Group[];
} = {
  items,
  parents,
  groups: window.innerWidth < 1024 ? [...groups, ...spacingGroups] : groups,
};

export default data;
