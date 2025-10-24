import numeral from 'numeral';

const formatNumber = (value: number, locale?: string): string | null => {
  if (typeof window === 'undefined') return null;

  if (numeral.locales.fr === undefined) {
    numeral.register('locale', 'fr', {
      delimiters: {
        thousands: "'",
        decimal: '.',
      },
      abbreviations: {
        million: 'Mio',
        billion: 'Mrd',
        thousand: 'k',
        trillion: 'T',
      },
      ordinal(number: number) {
        return number === 1 ? 'er' : 'ème';
      },
      currency: {
        symbol: 'CHF',
      },
    });
  }

  numeral.locale(locale || 'en');

  return numeral(+value).format(Math.abs(+value) > 999999 ? '0,0.0 a' : '0,0');
};

export default formatNumber;
