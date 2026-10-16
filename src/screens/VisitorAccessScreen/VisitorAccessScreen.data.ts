import type { Glyph } from '@/components/common/AppIcon';
import type { ListOption } from '@/components/ui/OptionList';
import type { StatusTone } from '@/components/ui/StatusChip';
import type { Locale, Localized } from '@/context/LocaleContext';
import { addDays, formatDay, formatTime } from '@/utils/date';

/**
 * Visitor Access, migrated from the Parklane app: issue a QR pass for a guest, see the active
 * pass and upcoming visitors, share or cancel a pass. Frontend only for now: passes live in
 * the screen's state, shaped like an API response so a backend can replace this module.
 */

export type VisitorStatus = 'arrived' | 'scheduled' | 'entered';

export interface VisitorPass {
  id: string;
  /** Sample guests carry both spellings; a typed name is used as entered in both. */
  name: Localized<string>;
  mobile: string;
  /** ISO day, e.g. "2026-10-16". */
  date: string;
  /** 24-hour "HH:MM". */
  time: string;
  guests: number;
  /** Empty when the visitor is not bringing a car. */
  plate: string;
  status: VisitorStatus;
}

export const visitorContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  generate: string;
  passCaption: string;
  passOptions: string;
  passFor: (name: string) => string;
  upcomingTitle: string;
  viewAll: string;
  showLess: string;
  parkingTitle: string;
  parkingSubtitle: string;
  sharePass: string;
  cancelPass: string;
  passCreated: (name: string) => string;
  passCancelled: string;
  shareFailedTitle: string;
  shareFailedBody: string;
  noVisitors: string;
  showPass: string;
}> = {
  en: {
    overline: 'GUESTS',
    title: 'Visitor Access',
    subtitle: 'Create secure guest entry for a safer, smarter community.',
    formTitle: 'New Visitor Pass',
    formSubtitle: 'Fill in the details to generate a QR pass',
    generate: 'Generate QR Pass',
    passCaption: 'Show this QR code at the gate for a smooth entry experience.',
    passOptions: 'Pass options',
    passFor: (name) => `QR pass for ${name}`,
    upcomingTitle: 'Upcoming Visitors',
    viewAll: 'View All',
    showLess: 'Show Less',
    parkingTitle: 'Guest Parking Request',
    parkingSubtitle: 'Reserve a parking slot for your visitors',
    sharePass: 'Share pass',
    cancelPass: 'Cancel pass',
    passCreated: (name) => `QR pass created for ${name}`,
    passCancelled: 'Pass cancelled',
    shareFailedTitle: "Couldn't share the pass",
    shareFailedBody: 'Please try again in a moment.',
    noVisitors: 'No visitors expected. Create a pass above.',
    showPass: "Shows this visitor's pass",
  },
  ar: {
    overline: 'الضيوف',
    title: 'دخول الزوّار',
    subtitle: 'أنشئ دخولاً آمناً لضيوفك من أجل مجتمع أكثر أماناً وذكاءً.',
    formTitle: 'تصريح زائر جديد',
    formSubtitle: 'املأ البيانات لإنشاء تصريح برمز QR',
    generate: 'إنشاء تصريح QR',
    passCaption: 'اعرض رمز QR هذا عند البوابة لدخول سلس.',
    passOptions: 'خيارات التصريح',
    passFor: (name) => `تصريح QR لـ ${name}`,
    upcomingTitle: 'الزوّار القادمون',
    viewAll: 'عرض الكل',
    showLess: 'عرض أقل',
    parkingTitle: 'طلب موقف للضيوف',
    parkingSubtitle: 'احجز موقفاً لزوّارك',
    sharePass: 'مشاركة التصريح',
    cancelPass: 'إلغاء التصريح',
    passCreated: (name) => `تم إنشاء تصريح QR لـ ${name}`,
    passCancelled: 'تم إلغاء التصريح',
    shareFailedTitle: 'تعذّرت مشاركة التصريح',
    shareFailedBody: 'يرجى المحاولة مرة أخرى بعد قليل.',
    noVisitors: 'لا يوجد زوّار متوقعون. أنشئ تصريحاً أعلاه.',
    showPass: 'يعرض تصريح هذا الزائر',
  },
};

export const statusDisplay: Record<
  VisitorStatus,
  { label: Localized<string>; tone: StatusTone; icon: Glyph }
