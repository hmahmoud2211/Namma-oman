import type { ChipOption } from '../../components/parking/Controls';
import type { TimelineItem } from '../../components/parking/Rows';
import { dateTimeIn, digitsIn, gateNameIn, gateResultIn, nameIn, rangeIn, type Lang } from '../../services/parking/i18n';
import { siteInfo } from '../../services/parking/policy';
import type { ReservationView } from '../../services/parking/selectors';
import { shareChannelLabel, type ShareChannel } from '../../services/parking/tracking';
import type { ParkingDb, Reservation } from '../../services/parking/types';

interface DetailsCopy {
  title: string;
  notFoundTitle: string;
  notFoundBody: string;
  justBooked: string;
  justBookedBody: string;
  evReserved: string;
  justEdited: string;
  justEditedBody: string;
  evUpdated: string;
  cancelConfirm: string;
  replaceConfirm: string;
  trackerNote: string;
  whatsappOpened: string;
  sendTitle: string;
  sendNote: string;
  localOnlyShort: string;
  noPhoneShort: string;
  directions: string;
  sendTo: (phone: string) => string;
  bookedSendTitle: (name: string) => string;
  yourGuest: string;
  openFailed: (app: string) => string;
  passWord: string;
  passLinkWord: string;
  linkCopied: string;
  copyFailed: (link: string) => string;
  needsBayTitle: string;
  needsBayBody: string;
  moveBay: string;
  moved: string;
  overdueTitle: (time: string) => string;
  overdueBody: (who: string, bay: string) => string;
  noShowTitle: string;
  noShowBody: (time: string) => string;
  arrivedIn: (time: string) => string;
  leftBay: (time: string) => string;
  out: (time: string) => string;
  when: string;
  bay: string;
  entrance: string;
  vehicle: string;
  guestAddsIt: string;
  sendWhatsApp: string;
  share: string;
  copyLink: string;
  preview: string;
  hideActivity: string;
  activity: (count: string) => string;
  charging: string;
  chargingSlot: string;
  requested: (kwh: string) => string;
  openSession: string;
  manage: string;
  edit: string;
  replaceQr: string;
  cancel: string;
  extend: (time: string) => string;
  extendBy: (minutes: number) => string;
  extended: (time: string) => string;
  inside: string;
  cancelTitle: string;
  replaceTitle: string;
  keep: string;
  yesCancel: string;
  issueQr: string;
  cancelled: string;
  replaced: string;
  cancelledAt: (time: string) => string;
  completed: string;
  bookAgain: string;
}

