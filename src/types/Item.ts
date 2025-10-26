import type { DataItem } from 'vis-timeline';

export type Item = DataItem & { properties?: Properties };

type Properties = {
  description?: string;
  cover?: string;
  wikiUrl?: string;
  wikiName?: string;
  credits?: {
    attribution: string;
    url: string;
  };
};
