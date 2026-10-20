import type { Glyph } from '@/components/common/AppIcon';
import type { DashboardCounts } from '@/services/parking/selectors';

/**
 * Copy and presentation rules for Parking, after the Parklane app's parking demo. The figures
 * come from the parking store (services/parking), so every count on screen is derived from the
 * same bookings, bays and chargers as the booking flow, the passes and the gate. The parking
 * flows are in English for now, as in Parklane; the visitor's pass is also in Arabic.
 */

export const parkingCopy = {
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
  viewAll: 'View All',
  viewAllLabel: 'View all bookings',
  countsNote: (time: string) =>
    `Live counts right now. When you book, availability is checked for the exact time you choose. Updated ${time}.`,
  slot: (label: string) => `Slot ${label}`,
  plate: (country: string, plate: string) => `${country} Plate: ${plate}`,
  carParked: 'Car parked',
  bayFree: 'Bay free',
  evRegistered: (count: number) => `+${count} EV registered`,
  demo: (time: string) => `Demo · simulated time ${time} · open demo controls`,
  demoLabel: 'Open demo controls',
} as const;

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

/** The four tiles, each labelled with exactly what it counts. */
export function parkingStats(counts: DashboardCounts): ParkingStat[] {
  return [
    {
      id: 'available',
      label: 'Available now',
      value: String(counts.sharedAvailableNow),
      total: String(counts.sharedTotal),
      icon: { set: 'material', name: 'alpha-p-box-outline' },
    },
    {
      id: 'guest',
      label: 'Guest bays free now',
      value: String(counts.guestAvailableNow),
      total: String(counts.guestTotal),
      icon: { set: 'ionicons', name: 'people-outline' },
    },
    {
      id: 'ev',
      label: 'Chargers free now',
      value: String(counts.chargerFreeNow),
      total: String(counts.chargerTotal),
      icon: { set: 'ionicons', name: 'flash-outline' },
    },
    {
      id: 'occupancy',
      label: 'Occupied now',
      value: `${Math.round(counts.occupancyRate * 100)}%`,
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
  label: string;
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
    label: 'Navigate\nto My Car',
    icon: { set: 'ionicons', name: 'navigate-outline' },
    tone: 'primary',
  },
  {
    id: 'reserve-guest',
    label: 'Reserve\nGuest Parking',
    icon: { set: 'ionicons', name: 'people-outline' },
    tone: 'accent',
  },
  {
    id: 'reserve-ev',
    label: 'Reserve\nEV Charging',
    icon: { set: 'ionicons', name: 'flash-outline' },
    tone: 'plain',
  },
];
