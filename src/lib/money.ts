export type Currency = 'CZK' | 'EUR';

export const toCents = (input: string | number) =>
  Math.round(parseFloat(String(input).replace(',', '.')) * 100) || 0;

export const fromCents = (cents: number) => cents / 100;

export const formatMoney = (cents: number, currency: Currency) =>
  (cents / 100).toLocaleString(currency === 'CZK' ? 'cs-CZ' : 'de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 ? 2 : 0,
  });