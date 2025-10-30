import { isNotNil } from 'ramda';
import type { DataGroup } from 'vis-timeline';

import type { CSVItem, Item, StratygraphyItem } from '../types';
import { getLng, t } from '../utils';
import chart1 from './sources/stratigraphy/chart1.json';
import chart2 from './sources/stratigraphy/chart2.json';
import chart3 from './sources/stratigraphy/chart3.json';
import chart4 from './sources/stratigraphy/chart4.json';
import wiki from './sources/stratigraphy/wiki.json';

const credits = {
  attribution: 'International Commission on Stratigraphy, December 2024.',
  url: 'https://stratigraphy.org/chart',
};

const csv: CSVItem[] = [
  {
    id: 'earth',
    name_fr: 'Géologie',
    name_en: 'Geology',
    description_fr:
      "L'échelle des temps géologiques est une échelle de temps qui divise la Terre en époques, périodes, époques et âges.",
    description_en:
      'The geological time scale is a time scale that divides the Earth into eons, eras, periods, epochs and ages.',
    wiki_fr: 'Échelle_des_temps_géologiques',
    wiki_en: 'Geologic_time_scale',
    background: 'oklch(92.3% 0.003 48.717)',
    start: -4567000000,
    end: 0,
    group: 'geology',
  },
];

const items: Item[] = [
  {
    id: 'earth',
    content: t('geology.title'),
    start: -4567000000,
    end: 0,
    group: 'geology',
    style: `background-color: oklch(92.3% 0.003 48.717);`,
    properties: {
      description: t('geology.description'),
      credits,
      wikiName: t('geology.wikiName'),
    },
  },
];
const lng = getLng();

// process each chart recursively
const processChart = (chart: StratygraphyItem) => {
  if (chart.narrower) {
    chart.narrower.forEach(c => processChart(c as unknown as StratygraphyItem));
  }
  if (items.findIndex(i => i.id === chart.id) === -1) {
    items.push({
      id: chart.id,
      content:
        lng === 'en'
          ? chart.prefLabel.value
          : isNotNil(chart.altLabel) && Array.isArray(chart.altLabel)
            ? (chart.altLabel.find(l => l.language === lng)?.value ??
              chart.prefLabel.value)
            : chart.prefLabel.value,
      start: +chart.hasBeginning.inMYA.value * -1000000,
      end: +chart.hasEnd.inMYA.value * -1000000,
      group:
        isNotNil(chart.rank) && typeof chart.rank === 'string'
          ? `geology-${chart.rank.split('/rank/')[1].toLocaleLowerCase()}`
          : Array.isArray(chart.rank)
            ? `geology-${(chart.rank[0] as string).split('/rank/')[1].toLocaleLowerCase()}`
            : 'geology',
      style: `background-color: ${chart.color};border-color: #000;`,
      properties: {
        description: chart.definition,
        credits,
        wikiName: (wiki as Record<string, Record<string, string>>)[chart.id][
          lng as keyof typeof wiki
        ]
          ?.split('/wiki/')
          ?.at(-1),
      },
    });
    csv.push({
      id: chart.id,
      type: 'box',
      name_fr:
        isNotNil(chart.altLabel) && Array.isArray(chart.altLabel)
          ? (chart.altLabel.find(l => l.language === lng)?.value ??
            chart.prefLabel.value)
          : chart.prefLabel.value,
      name_en: chart.prefLabel.value,
      description_fr: chart.definition,
      description_en: chart.definition,
      wiki_fr: (wiki as Record<string, Record<string, string>>)[chart.id].fr
        ?.split('/wiki/')
        ?.at(-1),
      wiki_en: (wiki as Record<string, Record<string, string>>)[chart.id].en
        ?.split('/wiki/')
        ?.at(-1),
      background: chart.color,
      foreground: '#000',
      border: '#000',
      start: +chart.hasBeginning.inMYA.value * -1000000,
      end: +chart.hasEnd.inMYA.value * -1000000,
      group:
        isNotNil(chart.rank) && typeof chart.rank === 'string'
          ? `geology-${chart.rank.split('/rank/')[1].toLocaleLowerCase()}`
          : Array.isArray(chart.rank)
            ? `geology-${(chart.rank[0] as string).split('/rank/')[1].toLocaleLowerCase()}`
            : 'geology',
    });
  }
};

processChart(chart1 as unknown as StratygraphyItem);
processChart(chart2 as unknown as StratygraphyItem);
processChart(chart3 as unknown as StratygraphyItem);
processChart(chart4 as unknown as StratygraphyItem);

const groups: DataGroup[] = [
  {
    id: 'geology',
    content: t('geology.label'),
    nestedGroups: [
      'geology-eon',
      'geology-era',
      'geology-period',
      'geology-epoch',
      'geology-age',
    ],
  },
  {
    id: 'geology-eon',
    content: t('geology.groups.eon'),
  },
  {
    id: 'geology-era',
    content: t('geology.groups.era'),
  },
  {
    id: 'geology-period',
    content: t('geology.groups.period'),
  },
  {
    id: 'geology-epoch',
    content: t('geology.groups.epoch'),
  },
  {
    id: 'geology-age',
    content: t('geology.groups.age'),
  },
  {
    id: 'geology-bottom',
    content: '&nbsp;',
  },
];

export default {
  items,
  groups,
};
