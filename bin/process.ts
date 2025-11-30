// bun run bin/processCsv.ts

import { csv2json, json2csv } from 'json-2-csv';
import { isNotEmpty, isNotNil, difference } from 'ramda';

import { CSVItem } from '../src/types';

const process = async () => {
  const wip = Bun.file('./src/data/sources/cultures-wip.csv');
  const csvwip: string = await wip.text();
  const datawip: CSVItem[] = csv2json(csvwip).map(({ name_en, name_fr, wiki_en, wiki_fr }) => ({ name_en, name_fr, wiki_en, wiki_fr }));

  const done = Bun.file('./src/data/sources/cultures-wip-done.csv');
  const csvdone: string = await done.text();
  const datadone: CSVItem[] = csv2json(csvdone).map(({ name_en, name_fr, wiki_en, wiki_fr }) => ({ name_en, name_fr, wiki_en, wiki_fr }));

  console.log(datawip.length, datadone.length);  
};

process();
