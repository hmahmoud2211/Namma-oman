/**
 * Following a guest's visit, from records the demo already keeps: the
 * booking, the owner sharing the pass, gate scans, bay occupancy, charging
 * and the exit. Nothing here is stored; it is all read back from those
 * records at a clock reading, so the owner's tracker and the security
 * console always agree with the gate log.
 */
import { isOverdue } from './availability';
import { projectSession } from './charging';
import { dateTimeIn, digitsIn, durationIn, gateNameIn, nameIn, timeIn, type Lang } from './i18n';
import { MINUTE_MS, ms } from './time';
import type { ParkingDb, Reservation } from './types';

/** How the owner handed the pass on. None of these confirms delivery. */
export type ShareChannel = 'whatsapp' | 'share' | 'copy';

export const shareChannelLabel: Record<ShareChannel, string> = {
  whatsapp: 'WhatsApp',
  share: 'the share menu',
  copy: 'a copied link',
};

const shareChannelAr: Record<ShareChannel, string> = {
  whatsapp: 'واتساب',
  share: 'قائمة المشاركة',
  copy: 'رابط منسوخ',
};

export type TrackState = 'done' | 'current' | 'upcoming' | 'problem';

export interface TrackStep {
  key: 'booked' | 'shared' | 'arrived' | 'parked' | 'left' | 'ended';
  title: string;
  detail?: string;
  state: TrackState;
  /** An Ionicons glyph. */
  icon: string;
}

export interface GuestTracker {
  /** One line on where things stand now. */
  headline: string;
  tone: 'info' | 'success' | 'warning' | 'error';
  steps: TrackStep[];
}

const gateShort = (db: ParkingDb, id: string | undefined, lang: Lang) =>
  id && db.gates.some((g) => g.id === id) ? gateNameIn(id, lang, true) : lang === 'ar' ? 'البوابة' : 'the gate';

const minutesBetween = (a: number, b: number) => Math.round(Math.abs(a - b) / MINUTE_MS);

