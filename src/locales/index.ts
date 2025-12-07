import en from './en.json';
import fr from './fr.json';

type Locales = { [key: string]: string | Record<string, string>[] | Locales };

const locales: Locales = {
  fr,
  en,
};

export default locales;
