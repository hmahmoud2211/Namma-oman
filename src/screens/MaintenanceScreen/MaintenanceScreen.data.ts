import type { Glyph } from '@/components/common/AppIcon';
import type { ListOption } from '@/components/ui/OptionList';
import type { StatusTone } from '@/components/ui/StatusChip';
import type { Locale, Localized } from '@/context/LocaleContext';
import { addDays, currentTime, formatDate, formatTimeRange, toIsoDate } from '@/utils/date';

/**
 * Maintenance, migrated from the Parklane app: service categories, the active request and its
 * progress, request history, a new-request form and emergency support. Frontend only for now:
 * requests live in the screen's state, shaped like an API response for a backend to replace.
 */

type Text = Localized<string>;

export const maintenanceContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  categoriesTitle: string;
  activeTitle: string;
  viewAll: string;
  showLess: string;
  newRequest: string;
  myRequests: string;
  emergencyTitle: string;
  emergencyBody: string;
  callNow: string;
  callHint: string;
  formTitle: string;
  formSubtitle: string;
  submit: string;
  closeForm: string;
  historyTitle: string;
  technician: string;
  visitDate: string;
  contact: string;
  contactPending: string;
  callTechnician: string;
  showsOtherRequests: string;
  showsRequest: string;
  submitted: (id: string) => string;
}> = {
  en: {
    overline: 'HOME CARE',
    title: 'Maintenance',
    subtitle: 'Home maintenance made simple: reliable support for a more comfortable home.',
    categoriesTitle: 'Service Categories',
    activeTitle: 'Active Request',
    viewAll: 'View All',
    showLess: 'Show Less',
    newRequest: 'New Request',
    myRequests: 'My Requests',
    emergencyTitle: 'Emergency Support',
    emergencyBody: 'For urgent issues, get immediate assistance.',
    callNow: 'Call Now',
    callHint: 'Opens the phone to call emergency support',
    formTitle: 'New Maintenance Request',
    formSubtitle: 'Tell us what needs fixing and when suits you',
    submit: 'Submit Request',
    closeForm: 'Close the request form',
    historyTitle: 'My Requests',
    technician: 'Technician',
    visitDate: 'Visit Date',
    contact: 'Contact',
    contactPending: 'Pending',
    callTechnician: 'Calls the technician',
    showsOtherRequests: 'Shows your other requests',
    showsRequest: 'Shows this request',
    submitted: (id) => `Request ${id} submitted`,
  },
  ar: {
    overline: 'العناية بالمنزل',
    title: 'الصيانة',
    subtitle: 'صيانة منزلك ببساطة: دعم موثوق لمنزل أكثر راحة.',
    categoriesTitle: 'فئات الخدمة',
    activeTitle: 'الطلب الحالي',
    viewAll: 'عرض الكل',
    showLess: 'عرض أقل',
    newRequest: 'طلب جديد',
    myRequests: 'طلباتي',
    emergencyTitle: 'دعم الطوارئ',
    emergencyBody: 'للمشكلات العاجلة، احصل على مساعدة فورية.',
    callNow: 'اتصل الآن',
    callHint: 'يفتح الهاتف للاتصال بدعم الطوارئ',
    formTitle: 'طلب صيانة جديد',
    formSubtitle: 'أخبرنا بما يحتاج إلى إصلاح والوقت المناسب لك',
    submit: 'إرسال الطلب',
    closeForm: 'إغلاق نموذج الطلب',
    historyTitle: 'طلباتي',
    technician: 'الفني',
    visitDate: 'موعد الزيارة',
    contact: 'التواصل',
    contactPending: 'قيد الانتظار',
    callTechnician: 'يتصل بالفني',
    showsOtherRequests: 'يعرض طلباتك الأخرى',
    showsRequest: 'يعرض هذا الطلب',
    submitted: (id) => `تم إرسال الطلب ${id}`,
  },
};

export interface ServiceCategory {
  id: string;
  title: Text;
  subtitle: Text;
  icon: Glyph;
}

/** Three across; "View All" adds the rest. */
export const CATEGORIES_SHOWN = 6;

