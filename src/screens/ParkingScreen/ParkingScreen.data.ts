import type { Glyph } from '@/components/common/AppIcon';
import { digitsIn, type Lang } from '@/services/parking/i18n';
import type { DashboardCounts } from '@/services/parking/selectors';

/**
 * Copy and presentation rules for Parking, after the Parklane app's parking demo, in English
 * and Arabic (the app's EN | AR switch). The figures come from the parking store
 * (services/parking), so every count on screen is derived from the same bookings, bays and
 * chargers as the booking flow, the passes and the gate.
 */

interface ParkingCopy {
  title: string;
  subtitle: string;
  bannerTitle: string;
  bannerBody: string;
  myParkingTitle: string;
  myParkingHint: string;
  vehicleTitle: string;
  guestRequestTitle: string;
  guestRequestEmpty: string;
  reserveGuest: string;
  activityTitle: string;
  activityEmpty: string;
  viewAll: string;
  viewAllLabel: string;
  countsNote: (time: string) => string;
  slot: (label: string) => string;
  plate: (country: string, plate: string) => string;
  carParked: string;
  bayFree: string;
  evRegistered: (count: number) => string;
  demo: (time: string) => string;
  demoLabel: string;
  of: string;
}

export const parkingCopy: Record<Lang, ParkingCopy> = {
  en: {
    title: 'Parking',
    subtitle: 'Your parking, simplified: seamless access and greater convenience.',
    bannerTitle: 'Your parking,\nsimplified.',
    bannerBody: 'Seamless access, greater\nconvenience, a smarter\ncommunity.',
    myParkingTitle: 'My Parking',
    myParkingHint: 'Shows the way to your bay',
    vehicleTitle: 'Registered Vehicle',
    guestRequestTitle: 'Guest Parking Requests',
    guestRequestEmpty: 'No upcoming guest parking. Reserve a space and share the pass with your visitor.',
    reserveGuest: 'Reserve Guest Parking',
    activityTitle: 'Parking Activity',
    activityEmpty: 'Entries and exits for your bookings appear here.',
    viewAll: 'View All ›',
    viewAllLabel: 'View all bookings',
    countsNote: (time) =>
      `Live counts right now. When you book, availability is checked for the exact time you choose. Updated ${time}.`,
    slot: (label) => `Slot ${label}`,
    plate: (country, plate) => `${country} Plate: ${plate}`,
    carParked: 'Car parked',
    bayFree: 'Bay free',
    evRegistered: (count) => `+${count} EV registered`,
    demo: (time) => `Demo · simulated time ${time} · open demo controls`,
    demoLabel: 'Open demo controls',
    of: 'of',
  },
  ar: {
    title: 'المواقف',
    subtitle: 'مواقفك بكل سهولة: دخول سلس وراحة أكبر.',
    bannerTitle: 'مواقفك،\nبكل سهولة.',
    bannerBody: 'دخول سلس، راحة أكبر،\nومجتمع أذكى.',
    myParkingTitle: 'موقفي',
    myParkingHint: 'يعرض الطريق إلى موقفك',
    vehicleTitle: 'المركبة المسجّلة',
    guestRequestTitle: 'حجوزات مواقف الضيوف',
    guestRequestEmpty: 'لا توجد حجوزات قادمة للضيوف. احجز موقفًا وشارك التصريح مع ضيفك.',
    reserveGuest: 'حجز موقف لضيف',
    activityTitle: 'نشاط المواقف',
    activityEmpty: 'يظهر هنا دخول وخروج السيارات في حجوزاتك.',
    viewAll: 'عرض الكل ‹',
    viewAllLabel: 'عرض كل الحجوزات',
    countsNote: (time) =>
      `أعداد مباشرة الآن. عند الحجز يُتحقَّق من التوفّر للوقت الذي تختاره بالضبط. آخر تحديث ${time}.`,
    slot: (label) => `الموقف ${label}`,
    plate: (country, plate) => `لوحة ${country === 'Oman' ? 'عُمان' : country}: ⁦${plate}⁩`,
    carParked: 'السيارة في الموقف',
    bayFree: 'الموقف شاغر',
    evRegistered: (count) => `+${digitsIn(count, 'ar')} سيارة كهربائية مسجّلة`,
    demo: (time) => `عرض تجريبي · الوقت المحاكى ${time} · افتح أدوات العرض`,
    demoLabel: 'افتح أدوات العرض',
    of: 'من',
  },
};

