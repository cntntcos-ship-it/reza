# IRANYekan webfont

The interface asks for **IRANYekan** first:

```css
--font-fa: 'IRANYekan', 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
```

Until a licensed IRANYekan webfont is present, the fallback **Vazirmatn** renders
every Persian glyph. Vazirmatn ships with the app (`@fontsource/vazirmatn`), has
an open licence and a similar weight range, so nothing is downloaded from an
unknown source and no `@font-face` points at a file that does not exist.

## Adding the real IRANYekan files

1. Put the licensed files in this folder, for example:
   - `IRANYekanX-Regular.woff2`
   - `IRANYekanX-Medium.woff2`
   - `IRANYekanX-Bold.woff2`
2. Add the matching `@font-face` rules to `src/styles/tokens.css` (top of file):

```css
@font-face {
  font-family: 'IRANYekan';
  src: url('/fonts/IRANYekanX-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
/* … repeat for 500 and 700 … */
```

3. Reload the preview. `IRANYekan` now wins over Vazirmatn everywhere, because
   it is the first family in `--font-fa`.

Do not rename a different font to `IRANYekan`, and do not add `@font-face`
rules pointing at files that have not been uploaded.
