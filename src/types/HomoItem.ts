export type HomoItem = {
  id: string;
  name: {
    fr: string;
    latin: string;
    en: string;
  };
  cover?: string;
  wiki: {
    fr: string;
    en: string;
  };
  start: number;
  end: number;
  colors: {
    background: string;
    foreground: string;
  };
  group: string;
};
