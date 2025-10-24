import type { DataItem } from 'vis-timeline';

export type Item = DataItem & { properties?: Properties };

type Properties = {
  description?: string;
  wikiUrl?: string;
};
