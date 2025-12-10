// bun run bin/processCsv.ts

import { csv2json, json2csv } from 'json-2-csv';
import { isNotEmpty, isNotNil } from 'ramda';

import type { CSVItem } from '../src/types';

const processCsv = async () => {
  const path = './src/data/sources/egypt.csv';
  const file = Bun.file(path);
  const csv: string = await file.text();
  
  const data: CSVItem[] = csv2json(csv) as CSVItem[];
 
  // for (const item of data) {
  //   await fetch(item.wiki_fr).then(res => {
  //     if (res.status === 404) {
  //       console.log(`❌ ${item.name_fr} pas trouvé`);
  //     } else {
  //       console.log(`✅ ${item.name_fr} trouvé`);
  //     }
  //   });
  //   await fetch(item.wiki_en).then(res => {
  //     if (res.status === 404) {
  //       console.log(`❌ ${item.name_en} not found`);
  //     } else {
  //       console.log(`✅ ${item.name_en} found`);
  //     }
  //   });
  // }

  const processedData = data
  .filter(item => item.date !== 'Unknown' && !item.date.includes('Naqada'))
  .map(item => ({
    ...item,
  }));

  await Bun.write(path, json2csv(processedData));
};

processCsv();
