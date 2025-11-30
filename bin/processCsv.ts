// bun run bin/processCsv.ts

import { csv2json, json2csv } from 'json-2-csv';
import { isNotEmpty, isNotNil } from 'ramda';

import type { CSVItem } from '../src/types';

const processCsv = async () => {
  const path = './src/data/sources/cultures.csv';
  const file = Bun.file(path);
  const csv: string = await file.text();
  
  const data: CSVItem[] = csv2json(csv) as CSVItem[];

  const processedData = data.map(item => ({
    ...item,
    name_fr: isNotEmpty(item.name_fr) ? item.name_fr : item.name_en,
    wiki_fr: isNotEmpty(item.wiki_fr) ? item.wiki_fr : item.wiki_en,
  }));

  await Bun.write(path, json2csv(processedData));
};

processCsv();
