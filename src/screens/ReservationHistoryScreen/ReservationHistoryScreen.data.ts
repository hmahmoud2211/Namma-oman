import type { Lang } from '../../services/parking/i18n';
import type { Reservation } from '../../services/parking/types';

export type HistoryFilter = 'all' | 'upcoming' | 'active' | 'past';

export const historyCopy: Record<Lang, { title: string; empty: string; note: string; reserveGuest: string }> = {
  en: {
    title: 'Reservation History',
    empty: 'No bookings here yet.',
    note: 'Times are shown in Muscat time. Booked times and actual gate times are both kept for every visit.',
    reserveGuest: 'Reserve Guest Parking',
  },
  ar: {
    title: 'سجل الحجوزات',
    empty: 'لا توجد حجوزات هنا بعد.',
    note: 'الأوقات بتوقيت مسقط. يُحفظ وقت الحجز ووقت البوابة الفعلي لكل زيارة.',
    reserveGuest: 'حجز موقف لضيف',
  },
};

export const filterOptions: { value: HistoryFilter; label: Record<Lang, string> }[] = [
  { value: 'all', label: { en: 'All', ar: 'الكل' } },
  { value: 'upcoming', label: { en: 'Upcoming', ar: 'القادمة' } },
  { value: 'active', label: { en: 'Active', ar: 'الحالية' } },
  { value: 'past', label: { en: 'Past', ar: 'السابقة' } },
];

export function matchesFilter(r: Reservation, filter: HistoryFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'upcoming':
      return r.status === 'confirmed';
    case 'active':
      return r.status === 'checked-in';
    case 'past':
      return r.status === 'completed' || r.status === 'cancelled' || r.status === 'no-show';
  }
}
