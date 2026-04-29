import type { DataItem } from 'vis-timeline';

export type Item = DataItem & { properties?: Properties };

type Properties = {
  icon?: string;
  description?: string;
  cover?: string;
  wikiUrl?: string;
  wikiName?: string;
  wikiLng?: string;
  credits?: {
    attribution?: string;
    url?: string;
  };
};
