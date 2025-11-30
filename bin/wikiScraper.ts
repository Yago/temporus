// bun run bin/wikiScraper.ts

import { json2csv } from 'json-2-csv';

import type { CSVItem, WikiSummary } from '../src/types';

const lng: string = 'en';
const prefix: string = 'cultures:oceania:';
const group: string = 'cultures-oceania';

const wikiScraper = async () => {
  const file = Bun.file('./wiki-oceania.txt');
  const urlsText: string = await file.text();

  const urls: string[] = urlsText.split('\n').filter(url => url.trim() !== '');
  const output: CSVItem[] = [];
  const translationLng: string = lng === 'fr' ? 'en' : 'fr';

  for (const url of urls) {
    const slug = url.split('/').pop() as string;
    const data: WikiSummary = await fetch(
      `https://${lng}.wikipedia.org/api/rest_v1/page/summary/${slug}`
    ).then(res => res.json());
    const links: {
      code: string;
      name: string;
      key: string;
      title: string;
    }[] = await fetch(
      `https://api.wikimedia.org/core/v1/wikipedia/${lng}/page/${slug}/links/language`
    ).then(res => res.json());
    const translation = links && links.length > 0 ? links.find(link => link.code === translationLng) : null;
    const translatedData: WikiSummary = translation
      ? await fetch(
          `https://${translationLng}.wikipedia.org/api/rest_v1/page/summary/${translation?.key}`
        ).then(res => res.json())
      : null;

    output.push({
      id: `${prefix}${slug.toLocaleLowerCase().replaceAll(' ', '_')}`,
      group,
      start: 0,
      end: 0,
      [`name_${translationLng}`]: translation?.title ?? '',
      [`name_${lng}`]: data.title,
      [`wiki_${translationLng}`]: translation?.key
        ? `https://${translationLng}.wikipedia.org/wiki/${translation.key}`
        : '',
      [`wiki_${lng}`]: `https://${lng}.wikipedia.org/wiki/${slug}`,
      [`description_${translationLng}`]: translatedData?.description ?? '',
      [`description_${lng}`]: data.description,
      background: '',
      foreground: '',
      border: '',
    });

    console.log(`✅ ${slug} done`);
  }

  await Bun.write('./wiki.csv', json2csv(output));
};

wikiScraper();
