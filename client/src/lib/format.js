const faNumber = new Intl.NumberFormat('fa-IR');

export const toFa = (value) => faNumber.format(Number(value) || 0);

/** Persian digits without grouping — for postal codes, phone numbers and IDs. */
export const toFaDigits = (value) =>
  String(value ?? '').replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);

/** Prices are stored in Toman; the unit is rendered separately and lighter. */
export const formatToman = (value) => toFa(value);

export const cx = (...values) => values.filter(Boolean).join(' ');

export const discountPercent = (price, compareAtPrice) => {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export const sizeLabel = (size) => (size === 'ONE' ? 'تک‌سایز' : size);

export const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
};