export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: 'hvac',
    title: { en: 'AC / HVAC', ar: 'التكييف' },
    subtitle: { en: 'Cooling & Heating', ar: 'التبريد والتدفئة' },
    icon: { set: 'ionicons', name: 'snow-outline' },
  },
  {
    id: 'electrical',
    title: { en: 'Electrical', ar: 'الكهرباء' },
    subtitle: { en: 'Lights & Power', ar: 'الإضاءة والطاقة' },
    icon: { set: 'ionicons', name: 'bulb-outline' },
  },
  {
    id: 'plumbing',
    title: { en: 'Plumbing', ar: 'السباكة' },
    subtitle: { en: 'Water & Drains', ar: 'المياه والصرف' },
    icon: { set: 'material', name: 'water-pump' },
  },
  {
    id: 'appliances',
    title: { en: 'Appliances', ar: 'الأجهزة' },
    subtitle: { en: 'Home Appliances', ar: 'الأجهزة المنزلية' },
    icon: { set: 'material', name: 'fridge-outline' },
  },
  {
    id: 'doors',
    title: { en: 'Doors & Locks', ar: 'الأبواب والأقفال' },
    subtitle: { en: 'Access & Security', ar: 'الدخول والأمان' },
    icon: { set: 'material', name: 'door' },
  },
  {
    id: 'other',
    title: { en: 'Other', ar: 'أخرى' },
    subtitle: { en: 'General Maintenance', ar: 'صيانة عامة' },
    icon: { set: 'ionicons', name: 'ellipsis-horizontal-circle-outline' },
  },
  // Behind "View All".
  {
    id: 'painting',
    title: { en: 'Painting', ar: 'الدهان' },
    subtitle: { en: 'Walls & Ceilings', ar: 'الجدران والأسقف' },
    icon: { set: 'material', name: 'format-paint' },
  },
  {
    id: 'pest',
    title: { en: 'Pest Control', ar: 'مكافحة الحشرات' },
    subtitle: { en: 'Insects & Rodents', ar: 'الحشرات والقوارض' },
    icon: { set: 'ionicons', name: 'bug-outline' },
  },
  {
    id: 'carpentry',
    title: { en: 'Carpentry', ar: 'النجارة' },
    subtitle: { en: 'Wood & Furniture', ar: 'الخشب والأثاث' },
    icon: { set: 'ionicons', name: 'hammer-outline' },
  },
];

export type RequestStatus = 'submitted' | 'assigned' | 'in-progress' | 'completed';

export const REQUEST_STAGES: readonly RequestStatus[] = [
  'submitted',
  'assigned',
  'in-progress',
  'completed',
];

export const requestStatusDisplay: Record<RequestStatus, { label: Text; tone: StatusTone }> = {
  submitted: { label: { en: 'Submitted', ar: 'مُرسل' }, tone: 'neutral' },
  assigned: { label: { en: 'Assigned', ar: 'تم التعيين' }, tone: 'neutral' },
  'in-progress': { label: { en: 'In Progress', ar: 'قيد التنفيذ' }, tone: 'accent' },
  completed: { label: { en: 'Completed', ar: 'مكتمل' }, tone: 'positive' },
};

export interface RequestStage {
  status: RequestStatus;
  /** When the stage was reached (ISO day and "HH:MM"); absent until it is. */
  date?: string;
  time?: string;
}

/** A time window in 24-hour "HH:MM". */
export interface VisitWindow {
  from: string;
  to: string;
}

export interface MaintenanceRequest {
  id: string;
  /** Sample requests carry both spellings; a typed issue is used as entered in both. */
  title: Text;
  categoryId: ServiceCategory['id'];
  status: RequestStatus;
  /** Every stage, in order, whether reached or not. */
  stages: readonly RequestStage[];
  /** `null` until a technician is assigned. */
  technician: Text | null;
  /** ISO day. */
  visitDate: string;
  visitWindow: VisitWindow;
  /** The technician's number, dialled from the Contact column; `null` until assigned. */
  contactPhone: string | null;
  details?: string;
}

