import type { StatusTone } from '../../components/parking/compat/StatusChip';
import { digitsIn, type Lang } from '../../services/parking/i18n';
import type { ScanResult } from '../../services/parking/gate';
import type { ArrivalPhase } from '../../services/parking/tracking';
import type { AppNotification, OccupancyState, Serviceability } from '../../services/parking/types';

interface ConsoleCopy {
  title: string;
  roleNote: string;
  entryNote: string;
  emergency: string;
  arrivalsNote: string;
  noArrivals: string;
  plateToCome: string;
  arrivalHint: string;
  arrivalPicked: (gate: string) => string;
  arrivalScan: (gate: string) => string;
  scanFailed: string;
  failed: string;
  gate: string;
  entryAndExit: string;
  exitOnly: string;
  lane: string;
  entry: string;
  exit: string;
  scanTitle: string;
  laneLabel: (gate: string, entry: boolean) => string;
  scanCamera: string;
  paste: string;
  validate: string;
  opened: string;
  closed: string;
  notNow: string;
  arrivals: (count: number) => string;
  simulateTitle: string;
  simulateNote: string;
  scanCurrent: string;
  scanReplaced: string;
  exceptions: (count: number) => string;
  nothing: string;
  reassign: string;
  reassigned: string;
  resolveManually: string;
  markHandled: string;
  handled: string;
  manualTitle: string;
  manualNote: string;
  noPlate: string;
  reason: string;
  reasonPlaceholder: string;
  plateSeen: string;
  admitAt: (gate: string) => string;
  exitAt: (gate: string) => string;
  movedOut: string;
  released: string;
  stopCharging: string;
  stopped: string;
  bayTitle: string;
  bayNote: string;
  note: string;
  notePlaceholder: string;
  occupancy: Record<OccupancyState, string>;
  serviceability: Record<Serviceability, string>;
  nowState: (state: string) => string;
  mark: (state: string) => string;
  marked: (bay: string, state: string) => string;
  logTitle: string;
  logOpened: string;
  logRefused: string;
  logTitleFor: (accepted: boolean, gate: string, entry: boolean) => string;
  unknownPass: string;
  override: (reason: string) => string;
  arrivalChip: Record<ArrivalPhase, string>;
  needsBay: string;
  notification: Record<AppNotification['kind'], string>;
}

