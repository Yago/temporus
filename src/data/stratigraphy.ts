import { isNotNil } from 'ramda';
import type { DataGroup } from 'vis-timeline';

import type { Item, StratygraphyItem } from '../types';
import { getLng, t } from '../utils';
import chart1 from './sources/stratigraphy/chart1.json';
import chart2 from './sources/stratigraphy/chart2.json';
import chart3 from './sources/stratigraphy/chart3.json';
import chart4 from './sources/stratigraphy/chart4.json';

const credits = {
  attribution: 'International Commission on Stratigraphy, December 2024.',
  url: 'https://stratigraphy.org/chart',
};

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
      style: `background-color: ${chart.color};`,
      properties: {
        description: chart.definition,
        credits,
      },
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
    id: 'geology-other',
    content: '&nbsp;',
  },
];

export default {
  items,
  groups,
};