> = {
  arrived: {
    label: { en: 'Arrived', ar: 'وصل' },
    tone: 'positive',
    icon: { set: 'ionicons', name: 'checkmark-circle-outline' },
  },
  scheduled: {
    label: { en: 'Scheduled', ar: 'مجدول' },
    tone: 'accent',
    icon: { set: 'ionicons', name: 'calendar-outline' },
  },
  entered: {
    label: { en: 'Entered', ar: 'دخل' },
    tone: 'neutral',
    icon: { set: 'ionicons', name: 'log-in-outline' },
  },
};

/**
 * The pass on show first, then the upcoming list. Dated from today, so "Today" and the
 * two-week booking window stay true whenever the app runs.
 */
export function sampleVisitors(now: Date = new Date()): VisitorPass[] {
  return [
    {
      id: 'omar-khaled',
      name: { en: 'Omar Khaled', ar: 'عمر خالد' },
      mobile: '+968 9223 4455',
      date: addDays(now, 1),
      time: '14:30',
      guests: 2,
      plate: '4521 AB',
      status: 'scheduled',
    },
    {
      id: 'sara-lamees',
      name: { en: 'Sara Lamees', ar: 'سارة لميس' },
      mobile: '+968 9334 5566',
      date: addDays(now, 0),
      time: '11:00',
      guests: 1,
      plate: '7310 RS',
      status: 'arrived',
    },
    {
      id: 'mohamed-ali',
      name: { en: 'Mohamed Ali', ar: 'محمد علي' },
      mobile: '+968 9445 6677',
      date: addDays(now, 0),
      time: '15:00',
      guests: 3,
      plate: '1188 KM',
      status: 'scheduled',
    },
    {
      id: 'noura-ahmed',
      name: { en: 'Noura Ahmed', ar: 'نورة أحمد' },
      mobile: '+968 9556 7788',
      date: addDays(now, 2),
      time: '10:00',
      guests: 2,
      plate: '9911 HD',
      status: 'entered',
    },
    // Behind "View All".
    {
      id: 'youssef-adel',
      name: { en: 'Youssef Adel', ar: 'يوسف عادل' },
      mobile: '+968 9667 8899',
      date: addDays(now, 3),
      time: '18:00',
      guests: 1,
      plate: '',
      status: 'scheduled',
    },
    {
      id: 'hana-mostafa',
      name: { en: 'Hana Mostafa', ar: 'هناء مصطفى' },
      mobile: '+968 9778 9900',
      date: addDays(now, 4),
      time: '13:30',
      guests: 4,
      plate: '3344 TS',
      status: 'scheduled',
    },
  ];
}

/** The list shows this many rows; the rest sit behind "View All". */
export const UPCOMING_LIMIT = 3;

export type FormFieldKey = 'name' | 'mobile' | 'date' | 'time' | 'guests' | 'plate';
export type SelectKey = Extract<FormFieldKey, 'date' | 'time' | 'guests'>;

export interface FormFieldConfig {
  key: FormFieldKey;
  /** `select` fields open a list of choices instead of the keyboard. */
  kind: 'text' | 'phone' | 'select';
  icon: Glyph;
}

/** Two columns, read in the reading direction. */
export const formFields: readonly FormFieldConfig[] = [
  { key: 'name', kind: 'text', icon: { set: 'ionicons', name: 'person-outline' } },
  { key: 'mobile', kind: 'phone', icon: { set: 'ionicons', name: 'phone-portrait-outline' } },
  { key: 'date', kind: 'select', icon: { set: 'ionicons', name: 'calendar-outline' } },
  { key: 'time', kind: 'select', icon: { set: 'ionicons', name: 'time-outline' } },
  { key: 'guests', kind: 'select', icon: { set: 'ionicons', name: 'people-outline' } },
  { key: 'plate', kind: 'text', icon: { set: 'ionicons', name: 'car-outline' } },
];

