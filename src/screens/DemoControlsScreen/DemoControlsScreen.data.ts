import { digitsIn, type Lang } from '../../services/parking/i18n';
import type { PolicySettings } from '../../services/parking/policy';
import { HOUR_MS, MINUTE_MS } from '../../services/parking/time';
import type { OccupancyState, Serviceability } from '../../services/parking/types';

interface DemoCopy {
  title: string;
  intro: string;
  clockNote: string;
  storage: { browser: string; device: string; memory: string };
  resetConfirm: string;
  failed: string;
  clockTitle: string;
  ahead: (duration: string) => string;
  realTime: string;
  clockMoved: (step: string) => string;
  viewAs: string;
  viewAsNote: string;
  resident: string;
  security: string;
  visitorPick: string;
  openAsVisitor: string;
  gateTitle: string;
  gateNote: string;
  simEntry: string;
  simExit: string;
  chargingTitle: string;
  plugIn: string;
  plugged: string;
  complete: string;
  completed: string;
  movedOut: string;
  released: string;
  openSession: string;
  upTo: (cars: number, connectors: string) => string;
  inService: string;
  fault: string;
  simFault: string;
  restore: string;
  faulted: (charger: string) => string;
  restored: (charger: string) => string;
  baysTitle: string;
  baysNote: string;
  occupancy: Record<OccupancyState, string>;
  serviceability: Record<Serviceability, string>;
  mark: (state: string) => string;
  bayIs: (bay: string, state: string) => string;
  checksTitle: string;
  checksNote: string;
  runAgain: string;
  runChecks: string;
  passed: (passed: number, total: number) => string;
  pass: string;
  fail: string;
  dataTitle: string;
  counts: (bookings: number, events: number, audit: number, revision: number) => string;
  resetTitle: string;
  keep: string;
  reset: string;
  resetDone: string;
  resetData: string;
  policyTitle: string;
  policyNote: string;
  units: { min: string; days: string };
}

