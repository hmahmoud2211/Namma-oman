/**
 * Site time handling: Asia/Muscat.
 *
 * Bookings are entered and shown in Muscat time and stored as UTC. Oman keeps
 * Gulf Standard Time (UTC+4) all year, with no daylight saving, so the offset
 * is a constant here rather than read from `Intl`, and conversions are
 * identical on Hermes, browsers and Node.
 *
 * For a site in a zone with daylight saving, compute the offset per instant in
 * `siteOffsetMinutes` (or replace it with an IANA-backed library) and every
 * conversion follows.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
export const DAY_MS = 24 * HOUR;
export { MINUTE as MINUTE_MS, HOUR as HOUR_MS };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Gulf Standard Time, UTC+4. */
const SITE_OFFSET_MINUTES = 240;

/** The site's offset from UTC at an instant, in minutes (constant in Muscat). */
export function siteOffsetMinutes(_utcMs: number): number {
  return SITE_OFFSET_MINUTES;
}

export interface SiteParts {
  year: number;
  /** 1-12. */
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
}

export function siteParts(utcMs: number): SiteParts {
  const local = new Date(utcMs + siteOffsetMinutes(utcMs) * MINUTE);
  return {
    year: local.getUTCFullYear(),
    month: local.getUTCMonth() + 1,
    day: local.getUTCDate(),
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
    weekday: local.getUTCDay(),
  };
}

const pad = (value: number) => String(value).padStart(2, '0');

/** "2026-10-13": the Muscat calendar date of an instant. */
export function siteDateKey(utcMs: number): string {
  const p = siteParts(utcMs);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** Minutes since Muscat midnight. */
export function siteMinuteOfDay(utcMs: number): number {
  const p = siteParts(utcMs);
  return p.hour * 60 + p.minute;
}

/**
 * The UTC instant for a site wall-clock time. `minuteOfDay` may run past
 * 1440 for a time on the following day.
 */
export function siteToUtc(dateKey: string, minuteOfDay: number): number {
  const [year, month, day] = dateKey.split('-').map(Number);
  const wall = Date.UTC(year, month - 1, day) + minuteOfDay * MINUTE;
  // Guess with the usual offset, then correct with the offset in force there.
  let utc = wall - SITE_OFFSET_MINUTES * MINUTE;
  utc = wall - siteOffsetMinutes(utc) * MINUTE;
  return wall - siteOffsetMinutes(utc) * MINUTE;
}

/** Adds whole days to a Muscat date key. */
export function addDaysToKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/* ------------------------------------------------------- Formatting */

const toMs = (value: string | number) => (typeof value === 'number' ? value : Date.parse(value));

/** "02:30 PM". */
export function formatTime(value: string | number): string {
  const p = siteParts(toMs(value));
  const hour12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return `${pad(hour12)}:${pad(p.minute)} ${p.hour < 12 ? 'AM' : 'PM'}`;
}

/** "02:30 PM" for a minute of the day, for pickers. */
export function formatMinuteOfDay(minuteOfDay: number): string {
  const m = ((minuteOfDay % 1440) + 1440) % 1440;
  const hour = Math.floor(m / 60);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${pad(hour12)}:${pad(m % 60)} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** "Tue 13 Oct 2026". */
export function formatDate(value: string | number, withYear = true): string {
  const p = siteParts(toMs(value));
  const base = `${WEEKDAYS[p.weekday]} ${pad(p.day)} ${MONTHS[p.month - 1]}`;
  return withYear ? `${base} ${p.year}` : base;
}

/** "Tue 13 Oct" for a Muscat date key. */
export function formatDateKey(dateKey: string): string {
  return formatDate(siteToUtc(dateKey, 12 * 60), false);
}

/** "Tue 13 Oct, 02:30 PM". */
export function formatDateTime(value: string | number): string {
  return `${formatDate(value, false)}, ${formatTime(value)}`;
}

/** "Tue 13 Oct, 02:00 PM – 05:00 PM", naming the end's date when it differs. */
export function formatRange(start: string | number, end: string | number): string {
  const sameDay = siteDateKey(toMs(start)) === siteDateKey(toMs(end));
  return sameDay
    ? `${formatDate(start, false)}, ${formatTime(start)} – ${formatTime(end)}`
    : `${formatDateTime(start)} – ${formatDateTime(end)}`;
}

/** "2h 15m", "45m". */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours === 0) {
    return `${rest}m`;
  }
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** "Today", "Tomorrow" or the date, relative to `now`. */
export function relativeDayLabel(dateKey: string, nowMs: number): string {
  const today = siteDateKey(nowMs);
  if (dateKey === today) {
    return 'Today';
  }
  if (dateKey === addDaysToKey(today, 1)) {
    return 'Tomorrow';
  }
  return formatDateKey(dateKey);
}

export const iso = (ms: number) => new Date(ms).toISOString();
export const ms = (value: string) => Date.parse(value);
