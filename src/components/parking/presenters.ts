import type Ionicons from '@expo/vector-icons/Ionicons';

import { chargingStateIn, nameIn, rangeIn, relativeDayIn, timeIn, type Lang } from '../../services/parking/i18n';
import type { ReservationView } from '../../services/parking/selectors';
import { siteDateKey } from '../../services/parking/time';
import type { AppNotification, ChargingState } from '../../services/parking/types';

/**
 * Plain-language labels for the parking screens, so residents and visitors
 * read "Charging" and "Space V-023", never record states or codes.
 */

/** A charging session's state as people say it, in the reader's language. */
export const chargingStateLabel = (state: ChargingState, lang: Lang = 'en') => chargingStateIn(state, lang);

export function reservationIcon(view: ReservationView): keyof typeof Ionicons.glyphMap {
  if (view.reservation.parkingType === 'ev') return 'flash-outline';
  if (view.reservation.status === 'checked-in') return 'car-outline';
  return 'calendar-outline';
}

/**
 * "Today · 02:10 PM–05:10 PM": short enough for one line beside a status chip.
 * Without `now` (e.g. for history) it falls back to the full date.
 */
export function shortRange(start: string, end: string, now?: number, lang: Lang = 'en'): string {
  if (now === undefined) return rangeIn(start, end, lang);
  const sameDay = siteDateKey(Date.parse(start)) === siteDateKey(Date.parse(end));
  const nextDay = sameDay ? '' : lang === 'ar' ? ' (+يوم)' : ' (+1 day)';
  return `${relativeDayIn(siteDateKey(Date.parse(start)), now, lang)} · ${timeIn(start, lang)}–${timeIn(end, lang)}${nextDay}`;
}

/** Two summary lines for a list row. */
export function reservationLines(view: ReservationView, now?: number, lang: Lang = 'en'): string[] {
  const r = view.reservation;
  const where = `${view.space.label} · ${nameIn(view.zone.name, lang)}`;
  const lines = [shortRange(r.scheduledStart, r.scheduledEnd, now, lang), where];
  if (r.status === 'checked-in' && r.actualEntryAt) {
    lines[1] = `${where} · ${lang === 'ar' ? 'في الداخل منذ' : 'in since'} ${timeIn(r.actualEntryAt, lang)}`;
  }
  if (view.charging && (r.status === 'confirmed' || r.status === 'checked-in')) {
    lines.push(chargingStateLabel(view.charging.state, lang));
  }
  return lines;
}

export const notificationIcon: Record<AppNotification['kind'], keyof typeof Ionicons.glyphMap> = {
  overdue: 'time-outline',
  'reassignment-needed': 'swap-horizontal-outline',
  'charging-complete': 'battery-full-outline',
  'charger-fault': 'warning-outline',
  'no-show': 'person-remove-outline',
  'help-request': 'help-buoy-outline',
  entry: 'log-in-outline',
  exit: 'log-out-outline',
};