export const demoCopy: Record<Lang, DemoCopy> = {
  en: {
    title: 'Demo Controls',
    intro:
      'Everything here is a simulation tool for presenting the demo. Residents, visitors and security never see these controls.',
    clockNote:
      'One demo clock drives every rule: arrival expiry, overstays, charging progress and availability all move together. Time only moves forward; reset the demo to return to now.',
    storage: {
      browser:
        'Saved in this browser (localStorage). Refreshing keeps everything. Other devices, and other browsers on this one, cannot see it: a shared backend would be needed for a visitor to open a pass on their own phone.',
      device:
        'Saved on this device only. Refreshing or restarting keeps everything; other devices cannot see it without a shared backend.',
      memory: 'Saved in memory only (storage is blocked here), so a refresh starts again from the seed data.',
    },
    resetConfirm: 'Replace all bookings and events with fresh demo data at the current time?',
    failed: 'That did not work.',
    clockTitle: 'Demo clock',
    ahead: (duration) => `${duration} ahead of real time · Muscat`,
    realTime: 'Real time · Muscat',
    clockMoved: (step) => `Clock moved ${step}. Expiries, overstays and charging updated.`,
    viewAs: 'View as',
    viewAsNote: 'Switch role to present each side of the flow.',
    resident: 'Resident',
    security: 'Security',
    visitorPick: 'Visitor: open a guest’s pass',
    openAsVisitor: 'Open as visitor',
    gateTitle: 'Simulate gate',
    gateNote: 'Scans the pass’s current QR at its assigned gate.',
    simEntry: 'Simulate entry',
    simExit: 'Simulate exit',
    chargingTitle: 'Simulate charging',
    plugIn: 'Plug in',
    plugged: 'Plugged in; charging started.',
    complete: 'Charging complete',
    completed: 'Charging completed. The bay stays occupied until the car moves.',
    movedOut: 'Moved out of EV bay',
    released: 'Bay released; the visit is still inside the compound.',
    openSession: 'Open session',
    upTo: (cars, connectors) => `Up to ${cars} car${cars > 1 ? 's' : ''} at once · ${connectors}`,
    inService: 'In service',
    fault: 'Fault',
    simFault: 'Simulate charger fault',
    restore: 'Restore charger',
    faulted: (charger) => `${charger} faulted. Active sessions interrupted; upcoming bookings flagged.`,
    restored: (charger) => `${charger} back in service.`,
    baysTitle: 'Simulate bays',
    baysNote: 'Bay sensors and maintenance status.',
    occupancy: { occupied: 'occupied', vacant: 'vacant', unknown: 'unknown' },
    serviceability: { 'in-service': 'in service', maintenance: 'maintenance', 'out-of-service': 'out of service' },
    mark: (state) => `Mark ${state}`,
    bayIs: (bay, state) => `${bay} is now ${state}.`,
    checksTitle: 'Acceptance checks',
    checksNote: 'Runs the scenarios on a private copy; your demo data is not touched.',
    runAgain: 'Run again',
    runChecks: 'Run acceptance checks',
    passed: (passed, total) => `${passed} of ${total} passed`,
    pass: 'Pass',
    fail: 'Fail',
    dataTitle: 'Data',
    counts: (bookings, events, audit, revision) =>
      `${bookings} bookings · ${events} gate events · ${audit} audit entries · revision ${revision}`,
    resetTitle: 'Reset demo data?',
    keep: 'Keep data',
    reset: 'Reset',
    resetDone: 'Demo data reset to the seed at the current time.',
    resetData: 'Reset demo data',
    policyTitle: 'Policy settings',
    policyNote: 'Configuration in services/parking/policy.ts',
    units: { min: 'min', days: 'days' },
  },
  ar: {
    title: 'أدوات العرض',
    intro: 'كل ما هنا أدوات محاكاة لتقديم العرض. لا يرى السكان والزوار والأمن هذه الأدوات.',
    clockNote:
      'ساعة عرض واحدة تحرّك كل القواعد: انتهاء الوصول وتجاوز الوقت وتقدّم الشحن والتوفّر تتحرك معًا. الوقت يتقدّم فقط؛ أعد ضبط العرض للعودة إلى الآن.',
    storage: {
      browser:
        'محفوظ في هذا المتصفح (localStorage). التحديث يحافظ على كل شيء. لا تراه الأجهزة الأخرى ولا المتصفحات الأخرى على هذا الجهاز: يلزم خادم مشترك ليفتح الزائر تصريحه على هاتفه.',
      device: 'محفوظ على هذا الجهاز فقط. التحديث أو إعادة التشغيل يحافظ على كل شيء؛ لا تراه الأجهزة الأخرى دون خادم مشترك.',
      memory: 'محفوظ في الذاكرة فقط (التخزين محظور هنا)، لذا يبدأ التحديث من بيانات العرض الأولى.',
    },
    resetConfirm: 'استبدال كل الحجوزات والأحداث ببيانات عرض جديدة في الوقت الحالي؟',
    failed: 'لم ينجح ذلك.',
    clockTitle: 'ساعة العرض',
    ahead: (duration) => `متقدّمة ${duration} عن الوقت الفعلي · مسقط`,
    realTime: 'الوقت الفعلي · مسقط',
    clockMoved: (step) => `تقدّمت الساعة ${step}. تم تحديث الانتهاءات وتجاوز الوقت والشحن.`,
    viewAs: 'العرض كـ',
    viewAsNote: 'بدّل الدور لعرض كل جانب من التجربة.',
    resident: 'ساكن',
    security: 'الأمن',
    visitorPick: 'زائر: افتح تصريح ضيف',
    openAsVisitor: 'افتح كزائر',
    gateTitle: 'محاكاة البوابة',
    gateNote: 'يمسح رمز QR الحالي للتصريح عند بوابته المخصّصة.',
    simEntry: 'محاكاة الدخول',
    simExit: 'محاكاة الخروج',
    chargingTitle: 'محاكاة الشحن',
    plugIn: 'توصيل',
    plugged: 'تم التوصيل؛ بدأ الشحن.',
    complete: 'اكتمال الشحن',
    completed: 'اكتمل الشحن. يبقى الموقف مشغولًا حتى تتحرك السيارة.',
    movedOut: 'غادر موقف الشحن',
    released: 'أُفرج عن الموقف؛ الزيارة ما زالت داخل المجمع.',
    openSession: 'فتح الجلسة',
    upTo: (cars, connectors) => `حتى ${digitsIn(cars, 'ar')} ${cars > 1 ? 'سيارات' : 'سيارة'} في وقت واحد · ${connectors}`,
    inService: 'في الخدمة',
    fault: 'عطل',
    simFault: 'محاكاة عطل الشاحن',
    restore: 'إعادة الشاحن',
    faulted: (charger) => `تعطّل ${charger}. توقفت الجلسات النشطة؛ ونُبّهت الحجوزات القادمة.`,
    restored: (charger) => `عاد ${charger} إلى الخدمة.`,
    baysTitle: 'محاكاة المواقف',
    baysNote: 'حساسات المواقف وحالة الصيانة.',
    occupancy: { occupied: 'مشغول', vacant: 'شاغر', unknown: 'غير معروف' },
    serviceability: { 'in-service': 'في الخدمة', maintenance: 'صيانة', 'out-of-service': 'خارج الخدمة' },
    mark: (state) => `تعيين ${state}`,
    bayIs: (bay, state) => `${bay} الآن ${state}.`,
    checksTitle: 'اختبارات القبول',
    checksNote: 'تُشغَّل السيناريوهات على نسخة خاصة؛ لا تُمس بيانات العرض.',
    runAgain: 'تشغيل مرة أخرى',
    runChecks: 'تشغيل اختبارات القبول',
    passed: (passed, total) => `نجح ${digitsIn(passed, 'ar')} من ${digitsIn(total, 'ar')}`,
    pass: 'نجح',
    fail: 'فشل',
    dataTitle: 'البيانات',
    counts: (bookings, events, audit, revision) =>
      `${digitsIn(bookings, 'ar')} حجز · ${digitsIn(events, 'ar')} حدث بوابة · ${digitsIn(audit, 'ar')} سجل تدقيق · المراجعة ${digitsIn(revision, 'ar')}`,
    resetTitle: 'إعادة ضبط بيانات العرض؟',
    keep: 'الإبقاء على البيانات',
    reset: 'إعادة الضبط',
    resetDone: 'أُعيد ضبط بيانات العرض في الوقت الحالي.',
    resetData: 'إعادة ضبط بيانات العرض',
    policyTitle: 'إعدادات السياسة',
    policyNote: 'الإعدادات في services/parking/policy.ts',
    units: { min: 'د', days: 'أيام' },
  },
};

