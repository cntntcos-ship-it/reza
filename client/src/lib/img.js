/** Adds responsive sizing params to a stock-photo URL. */
export const img = (url, width = 900) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'compress');
    parsed.searchParams.set('cs', 'tinysrgb');
    parsed.searchParams.set('w', String(width));
    return parsed.toString();
  } catch {
    return url;
  }
};

export const srcSet = (url, widths = [480, 900, 1400]) =>
  widths.map((width) => `${img(url, width)} ${width}w`).join(', ');