/** The milestones of one visit, and a headline for where it stands now, worded in `lang`. */
export function guestTracker(db: ParkingDb, r: Reservation, now: number, lang: Lang = 'en'): GuestTracker {
  const ar = lang === 'ar';
  const time = (value: string | number) => timeIn(value, lang);
  const n = (value: number) => digitsIn(value, lang);
  const space = db.spaces.find((s) => s.id === r.spaceId)!;
  const zone = db.zones.find((z) => z.id === space.zoneId);
  const zoneLine = zone ? `${nameIn(zone.name, lang)}${ar ? '، ' : ', '}${nameIn(zone.level, lang)}` : '';
  const start = ms(r.scheduledStart);
  const end = ms(r.scheduledEnd);
  const opensAt = start - db.policy.earlyArrivalMinutes * MINUTE_MS;
  const holdUntil = start + db.policy.lateArrivalGraceMinutes * MINUTE_MS;
  const who = r.guest?.name ?? (ar ? 'سيارتك' : 'Your vehicle');
  const steps: TrackStep[] = [];

  const created = db.audit.find((a) => a.entityId === r.id && a.action === 'reservation.created');
  steps.push({
    key: 'booked',
    title: ar ? 'تم الحجز' : 'Booked',
    detail: `${dateTimeIn(created?.at ?? r.createdAt, lang)} · ${space.label}`,
    state: 'done',
    icon: 'calendar-outline',
  });

  if (r.bookedFor === 'guest') {
    const shares = db.audit.filter((a) => a.entityId === r.id && a.action === 'pass.shared');
    const last = shares[shares.length - 1];
    const channel = last?.details as ShareChannel | undefined;
    if (last && channel) {
      steps.push({
        key: 'shared',
        title: ar ? 'تمت مشاركة التصريح' : 'Pass shared',
        detail: ar
          ? `عبر ${shareChannelAr[channel] ?? channel} الساعة ${time(last.at)}. لا يمكن تأكيد الاستلام.`
          : `Through ${shareChannelLabel[channel] ?? channel} at ${time(last.at)}. Delivery isn’t confirmed.`,
        state: 'done',
        icon: 'paper-plane-outline',
      });
    } else if (r.status === 'confirmed') {
      // Only worth saying before the visit: a guest who came in had the pass somehow.
      steps.push({
        key: 'shared',
        title: ar ? 'لم تتم مشاركة التصريح بعد' : 'Pass not shared yet',
        detail: ar ? 'أرسله عبر واتساب من هذه الصفحة.' : 'Send it on WhatsApp from this page.',
        state: 'upcoming',
        icon: 'paper-plane-outline',
      });
    }
  }

  if (r.status === 'cancelled') {
    steps.push({
      key: 'ended',
      title: ar ? 'أُلغي' : 'Cancelled',
      detail: dateTimeIn(r.cancelledAt ?? r.updatedAt, lang),
      state: 'problem',
      icon: 'close-circle-outline',
    });
    return { headline: ar ? 'أُلغي الحجز. لم يعد التصريح صالحًا.' : 'Cancelled. The pass no longer works.', tone: 'info', steps };
  }
  if (r.status === 'no-show') {
    const grace = db.policy.lateArrivalGraceMinutes;
    steps.push({
      key: 'ended',
      title: ar ? 'لم يحضر' : 'Didn’t arrive',
      detail: ar
        ? `انتهى الحجز الساعة ${time(r.noShowAt ?? holdUntil)}، بعد ${n(grace)} دقيقة من موعد الوصول.`
        : `The booking expired at ${time(r.noShowAt ?? holdUntil)}, ${grace} minutes after the booked arrival.`,
      state: 'problem',
      icon: 'person-remove-outline',
    });
    return { headline: ar ? `${who} لم يحضر.` : `${who} didn’t arrive.`, tone: 'warning', steps };
  }

  // Arrival at the gate.
  let headline: string;
  let tone: GuestTracker['tone'] = 'info';
  if (r.actualEntryAt) {
    const entered = ms(r.actualEntryAt);
    const early = entered < start;
    const offset = minutesBetween(entered, start);
    const timing = ar
      ? offset >= 1
        ? ` · ${early ? 'مبكرًا' : 'متأخرًا'} ${n(offset)} د`
        : ' · في الموعد'
      : offset >= 1
        ? ` · ${offset} min ${early ? 'early' : 'late'}`
        : ' · on time';
    steps.push({
      key: 'arrived',
      title: ar ? `وصل عبر ${gateShort(db, r.entryGateId, lang)}` : `Arrived at ${gateShort(db, r.entryGateId, lang)}`,
      detail: `${time(entered)}${timing}`,
      state: 'done',
      icon: 'enter-outline',
    });
  } else if (now < opensAt) {
    steps.push({
      key: 'arrived',
      title: ar ? 'الوصول المتوقع' : 'Expected to arrive',
      detail: ar
        ? `${time(start)} عبر ${gateShort(db, space.gateId, lang)} · تفتح البوابة له الساعة ${time(opensAt)}`
        : `${time(start)} at ${gateShort(db, space.gateId, lang)} · the gate opens for them at ${time(opensAt)}`,
      state: 'current',
      icon: 'enter-outline',
    });
  } else if (now <= start) {
    steps.push({
      key: 'arrived',
      title: ar ? 'متوقع الآن' : 'Expected now',
      detail: ar
        ? `${gateShort(db, space.gateId, lang)} تسمح بالدخول من الآن · الموعد ${time(start)}`
        : `${gateShort(db, space.gateId, lang)} lets them in from now · due ${time(start)}`,
      state: 'current',
      icon: 'enter-outline',
    });
  } else {
    steps.push({
      key: 'arrived',
      title: ar ? 'متأخر' : 'Running late',
      detail: ar
        ? `متأخر ${n(minutesBetween(now, start))} د · الموقف محجوز حتى ${time(holdUntil)}`
        : `${minutesBetween(now, start)} min late · the bay is held until ${time(holdUntil)}`,
      state: 'problem',
      icon: 'enter-outline',
    });
  }

  // In the bay.
  const charging = db.chargingSessions.find((s) => s.reservationId === r.id);
  let chargingNote = '';
  if (charging && charging.state !== 'reserved') {
    if (charging.state === 'charging') {
      const kwh = projectSession(db, charging, now).energyKwh;
      chargingNote = ar ? ` · جارٍ الشحن، ${n(kwh)} كيلوواط ساعة حتى الآن` : ` · charging, ${kwh} kWh so far`;
    } else if (charging.state === 'waiting-for-plug-in') {
      chargingNote = ar ? ' · لم يتم التوصيل بعد' : ' · not plugged in yet';
    } else {
      chargingNote = ar ? ` · انتهى الشحن، ${n(charging.energyKwh)} كيلوواط ساعة` : ` · charging ended, ${charging.energyKwh} kWh`;
    }
  }
  const overdue = isOverdue(r, now);
  if (r.status === 'checked-in' || r.status === 'completed') {
    if (r.bayVacatedAt) {
      steps.push({
        key: 'parked',
        title: ar ? `وقف في ${space.label}` : `Parked in ${space.label}`,
        detail: ar ? `غادر الموقف الساعة ${time(r.bayVacatedAt)}${chargingNote}` : `Left the bay at ${time(r.bayVacatedAt)}${chargingNote}`,
        state: 'done',
        icon: 'car-outline',
      });
    } else if (overdue) {
      steps.push({
        key: 'parked',
        title: ar ? `ما زال في ${space.label}` : `Still in ${space.label}`,
        detail: ar
          ? `محجوز حتى ${time(end)} · تجاوز بـ ${durationIn((now - end) / MINUTE_MS, lang)}${chargingNote}`
          : `Booked until ${time(end)} · ${durationIn((now - end) / MINUTE_MS, lang)} over${chargingNote}`,
        state: 'problem',
        icon: 'car-outline',
      });
    } else {
      steps.push({
        key: 'parked',
        title: ar ? `وقف في ${space.label}` : `Parked in ${space.label}`,
        detail: ar ? `${zoneLine} · منذ ${time(r.actualEntryAt!)}${chargingNote}` : `${zoneLine} · since ${time(r.actualEntryAt!)}${chargingNote}`,
        state: 'done',
        icon: 'car-outline',
      });
    }
  } else {
    steps.push({
      key: 'parked',
      title: ar ? `يقف في ${space.label}` : `Park in ${space.label}`,
      detail: zoneLine,
      state: 'upcoming',
      icon: 'car-outline',
    });
  }

  // Leaving.
  if (r.actualExitAt) {
    steps.push({
      key: 'left',
      title: ar ? `غادر عبر ${gateShort(db, r.exitGateId, lang)}` : `Left by ${gateShort(db, r.exitGateId, lang)}`,
      detail: time(r.actualExitAt),
      state: 'done',
      icon: 'exit-outline',
    });
  } else {
    steps.push({
      key: 'left',
      title: ar ? 'المغادرة' : 'Leaves',
      detail: ar ? `محجوز حتى ${time(end)}` : `Booked until ${time(end)}`,
      state: r.status === 'checked-in' && !overdue ? 'current' : 'upcoming',
      icon: 'exit-outline',
    });
  }

  if (r.status === 'completed') {
    headline = ar ? `${who} غادر الساعة ${time(r.actualExitAt!)}.` : `${who} left at ${time(r.actualExitAt!)}.`;
    tone = 'success';
  } else if (r.status === 'checked-in') {
    headline = overdue
      ? ar
        ? `${who} ما زال في الموقف بعد الوقت المحجوز.`
        : `${who} is still parked, past the booked time.`
      : ar
        ? `${who} في المجمع، في ${space.label}.`
        : `${who} is on site, in ${space.label}.`;
    tone = overdue ? 'error' : 'success';
  } else if (now > start) {
    headline = ar ? `${who} متأخر.` : `${who} is running late.`;
    tone = 'warning';
  } else {
    headline = ar ? `${who} متوقع الساعة ${time(start)}.` : `${who} is expected at ${time(start)}.`;
  }
  if (r.needsReassignment && r.status === 'confirmed') {
    headline = ar ? `${headline} يجب تغيير الموقف.` : `${headline} The bay needs changing.`;
    tone = 'warning';
  }
  return { headline, tone, steps };
}

