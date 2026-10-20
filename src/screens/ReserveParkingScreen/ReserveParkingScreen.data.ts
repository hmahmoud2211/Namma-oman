import { digitsIn, type Lang } from '../../services/parking/i18n';
import type { PolicySettings } from '../../services/parking/policy';
import { MINUTE_MS, siteDateKey, siteMinuteOfDay, siteToUtc, ms } from '../../services/parking/time';
import type { ConnectorType, ParkingDb, Reservation } from '../../services/parking/types';

/** Two steps: what and when, then where (and confirm). */
export type Step = 'details' | 'space';
export const STEPS: readonly Step[] = ['details', 'space'];

export interface ReserveCopy {
  steps: Record<Step, string>;
  stepOf: (index: number, total: number) => string;
  guestTitle: string;
  evTitle: string;
  editTitle: string;
  chooseTitle: string;
  noSpace: string;
  noSpaceDetail: string;
  autoConfirm: string;
  evDeparture: string;
  estimateNote: string;
  vehicleLater: string;
  vehicleLaterDetail: string;
  addContact: string;
  guest: string;
  yourVehicle: string;
  property: string;
  chargingFor: string;
  myVehicle: string;
  aVisitor: string;
  guestName: string;
  fullName: string;
  mobile: string;
  email: string;
  plate: string;
  platePlaceholder: string;
  electricVehicle: string;
  parking: string;
  visitorBay: string;
  evBay: string;
  when: string;
  siteTime: string;
  arrival: string;
  howLong: string;
  parkingUntil: string;
  departure: string;
  stay: (duration: string, nextDay: boolean) => string;
  charging: string;
  connector: string;
  chargingStarts: string;
  chargingEnds: string;
  onArrival: string;
  afterArrival: (duration: string) => string;
  ofCharging: (duration: string) => string;
  energy: string;
  untilSlotEnds: string;
  kwh: (value: string) => string;
  needName: string;
  needPlate: string;
  needVehicle: string;
  needConnector: string;
  checkDetails: string;
  saveFailed: string;
  editDetails: string;
  plateToFollow: string;
  chargingWindow: (from: string, to: string, connector: string) => string;
  edit: string;
  pickLost: (bay: string) => string;
  pickedInstead: (bay: string) => string;
  list: string;
  map: string;
  availableTitle: string;
  availableCount: (free: string, total: string, ev: boolean) => string;
  recommended: string;
  nearest: (rank: number, property: string) => string;
  selected: string;
  showFewer: string;
  showMore: (count: string) => string;
  notAvailable: (count: string) => string;
  unavailable: string;
  chargesOn: (bay: string, charger: string, estimate: string) => string;
  estimate: (kwh: string, duration: string, rate: string) => string;
  near: (building: string) => string;
  confirmBay: (bay: string, editing: boolean) => string;
  changeTime: string;
  findSpace: string;
  notEditableTitle: string;
  notEditableBody: string;
  notBookedTitle: string;
  pickAnother: string;
}

const ORDINALS_EN = ['Nearest', '2nd nearest', '3rd nearest'];
const ORDINALS_AR = ['الأقرب', 'ثاني أقرب', 'ثالث أقرب'];