export const fieldCopy: Localized<Record<FormFieldKey, { label: string; placeholder: string }>> = {
  en: {
    name: { label: 'Visitor Name', placeholder: 'Enter full name' },
    mobile: { label: 'Mobile Number', placeholder: '+968 9123 4567' },
    date: { label: 'Visit Date', placeholder: 'Select date' },
    time: { label: 'Arrival Time', placeholder: 'Select time' },
    guests: { label: 'Number of Guests', placeholder: 'Select guests' },
    plate: { label: 'Car Plate (Optional)', placeholder: 'e.g. 1234 AB' },
  },
  ar: {
    name: { label: 'اسم الزائر', placeholder: 'أدخل الاسم الكامل' },
    mobile: { label: 'رقم الهاتف', placeholder: '+968 9123 4567' },
    date: { label: 'تاريخ الزيارة', placeholder: 'اختر التاريخ' },
    time: { label: 'وقت الوصول', placeholder: 'اختر الوقت' },
    guests: { label: 'عدد الضيوف', placeholder: 'اختر العدد' },
    plate: { label: 'رقم اللوحة (اختياري)', placeholder: 'مثال: 1234 AB' },
  },
};

/** Field values: text as typed; the date as ISO, the time as "HH:MM", guests as a count. */
export type VisitorForm = Record<FormFieldKey, string>;

/** The visit date and party size start filled in. */
export function initialForm(now: Date = new Date()): VisitorForm {
  return { name: '', mobile: '', date: addDays(now, 0), time: '', guests: '1', plate: '' };
}

const GUESTS: Localized<(count: number) => string> = {
  en: (count) => (count === 1 ? '1 Guest' : `${count} Guests`),
  ar: (count) => (count === 1 ? 'ضيف واحد' : count === 2 ? 'ضيفان' : `${count} ضيوف`),
};

export function guestsLabel(count: number, locale: Locale): string {
  return GUESTS[locale](count);
}

/** Visits can be booked from today up to two weeks ahead. */
export function dateOptions(locale: Locale, now: Date = new Date(), days = 14): ListOption[] {
  return Array.from({ length: days }, (_, offset) => {
    const iso = addDays(now, offset);
    return { id: iso, label: formatDay(iso, locale, now) };
  });
}

/** Half-hour arrival slots across visiting hours, 08:00 to 22:00. */
export function timeOptions(locale: Locale): ListOption[] {
  return Array.from({ length: 29 }, (_, index) => {
    const minutes = 8 * 60 + index * 30;
    const id = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    return { id, label: formatTime(id, locale) };
  });
}

export function guestOptions(locale: Locale): ListOption[] {
  return Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1),
    label: guestsLabel(index + 1, locale),
  }));
}

/** How a select field's stored value reads. */
export function selectLabel(key: SelectKey, value: string, locale: Locale): string {
  if (!value) return '';
  if (key === 'date') return formatDay(value, locale);
  if (key === 'time') return formatTime(value, locale);
  return guestsLabel(Number(value), locale);
}

/** Separates the parts of a visit summary, e.g. date and time. */
export const SEPARATOR = ' • ';

/**
 * What the gate scanner reads. A placeholder format: real passes should be short-lived
 * tokens issued by the backend.
 */
export function passPayload(pass: VisitorPass): string {
  return ['NAMA', 'VISITOR', pass.id.toUpperCase()].join(':');
}

/** Mobile numbers need at least this many digits to be dialable. */
const MIN_MOBILE_DIGITS = 8;

export type FormErrors = Partial<Record<FormFieldKey, string>>;

const ERRORS: Localized<
  Record<'name' | 'mobileMissing' | 'mobileInvalid' | 'date' | 'time', string>
> = {
  en: {
    name: 'Enter the visitor’s name',
    mobileMissing: 'Enter a mobile number',
    mobileInvalid: 'Enter a valid mobile number',
    date: 'Choose a visit date',
    time: 'Choose an arrival time',
  },
  ar: {
    name: 'أدخل اسم الزائر',
    mobileMissing: 'أدخل رقم الهاتف',
    mobileInvalid: 'أدخل رقم هاتف صحيحاً',
    date: 'اختر تاريخ الزيارة',
    time: 'اختر وقت الوصول',
  },
};

/** Frontend checks only; the backend will validate again. */
export function validateForm(form: VisitorForm, locale: Locale): FormErrors {
  const messages = ERRORS[locale];
  const errors: FormErrors = {};
  if (!form.name.trim()) {
    errors.name = messages.name;
  }
  const digits = form.mobile.replace(/\D/g, '');
  if (!digits) {
    errors.mobile = messages.mobileMissing;
  } else if (digits.length < MIN_MOBILE_DIGITS || /[^\d\s+()-]/.test(form.mobile)) {
    errors.mobile = messages.mobileInvalid;
  }
  if (!form.date) {
    errors.date = messages.date;
  }
  if (!form.time) {
    errors.time = messages.time;
  }
  return errors;
}
