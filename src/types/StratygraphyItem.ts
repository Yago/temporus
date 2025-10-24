export type StratygraphyItem = {
  id: string;
  type: string;
  rank: string;
  ratifiedGSSP: RatifiedGssp;
  isDefinedBy: string;
  altLabel: AltLabel[];
  definition: string;
  inScheme: string;
  narrower: Narrower[];
  notation: string;
  prefLabel: PrefLabel;
  hasBeginning: HasBeginning;
  hasEnd: HasEnd;
  wasDerivedFrom: string;
  order: number;
  counts: Counts;
  color: string;
};

type RatifiedGssp = {
  type: string;
  value: boolean;
};

type AltLabel = {
  language: string;
  value: string;
};

type Narrower = {
  id: string;
  type: string;
  rank: string | string[];
  ratifiedGSSP: RatifiedGssp;
  isDefinedBy: string;
  altLabel: AltLabel[];
  broader: string[];
  definition: string;
  inScheme: string;
  narrower: Narrower[];
  notation: string;
  prefLabel: PrefLabel;
  hasBeginning: HasBeginning;
  hasEnd: HasEnd;
  wasDerivedFrom: string;
  order: number;
  counts: Counts;
  color: string;
};

type Counts = {
  directNarrowers: number;
  indirectNarrowers: number;
};
type HasBeginning = {
  inMYA: InMya;
  marginOfError?: MarginOfError;
};

type InMya = {
  type: string;
  value: string;
};

type MarginOfError = {
  type: string;
  value: string;
};

type HasEnd = {
  inMYA: InMya;
  marginOfError?: MarginOfError;
};

type PrefLabel = {
  language: string;
  value: string;
};
