/**
 * English and Arabic wording for the parking flows: the guest's pass, its
 * route and its map, and the resident and security screens (which follow the
 * app's language).
 *
 * Arabic text uses Arabic-Indic digits for dates, times and counts, and keeps
 * codes exactly as they are signed on site: bay V-014, plate 1234 BK,
 * building A. Names come from site.ts in English and are translated here by
 * name, so a real site adds its own names to these tables.
 */
import { gateDefs, levels } from './site';
import { addDaysToKey, formatDate, formatDateTime, formatDuration, formatRange, formatTime, siteDateKey, siteParts, siteToUtc } from './time';
import type { LevelId, RouteStep, RouteStepInfo, RouteStepKind, WalkTarget } from './types';

export type Lang = 'en' | 'ar';

export const isLang = (value: unknown): value is Lang => value === 'en' || value === 'ar';

/** Arabic when the phone or browser is set to Arabic, else English. */
export function deviceLang(): Lang {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Arabic-Indic digits, with the Arabic decimal separator: 33.3 becomes ٣٣٫٣. */
export const arabicDigits = (text: string) =>
  text.replace(/(\d)\.(\d)/g, '$1٫$2').replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);

/** Numbers in the reader's digits. */
export const digitsIn = (text: string | number, lang: Lang) => (lang === 'ar' ? arabicDigits(String(text)) : String(text));

/**
 * A plate as signed (Omani plates lead with digits, "3344 MK"). In Arabic text the bidi rules
 * would show it as "MK 3344", so it is kept as one left-to-right run (an isolate).
 */
export const plateIn = (plate: string, lang: Lang) => (lang === 'ar' ? `\u2066${plate}\u2069` : plate);

/* -------------------------------------------------------- Dates, times */

const AR_WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const toMs = (value: string | number) => (typeof value === 'number' ? value : Date.parse(value));

/** "02:30 PM", or "٢:٣٠ م". */
export function timeIn(value: string | number, lang: Lang): string {
  if (lang === 'en') return formatTime(value);
  const p = siteParts(toMs(value));
  const hour12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return arabicDigits(`${hour12}:${String(p.minute).padStart(2, '0')}`) + (p.hour < 12 ? ' ص' : ' م');
}

/** "Tue 13 Oct 2026", or "الثلاثاء ١٣ أكتوبر ٢٠٢٦". */
export function dateIn(value: string | number, lang: Lang, withYear = true): string {
  if (lang === 'en') return formatDate(value, withYear);
  const p = siteParts(toMs(value));
  return arabicDigits(`${AR_WEEKDAYS[p.weekday]} ${p.day} ${AR_MONTHS[p.month - 1]}${withYear ? ` ${p.year}` : ''}`);
}

/** A visit's time span, naming the end's date only when it differs. */
export function rangeIn(start: string | number, end: string | number, lang: Lang): string {
  if (lang === 'en') return formatRange(start, end);
  const sameDay = dateIn(start, 'ar', false) === dateIn(end, 'ar', false);
  return sameDay
    ? `${dateIn(start, 'ar', false)}، ${timeIn(start, 'ar')} – ${timeIn(end, 'ar')}`
    : `${dateIn(start, 'ar', false)}، ${timeIn(start, 'ar')} – ${dateIn(end, 'ar', false)}، ${timeIn(end, 'ar')}`;
}

/** "Tue 13 Oct, 02:30 PM", or "الثلاثاء ١٣ أكتوبر، ٢:٣٠ م". */
export function dateTimeIn(value: string | number, lang: Lang): string {
  if (lang === 'en') return formatDateTime(value);
  return `${dateIn(value, 'ar', false)}، ${timeIn(value, 'ar')}`;
}

/** "Today", "Tomorrow" or the date of a site date key, relative to `now`. */
export function relativeDayIn(dateKey: string, nowMs: number, lang: Lang): string {
  const today = siteDateKey(nowMs);
  if (dateKey === today) return lang === 'ar' ? 'اليوم' : 'Today';
  if (dateKey === addDaysToKey(today, 1)) return lang === 'ar' ? 'غدًا' : 'Tomorrow';
  return dateIn(siteToUtc(dateKey, 12 * 60), lang, false);
}

