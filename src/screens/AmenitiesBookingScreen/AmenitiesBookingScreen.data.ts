import type { Glyph } from '@/components/common/AppIcon';
import type { ListOption } from '@/components/ui/OptionList';
import type { Locale, Localized } from '@/context/LocaleContext';
import { addDays, formatDay, toIsoDate } from '@/utils/date';

import { guestsLabel } from '../VisitorAccessScreen/VisitorAccessScreen.data';

/**
 * Amenities Booking, migrated from the Parklane app: browse the community's amenities by
 * category, book a day, an hour and a party size, and manage your bookings. Frontend only:
 * bookings live in the screen's state, shaped like an API response for a backend to replace.
 */

type Text = Localized<string>;

export const amenitiesContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  bookNow: string;
  viewMore: string;
  showLess: string;
  empty: string;
  formTitle: (amenity: string) => string;
  formSubtitle: string;
  dateLabel: string;
  datePlaceholder: string;
  slotLabel: string;
  slotPlaceholder: string;
  guestsLabel: string;
  confirm: string;
  closeForm: string;
  bookingsTitle: string;
  cancelBooking: (amenity: string, date: string) => string;
  booked: (amenity: string, date: string, slot: string) => string;
  noSlots: string;
  hours: string;
  capacity: (count: number) => string;
  openForm: string;
}> = {
  en: {
    overline: 'LIFESTYLE',
    title: 'Amenities Booking',
    subtitle: 'Premium amenities for a healthier, happier lifestyle.',
    bookNow: 'Book Now',
    viewMore: 'View More Amenities',
    showLess: 'Show Less',
    empty: 'No amenities in this category yet.',
    formTitle: (amenity) => `Book ${amenity}`,
    formSubtitle: 'Choose a day, a time and how many are coming',
    dateLabel: 'Date',
    datePlaceholder: 'Select date',
    slotLabel: 'Time',
    slotPlaceholder: 'Select time',
    guestsLabel: 'Guests',
    confirm: 'Confirm Booking',
    closeForm: 'Close the booking form',
    bookingsTitle: 'My Bookings',
    cancelBooking: (amenity, date) => `Cancel ${amenity} on ${date}`,
    booked: (amenity, date, slot) => `${amenity} booked for ${date}, ${slot}`,
    noSlots: 'No times left that day',
    hours: 'Opening hours',
    capacity: (count) => `Max ${count}`,
    openForm: 'Opens the booking form',
  },
  ar: {
    overline: 'أسلوب الحياة',
    title: 'حجز المرافق',
    subtitle: 'مرافق مميزة لأسلوب حياة أكثر صحة وسعادة.',
    bookNow: 'احجز الآن',
    viewMore: 'عرض المزيد من المرافق',
    showLess: 'عرض أقل',
    empty: 'لا توجد مرافق في هذه الفئة بعد.',
    formTitle: (amenity) => `حجز ${amenity}`,
    formSubtitle: 'اختر اليوم والوقت وعدد الحضور',
    dateLabel: 'التاريخ',
    datePlaceholder: 'اختر التاريخ',
    slotLabel: 'الوقت',
    slotPlaceholder: 'اختر الوقت',
    guestsLabel: 'الضيوف',
    confirm: 'تأكيد الحجز',
    closeForm: 'إغلاق نموذج الحجز',
    bookingsTitle: 'حجوزاتي',
    cancelBooking: (amenity, date) => `إلغاء حجز ${amenity} يوم ${date}`,
    booked: (amenity, date, slot) => `تم حجز ${amenity} يوم ${date}، ${slot}`,
    noSlots: 'لا توجد أوقات متاحة في ذلك اليوم',
    hours: 'ساعات العمل',
    capacity: (count) => `الحد الأقصى ${count}`,
    openForm: 'يفتح نموذج الحجز',
  },
};

export type AmenityCategory = 'sports' | 'leisure' | 'family';

/** `all` is the unfiltered list; the rest match an amenity's categories. */
export type CategoryFilter = 'all' | AmenityCategory;

