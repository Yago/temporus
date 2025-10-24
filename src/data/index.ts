import type { DataGroup, DataItem } from 'vis-timeline';

import type { Item } from '../types';
import stratigraphy from './stratigraphy';

const items: DataItem[] = [...stratigraphy.items];
const groups: DataGroup[] = [...stratigraphy.groups];

const data: {
  items: Item[];
  groups: DataGroup[];
} = {
  items,
  groups,
};

export default data;