export const clockSteps = [
  { label: { en: '+15 min', ar: '+١٥ د' }, ms: 15 * MINUTE_MS },
  { label: { en: '+1 hour', ar: '+١ ساعة' }, ms: HOUR_MS },
  { label: { en: '+4 hours', ar: '+٤ ساعات' }, ms: 4 * HOUR_MS },
  { label: { en: '+1 day', ar: '+١ يوم' }, ms: 24 * HOUR_MS },
] as const;

type Unit = 'min' | 'days' | '';

export const policyLabels: Record<keyof PolicySettings, [Record<Lang, string>, Unit]> = {
  turnoverBufferMinutes: [{ en: 'Turnover buffer', ar: 'فاصل التجهيز بين الزيارات' }, 'min'],
  lateArrivalGraceMinutes: [{ en: 'Late arrival grace', ar: 'مهلة التأخير' }, 'min'],
  earlyArrivalMinutes: [{ en: 'Early arrival allowed', ar: 'الوصول المبكر المسموح' }, 'min'],
  maxSimultaneousGuestBookingsPerProperty: [{ en: 'Guest bookings at once, per property', ar: 'حجوزات الضيوف في وقت واحد لكل وحدة' }, ''],
  maxStandardDurationMinutes: [{ en: 'Longest visitor stay', ar: 'أطول مدة لوقوف الزائر' }, 'min'],
  maxEvParkingDurationMinutes: [{ en: 'Longest EV stay', ar: 'أطول مدة في موقف الشحن' }, 'min'],
  maxChargingDurationMinutes: [{ en: 'Longest charging slot', ar: 'أطول موعد شحن' }, 'min'],
  bookingHorizonDays: [{ en: 'Booking horizon', ar: 'مدى الحجز المسبق' }, 'days'],
  startTolerancePastMinutes: [{ en: 'Arrival may be this far in the past', ar: 'أقصى تأخر مسموح لوقت الوصول' }, 'min'],
  evMoveOutBufferMinutes: [{ en: 'Default stay after charging', ar: 'مدة الوقوف الافتراضية بعد الشحن' }, 'min'],
  evMoveOutGraceMinutes: [{ en: 'Move out of EV bay within', ar: 'مغادرة موقف الشحن خلال' }, 'min'],
  chargingPlugInGraceMinutes: [{ en: 'Plug in within', ar: 'التوصيل خلال' }, 'min'],
  slotMinutes: [{ en: 'Booking time step', ar: 'خطوة وقت الحجز' }, 'min'],
};