export const categoryChips: readonly { id: CategoryFilter; label: Text; icon: Glyph }[] = [
  { id: 'all', label: { en: 'All', ar: 'الكل' }, icon: { set: 'ionicons', name: 'grid-outline' } },
  { id: 'sports', label: { en: 'Sports', ar: 'رياضة' }, icon: { set: 'material', name: 'run' } },
  {
    id: 'leisure',
    label: { en: 'Leisure', ar: 'ترفيه' },
    icon: { set: 'material', name: 'seat-recline-normal' },
  },
  {
    id: 'family',
    label: { en: 'Family', ar: 'عائلة' },
    icon: { set: 'material', name: 'account-group-outline' },
  },
];

export interface Amenity {
  id: string;
  title: Text;
  location: Text;
  /** Opening hours, 24-hour "HH:MM". */
  opens: string;
  closes: string;
  capacity: number;
  icon: Glyph;
  categories: readonly AmenityCategory[];
}

export const amenities: readonly Amenity[] = [
  {
    id: 'pool',
    title: { en: 'Swimming Pool', ar: 'المسبح' },
    location: { en: 'Residential Club', ar: 'النادي السكني' },
    opens: '06:00',
    closes: '22:00',
    capacity: 20,
    icon: { set: 'material', name: 'pool' },
    categories: ['sports', 'leisure', 'family'],
  },
  {
    id: 'gym',
    title: { en: 'Gym', ar: 'النادي الرياضي' },
    location: { en: 'Tower A - Level 1', ar: 'البرج A - الطابق 1' },
    opens: '05:00',
    closes: '23:00',
    capacity: 15,
    icon: { set: 'ionicons', name: 'barbell-outline' },
    categories: ['sports'],
  },
  {
    id: 'hall',
    title: { en: 'Multipurpose Hall', ar: 'القاعة متعددة الأغراض' },
    location: { en: 'Tower B - Ground Floor', ar: 'البرج B - الطابق الأرضي' },
    opens: '09:00',
    closes: '22:00',
    capacity: 50,
    icon: { set: 'material', name: 'account-group-outline' },
    categories: ['leisure', 'family'],
  },
  // Revealed by "View More Amenities".
  {
    id: 'yoga',
    title: { en: 'Yoga Studio', ar: 'استوديو اليوغا' },
    location: { en: 'Clubhouse - Level 2', ar: 'النادي - الطابق 2' },
    opens: '06:00',
    closes: '21:00',
    capacity: 12,
    icon: { set: 'material', name: 'meditation' },
    categories: ['sports', 'leisure'],
  },
  {
    id: 'cinema',
    title: { en: 'Outdoor Cinema', ar: 'السينما المفتوحة' },
    location: { en: 'Central Garden', ar: 'الحديقة المركزية' },
    opens: '18:00',
    closes: '23:00',
    capacity: 40,
    icon: { set: 'material', name: 'movie-open-outline' },
    categories: ['leisure', 'family'],
  },
  {
    id: 'kids',
    title: { en: 'Kids Play Area', ar: 'منطقة ألعاب الأطفال' },
    location: { en: 'Central Garden', ar: 'الحديقة المركزية' },
    opens: '08:00',
    closes: '20:00',
    capacity: 25,
    icon: { set: 'material', name: 'seesaw' },
    categories: ['family'],
  },
  {
    id: 'cafe',
    title: { en: 'Clubhouse Café', ar: 'مقهى النادي' },
    location: { en: 'Clubhouse - Ground Floor', ar: 'النادي - الطابق الأرضي' },
    opens: '07:00',
    closes: '22:00',
    capacity: 30,
    icon: { set: 'material', name: 'coffee-outline' },
    categories: ['leisure'],
  },
];

/** How many amenities show before "View More Amenities" is tapped. */
export const initialVisibleCount = 3;

export function amenitiesFor(filter: CategoryFilter): readonly Amenity[] {
  return filter === 'all'
    ? amenities
    : amenities.filter((amenity) => amenity.categories.includes(filter));
}

