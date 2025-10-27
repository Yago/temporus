import type { DataGroup } from 'vis-timeline';

import type { Item } from '../types';
import homo from './homo';
import stratigraphy from './stratigraphy';

const items: Item[] = [...stratigraphy.items, ...homo.items].map(i => ({
  ...i,
  end: i.end === 0 ? new Date().getFullYear() : i.end,
}));
const groups: DataGroup[] = [...stratigraphy.groups, ...homo.groups];

const data: {
  items: Item[];
  groups: DataGroup[];
} = {
  items,
  groups,
};

export default data;
