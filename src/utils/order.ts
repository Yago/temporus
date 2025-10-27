import type { Item } from '../types';

const order = (a: Item, b: Item) => {
  const startA = typeof a.start === 'number' ? a.start : 0;
  const startB = typeof b.start === 'number' ? b.start : 0;
  return startA - startB;
};

export default order;
