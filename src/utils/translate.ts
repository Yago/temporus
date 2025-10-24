import { path } from 'ramda';

import { getLng } from '.';
import locales from '../locales';

const translate = (p: string): string =>
  path(p.split('.'), locales[getLng() ?? 'en']) ?? p;

export default translate;