export const reserveCopy: Record<Lang, ReserveCopy> = {
  en: {
    steps: { details: 'Visit details', space: 'Choose a space' },
    stepOf: (index, total) => `Step ${index} of ${total}`,
    guestTitle: 'Reserve Guest Parking',
    evTitle: 'Reserve EV Charging',
    editTitle: 'Edit Reservation',
    chooseTitle: 'Choose a space',
    noSpace: 'No bay is free for the whole time',
    noSpaceDetail: 'Try another time or date.',
    autoConfirm: 'Confirmed instantly if the space is still free for your whole visit when you confirm.',
    evDeparture:
      'Parking ends 15 minutes after charging by default. Book longer if you need the bay: it stays reserved for the whole stay.',
    estimateNote:
      'Charging times are estimates: they depend on how fast the car accepts charge, the charger’s capacity and slower charging near full.',
    vehicleLater: 'Visitor will add vehicle details',
    vehicleLaterDetail: 'They add the plate from their pass. Entry needs it.',
    addContact: 'Add mobile or email (optional)',
    guest: 'Guest',
    yourVehicle: 'Your vehicle',
    property: 'Property',
    chargingFor: 'Charging for',
    myVehicle: 'My vehicle',
    aVisitor: 'A visitor',
    guestName: 'Guest name',
    fullName: 'Full name',
    mobile: 'Mobile (optional)',
    email: 'Email (optional)',
    plate: 'Plate number',
    platePlaceholder: 'e.g. 4521 AB',
    electricVehicle: 'Electric vehicle',
    parking: 'Parking',
    visitorBay: 'Visitor bay',
    evBay: 'EV bay + charging',
    when: 'When',
    siteTime: 'Muscat time',
    arrival: 'Arrival',
    howLong: 'How long?',
    parkingUntil: 'Parking until',
    departure: 'Departure',
    stay: (duration, nextDay) => `${duration} stay${nextDay ? ' · ends next day' : ''}`,
    charging: 'Charging',
    connector: 'Connector',
    chargingStarts: 'Charging starts',
    chargingEnds: 'Charging ends',
    onArrival: 'On arrival',
    afterArrival: (duration) => `${duration} after arrival`,
    ofCharging: (duration) => `${duration} of charging`,
    energy: 'Energy to add (optional)',
    untilSlotEnds: 'Until slot ends',
    kwh: (value) => `${value} kWh`,
    needName: 'Enter your guest’s name.',
    needPlate: 'Enter the plate, or tick “Visitor will add vehicle details”.',
    needVehicle: 'Choose the vehicle to charge.',
    needConnector: 'Choose the connector the car needs.',
    checkDetails: 'Check the details and try again.',
    saveFailed: 'Could not save the booking. Please try again.',
    editDetails: 'Edit visit details',
    plateToFollow: 'plate to follow',
    chargingWindow: (from, to, connector) => `Charging ${from}–${to} · ${connector}`,
    edit: 'Edit',
    pickLost: (bay) => `${bay} isn’t free for the new time`,
    pickedInstead: (bay) => `${bay} is selected instead.`,
    list: 'List',
    map: 'Map',
    availableTitle: 'Available for your visit',
    availableCount: (free, total, ev) => `${free} of ${total} ${ev ? 'EV bays' : 'visitor bays'} are free the whole time`,
    recommended: ' · Recommended',
    nearest: (rank, property) => `${ORDINALS_EN[rank] ?? `${rank + 1}th nearest`} to ${property}`,
    selected: 'Selected',
    showFewer: 'Show fewer',
    showMore: (count) => `Show ${count} more`,
    notAvailable: (count) => `${count} bays not available for this time`,
    unavailable: 'Unavailable',
    chargesOn: (bay, charger, estimate) => `${bay} charges on ${charger}${estimate}.`,
    estimate: (kwh, duration, rate) => `: ${kwh} kWh in about ${duration} at ~${rate} kW`,
    near: (building) => `Near ${building}`,
    confirmBay: (bay, editing) => `${editing ? 'Save' : 'Confirm'} ${bay}`,
    changeTime: 'Change the time',
    findSpace: 'Find a space',
    notEditableTitle: 'This booking can no longer be edited',
    notEditableBody: 'Only upcoming bookings can be changed.',
    notBookedTitle: 'Not booked yet',
    pickAnother: 'Pick another space',
  },
  ar: {
    steps: { details: 'تفاصيل الزيارة', space: 'اختر موقفًا' },
    stepOf: (index, total) => `الخطوة ${digitsIn(index, 'ar')} من ${digitsIn(total, 'ar')}`,
    guestTitle: 'حجز موقف لضيف',
    evTitle: 'حجز شحن سيارة كهربائية',
    editTitle: 'تعديل الحجز',
    chooseTitle: 'اختر موقفًا',
    noSpace: 'لا يوجد موقف شاغر طوال الوقت',
    noSpaceDetail: 'جرّب وقتًا أو تاريخًا آخر.',
    autoConfirm: 'يُؤكَّد الحجز فورًا إذا بقي الموقف شاغرًا طوال زيارتك عند التأكيد.',
    evDeparture: 'ينتهي الوقوف افتراضيًا بعد ١٥ دقيقة من انتهاء الشحن. احجز مدة أطول إن احتجت الموقف: يبقى محجوزًا طوال المدة.',
    estimateNote: 'أوقات الشحن تقديرية: تعتمد على سرعة قبول السيارة للشحن وقدرة الشاحن وبطء الشحن قرب الامتلاء.',
    vehicleLater: 'سيضيف الزائر بيانات المركبة',
    vehicleLaterDetail: 'يضيف رقم اللوحة من تصريحه. الدخول يتطلبه.',
    addContact: 'إضافة رقم الجوال أو البريد (اختياري)',
    guest: 'الضيف',
    yourVehicle: 'سيارتك',
    property: 'الوحدة',
    chargingFor: 'الشحن لـ',
    myVehicle: 'سيارتي',
    aVisitor: 'زائر',
    guestName: 'اسم الضيف',
    fullName: 'الاسم الكامل',
    mobile: 'الجوال (اختياري)',
    email: 'البريد الإلكتروني (اختياري)',
    plate: 'رقم اللوحة',
    platePlaceholder: 'مثل 4521 AB',
    electricVehicle: 'السيارة الكهربائية',
    parking: 'الموقف',
    visitorBay: 'موقف زوار',
    evBay: 'موقف شحن + شحن',
    when: 'الموعد',
    siteTime: 'بتوقيت مسقط',
    arrival: 'الوصول',
    howLong: 'المدة',
    parkingUntil: 'الوقوف حتى',
    departure: 'المغادرة',
    stay: (duration, nextDay) => `مدة الوقوف ${duration}${nextDay ? ' · تنتهي في اليوم التالي' : ''}`,
    charging: 'الشحن',
    connector: 'الموصّل',
    chargingStarts: 'بداية الشحن',
    chargingEnds: 'نهاية الشحن',
    onArrival: 'عند الوصول',
    afterArrival: (duration) => `بعد الوصول بـ ${duration}`,
    ofCharging: (duration) => `شحن لمدة ${duration}`,
    energy: 'الطاقة المطلوبة (اختياري)',
    untilSlotEnds: 'حتى نهاية الموعد',
    kwh: (value) => `${digitsIn(value, 'ar')} كيلوواط ساعة`,
    needName: 'اكتب اسم ضيفك.',
    needPlate: 'اكتب رقم اللوحة، أو اختر «سيضيف الزائر بيانات المركبة».',
    needVehicle: 'اختر السيارة المراد شحنها.',
    needConnector: 'اختر الموصّل الذي تحتاجه السيارة.',
    checkDetails: 'تحقّق من البيانات وحاول مرة أخرى.',
    saveFailed: 'تعذّر حفظ الحجز. حاول مرة أخرى.',
    editDetails: 'تعديل تفاصيل الزيارة',
    plateToFollow: 'اللوحة لاحقًا',
    chargingWindow: (from, to, connector) => `الشحن ${from}–${to} · ${connector}`,
    edit: 'تعديل',
    pickLost: (bay) => `${bay} غير شاغر في الوقت الجديد`,
    pickedInstead: (bay) => `تم اختيار ${bay} بدلًا منه.`,
    list: 'قائمة',
    map: 'خريطة',
    availableTitle: 'متاح لزيارتك',
    availableCount: (free, total, ev) => `${free} من ${total} ${ev ? 'مواقف شحن' : 'مواقف زوار'} شاغرة طوال الوقت`,
    recommended: ' · مقترح',
    nearest: (rank, property) => `${ORDINALS_AR[rank] ?? `الأقرب رقم ${digitsIn(rank + 1, 'ar')}`} إلى ${property}`,
    selected: 'محدد',
    showFewer: 'عرض أقل',
    showMore: (count) => `عرض ${count} أخرى`,
    notAvailable: (count) => `${count} مواقف غير متاحة في هذا الوقت`,
    unavailable: 'غير متاح',
    chargesOn: (bay, charger, estimate) => `${bay} يُشحن على ${charger}${estimate}.`,
    estimate: (kwh, duration, rate) => `: ${kwh} كيلوواط ساعة في نحو ${duration} بقدرة ~${rate} كيلوواط`,
    near: (building) => `بجوار ${building}`,
    confirmBay: (bay, editing) => `${editing ? 'حفظ' : 'تأكيد'} ${bay}`,
    changeTime: 'تغيير الوقت',
    findSpace: 'ابحث عن موقف',
    notEditableTitle: 'لم يعد بالإمكان تعديل هذا الحجز',
    notEditableBody: 'يمكن تغيير الحجوزات القادمة فقط.',
    notBookedTitle: 'لم يتم الحجز بعد',
    pickAnother: 'اختر موقفًا آخر',
  },
};

