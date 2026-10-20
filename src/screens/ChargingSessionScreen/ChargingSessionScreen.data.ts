import { digitsIn, type Lang } from '../../services/parking/i18n';

interface ChargingCopy {
  title: string;
  demoValues: string;
  estimate: string;
  entryNote: string;
  bayNote: string;
  noSlot: string;
  energy: string;
  rate: string;
  progress: string;
  kwh: (value: number) => string;
  kw: (value: number) => string;
  target: (kwh: number) => string;
  until: (time: string) => string;
  finishAbout: (time: string) => string;
  waiting: string;
  inBay: string;
  plugIn: string;
  started: string;
  slotStarts: (time: string) => string;
  plugBy: (time: string) => string;
  stop: string;
  stopped: string;
  moveNow: string;
  ended: string;
  moveOut: (bay: string, by: string) => string;
  by: (time: string) => string;
  details: string;
  slot: string;
  bayReserved: string;
  leftBay: (time: string) => string;
  startedAt: string;
  endedAt: string;
  remaining: string;
  remainingValue: (kwh: number, duration: string) => string;
}

export const chargingCopy: Record<Lang, ChargingCopy> = {
  en: {
    title: 'Charging',
    demoValues: 'Simulated demo values: no charger is connected.',
    estimate:
      'Times are estimates. Actual charging depends on how much power the car accepts, the charger’s capacity and slower charging as the battery fills.',
    entryNote: 'Arriving at the gate doesn’t start charging. Plug in at your bay, then start the session here.',
    bayNote: 'Finishing charging doesn’t free the bay. It is released when the car leaves the bay or the compound.',
    noSlot: 'This booking has no charging slot.',
    energy: 'Energy delivered',
    rate: 'Charging rate',
    progress: 'Charging progress',
    kwh: (value) => `${value} kWh`,
    kw: (value) => `${value} kW`,
    target: (kwh) => `Target ${kwh} kWh`,
    until: (time) => `Charging until ${time}`,
    finishAbout: (time) => ` · expected to finish about ${time} (estimate)`,
    waiting: 'Waiting for the car to arrive.',
    inBay: 'Car is in the bay',
    plugIn: 'Plug in & start charging',
    started: 'Charging started.',
    slotStarts: (time) => `Your slot starts at ${time}.`,
    plugBy: (time) => `Plug in by ${time} to keep the slot.`,
    stop: 'Stop charging & unplug',
    stopped: 'Charging stopped. Please move the car out of the EV bay.',
    moveNow: 'Please move the car now',
    ended: 'Charging has ended',
    moveOut: (bay, by) => `Move the car out of ${bay}${by} so the next driver can charge.`,
    by: (time) => ` by ${time}`,
    details: 'Details',
    slot: 'Charging slot',
    bayReserved: 'Bay reserved',
    leftBay: (time) => `Left the bay at ${time}`,
    startedAt: 'Started',
    endedAt: 'Ended',
    remaining: 'Remaining (estimate)',
    remainingValue: (kwh, duration) => `${kwh.toFixed(1)} kWh · about ${duration}`,
  },
  ar: {
    title: 'الشحن',
    demoValues: 'قيم محاكاة للعرض: لا يوجد شاحن متصل.',
    estimate: 'الأوقات تقديرية. يعتمد الشحن الفعلي على القدرة التي تقبلها السيارة وسعة الشاحن وبطء الشحن مع امتلاء البطارية.',
    entryNote: 'الوصول إلى البوابة لا يبدأ الشحن. وصّل الشاحن في موقفك، ثم ابدأ الجلسة من هنا.',
    bayNote: 'انتهاء الشحن لا يُخلي الموقف. يُفرج عنه عندما تغادر السيارة الموقف أو المجمع.',
    noSlot: 'لا يوجد موعد شحن في هذا الحجز.',
    energy: 'الطاقة المشحونة',
    rate: 'قدرة الشحن',
    progress: 'تقدّم الشحن',
    kwh: (value) => `${digitsIn(value, 'ar')} كيلوواط ساعة`,
    kw: (value) => `${digitsIn(value, 'ar')} كيلوواط`,
    target: (kwh) => `الهدف ${digitsIn(kwh, 'ar')} كيلوواط ساعة`,
    until: (time) => `الشحن حتى ${time}`,
    finishAbout: (time) => ` · يُتوقع الانتهاء نحو ${time} (تقدير)`,
    waiting: 'بانتظار وصول السيارة.',
    inBay: 'السيارة في الموقف',
    plugIn: 'وصّل وابدأ الشحن',
    started: 'بدأ الشحن.',
    slotStarts: (time) => `يبدأ موعدك ${time}.`,
    plugBy: (time) => `وصّل قبل ${time} للاحتفاظ بالموعد.`,
    stop: 'إيقاف الشحن وفصل الشاحن',
    stopped: 'توقف الشحن. يُرجى نقل السيارة من موقف الشحن.',
    moveNow: 'يُرجى نقل السيارة الآن',
    ended: 'انتهى الشحن',
    moveOut: (bay, by) => `انقل السيارة من ${bay}${by} ليتمكن السائق التالي من الشحن.`,
    by: (time) => ` قبل ${time}`,
    details: 'التفاصيل',
    slot: 'موعد الشحن',
    bayReserved: 'الموقف محجوز',
    leftBay: (time) => `غادر الموقف ${time}`,
    startedAt: 'البداية',
    endedAt: 'النهاية',
    remaining: 'المتبقي (تقدير)',
    remainingValue: (kwh, duration) => `${digitsIn(kwh.toFixed(1), 'ar')} كيلوواط ساعة · نحو ${duration}`,
  },
};
