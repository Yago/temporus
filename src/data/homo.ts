import type { DataGroup } from 'vis-timeline';

import type { HomoItem, Item } from '../types';
import { getLng, t } from '../utils';
import homo from './sources/homo.json';

const lng = getLng();

const items: Item[] = [];

// process each chart recursively
homo.forEach((item: HomoItem) => {
  items.push({
    id: item.id,
    content: `${item.name[lng as keyof typeof item.name]} ${item.name.latin ? `<i>(${item.name.latin})</i>` : ''}`,
    start: item.start,
    end: item.end,
    group: item.group,
    style: `background-color: ${item.colors.background};color: ${item.colors.foreground};`,
    properties: {
      wikiName: item.wiki[lng as keyof typeof item.wiki],
    },
  });
});

const groups: DataGroup[] = [
  {
    id: 'homo',
    content: t('homo.label'),
    nestedGroups: ['homo-early', 'homo-australopithecus'],
  },
  {
    id: 'homo-early',
    content: t('homo.groups.early'),
  },
  {
    id: 'homo-australopithecus',
    content: t('homo.groups.australopithecus'),
  },
];

export default {
  items,
  groups,
};
