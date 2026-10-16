import type { Locale, Localized } from '@/context/LocaleContext';

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

/** "2026-10-16", from the device's local calendar day (not UTC). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The ISO day `days` after `from` (local calendar). */
export function addDays(from: Date, days: number): string {
  return toIsoDate(new Date(from.getFullYear(), from.getMonth(), from.getDate() + days));
}

const TODAY: Localized<string> = { en: 'Today', ar: 'اليوم' };

/** "Today" for today's date, otherwise the date as `formatDate` writes it. */
export function formatDay(iso: string, locale: Locale, now: Date = new Date()): string {
  return iso === toIsoDate(now) ? TODAY[locale] : formatDate(iso, locale);
}

const MERIDIEM: Localized<readonly [string, string]> = { en: ['AM', 'PM'], ar: ['ص', 'م'] };

/** A 24-hour "14:30" as "02:30 PM" / "02:30 م". */
export function formatTime(hhmm: string, locale: Locale): string {
  const [hours, minutes] = hhmm.split(':').map(Number);
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const suffix = MERIDIEM[locale][hours < 12 ? 0 : 1];
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

/** "02:00 PM – 08:00 PM". */
export function formatTimeRange(from: string, to: string, locale: Locale): string {
  return `${formatTime(from, locale)} – ${formatTime(to, locale)}`;
}

/** The local time now as a 24-hour "HH:MM". */
export function currentTime(now: Date = new Date()): string {
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** "2026-10-05" split for a date column: "05" over "OCT" / "أكتوبر". */
export function dayAndMonth(iso: string, locale: Locale): { day: string; month: string } {
  const [, month, day] = iso.split('-');
  const name = MONTHS[locale][Number(month) - 1] ?? '';
  return { day, month: locale === 'en' ? name.toUpperCase() : name };
}
