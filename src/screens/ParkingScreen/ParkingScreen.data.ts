import type { Glyph } from '@/components/common/AppIcon';
import type { StatusTone } from '@/components/ui/StatusChip';
import type { Locale, Localized } from '@/context/LocaleContext';

/**
 * Parking, migrated from the Parklane app: the resident's bay and vehicle, the building's
 * capacity, the latest guest parking request and recent activity. Sample data shaped like an
 * API response, so a backend can replace this module rather than the screen.
 */

export const parkingContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  myParkingTitle: string;
  slot: (code: string) => string;
  vehicleTitle: string;
  plate: (country: string, plate: string) => string;
  vehicleHint: string;
  guestRequestTitle: string;
  activityTitle: string;
  viewAll: string;
}> = {
  en: {
    overline: 'MOBILITY',
    title: 'Parking',
    subtitle: 'Your parking, simplified: seamless access and greater convenience.',
    myParkingTitle: 'My Parking',
    slot: (code) => `Slot ${code}`,
    vehicleTitle: 'Registered Vehicle',
    plate: (country, plate) => `${country} Plate: ${plate}`,
    vehicleHint: "Shows the vehicle's details",
    guestRequestTitle: 'Guest Parking Request',
    activityTitle: 'Parking Activity',
    viewAll: 'View All',
  },
  ar: {
    overline: 'التنقّل',
    title: 'المواقف',
    subtitle: 'مواقفك بكل سهولة: دخول سلس وراحة أكبر.',
    myParkingTitle: 'موقفي',
    slot: (code) => `الموقف ${code}`,
    vehicleTitle: 'المركبة المسجّلة',
    plate: (country, plate) => `لوحة ${country}: ${plate}`,
    vehicleHint: 'يعرض تفاصيل المركبة',
    guestRequestTitle: 'طلب موقف للضيوف',
    activityTitle: 'نشاط المواقف',
    viewAll: 'عرض الكل',
  },
};

/** Separates the parts of a summary line, e.g. tower and level. */
export const SEPARATOR = ' • ';

/** Only the state the design shows; add others with their pill when designed. */
export type SlotStatus = 'active';

export const slotStatusDisplay: Record<SlotStatus, { label: Localized<string>; tone: StatusTone }> =
  {
    active: { label: { en: 'Active', ar: 'نشط' }, tone: 'positive' },
  };

export const mySlot = {
  /** The bay's code, as painted on its pillar. */
  code: 'P2-148',
  tower: { en: 'Tower A', ar: 'البرج A' },
  level: { en: 'Basement 2', ar: 'القبو 2' },
  status: 'active' as SlotStatus,
};

export const myVehicle = {
  make: { en: 'BMW', ar: 'بي إم دبليو' },
  model: 'X5 xDrive',
  colour: { en: 'Black', ar: 'أسود' },
  plateCountry: { en: 'Oman', ar: 'عُمان' },
  plate: '4521 AB',
};

/** Counts for the resident's building, as the stat tiles show them. */
export const capacity = {
  available: 42,
  total: 120,
  guestAvailable: 8,
  guestTotal: 20,
  evAvailable: 6,
  evTotal: 12,
};

export interface ParkingStat {
  id: string;
  label: string;
  value: string;
  total?: string;
  icon: Glyph;
  /** Draws a meter under the figure (the occupancy tile). */
  progress?: number;
}

const STAT_LABELS: Localized<Record<'available' | 'guest' | 'ev' | 'occupancy', string>> = {
  en: {
    available: 'Available Spaces',
    guest: 'Guest Parking',
    ev: 'EV Charging',
    occupancy: 'Occupancy Rate',
  },
  ar: {
    available: 'المواقف المتاحة',
    guest: 'مواقف الضيوف',
    ev: 'شحن السيارات',
    occupancy: 'نسبة الإشغال',
  },
};

