import { isNotEmpty, isNotNil } from 'ramda';

import type { CSVItem, Item } from '../types';

const formatCsvItem = (item: CSVItem, lng: string): Item => ({
  id: item.id,
  content: `${item[`name_${lng}` as keyof CSVItem]} ${item.name_latin ? `<i>(${item.name_latin})</i>` : ''}`,
  start: +item.start,
  end: item.end
    ? +item.end === 0
      ? new Date().getFullYear()
      : +item.end
    : undefined,
  group: item.group,
  subgroup: item.id,
  type: item.type ?? 'range',
  style: `background-color: ${isNotNil(item.background) && isNotEmpty(item.background) ? item.background : '#fff'};color: ${isNotNil(item.foreground) && isNotEmpty(item.foreground) ? item.foreground : item.type !== 'point' ? '#000' : '#fff'};border-color: ${isNotNil(item.border) && isNotEmpty(item.border) ? item.border : item.type !== 'point' ? '#000' : '#fff'};`,
  className: item.circa === 'true' ? 'circa' : '',
  properties: {
    wikiName:
      isNotNil(item.wiki_fr) || isNotNil(item.wiki_en)
        ? ((item[`wiki_${lng}` as keyof CSVItem] as string).split('/').pop() ??
          '')
        : undefined,
    wikiLng:
      isNotNil(item.wiki_fr) || isNotNil(item.wiki_en)
        ? (item[`wiki_${lng}` as keyof CSVItem] as string).includes('/en.')
          ? 'en'
          : 'fr'
        : undefined,
    description:
      (item[`description_${lng}` as keyof CSVItem] as string) ?? undefined,
    credits: {
      attribution: item.credits_attribution ?? undefined,
      url: item.credits_url ?? undefined,
    },
  },
});

export default formatCsvItem;
