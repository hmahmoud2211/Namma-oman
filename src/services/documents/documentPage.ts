import { darkColors, lightColors } from '@/theme/colors';

/*
 * The page every generated document shares: a self-contained A4 page in the app's palette.
 * It is printed without the app, so styles are inline and the brand is set in type rather
 * than the logo image. Arabic documents are laid out right to left.
 */

/** Ink, accents and rules, taken from the theme so documents match the app. */
const ink = darkColors.textOnGlass;
const green = lightColors.surfaceIcon;
const gold = darkColors.accent;
const bronze = lightColors.surfaceAccentText;
const rule = lightColors.surfaceDivider;
const paper = darkColors.white;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Label and value pairs, two to a row. */
export function detailsTable(rows: readonly (readonly [string, string])[]): string {
  const cells = rows.map(
    ([label, value]) =>
      `<td><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div></td>`,
  );
  const pairs: string[] = [];
  for (let index = 0; index < cells.length; index += 2) {
    pairs.push(`<tr>${cells[index]}${cells[index + 1] ?? '<td></td>'}</tr>`);
  }
  return `<table class="details">${pairs.join('')}</table>`;
}

/** A titled block; `body` is trusted HTML built by the helpers here. */
export function section(title: string, body: string): string {
  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

export interface DocumentPageOptions {
  /** The heading on the page. */
  title: string;
  /** The browser tab, and the default name when the web saves a PDF. */
  pageTitle: string;
  /** Plain-text lines under the heading, e.g. the unit and who it is for. */
  meta: readonly string[];
  /** Trusted HTML built with `section` and `detailsTable`. */
  body: string;
  /** Plain-text footnote. */
  note: string;
  /** The brand line at the top, in the document's language. */
  brand: string;
  lang: 'en' | 'ar';
}

/** The shared page: brand, title, who and what it is for, then the body. */
export function documentPage({
  title,
  pageTitle,
  meta,
  body,
  note,
  brand,
  lang,
}: DocumentPageOptions): string {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(pageTitle)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; padding: 24px; font-family: -apple-system, 'Helvetica Neue', Roboto, 'Segoe UI', Tahoma, Arial, sans-serif;
         color: ${ink}; background: ${paper}; font-size: 12px; line-height: 1.5; }
  .brand { font-family: Georgia, 'Times New Roman', serif; font-size: 22px; letter-spacing: 1px; color: ${green}; }
  .rule { height: 3px; margin: 14px 0 20px; border-radius: 2px; background: linear-gradient(90deg, ${bronze}, ${gold}); }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { opacity: 0.7; margin: 0; }
  section { margin-top: 22px; }
  h2 { font-size: 13px; color: ${green}; margin: 0 0 8px; padding-bottom: 6px;
       border-bottom: 1px solid ${rule}; page-break-after: avoid; }
  .details, .qr { page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; }
  .details td { width: 50%; padding: 6px 8px; vertical-align: top; text-align: start; }
  .label { font-size: 10px; opacity: 0.65; }
  .value { font-size: 12.5px; font-weight: 600; }
  /* A QR code with its quiet zone, centred, and the line under it. */
  .qr { margin: 26px auto 0; width: fit-content; padding: 16px; border-radius: 12px;
        border: 1.5px solid ${gold}; background: ${paper}; }
  .qr svg { display: block; }
  .qr-caption { text-align: center; margin: 10px 0 0; font-weight: 600; }
  .note { margin-top: 28px; font-size: 9.5px; opacity: 0.6; }
</style>
</head>
<body>
  <div class="brand">${escapeHtml(brand)}</div>
  <div class="rule"></div>
  <h1>${escapeHtml(title)}</h1>
  ${meta.map((line) => `<p class="meta">${escapeHtml(line)}</p>`).join('\n  ')}
  ${body}
  <p class="note">${escapeHtml(note)}</p>
</body>
</html>`;
}