export function parkingStats(locale: Locale): ParkingStat[] {
  const labels = STAT_LABELS[locale];
  // Share of the building's bays in use: 78 of 120 is 65%.
  const occupancy = capacity.total > 0 ? (capacity.total - capacity.available) / capacity.total : 0;
  return [
    {
      id: 'available',
      label: labels.available,
      value: String(capacity.available),
      total: String(capacity.total),
      icon: { set: 'material', name: 'alpha-p-box-outline' },
    },
    {
      id: 'guest',
      label: labels.guest,
      value: String(capacity.guestAvailable),
      total: String(capacity.guestTotal),
      icon: { set: 'ionicons', name: 'people-outline' },
    },
    {
      id: 'ev',
      label: labels.ev,
      value: String(capacity.evAvailable),
      total: String(capacity.evTotal),
      icon: { set: 'ionicons', name: 'flash-outline' },
    },
    {
      id: 'occupancy',
      label: labels.occupancy,
      value: `${Math.round(occupancy * 100)}%`,
      icon: { set: 'ionicons', name: 'pie-chart-outline' },
      progress: occupancy,
    },
  ];
}

/** `primary` and `accent` are the filled buttons; `plain` the outlined one. */
export type ActionTone = 'primary' | 'accent' | 'plain';

export const parkingActions: readonly {
  id: 'navigate' | 'request-guest' | 'register-vehicle';
  label: Localized<string>;
  icon: Glyph;
  tone: ActionTone;
}[] = [
  {
    id: 'navigate',
    label: { en: 'Navigate to My Car', ar: 'الوصول إلى سيارتي' },
    icon: { set: 'ionicons', name: 'navigate-outline' },
    tone: 'primary',
  },
  {
    id: 'request-guest',
    label: { en: 'Request Guest Parking', ar: 'طلب موقف للضيوف' },
    icon: { set: 'ionicons', name: 'people-outline' },
    tone: 'accent',
  },
  {
    id: 'register-vehicle',
    label: { en: 'Register New Vehicle', ar: 'تسجيل مركبة جديدة' },
    icon: { set: 'ionicons', name: 'car-outline', badge: 'add' },
    tone: 'plain',
  },
];

export const guestRequestStatusDisplay = {
  approved: { label: { en: 'Approved', ar: 'تمت الموافقة' }, tone: 'positive' as StatusTone },
};

/** The latest guest parking request; its date is a day from today. */
export const latestGuestRequest = {
  id: 'GPR-2026-0311',
  dayOffset: 1,
  from: '14:00',
  to: '20:00',
  guests: 2,
  status: 'approved' as const,
};

export type ActivityKind = 'vehicle-entry' | 'guest-approval' | 'vehicle-exit';

/** Each kind of event keeps its icon and pill colour. */
export const activityKindDisplay: Record<
  ActivityKind,
  { title: Localized<string>; icon: Glyph; tone: StatusTone }
> = {
  'vehicle-entry': {
    title: { en: 'Car Entered', ar: 'دخلت السيارة' },
    icon: { set: 'ionicons', name: 'car-outline' },
    tone: 'positive',
  },
  'guest-approval': {
    title: { en: 'Guest Parking Approved', ar: 'تمت الموافقة على موقف الضيوف' },
    icon: { set: 'ionicons', name: 'people-outline' },
    tone: 'accent',
  },
  'vehicle-exit': {
    title: { en: 'Vehicle Exit Logged', ar: 'تم تسجيل خروج المركبة' },
    icon: { set: 'ionicons', name: 'car-outline', badge: 'remove' },
    tone: 'accent',
  },
};

export const activityStatusLabel: Localized<Record<'completed' | 'approved', string>> = {
  en: { completed: 'Completed', approved: 'Approved' },
  ar: { completed: 'مكتمل', approved: 'تمت الموافقة' },
};

/** Today's activity, newest first. */
export const recentActivity: readonly {
  id: string;
  kind: ActivityKind;
  /** Whose car or guests. */
  subject: Localized<string>;
  /** The bay, or the party size (`guests`). */
  detail: string | { guests: number };
  /** 24-hour "HH:MM", today. */
  time: string;
  status: 'completed' | 'approved';
}[] = [
  {
    id: 'act-0914',
    kind: 'vehicle-entry',
    subject: { en: 'My Vehicle', ar: 'مركبتي' },
    detail: mySlot.code,
    time: '09:14',
    status: 'completed',
  },
  {
    id: 'act-1030',
    kind: 'guest-approval',
    subject: { en: 'Sara Lamees', ar: 'سارة لميس' },
    detail: { guests: 2 },
    time: '10:30',
    status: 'approved',
  },
  {
    id: 'act-2045',
    kind: 'vehicle-exit',
    subject: { en: 'My Vehicle', ar: 'مركبتي' },
    detail: mySlot.code,
    time: '20:45',
    status: 'completed',
  },
];