/** Quick choices for the length of a visitor stay, in minutes. */
export const STAY_PRESETS = [60, 120, 180, 240, 360, 480] as const;

/** Bays listed before "Show more". */
export const LIST_PREVIEW = 3;

export const CONNECTORS: readonly ConnectorType[] = ['Type 2', 'CCS2', 'CHAdeMO', 'GB/T'];
export const ENERGY_TARGETS = ['none', '10', '20', '30', '40'] as const;

export interface ReserveForm {
  propertyId: string;
  bookedFor: 'guest' | 'resident';
  parkingType: 'standard' | 'ev';
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  plate: string;
  visitorAddsVehicle: boolean;
  vehicleId: string | null;
  /** Muscat calendar date of arrival. */
  dateKey: string;
  /** Minutes after Muscat midnight. */
  arrivalMin: number;
  /** Length of the parking stay. */
  stayMin: number;
  /** EV only: charging start, minutes after arrival, and its length. */
  chargeOffsetMin: number;
  chargeMin: number;
  /** Departure follows the charging end until the user moves it. */
  stayFollowsCharging: boolean;
  connectorType: ConnectorType | null;
  targetKwh: (typeof ENERGY_TARGETS)[number];
  spaceId: string | null;
}

/** The next booking slot at or after `now`. */
export function nextSlot(now: number, policy: PolicySettings): number {
  const slot = policy.slotMinutes * MINUTE_MS;
  return Math.ceil(now / slot) * slot;
}