export const detailsCopy: Record<Lang, DetailsCopy> = {
  en: {
    title: 'Reservation',
    notFoundTitle: 'Booking not found',
    notFoundBody: 'It may have been removed when the demo data was reset.',
    justBooked: 'Reserved and confirmed',
    justBookedBody: 'Share the pass with your guest. It shows their space, gate, QR code and directions.',
    evReserved: 'Your EV bay and charger are reserved.',
    justEdited: 'Changes saved',
    justEditedBody: 'Your guest’s pass and directions show the new details. The QR code stays the same.',
    evUpdated: 'Your EV bay and charger are updated.',
    cancelConfirm: 'Cancel this booking? The guest’s pass stops working immediately.',
    replaceConfirm: 'Issue a new QR? The current one stops working, so re-share the pass afterwards.',
    trackerNote: 'From gate scans and bay records, never your guest’s location.',
    whatsappOpened: 'WhatsApp opened with the message ready. Press send there. The app can’t confirm delivery.',
    sendTitle: 'Send the pass',
    sendNote: 'You press send in WhatsApp; the app can’t confirm delivery.',
    localOnlyShort: 'Demo: the link opens only in this browser.',
    noPhoneShort: 'No number saved: WhatsApp will ask who to send to.',
    directions: 'Directions & site map',
    sendTo: (phone) => `To ${phone}`,
    bookedSendTitle: (name) => `Booked! Send the pass to ${name}`,
    yourGuest: 'your guest',
    openFailed: (app) => `Couldn’t open ${app} here. Copy the link and paste it into a message instead.`,
    passWord: 'Parking pass',
    passLinkWord: 'Pass link',
    linkCopied: 'Link copied.',
    copyFailed: (link) => `Could not copy. The link is: ${link}`,
    needsBayTitle: 'This booking needs another bay',
    needsBayBody: '',
    moveBay: 'Move to the nearest free bay',
    moved: 'Moved. The pass and directions now show the new bay.',
    overdueTitle: (time) => `Overdue since ${time}`,
    overdueBody: (who, bay) =>
      `${who} is still parked in ${bay}. The bay stays held until the car leaves. Extend below if the bay is free, or ask your guest to leave.`,
    noShowTitle: 'Guest did not arrive',
    noShowBody: (time) => `Arrival was held until ${time}. The space was released and the pass no longer works.`,
    arrivedIn: (time) => `In ${time}`,
    leftBay: (time) => `left bay ${time}`,
    out: (time) => `out ${time}`,
    when: 'When (Muscat)',
    bay: 'Bay',
    entrance: 'Entrance',
    vehicle: 'Vehicle',
    guestAddsIt: 'Guest adds it',
    sendWhatsApp: 'Send on WhatsApp',
    share: 'Share',
    copyLink: 'Copy link',
    preview: 'Preview',
    hideActivity: 'Hide activity',
    activity: (count) => `Activity (${count})`,
    charging: 'Charging',
    chargingSlot: 'Charging slot',
    requested: (kwh) => ` · ${kwh} kWh requested`,
    openSession: 'Open charging session',
    manage: 'Manage',
    edit: 'Edit',
    replaceQr: 'Replace QR',
    cancel: 'Cancel',
    extend: (time) => `Extend (ends ${time})`,
    extendBy: (minutes) => `+${minutes < 60 ? `${minutes} min` : `${minutes / 60} h`}`,
    extended: (time) => `Extended to ${time}.`,
    inside: 'The visitor is inside. The visit ends when they exit, or when security records it.',
    cancelTitle: 'Cancel booking?',
    replaceTitle: 'Replace QR?',
    keep: 'Keep it',
    yesCancel: 'Yes, cancel',
    issueQr: 'Issue new QR',
    cancelled: 'Booking cancelled. The pass no longer works.',
    replaced: 'New QR issued. Share the pass again; the old QR is refused at the gate.',
    cancelledAt: (time) => `Cancelled ${time}. The pass no longer works.`,
    completed: 'Visit completed. The pass can’t be used again.',
    bookAgain: 'Book again',
  },
  ar: {
    title: 'الحجز',
    notFoundTitle: 'لم يتم العثور على الحجز',
    notFoundBody: 'ربما حُذف عند إعادة ضبط بيانات العرض.',
    justBooked: 'تم الحجز والتأكيد',
    justBookedBody: 'شارك التصريح مع ضيفك. يعرض موقفه والبوابة ورمز QR والاتجاهات.',
    evReserved: 'تم حجز موقف الشحن والشاحن.',
    justEdited: 'تم حفظ التغييرات',
    justEditedBody: 'يعرض تصريح ضيفك واتجاهاته البيانات الجديدة. يبقى رمز QR كما هو.',
    evUpdated: 'تم تحديث موقف الشحن والشاحن.',
    cancelConfirm: 'إلغاء هذا الحجز؟ سيتوقف تصريح الضيف فورًا.',
    replaceConfirm: 'إصدار رمز QR جديد؟ سيتوقف الرمز الحالي، لذا أعد مشاركة التصريح بعدها.',
    trackerNote: 'من مسح البوابات وسجلات المواقف، وليس من موقع ضيفك أبدًا.',
    whatsappOpened: 'فُتح واتساب والرسالة جاهزة. اضغط إرسال هناك. لا يمكن للتطبيق تأكيد الاستلام.',
    sendTitle: 'أرسل التصريح',
    sendNote: 'أنت من يضغط إرسال في واتساب؛ لا يمكن للتطبيق تأكيد الاستلام.',
    localOnlyShort: 'عرض تجريبي: يفتح الرابط في هذا المتصفح فقط.',
    noPhoneShort: 'لا يوجد رقم محفوظ: سيسألك واتساب لمن ترسل.',
    directions: 'الاتجاهات وخريطة الموقع',
    sendTo: (phone) => `إلى ⁦${phone}⁩`,
    bookedSendTitle: (name) => `تم الحجز! أرسل التصريح إلى ${name}`,
    yourGuest: 'ضيفك',
    openFailed: (app) => `تعذّر فتح ${app} هنا. انسخ الرابط والصقه في رسالة بدلًا من ذلك.`,
    passWord: 'تصريح الموقف',
    passLinkWord: 'رابط التصريح',
    linkCopied: 'تم نسخ الرابط.',
    copyFailed: (link) => `تعذّر النسخ. الرابط هو: ${link}`,
    needsBayTitle: 'هذا الحجز يحتاج موقفًا آخر',
    needsBayBody: 'لم يعد الموقف أو الشاحن المحجوز متاحًا. انقله إلى أقرب موقف شاغر.',
    moveBay: 'انقله إلى أقرب موقف شاغر',
    moved: 'تم النقل. يعرض التصريح والاتجاهات الموقف الجديد الآن.',
    overdueTitle: (time) => `تجاوز الوقت منذ ${time}`,
    overdueBody: (who, bay) =>
      `${who} ما زال في ${bay}. يبقى الموقف محجوزًا حتى تغادر السيارة. مدّد أدناه إن كان الموقف شاغرًا، أو اطلب من ضيفك المغادرة.`,
    noShowTitle: 'لم يحضر الضيف',
    noShowBody: (time) => `انتُظر الوصول حتى ${time}. أُفرج عن الموقف ولم يعد التصريح صالحًا.`,
    arrivedIn: (time) => `دخل ${time}`,
    leftBay: (time) => `غادر الموقف ${time}`,
    out: (time) => `خرج ${time}`,
    when: 'الموعد (بتوقيت مسقط)',
    bay: 'الموقف',
    entrance: 'المدخل',
    vehicle: 'المركبة',
    guestAddsIt: 'يضيفها الضيف',
    sendWhatsApp: 'إرسال عبر واتساب',
    share: 'مشاركة',
    copyLink: 'نسخ الرابط',
    preview: 'معاينة',
    hideActivity: 'إخفاء السجل',
    activity: (count) => `السجل (${count})`,
    charging: 'الشحن',
    chargingSlot: 'موعد الشحن',
    requested: (kwh) => ` · مطلوب ${kwh} كيلوواط ساعة`,
    openSession: 'فتح جلسة الشحن',
    manage: 'إدارة',
    edit: 'تعديل',
    replaceQr: 'رمز QR جديد',
    cancel: 'إلغاء',
    extend: (time) => `تمديد (ينتهي ${time})`,
    extendBy: (minutes) => `+${minutes < 60 ? `${digitsIn(minutes, 'ar')} د` : `${digitsIn(minutes / 60, 'ar')} س`}`,
    extended: (time) => `تم التمديد حتى ${time}.`,
    inside: 'الزائر في الداخل. تنتهي الزيارة عند خروجه، أو عندما يسجّلها الأمن.',
    cancelTitle: 'إلغاء الحجز؟',
    replaceTitle: 'رمز QR جديد؟',
    keep: 'إبقاء الحجز',
    yesCancel: 'نعم، إلغاء',
    issueQr: 'إصدار رمز جديد',
    cancelled: 'أُلغي الحجز. لم يعد التصريح صالحًا.',
    replaced: 'تم إصدار رمز QR جديد. شارك التصريح مرة أخرى؛ الرمز القديم يُرفض عند البوابة.',
    cancelledAt: (time) => `أُلغي ${time}. لم يعد التصريح صالحًا.`,
    completed: 'اكتملت الزيارة. لا يمكن استخدام التصريح مرة أخرى.',
    bookAgain: 'احجز مرة أخرى',
  },
};

