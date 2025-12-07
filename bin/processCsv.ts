// bun run bin/processCsv.ts

import { csv2json, json2csv } from 'json-2-csv';
import { isNotEmpty, isNotNil } from 'ramda';

import type { CSVItem } from '../src/types';

const processCsv = async () => {
  const path = './src/data/sources/dinosaurs.csv';
  const file = Bun.file(path);
  const csv: string = await file.text();
  
  const data: CSVItem[] = csv2json(csv) as CSVItem[];
  const processedData = data.map(item => ({
    ...item,
    wiki_en: `https://en.wikipedia.org/wiki/${item.name}`,
    wiki_fr: `https://fr.wikipedia.org/wiki/${item.name}`,
    name_en: item.name,
    name_fr: item.name,
  }));

  await Bun.write(path, json2csv(processedData));
};

processCsv();
