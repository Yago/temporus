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
  ...innovations.items,
  ...egypt.items,
  ...rome.items,
  ...periods.items,
  ...homo.items,
  ...cultures.items,
  ...dinosaurs.items,
];
const parents: Group[] = [
  stratigraphy.parent,
  innovations.parent,
  egypt.parent,
  rome.parent,
  dinosaurs.parent,
  periods.parent,
  homo.parent,
  cultures.parent,
];
const groups: Group[] = [
  ...parents,
  ...stratigraphy.groups,
  ...innovations.groups,
  ...dinosaurs.groups,
  ...egypt.groups,
  ...rome.groups,
  ...periods.groups,
  ...homo.groups,
  ...cultures.groups,
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