/** The resident's requests, newest first, dated around today. */
export function sampleRequests(now: Date = new Date()): MaintenanceRequest[] {
  return [
    {
      id: 'REQ-2026-00124',
      title: { en: 'AC not cooling properly', ar: 'التكييف لا يبرّد جيداً' },
      categoryId: 'hvac',
      status: 'in-progress',
      stages: [
        { status: 'submitted', date: addDays(now, -1), time: '10:15' },
        { status: 'assigned', date: addDays(now, -1), time: '12:30' },
        { status: 'in-progress', date: addDays(now, 0), time: '09:00' },
        { status: 'completed' },
      ],
      technician: { en: 'Ahmed Hassan', ar: 'أحمد حسن' },
      visitDate: addDays(now, 0),
      visitWindow: { from: '09:00', to: '12:00' },
      contactPhone: '+968 9876 5432',
    },
    {
      id: 'REQ-2026-00117',
      title: { en: 'Kitchen sink leaking', ar: 'تسرّب في حوض المطبخ' },
      categoryId: 'plumbing',
      status: 'completed',
      stages: [
        { status: 'submitted', date: addDays(now, -25), time: '08:40' },
        { status: 'assigned', date: addDays(now, -25), time: '10:05' },
        { status: 'in-progress', date: addDays(now, -24), time: '11:00' },
        { status: 'completed', date: addDays(now, -24), time: '13:20' },
      ],
      technician: { en: 'Mahmoud Samir', ar: 'محمود سمير' },
      visitDate: addDays(now, -24),
      visitWindow: { from: '11:00', to: '14:00' },
      contactPhone: '+968 9234 5678',
    },
    {
      id: 'REQ-2026-00098',
      title: { en: 'Bedroom light flickering', ar: 'وميض في إضاءة غرفة النوم' },
      categoryId: 'electrical',
      status: 'completed',
      stages: [
        { status: 'submitted', date: addDays(now, -49), time: '19:15' },
        { status: 'assigned', date: addDays(now, -48), time: '09:30' },
        { status: 'in-progress', date: addDays(now, -47), time: '10:00' },
        { status: 'completed', date: addDays(now, -47), time: '11:10' },
      ],
      technician: { en: 'Karim Fathy', ar: 'كريم فتحي' },
      visitDate: addDays(now, -47),
      visitWindow: { from: '09:00', to: '12:00' },
      contactPhone: '+968 9345 6789',
    },
  ];
}

export type RequestFormKey = 'issue' | 'category' | 'date' | 'window' | 'details';
export type RequestSelectKey = Extract<RequestFormKey, 'category' | 'date' | 'window'>;

/** Values: text as typed; the category's id, the ISO day and the window's start time. */
export type RequestForm = Record<RequestFormKey, string>;

export type RequestFormErrors = Partial<Record<RequestFormKey, string>>;

export interface RequestFieldConfig {
  key: RequestFormKey;
  kind: 'text' | 'select';
  icon: Glyph;
}

/** Rows of the form, read in the reading direction. */
export const requestFieldRows: readonly (readonly RequestFieldConfig[])[] = [
  [{ key: 'issue', kind: 'text', icon: { set: 'ionicons', name: 'construct-outline' } }],
  [
    { key: 'category', kind: 'select', icon: { set: 'ionicons', name: 'grid-outline' } },
    { key: 'date', kind: 'select', icon: { set: 'ionicons', name: 'calendar-outline' } },
  ],
  [
    { key: 'window', kind: 'select', icon: { set: 'ionicons', name: 'time-outline' } },
    { key: 'details', kind: 'text', icon: { set: 'ionicons', name: 'document-text-outline' } },
  ],
];

export const requestFieldCopy: Localized<
  Record<RequestFormKey, { label: string; placeholder: string }>
> = {
  en: {
    issue: { label: 'Issue', placeholder: 'e.g. AC not cooling' },
    category: { label: 'Category', placeholder: 'Select category' },
    date: { label: 'Preferred Date', placeholder: 'Select date' },
    window: { label: 'Visit Window', placeholder: 'Select time' },
    details: { label: 'Details (Optional)', placeholder: 'Anything the technician should know' },
  },
  ar: {
    issue: { label: 'المشكلة', placeholder: 'مثال: التكييف لا يبرّد' },
    category: { label: 'الفئة', placeholder: 'اختر الفئة' },
    date: { label: 'التاريخ المفضّل', placeholder: 'اختر التاريخ' },
    window: { label: 'فترة الزيارة', placeholder: 'اختر الوقت' },
    details: { label: 'تفاصيل (اختياري)', placeholder: 'ما يجب أن يعرفه الفني' },
  },
};

