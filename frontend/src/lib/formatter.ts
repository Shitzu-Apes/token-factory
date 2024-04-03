// Take string and decimals and return decimals
export const bnFormatter = (
  string: string,
  decimals: number = 24,
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 4
): string => {
  // append zero if string is less than decimals
  if (string.length < decimals) {
    string = string.padStart(decimals, '0');
  }

  // insert decimal point
  const decimalPoint = string.length - decimals;

  const f = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits
  });

  return f.format(parseFloat(string.slice(0, decimalPoint) + '.' + string.slice(decimalPoint)));
};

export const addrsFormatter = (string: string): string => {
  if (string.length > 20) {
    return string.substring(0, 20) + '...';
  }
  return string;
};

export const priceFormatter = (
  price: number,
  decimals: number = 24,

  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 4
): string => {
  const f = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits
  });

  return f.format(price * 10 ** (decimals - 24));
};