/** "02:30 PM" for a minute of the day (pickers), or "٢:٣٠ م". */
export function minuteOfDayIn(minuteOfDay: number, lang: Lang): string {
  const m = ((minuteOfDay % 1440) + 1440) % 1440;
  const hour = Math.floor(m / 60);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  if (lang === 'en') return `${String(hour12).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
  return arabicDigits(`${hour12}:${String(m % 60).padStart(2, '0')}`) + (hour < 12 ? ' ص' : ' م');
}

/** "2h 15m", or "٢ س ١٥ د". */
export function durationIn(minutes: number, lang: Lang): string {
  if (lang === 'en') return formatDuration(minutes);
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return arabicDigits([h ? `${h} س` : '', m || !h ? `${m} د` : ''].filter(Boolean).join(' '));
}

/* --------------------------------------------------------------- Names */

const AR_NAMES: Readonly<Record<string, string>> = {
  'Main Avenue': 'الشارع الرئيسي',
  'Central Avenue': 'الشارع الأوسط',
  'South Road': 'الطريق الجنوبي',
  'Aisle 1': 'الممر ١',
  'Aisle 2': 'الممر ٢',
  'Aisle 3': 'الممر ٣',
  'Building A': 'مبنى A',
  'Building B': 'مبنى B',
  'Building C': 'مبنى C',
  'Visitor Court North': 'ساحة الزوار الشمالية',
  'Visitor Lane East': 'ممر الزوار الشرقي',
  'EV Hub': 'محطة الشحن',
  Residents: 'مواقف السكان',
  Garden: 'حديقة',
  Clubhouse: 'النادي',
  Pool: 'حمام السباحة',
  'General parking': 'مواقف عامة',
  'Residents’ bays': 'مواقف السكان',
  'Lift A': 'مصعد A',
  'Lift C': 'مصعد C',
  Ground: 'الدور الأرضي',
  'Basement 1': 'الطابق السفلي الأول',
  'Basement 2': 'الطابق السفلي الثاني',
  // Vehicle colours.
  Black: 'أسود',
  White: 'أبيض',
  Grey: 'رمادي',
  Silver: 'فضي',
  Blue: 'أزرق',
  Red: 'أحمر',
};

/** A home's label, "Apartment A-302", or "شقة A-302". */
export const propertyIn = (label: string, lang: Lang) =>
  lang === 'ar' ? label.replace(/^Apartment /, 'شقة ').replace(/^Villa /, 'فيلا ') : label;

/** A site name (road, building, zone, landmark) in the reader's language. */
export const nameIn = (name: string, lang: Lang) => (lang === 'ar' ? (AR_NAMES[name] ?? name) : name);

const AR_GATES: Readonly<Record<string, { name: string; short: string; description: string }>> = {
  'gate-1': { name: 'البوابة ١ · البوابة الرئيسية', short: 'البوابة ١', description: 'المدخل الغربي من الطريق الرئيسي' },
  'gate-2': { name: 'البوابة ٢ · البوابة الشرقية', short: 'البوابة ٢', description: 'المدخل الشرقي بجوار النادي' },
  'gate-3': { name: 'البوابة ٣ · بوابة الخدمة', short: 'البوابة ٣', description: 'مخرج جنوبي فقط' },
};

export function gateNameIn(gateId: string, lang: Lang, short = false): string {
  const gate = gateDefs.find((g) => g.id === gateId);
  if (lang === 'ar' && AR_GATES[gateId]) return short ? AR_GATES[gateId].short : AR_GATES[gateId].name;
  if (!gate) return gateId;
  return short ? gate.name.split(' · ')[0] : gate.name;
}

export function gateDescriptionIn(gateId: string, lang: Lang): string {
  if (lang === 'ar' && AR_GATES[gateId]) return AR_GATES[gateId].description;
  return gateDefs.find((g) => g.id === gateId)?.description ?? '';
}

const AR_LEVELS: Readonly<Record<LevelId, { name: string; short: string }>> = {
  ground: { name: 'الدور الأرضي', short: 'الأرضي' },
  b1: { name: 'الطابق السفلي الأول · محطة الشحن', short: 'السفلي ١ · الشحن' },
  b2: { name: 'الطابق السفلي الثاني · السكان', short: 'السفلي ٢ · السكان' },
};

export function levelNameIn(id: LevelId, lang: Lang, short = false): string {
  if (lang === 'ar') return short ? AR_LEVELS[id].short : AR_LEVELS[id].name;
  const level = levels.find((l) => l.id === id);
  return (short ? level?.short : level?.name) ?? id;
}

/* --------------------------------------------------------- Route steps */

const EN_ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
const AR_ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن'];
const AR_HEADINGS = { north: 'شمالًا', south: 'جنوبًا', east: 'شرقًا', west: 'غربًا' } as const;

function walkText(target: WalkTarget, lang: Lang): string {
  if (lang === 'ar') {
    return target.kind === 'entrance'
      ? `امشِ إلى مدخل مبنى ${target.building}`
      : `امشِ إلى المصعد ${target.lift}، ثم اصعد إلى بهو مبنى ${target.building}`;
  }
  return target.kind === 'entrance'
    ? `Walk to the Building ${target.building} entrance`
    : `Walk to Lift ${target.lift}, up to the Building ${target.building} lobby`;
}

/**
 * The wording of a route step. English and Arabic are written from the same
 * facts, so the two can never drift apart.
 */
export function describeStep(kind: RouteStepKind, info: RouteStepInfo, lang: Lang): string {
  const road = nameIn(info.road ?? '', lang);
  if (lang === 'ar') {
    const turn = info.turn === 'left' ? 'يسارًا' : 'يمينًا';
    const lead = info.afterRamp ? 'في أسفل المنحدر، ' : '';
    switch (kind) {
      case 'enter':
        return `ادخل من ${gateNameIn(info.gateId ?? '', 'ar')}`;
      case 'head':
        return `اتجه ${AR_HEADINGS[info.heading ?? 'north']} على ${road}`;
      case 'continue':
        return `${lead}تابع إلى ${road}`;
      case 'turn-left':
      case 'turn-right':
        return `${lead}انعطف ${turn} إلى ${road}`;
      case 'ramp':
        return `انزل المنحدر إلى ${levelNameIn(info.toLevel ?? 'b1', 'ar')}`;
      case 'park':
        return `اركن في ${info.bay}، الموقف ${AR_ORDINALS[(info.ordinal ?? 1) - 1] ?? arabicDigits(String(info.ordinal))} على ${info.side === 'left' ? 'يسارك' : 'يمينك'}`;
      case 'walk':
        return info.walkTo ? walkText(info.walkTo, 'ar') : '';
    }
  }
  const lead = info.afterRamp ? 'At the foot of the ramp, ' : '';
  switch (kind) {
    case 'enter':
      return `Enter at ${gateNameIn(info.gateId ?? '', 'en')}`;
    case 'head':
      return `Head ${info.heading} on ${road}`;
    case 'continue':
      return info.afterRamp ? `${lead}continue onto ${road}` : `Continue onto ${road}`;
    case 'turn-left':
    case 'turn-right':
      return info.afterRamp ? `${lead}turn ${info.turn} onto ${road}` : `Turn ${info.turn} onto ${road}`;
    case 'ramp':
      return `Take the ramp down to ${levelNameIn(info.toLevel ?? 'b1', 'en')}`;
    case 'park':
      return `Park in ${info.bay}, the ${EN_ORDINALS[(info.ordinal ?? 1) - 1] ?? `${info.ordinal}th`} bay on your ${info.side}`;
    case 'walk':
      return info.walkTo ? walkText(info.walkTo, 'en') : '';
  }
}

/** A stored step's wording in the reader's language. */
export const stepText = (step: RouteStep, lang: Lang) => (lang === 'en' ? step.text : describeStep(step.kind, step.info, lang));


/* ------------------------------------------------- Statuses and states */

/** A booking's status chip (selectors' DisplayStatusKey) in the reader's language. */
const AR_STATUS: Readonly<Record<string, string>> = {
  confirmed: 'مؤكد',
  'action-needed': 'يحتاج إجراء',
  'checked-in': 'تم الدخول',
  overdue: 'تجاوز الوقت',
  completed: 'مكتمل',
  cancelled: 'ملغى',
  'no-show': 'لم يحضر',
};
export const statusLabelIn = (key: string, english: string, lang: Lang) => (lang === 'ar' ? (AR_STATUS[key] ?? english) : english);

const CHARGING_STATE: Readonly<Record<string, { en: string; ar: string }>> = {
  reserved: { en: 'Charging booked', ar: 'الشحن محجوز' },
  'waiting-for-plug-in': { en: 'Ready to plug in', ar: 'جاهز للتوصيل' },
  charging: { en: 'Charging', ar: 'جارٍ الشحن' },
  completed: { en: 'Charging finished', ar: 'انتهى الشحن' },
  interrupted: { en: 'Charging stopped', ar: 'توقف الشحن' },
  faulted: { en: 'Charger fault', ar: 'عطل في الشاحن' },
};
export const chargingStateIn = (state: string, lang: Lang) => CHARGING_STATE[state]?.[lang] ?? state;

/* ------------------------------------------------------------- Errors */

/**
 * The service's errors by code (tx.ts ParkingError), for the Arabic screens. English shows the
 * service's own message, which can carry details (a time, a bay); a code missing here falls
 * back to it too.
 */
const AR_ERRORS: Readonly<Record<string, string>> = {
  'in-past': 'هذا الوقت قد مضى. اختر وقتًا لاحقًا.',
  'invalid-time': 'وقت غير صالح. تحقّق من الوصول ومدة البقاء.',
  'too-long': 'المدة أطول من المسموح به لهذا النوع من المواقف.',
  'reason-required': 'اكتب سببًا لهذا الإجراء.',
  'not-in-bay': 'يجب أن تكون السيارة قد دخلت وتقف في موقف الشحن لبدء الشحن.',
  'not-extendable': 'لا يمكن تمديد هذا الحجز.',
  'not-editable': 'لا يمكن تعديل هذا الحجز الآن.',
  'not-charging': 'الشحن لا يعمل.',
  'invalid-plate': 'اكتب رقم اللوحة بالأرقام والحروف، مثل 4521 AB.',
  'wrong-kind': 'هذا الإجراء لا ينطبق على هذا الحجز.',
  'space-unavailable': 'هذا الموقف غير متاح في الوقت المختار.',
  'slot-released': 'تم إلغاء موعد الشحن لهذا الحجز.',
  'slot-not-started': 'لم يبدأ موعد الشحن بعد.',
  'slot-ended': 'انتهى وقت الشحن المحجوز.',
  'session-state': 'تم استخدام موعد الشحن هذا بالفعل.',
  'not-your-property': 'هذه الوحدة ليست مسجّلة باسمك.',
  'not-replaceable': 'لا يمكن إصدار رمز جديد لهذا الحجز.',
  'not-reassignable': 'لا يمكن نقل هذا الحجز إلى موقف آخر.',
  'not-found': 'لم يتم العثور على الحجز.',
  'not-cancellable': 'لا يمكن إلغاء هذا الحجز.',
  'no-charging': 'لا يوجد شحن في هذا الحجز.',
  'invite-not-found': 'هذا التصريح غير متاح.',
  'invalid-type': 'نوع موقف غير صالح.',
  incompatible: 'الشاحن في هذا الموقف لا يناسب هذا الموصّل.',
  'guest-name': 'اكتب اسم الضيف.',
  'guest-limit': 'وصلت إلى الحد الأقصى للضيوف في الوقت نفسه لهذه الوحدة.',
  'charging-outside': 'يجب أن يكون وقت الشحن ضمن وقت الحجز.',
  'charging-missing': 'اختر وقت الشحن.',
  'charging-active': 'لا يمكن ذلك أثناء الشحن.',
  'charger-unavailable': 'الشاحن غير متاح في الوقت المختار.',
  'charger-down': 'الشاحن غير متاح الآن. تم إبلاغ الأمن.',
  'already-vacated': 'تم إخلاء الموقف بالفعل.',
  stale: 'تغيّر هذا الحجز في هذه الأثناء. أعد فتحه وحاول مرة أخرى.',
};

/** A ParkingError for the reader: the service's message in English, its code's wording in Arabic. */
export function parkingErrorIn(error: { code: string; message: string }, lang: Lang): string {
  return lang === 'ar' ? (AR_ERRORS[error.code] ?? error.message) : error.message;
}

/** "That did not work" and its kin, for failures that aren't ParkingErrors. */
export const failedIn = (lang: Lang) => (lang === 'ar' ? 'لم ينجح ذلك. حاول مرة أخرى.' : 'That did not work. Please try again.');

/* -------------------------------------------------- Bay search reasons */

const AR_REASONS: Readonly<Record<string, string>> = {
  'Under maintenance': 'تحت الصيانة',
  'Out of service': 'خارج الخدمة',
  'Bay status unknown': 'حالة الموقف غير معروفة',
  'Occupied by an unregistered vehicle': 'تشغله مركبة غير مسجّلة',
  'Held by an overstaying vehicle': 'تشغله مركبة تجاوزت وقتها',
  'Booked for part of this time': 'محجوز لجزء من هذا الوقت',
  'Connector booked for part of this time': 'الموصّل محجوز لجزء من هذا الوقت',
  'Charger at capacity for part of this time': 'الشاحن ممتلئ لجزء من هذا الوقت',
  'Charger fault': 'عطل في الشاحن',
  'Charger offline': 'الشاحن غير متصل',
  'Charger under maintenance': 'الشاحن تحت الصيانة',
  Available: 'متاح',
};

/** Why a bay can't be booked (availability.ts), in the reader's language. */
export function reasonIn(reason: string | undefined, lang: Lang): string | undefined {
  if (!reason || lang === 'en') return reason;
  const connector = /^No (.+) connector at this bay$/.exec(reason);
  if (connector) return `لا يوجد موصّل ${connector[1]} في هذا الموقف`;
  return AR_REASONS[reason] ?? reason;
}

/* ------------------------------------------------------- Gate results */

const AR_GATE: Readonly<Record<string, { title: string; message: string }>> = {
  'too-early': { title: 'مبكر جدًا', message: 'لم يحن موعد الدخول لهذه الزيارة بعد.' },
  expired: { title: 'انتهى وقت الزيارة', message: 'انتهى الوقت المحجوز لهذا التصريح.' },
  'vehicle-missing': { title: 'بيانات المركبة ناقصة', message: 'أضف رقم اللوحة في تصريح الضيف، أو اطلب من الأمن تسجيله، قبل الدخول.' },
  'wrong-gate': { title: 'بوابة خاطئة', message: 'هذا التصريح لبوابة أخرى. استخدم البوابة المذكورة في التصريح.' },
  'space-unavailable': { title: 'الموقف المخصّص غير متاح', message: 'سيخصّص الأمن موقفًا آخر.' },
  'space-occupied': { title: 'الموقف المخصّص غير شاغر', message: 'سيخصّص الأمن موقفًا آخر.' },
  'space-turnover': { title: 'جارٍ تجهيز الموقف', message: 'أُخلي الموقف للتو ويجري تجهيزه.' },
  'space-conflict': { title: 'الموقف المخصّص غير شاغر', message: 'زيارة أخرى ما زالت تشغل الموقف.' },
  'early-conflict': { title: 'مبكر جدًا لهذا الموقف', message: 'الموقف محجوز حتى قبيل موعدك.' },
  unreadable: { title: 'رمز غير معروف', message: 'هذا ليس تصريح مواقف نماء.' },
  'unknown-pass': { title: 'التصريح غير موجود', message: 'لا يوجد حجز يطابق هذا التصريح.' },
  'already-checked-in': { title: 'تم الدخول مسبقًا', message: 'لم يتغيّر شيء.' },
  'already-checked-out': { title: 'تم الخروج مسبقًا', message: 'لم يتغيّر شيء.' },
  'pass-used': { title: 'التصريح مستخدم', message: 'اكتملت هذه الزيارة. يلزم حجز جديد للدخول مرة أخرى.' },
  'not-eligible': { title: 'التصريح غير صالح', message: 'لا يمكن لهذا الحجز الدخول الآن.' },
  'not-checked-in': { title: 'لا يوجد تسجيل دخول', message: 'لم يُستخدم هذا التصريح للدخول، لذا لا يمكنه الخروج.' },
  revoked: { title: 'التصريح غير صالح', message: 'تم سحب هذا التصريح. يمكن للأمن تسجيل الخروج يدويًا.' },
  'entry-ok': { title: 'فُتحت البوابة', message: 'تم تسجيل الدخول.' },
  'exit-ok': { title: 'فُتحت البوابة', message: 'تم تسجيل الخروج.' },
  'exit-ok-overdue': { title: 'فُتحت البوابة', message: 'تم تسجيل الخروج بعد تجاوز الوقت المحجوز.' },
  'entry-override': { title: 'فُتحت البوابة (يدويًا)', message: 'سمح الأمن بالدخول.' },
  'exit-override': { title: 'فُتحت البوابة (يدويًا)', message: 'سجّل الأمن الخروج.' },
};

/** A gate scan's result (gate.ts) for the reader. Revocations share one wording. */
export function gateResultIn(result: { code: string; title: string; message: string }, lang: Lang) {
  if (lang === 'en') return { title: result.title, message: result.message };
  const key = result.code.startsWith('revoked') ? 'revoked' : result.code;
  return AR_GATE[key] ?? { title: result.title, message: result.message };
}

/**
 * "Charger A · AC 22 kW" in the reader's language. In Arabic a right-to-left
 * mark after the letter keeps "A" and "AC" from running together as one
 * left-to-right phrase.
 */
export function chargerNameIn(label: string | undefined, lang: Lang): string {
  if (!label) return '';
  if (lang === 'en') return label;
  return arabicDigits(label.replace(/^Charger (\S+)/, 'الشاحن $1\u200F').replace(/ kW\b/, ' كيلوواط'));
}