/** "06:00 - 22:00": opening hours read the same in both languages. */
export function hoursLabel({ opens, closes }: Pick<Amenity, 'opens' | 'closes'>): string {
  return `${opens} - ${closes}`;
}

export interface Booking {
  id: string;
  amenityId: Amenity['id'];
  /** ISO day. */
  date: string;
  /** The slot's start hour, "HH:00". */
  slot: string;
  guests: number;
}

/** The resident's upcoming bookings, soonest first. */
export function sampleBookings(now: Date = new Date()): Booking[] {
  return [{ id: 'BK-1001', amenityId: 'pool', date: addDays(now, 2), slot: '10:00', guests: 2 }];
}

export interface BookingForm {
  /** ISO day. */
  date: string;
  /** Start hour, "HH:00". */
  slot: string;
  /** A count. */
  guests: string;
}

export type BookingErrors = Partial<Record<keyof BookingForm, string>>;

/** At most this many people on one booking, or the amenity's capacity if lower. */
const MAX_GUESTS = 6;

const pad = (value: number) => String(value).padStart(2, '0');

/** "10:00 - 11:00", as the cards write hours. */
export function slotLabel(slot: string): string {
  const hour = Number.parseInt(slot, 10);
  return `${pad(hour)}:00 - ${pad(hour + 1)}:00`;
}

/** Bookings open from today up to two weeks ahead. */
export function bookingDateOptions(
  locale: Locale,
  now: Date = new Date(),
  days = 14,
): ListOption[] {
  return Array.from({ length: days }, (_, offset) => {
    const iso = addDays(now, offset);
    return { id: iso, label: formatDay(iso, locale, now) };
  });
}

/**
 * One-hour slots across the amenity's opening hours. Today's list starts at the next full
 * hour, so a slot already under way can't be booked.
 */
export function slotOptions(amenity: Amenity, date: string, now: Date = new Date()): ListOption[] {
  const opens = Number.parseInt(amenity.opens, 10);
  const closes = Number.parseInt(amenity.closes, 10);
  const first = date === toIsoDate(now) ? Math.max(opens, now.getHours() + 1) : opens;
  return Array.from({ length: Math.max(0, closes - first) }, (_, index) => {
    const id = `${pad(first + index)}:00`;
    return { id, label: slotLabel(id) };
  });
}

export function bookingGuestOptions(amenity: Amenity, locale: Locale): ListOption[] {
  return Array.from({ length: Math.min(MAX_GUESTS, amenity.capacity) }, (_, index) => ({
    id: String(index + 1),
    label: guestsLabel(index + 1, locale),
  }));
}

const ERRORS: Localized<Record<'date' | 'slot' | 'taken', string>> = {
  en: { date: 'Choose a date', slot: 'Choose a time', taken: 'You already booked this time' },
  ar: { date: 'اختر التاريخ', slot: 'اختر الوقت', taken: 'لقد حجزت هذا الوقت مسبقاً' },
};

/** Frontend checks only; the backend will validate again (and check capacity). */
export function validateBooking(
  form: BookingForm,
  amenity: Amenity,
  bookings: readonly Booking[],
  locale: Locale,
): BookingErrors {
  const messages = ERRORS[locale];
  const errors: BookingErrors = {};
  if (!form.date) errors.date = messages.date;
  if (!form.slot) {
    errors.slot = messages.slot;
  } else if (
    bookings.some(
      (booking) =>
        booking.amenityId === amenity.id &&
        booking.date === form.date &&
        booking.slot === form.slot,
    )
  ) {
    errors.slot = messages.taken;
  }
  return errors;
}

/** A confirmed booking. Frontend only: its reference follows the highest so far. */
export function createBooking(
  form: BookingForm,
  amenity: Amenity,
  existing: readonly Booking[],
): Booking {
  const last = existing.reduce(
    (max, booking) => Math.max(max, Number.parseInt(booking.id.replace(/\D/g, ''), 10) || 0),
    1000,
  );
  return {
    id: `BK-${last + 1}`,
    amenityId: amenity.id,
    date: form.date,
    slot: form.slot,
    guests: Number.parseInt(form.guests, 10) || 1,
  };
}