/* ------------------------------------------------------- Expected arrivals */

export type ArrivalPhase = 'due' | 'open' | 'late';

export interface ExpectedArrival {
  reservationId: string;
  name: string;
  plate?: string;
  spaceLabel: string;
  zoneName: string;
  gateId: string;
  start: number;
  phase: ArrivalPhase;
  /** "Due in 25 min · gate opens 1:30 PM". */
  when: string;
  /** The booking needs another bay before they arrive. */
  needsBay: boolean;
  ev: boolean;
}

/**
 * Bookings security should expect: those due within `lookaheadMinutes`, and
 * any already late but still inside their grace period. Soonest first.
 */
export function expectedArrivals(db: ParkingDb, now: number, lookaheadMinutes = 60, lang: Lang = 'en'): ExpectedArrival[] {
  const { earlyArrivalMinutes, lateArrivalGraceMinutes } = db.policy;
  const ar = lang === 'ar';
  const time = (value: number) => timeIn(value, lang);
  const duration = (minutes: number) => durationIn(minutes, lang);
  return db.reservations
    .filter((r) => r.status === 'confirmed')
    .map((r) => ({ r, start: ms(r.scheduledStart) }))
    .filter(({ start }) => start <= now + lookaheadMinutes * MINUTE_MS && now <= start + lateArrivalGraceMinutes * MINUTE_MS)
    .sort((a, b) => a.start - b.start)
    .map(({ r, start }) => {
      const space = db.spaces.find((s) => s.id === r.spaceId)!;
      const zone = db.zones.find((z) => z.id === space.zoneId);
      const opensAt = start - earlyArrivalMinutes * MINUTE_MS;
      const phase: ArrivalPhase = now < opensAt ? 'due' : now <= start ? 'open' : 'late';
      const heldUntil = start + lateArrivalGraceMinutes * MINUTE_MS;
      const when = ar
        ? phase === 'due'
          ? `بعد ${duration((start - now) / MINUTE_MS)} · يبدأ الدخول ${time(opensAt)}`
          : phase === 'open'
            ? `الدخول متاح · الموعد ${time(start)}`
            : `متأخر ${duration((now - start) / MINUTE_MS)} · محجوز حتى ${time(heldUntil)}`
        : phase === 'due'
          ? `Due in ${duration((start - now) / MINUTE_MS)} · entry opens ${time(opensAt)}`
          : phase === 'open'
            ? `Entry open · due ${time(start)}`
            : `${duration((now - start) / MINUTE_MS)} late · held until ${time(heldUntil)}`;
      const vehicle = db.vehicles.find((v) => v.id === r.vehicleId);
      const resident = ar ? 'ساكن' : 'Resident';
      return {
        reservationId: r.id,
        name: r.guest?.name ?? (vehicle ? `${resident} · ${vehicle.make} ${vehicle.model}` : resident),
        plate: r.vehiclePlate,
        spaceLabel: space.label,
        zoneName: zone ? nameIn(zone.name, lang) : '',
        gateId: space.gateId,
        start,
        phase,
        when,
        needsBay: Boolean(r.needsReassignment),
        ev: r.parkingType === 'ev',
      };
    });
}
