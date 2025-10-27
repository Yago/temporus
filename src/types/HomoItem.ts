export type HomoItem = {
  id: string;
  type?: string;
  name: {
    fr: string;
    latin?: string;
    en: string;
  };
  description?: {
    fr: string;
    en: string;
  };
  cover?: string;
  wiki?: {
    fr: string;
    en: string;
  };
  start: number;
  end?: number;
  colors: {
    background?: string;
    foreground?: string;
    border?: string;
  };
  group: string;
};