export const MESSAGE_LANGUAGES: readonly ChipOption<Lang>[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

/**
 * The pass link, opening in the guest's language. `snapshot` (demo only, see
 * services/parking/passLink) lets the guest's own phone show the pass.
 */
export function passLink(link: string, lang: Lang, snapshot?: string): string {
  const query = [lang === 'ar' ? 'lang=ar' : '', snapshot ? `d=${snapshot}` : ''].filter(Boolean).join('&');
  return query ? `${link}?${query}` : link;
}

/**
 * The invitation, in the guest's language: when, which bay, which gate, and
 * what to do there. The pass link follows on its own line.
 */
export function passMessage(view: ReservationView, lang: Lang): string {
  const r = view.reservation;
  const first = r.guest?.name.trim().split(/\s+/)[0];
  if (lang === 'ar') {
    return [
      `${first ? `مرحبًا ${first}،` : 'مرحبًا،'} هذا تصريح موقفك في ${siteInfo.compoundName}.`,
      `${rangeIn(r.scheduledStart, r.scheduledEnd, 'ar')} · الموقف ${view.space.label}، ${nameIn(view.zone.name, 'ar')}`,
      `ادخل من ${gateNameIn(view.gate.id, 'ar')}، واعرض رمز QR الموجود في التصريح عند البوابة.`,
    ].join('\n');
  }
  return [
    `Hi ${first ?? 'there'}, here is your parking pass for ${siteInfo.compoundName}.`,
    `${rangeIn(r.scheduledStart, r.scheduledEnd, 'en')} · Bay ${view.space.label}, ${view.zone.name}`,
    `Enter by ${view.gate.name} and show the QR code on the pass at the gate.`,
  ].join('\n');
}

/** Extensions offered as quick choices, in minutes. */
export const EXTEND_OPTIONS = [30, 60, 120] as const;

const AUDIT_LABELS_AR: Record<string, string> = {
  'reservation.created': 'تم الحجز',
  'reservation.edited': 'تغيّر الحجز',
  'reservation.extended': 'مُدّدت الزيارة',
  'reservation.cancelled': 'أُلغي',
  'reservation.reassigned': 'نُقل إلى موقف آخر',
  'reservation.no-show': 'لم يصل في الوقت',
  'reservation.overdue': 'تجاوزت الزيارة وقتها',
  'reservation.vehicle-updated': 'أُضيفت المركبة',
  'pass.replaced': 'صدر رمز QR جديد',
  'pass.shared': 'تمت مشاركة التصريح',
  'gate.manual-entry': 'سجّل الأمن الدخول',
  'gate.manual-exit': 'سجّل الأمن الخروج',
};

const SHARE_CHANNEL_AR: Record<ShareChannel, string> = { whatsapp: 'واتساب', share: 'قائمة المشاركة', copy: 'رابط منسوخ' };

const AUDIT_LABELS: Record<string, string> = {
  'reservation.created': 'Booked',
  'reservation.edited': 'Booking changed',
  'reservation.extended': 'Visit extended',
  'reservation.cancelled': 'Cancelled',
  'reservation.reassigned': 'Moved to another bay',
  'reservation.no-show': 'Did not arrive in time',
  'reservation.overdue': 'Visit overdue',
  'reservation.vehicle-updated': 'Vehicle added',
  'pass.replaced': 'New QR issued',
  'pass.shared': 'Pass shared',
  'gate.manual-entry': 'Entry recorded by security',
  'gate.manual-exit': 'Exit recorded by security',
};

/**
 * Booking, gate and bay events for one reservation, newest first, in plain words. In Arabic,
 * free-text notes stored in English (a reason typed by security, a gate's message) give way to
 * the event's own wording.
 */
export function timelineFor(db: ParkingDb, r: Reservation, lang: Lang = 'en'): TimelineItem[] {
  const ar = lang === 'ar';
  const items: (TimelineItem & { at: string })[] = [];
  for (const a of db.audit) {
    if (a.entityId !== r.id || !AUDIT_LABELS[a.action]) continue;
    const channel = a.details as ShareChannel;
    const detail =
      a.action === 'pass.shared'
        ? ar
          ? `عبر ${SHARE_CHANNEL_AR[channel] ?? a.details}. لا يمكن تأكيد الاستلام.`
          : `Through ${shareChannelLabel[channel] ?? a.details}. Delivery isn’t confirmed.`
        : ar
          ? undefined
          : (a.reason ?? a.details);
    items.push({ id: a.id, at: a.at, time: dateTimeIn(a.at, lang), title: (ar ? AUDIT_LABELS_AR : AUDIT_LABELS)[a.action], detail });
  }
  for (const e of db.scanEvents) {
    if (e.reservationId !== r.id) continue;
    const gate = gateNameIn(e.gateId, lang);
    const accepted = e.outcome === 'accepted';
    const title = ar
      ? `${e.direction === 'entry' ? 'دخول' : 'خروج'}${accepted ? '' : ' مرفوض'} عبر ${gate}`
      : `${e.direction === 'entry' ? 'Entry' : 'Exit'}${accepted ? ' at' : ' refused at'} ${gate}`;
    items.push({
      id: e.id,
      at: e.at,
      time: dateTimeIn(e.at, lang),
      title,
      detail: accepted ? undefined : ar ? gateResultIn({ code: e.code, title: '', message: e.message }, lang).message : e.message,
      tone: accepted ? 'good' : 'bad',
    });
  }
  for (const o of db.occupancyEvents) {
    if (o.reservationId !== r.id || o.source !== 'bay-vacated') continue;
    items.push({
      id: o.id,
      at: o.at,
      time: dateTimeIn(o.at, lang),
      title: ar ? 'غادر موقف الشحن' : 'Left the EV bay',
      detail: ar ? undefined : o.note,
    });
  }
  return items.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