export const emptyRequestForm: RequestForm = {
  issue: '',
  category: '',
  date: '',
  window: '',
  details: '',
};

/** Technicians visit in three-hour windows across working hours. */
export const visitWindows: readonly VisitWindow[] = [
  { from: '09:00', to: '12:00' },
  { from: '12:00', to: '15:00' },
  { from: '15:00', to: '18:00' },
];

export function categoryOptions(locale: Locale): ListOption[] {
  return serviceCategories.map((category) => ({
    id: category.id,
    label: category.title[locale],
    description: category.subtitle[locale],
    icon: category.icon,
  }));
}

/** Visits can be booked from tomorrow up to two weeks ahead. */
export function visitDateOptions(locale: Locale, now: Date = new Date(), days = 14): ListOption[] {
  return Array.from({ length: days }, (_, offset) => {
    const iso = addDays(now, offset + 1);
    return { id: iso, label: formatDate(iso, locale) };
  });
}

export function windowOptions(locale: Locale): ListOption[] {
  return visitWindows.map((window) => ({
    id: window.from,
    label: formatTimeRange(window.from, window.to, locale),
  }));
}

/** How a select field's stored value reads. */
export function requestSelectLabel(key: RequestSelectKey, value: string, locale: Locale): string {
  if (!value) return '';
  if (key === 'category')
    return serviceCategories.find((item) => item.id === value)?.title[locale] ?? '';
  if (key === 'date') return formatDate(value, locale);
  const window = visitWindows.find((item) => item.from === value);
  return window ? formatTimeRange(window.from, window.to, locale) : '';
}

const ERRORS: Localized<Record<'issue' | 'category' | 'date' | 'window', string>> = {
  en: {
    issue: 'Describe the issue in a few words',
    category: 'Choose a category',
    date: 'Choose a date',
    window: 'Choose a time',
  },
  ar: {
    issue: 'صف المشكلة ببضع كلمات',
    category: 'اختر الفئة',
    date: 'اختر التاريخ',
    window: 'اختر الوقت',
  },
};

/** Frontend checks only; the backend will validate again. */
export function validateRequest(form: RequestForm, locale: Locale): RequestFormErrors {
  const messages = ERRORS[locale];
  const errors: RequestFormErrors = {};
  if (form.issue.trim().length < 3) errors.issue = messages.issue;
  if (!form.category) errors.category = messages.category;
  if (!form.date) errors.date = messages.date;
  if (!form.window) errors.window = messages.window;
  return errors;
}

/**
 * A new request, submitted now and waiting for a technician. Frontend only: its reference
 * simply follows the highest one so far.
 */
export function createRequest(
  form: RequestForm,
  existing: readonly MaintenanceRequest[],
  now: Date = new Date(),
): MaintenanceRequest {
  const last = existing.reduce((max, request) => {
    const number = Number.parseInt(request.id.split('-').pop() ?? '0', 10);
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);
  const issue = form.issue.trim();
  const window = visitWindows.find((item) => item.from === form.window) ?? visitWindows[0];
  return {
    id: `REQ-${now.getFullYear()}-${String(last + 1).padStart(5, '0')}`,
    title: { en: issue, ar: issue },
    categoryId: form.category || 'other',
    status: 'submitted',
    stages: REQUEST_STAGES.map((status) =>
      status === 'submitted'
        ? { status, date: toIsoDate(now), time: currentTime(now) }
        : { status },
    ),
    technician: null,
    visitDate: form.date,
    visitWindow: window,
    contactPhone: null,
    details: form.details.trim() || undefined,
  };
}

/**
 * The emergency line "Call Now" dials. The design doesn't give one.
 * TODO(config): set the community's real emergency number; until then the button opens the
 * dialer empty rather than calling a made-up number.
 */
export const emergencyPhone: string | null = null;

/** Separates the parts of a summary line, e.g. reference and unit. */
export const SEPARATOR = ' • ';

/** "tel:" link for a number as displayed, e.g. "+968 9876 5432". */
export function telLink(phone: string | null): string {
  return phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : 'tel:';
}
