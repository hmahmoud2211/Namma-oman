import type { Locale } from '@/context/LocaleContext';

const MONTHS: Readonly<Record<Locale, readonly string[]>> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
};

const ARABIC_QUARTERS = ['الأول', 'الثاني', 'الثالث', 'الرابع'] as const;

/**
 * A quarter split for display: English reads as one short line ("Q2 2027"); Arabic's
 * quarter is a phrase ("الربع الثاني"), shown as a small lead above the year.
 */
export function quarterParts(
  quarter: number,
  year: number,
  locale: Locale,
): { lead?: string; main: string } {
  return locale === 'ar'
    ? { lead: `الربع ${ARABIC_QUARTERS[quarter - 1]}`, main: String(year) }
    : { main: `Q${quarter} ${year}` };
}

/** "Q2 2027" / "الربع الثاني 2027". */
export function formatQuarter(quarter: number, year: number, locale: Locale): string {
  return locale === 'ar' ? `الربع ${ARABIC_QUARTERS[quarter - 1]} ${year}` : `Q${quarter} ${year}`;
}

/**
 * Formats an ISO-style date as "12 Oct 2026" / "12 أكتوبر 2026": a day (`2026-10-12`), a month
 * (`2026-10`) or a quarter (`2027-Q2`). Written out rather than Intl so the Western digits
 * used across the app are guaranteed on every engine.
 */
export function formatDate(iso: string, locale: Locale): string {
  const quarter = /^(\d{4})-Q([1-4])$/.exec(iso);
  if (quarter) return formatQuarter(Number(quarter[2]), Number(quarter[1]), locale);
  const [year, month, day] = iso.split('-').map(Number);
  const monthName = MONTHS[locale][month - 1];
  return day ? `${String(day).padStart(2, '0')} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** Short month name for chart axes ("Oct" / "أكتوبر"). */
export function formatMonth(month: number, locale: Locale): string {
  return MONTHS[locale][month - 1];
}