export function startOf(form: ReserveForm): number {
  return siteToUtc(form.dateKey, form.arrivalMin);
}

export function endOf(form: ReserveForm): number {
  return startOf(form) + form.stayMin * MINUTE_MS;
}

export function chargingWindow(form: ReserveForm) {
  const start = startOf(form) + form.chargeOffsetMin * MINUTE_MS;
  return { start, end: start + form.chargeMin * MINUTE_MS };
}

export function initialForm(
  db: ParkingDb,
  now: number,
  mode: 'guest' | 'ev',
  propertyIds: string[],
  editing?: Reservation,
): ReserveForm {
  const policy = db.policy;
  if (editing) {
    const allocation = db.allocations.find((a) => a.id === editing.chargingAllocationId);
    const connector = db.connectors.find((c) => c.id === allocation?.connectorId);
    const start = ms(editing.scheduledStart);
    return {
      propertyId: editing.propertyId,
      bookedFor: editing.bookedFor,
      parkingType: editing.parkingType,
      guestName: editing.guest?.name ?? '',
      guestPhone: editing.guest?.phone ?? '',
      guestEmail: editing.guest?.email ?? '',
      plate: editing.vehiclePlate ?? '',
      visitorAddsVehicle: !editing.vehiclePlate,
      vehicleId: editing.vehicleId ?? null,
      dateKey: siteDateKey(start),
      arrivalMin: siteMinuteOfDay(start),
      stayMin: Math.round((ms(editing.scheduledEnd) - start) / MINUTE_MS),
      chargeOffsetMin: allocation ? Math.round((ms(allocation.start) - start) / MINUTE_MS) : 0,
      chargeMin: allocation ? Math.round((ms(allocation.end) - ms(allocation.start)) / MINUTE_MS) : 120,
      stayFollowsCharging: false,
      connectorType: connector?.type ?? null,
      targetKwh: allocation?.targetKwh ? (String(allocation.targetKwh) as ReserveForm['targetKwh']) : 'none',
      spaceId: editing.spaceId,
    };
  }
  const slot = nextSlot(now, policy);
  const isEv = mode === 'ev';
  return {
    propertyId: propertyIds[0] ?? '',
    bookedFor: isEv ? 'resident' : 'guest',
    parkingType: isEv ? 'ev' : 'standard',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    plate: '',
    visitorAddsVehicle: false,
    vehicleId: null,
    dateKey: siteDateKey(slot),
    arrivalMin: siteMinuteOfDay(slot),
    stayMin: isEv ? 120 + policy.evMoveOutBufferMinutes : 180,
    chargeOffsetMin: 0,
    chargeMin: 120,
    stayFollowsCharging: true,
    connectorType: null,
    targetKwh: 'none',
    spaceId: null,
  };
}
