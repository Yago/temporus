import numeral from 'numeral';

import { getLng } from '.';

const formatNumber = (value: number): string | null => {
  if (typeof window === 'undefined') return null;
  const lng = getLng();

  if (numeral.locales.fr === undefined) {
    numeral.register('locale', 'fr', {
      delimiters: {
        thousands: "'",
        decimal: '.',
      },
      abbreviations: {
        million: 'Ma',
        billion: 'Ga',
        thousand: 'k',
        trillion: 'Ta',
      },
      ordinal(number: number) {
        return number === 1 ? 'er' : 'ème';
      },
      currency: {
        symbol: 'CHF',
      },
    });
  }

  numeral.locale(lng || 'en');

  return numeral(+value).format(Math.abs(+value) > 999999 ? '0,0.0 a' : '0,0');
};

export default formatNumber;
