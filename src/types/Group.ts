import type { DataGroup } from 'vis-timeline';

export type Group = DataGroup & Properties;

type Properties = {
  previousPosition?: number;
};