export const consoleCopy: Record<Lang, ConsoleCopy> = {
  en: {
    title: 'Security Console',
    roleNote:
      'Demo role: gate security. Every barrier action here is simulated. A real gate validates the code on a server before opening.',
    entryNote:
      'Entry proves the car entered the parking area. This demo marks the assigned bay occupied on entry; a real site would confirm it with bay sensors or a guard.',
    emergency: 'Booking rules never block an emergency: security can always open the barrier.',
    arrivalsNote: 'Due in the next hour, and late arrivals whose bay is still held. Tap one to get its pass ready to scan.',
    noArrivals: 'Nobody is due in the next hour.',
    plateToCome: 'plate to come',
    arrivalHint: 'Picks this pass and its gate for a simulated scan',
    arrivalPicked: (gate) => `${gate} and its entry lane are selected. Scan the pass as if the car were at the barrier.`,
    arrivalScan: (gate) => `Scan their pass at ${gate}`,
    scanFailed: 'Scan failed.',
    failed: 'That did not work.',
    gate: 'Gate',
    entryAndExit: 'Entry and exit',
    exitOnly: 'Exit only',
    lane: 'Lane',
    entry: 'Entry',
    exit: 'Exit',
    scanTitle: 'Scan a pass',
    laneLabel: (gate, entry) => `${gate} · ${entry ? 'entry lane' : 'exit lane'}`,
    scanCamera: 'Scan with camera',
    paste: 'Or paste a code or link',
    validate: 'Validate pasted code',
    opened: 'Barrier opened (simulated)',
    closed: 'Barrier stays closed',
    notNow: 'Not now',
    arrivals: (count) => `Expected arrivals (${count})`,
    simulateTitle: 'Simulate a scan',
    simulateNote: 'Pick any demo pass and scan it at the gate above.',
    scanCurrent: 'Scan current QR',
    scanReplaced: 'Scan replaced QR',
    exceptions: (count) => `Exceptions (${count})`,
    nothing: 'Nothing needs attention.',
    reassign: 'Reassign bay',
    reassigned: 'Reassigned to the nearest free bay.',
    resolveManually: 'Resolve manually',
    markHandled: 'Mark handled',
    handled: 'Marked as handled.',
    manualTitle: 'Manual resolution',
    manualNote: 'Lost pass, unreadable code or a stuck session. Every override is logged with its reason.',
    noPlate: 'no plate',
    reason: 'Reason (logged)',
    reasonPlaceholder: 'e.g. Phone battery dead, checked ID',
    plateSeen: 'Plate seen at the gate',
    admitAt: (gate) => `Admit at ${gate}`,
    exitAt: (gate) => `Record exit at ${gate}`,
    movedOut: 'Moved out of EV bay',
    released: 'EV bay released. The visit stays open until the car exits.',
    stopCharging: 'Stop charging',
    stopped: 'Charging stopped by security.',
    bayTitle: 'Bay status',
    bayNote: 'Correct a bay that is reported wrongly.',
    note: 'Note (logged)',
    notePlaceholder: 'e.g. Checked on patrol',
    occupancy: { occupied: 'occupied', vacant: 'vacant', unknown: 'unknown' },
    serviceability: { 'in-service': 'in service', maintenance: 'maintenance', 'out-of-service': 'out of service' },
    nowState: (state) => `${state} (now)`,
    mark: (state) => `Mark ${state}`,
    marked: (bay, state) => `${bay} marked ${state}.`,
    logTitle: 'Gate log',
    logOpened: 'Opened',
    logRefused: 'Refused',
    logTitleFor: (accepted, gate, entry) => `${accepted ? 'Opened' : 'Refused'} · ${gate} ${entry ? 'entry' : 'exit'}`,
    unknownPass: 'Unknown pass',
    override: (reason) => `Override: ${reason}`,
    arrivalChip: { due: 'Due', open: 'Entry open', late: 'Late' },
    needsBay: 'Needs bay',
    notification: {
      overdue: 'Visit overdue',
      'reassignment-needed': 'Booking needs another bay',
      'charging-complete': 'Charging complete',
      'charger-fault': 'Charger fault',
      'no-show': 'Guest did not arrive',
      'help-request': 'Visitor asked for help',
      entry: 'Car entered',
      exit: 'Car left',
    },
  },
  ar: {
    title: 'منصة الأمن',
    roleNote: 'دور تجريبي: أمن البوابة. كل إجراءات الحاجز هنا محاكاة. البوابة الحقيقية تتحقق من الرمز على خادم قبل الفتح.',
    entryNote:
      'الدخول يثبت أن السيارة دخلت منطقة المواقف. يعتبر هذا العرض الموقف المخصّص مشغولًا عند الدخول؛ الموقع الحقيقي يؤكده بحساسات أو حارس.',
    emergency: 'قواعد الحجز لا تمنع الطوارئ أبدًا: يستطيع الأمن فتح الحاجز دائمًا.',
    arrivalsNote: 'المتوقعون خلال الساعة القادمة، والمتأخرون الذين ما زالت مواقفهم محجوزة. اضغط على أحدهم لتجهيز تصريحه للمسح.',
    noArrivals: 'لا أحد متوقع خلال الساعة القادمة.',
    plateToCome: 'اللوحة لاحقًا',
    arrivalHint: 'يختار هذا التصريح وبوابته لمسح تجريبي',
    arrivalPicked: (gate) => `تم اختيار ${gate} ومسار الدخول. امسح التصريح كأن السيارة عند الحاجز.`,
    arrivalScan: (gate) => `امسح تصريحه عند ${gate}`,
    scanFailed: 'فشل المسح.',
    failed: 'لم ينجح ذلك.',
    gate: 'البوابة',
    entryAndExit: 'دخول وخروج',
    exitOnly: 'خروج فقط',
    lane: 'المسار',
    entry: 'دخول',
    exit: 'خروج',
    scanTitle: 'مسح تصريح',
    laneLabel: (gate, entry) => `${gate} · ${entry ? 'مسار الدخول' : 'مسار الخروج'}`,
    scanCamera: 'المسح بالكاميرا',
    paste: 'أو الصق رمزًا أو رابطًا',
    validate: 'التحقق من الرمز الملصق',
    opened: 'فُتح الحاجز (محاكاة)',
    closed: 'يبقى الحاجز مغلقًا',
    notNow: 'ليس الآن',
    arrivals: (count) => `الوصول المتوقع (${digitsIn(count, 'ar')})`,
    simulateTitle: 'محاكاة مسح',
    simulateNote: 'اختر أي تصريح تجريبي وامسحه عند البوابة أعلاه.',
    scanCurrent: 'مسح الرمز الحالي',
    scanReplaced: 'مسح الرمز القديم',
    exceptions: (count) => `الاستثناءات (${digitsIn(count, 'ar')})`,
    nothing: 'لا شيء يحتاج انتباهًا.',
    reassign: 'نقل إلى موقف آخر',
    reassigned: 'تم النقل إلى أقرب موقف شاغر.',
    resolveManually: 'حلّ يدوي',
    markHandled: 'تمت المعالجة',
    handled: 'تم التعليم كمُعالَج.',
    manualTitle: 'الحل اليدوي',
    manualNote: 'تصريح مفقود أو رمز غير مقروء أو جلسة عالقة. كل تجاوز يُسجَّل مع سببه.',
    noPlate: 'بدون لوحة',
    reason: 'السبب (يُسجَّل)',
    reasonPlaceholder: 'مثل: بطارية الهاتف فارغة، تم التحقق من الهوية',
    plateSeen: 'اللوحة عند البوابة',
    admitAt: (gate) => `سماح بالدخول عند ${gate}`,
    exitAt: (gate) => `تسجيل الخروج عند ${gate}`,
    movedOut: 'غادر موقف الشحن',
    released: 'أُفرج عن موقف الشحن. تبقى الزيارة مفتوحة حتى تخرج السيارة.',
    stopCharging: 'إيقاف الشحن',
    stopped: 'أوقف الأمن الشحن.',
    bayTitle: 'حالة المواقف',
    bayNote: 'صحّح موقفًا حالته خاطئة.',
    note: 'ملاحظة (تُسجَّل)',
    notePlaceholder: 'مثل: تم التحقق أثناء الجولة',
    occupancy: { occupied: 'مشغول', vacant: 'شاغر', unknown: 'غير معروف' },
    serviceability: { 'in-service': 'في الخدمة', maintenance: 'صيانة', 'out-of-service': 'خارج الخدمة' },
    nowState: (state) => `${state} (الآن)`,
    mark: (state) => `تعيين ${state}`,
    marked: (bay, state) => `تم تعيين ${bay} ${state}.`,
    logTitle: 'سجل البوابات',
    logOpened: 'فُتح',
    logRefused: 'رُفض',
    logTitleFor: (accepted, gate, entry) => `${accepted ? 'فُتح' : 'رُفض'} · ${entry ? 'دخول' : 'خروج'} ${gate}`,
    unknownPass: 'تصريح غير معروف',
    override: (reason) => `تجاوز: ${reason}`,
    arrivalChip: { due: 'متوقع', open: 'الدخول متاح', late: 'متأخر' },
    needsBay: 'يحتاج موقفًا',
    notification: {
      overdue: 'تجاوزت الزيارة وقتها',
      'reassignment-needed': 'حجز يحتاج موقفًا آخر',
      'charging-complete': 'اكتمل الشحن',
      'charger-fault': 'عطل في الشاحن',
      'no-show': 'لم يحضر الضيف',
      'help-request': 'زائر طلب المساعدة',
      entry: 'دخلت السيارة',
      exit: 'غادرت السيارة',
    },
  },
};

/** Where an expected arrival stands at the gate. */
export const arrivalTone: Record<ArrivalPhase, StatusTone> = { due: 'violet', open: 'teal', late: 'amber' };

export const needsBayTone: StatusTone = 'red';

/** Keeps "Gate 2" and "04:00 PM" on one line, so a narrow row breaks at the dots instead. */
export const keepTogether = (text: string) => text.replace(/(Gate|\d) (\d|AM|PM)/g, '$1 $2');

export function resultTone(result: ScanResult): 'success' | 'warning' | 'error' {
  if (result.outcome === 'accepted') return 'success';
  return result.outcome === 'already-processed' ? 'warning' : 'error';
}