/** Separates the parts of a summary line, e.g. tower and level. */
export const SEPARATOR = ' • ';

export interface ParkingStat {
  id: string;
  label: string;
  value: string;
  total?: string;
  icon: Glyph;
  /** Draws a gauge under the figure; the occupancy tile has one. */
  progress?: number;
}

const STAT_LABELS: Record<Lang, Record<'available' | 'guest' | 'ev' | 'occupancy', string>> = {
  en: { available: 'Available now', guest: 'Guest bays free now', ev: 'Chargers free now', occupancy: 'Occupied now' },
  ar: { available: 'متاح الآن', guest: 'مواقف الضيوف الشاغرة', ev: 'الشواحن المتاحة', occupancy: 'المشغول الآن' },
};

/** The four tiles, each labelled with exactly what it counts. */
export function parkingStats(counts: DashboardCounts, lang: Lang): ParkingStat[] {
  const label = STAT_LABELS[lang];
  const n = (value: number) => digitsIn(value, lang);
  return [
    {
      id: 'available',
      label: label.available,
      value: n(counts.sharedAvailableNow),
      total: n(counts.sharedTotal),
      icon: { set: 'material', name: 'alpha-p-box-outline' },
    },
    {
      id: 'guest',
      label: label.guest,
      value: n(counts.guestAvailableNow),
      total: n(counts.guestTotal),
      icon: { set: 'ionicons', name: 'people-outline' },
    },
    {
      id: 'ev',
      label: label.ev,
      value: n(counts.chargerFreeNow),
      total: n(counts.chargerTotal),
      icon: { set: 'ionicons', name: 'flash-outline' },
    },
    {
      id: 'occupancy',
      label: label.occupancy,
      value: lang === 'ar' ? `${n(Math.round(counts.occupancyRate * 100))}٪` : `${Math.round(counts.occupancyRate * 100)}%`,
      icon: { set: 'ionicons', name: 'pie-chart-outline' },
      progress: counts.occupancyRate,
    },
  ];
}

/** `primary` the emerald lit button, `accent` the gold one, `plain` the field-coloured one. */
export type ActionTone = 'primary' | 'accent' | 'plain';

export interface ParkingAction {
  id: 'navigate' | 'reserve-guest' | 'reserve-ev';
  /** Two lines, broken where Parklane breaks them. */
  label: Record<Lang, string>;
  icon: Glyph;
  tone: ActionTone;
}

/**
 * "Request Guest Parking" became Reserve Guest Parking (bookings confirm at once), and
 * "Register New Vehicle", which did nothing, became Reserve EV Charging, as in Parklane.
 */
export const parkingActions: readonly ParkingAction[] = [
  {
    id: 'navigate',
    label: { en: 'Navigate\nto My Car', ar: 'الطريق\nإلى سيارتي' },
    icon: { set: 'ionicons', name: 'navigate-outline' },
    tone: 'primary',
  },
  {
    id: 'reserve-guest',
    label: { en: 'Reserve\nGuest Parking', ar: 'حجز موقف\nلضيف' },
    icon: { set: 'ionicons', name: 'people-outline' },
    tone: 'accent',
  },
  {
    id: 'reserve-ev',
    label: { en: 'Reserve\nEV Charging', ar: 'حجز شحن\nسيارة كهربائية' },
    icon: { set: 'ionicons', name: 'flash-outline' },
    tone: 'plain',
  },
];
