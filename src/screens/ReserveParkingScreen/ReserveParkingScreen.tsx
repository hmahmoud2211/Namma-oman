import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, type ScrollViewInstance } from 'react-native';

import { AppText } from '../../components/parking/compat/AppText';
import { CheckRow, ChipGroup, Field, Stepper, type ChipOption } from '../../components/parking/Controls';
import { Notice } from '../../components/parking/Notice';
import { Panel } from '../../components/parking/Panel';
import { ParkingButton } from '../../components/parking/ParkingButton';
import { ParkingFrame } from '../../components/parking/ParkingFrame';
import { ListRow } from '../../components/parking/Rows';
import { SiteMap, type BayMark } from '../../components/parking/site-map/SiteMap';
import { useAppTheme } from '../../components/parking/compat/theme';
import { useParkingLang } from '../../components/parking/useParkingLang';
import { useParking } from '../../hooks/useParking';
import { searchSpaces, type SpaceOption } from '../../services/parking/availability';
import { chargingRateKw } from '../../services/parking/charging';
import { validateRequest, type ReservationInput } from '../../services/parking/reservations';
import { findReservation, myParking } from '../../services/parking/selectors';
import {
  chargerNameIn,
  digitsIn,
  durationIn,
  minuteOfDayIn,
  nameIn,
  parkingErrorIn,
  plateIn,
  propertyIn,
  rangeIn,
  reasonIn,
  relativeDayIn,
  timeIn,
} from '../../services/parking/i18n';
import { addDaysToKey, siteDateKey, siteMinuteOfDay, ms } from '../../services/parking/time';
import { ParkingError } from '../../services/parking/tx';
import type { RootStackScreenProps } from '../../types/navigation.types';
import {
  CONNECTORS,
  ENERGY_TARGETS,
  LIST_PREVIEW,
  STAY_PRESETS,
  STEPS,
  chargingWindow,
  endOf,
  initialForm,
  nextSlot,
  reserveCopy,
  startOf,
  type ReserveForm,
  type Step,
} from './ReserveParkingScreen.data';
import { createStyles } from './ReserveParkingScreen.styles';

/**
 * Booking in two steps: who and when on one page, then the space (list or
 * site map) with a confirm button. Also used to edit an upcoming booking.
 */
export function ReserveParkingScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<RootStackScreenProps<'ReserveParking'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'ReserveParking'>['route']>();
  // Opened bare (/parking/reserve, or a refresh), it books a guest.
  const params: RootStackScreenProps<'ReserveParking'>['route']['params'] = route.params ?? { mode: 'guest' };
  const { db, now, residentId, service } = useParking();
  const lang = useParkingLang();
  const copy = reserveCopy[lang];
  const time = (value: number) => timeIn(value, lang);
  const duration = (minutes: number) => durationIn(minutes, lang);
  const n = (value: number) => digitsIn(value, lang);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const editing = useMemo(() => findReservation(db, params.reservationId), [db, params.reservationId]);
  // The version the edit started from: a change elsewhere in the meantime is refused, not overwritten.
  const [editVersion] = useState(() => editing?.version);
  const mine = useMemo(() => myParking(db, residentId), [db, residentId]);
  const policy = db.policy;
  const mode = editing ? (editing.parkingType === 'ev' ? 'ev' : 'guest') : params.mode;

  const [form, setForm] = useState<ReserveForm>(() => initialForm(db, now, mode, mine.properties.map((p) => p.id), editing));
  const [step, setStep] = useState<Step>('details');
  const [error, setError] = useState<{ message: string; code?: string; field?: 'name' | 'plate' } | null>(null);
  // The map leads: residents pick by where the bay is. The list is one tap away.
  const [view, setView] = useState<'list' | 'map'>('map');
  const [showAll, setShowAll] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showContact, setShowContact] = useState(() => Boolean(editing?.guest?.phone || editing?.guest?.email));
  const [busy, setBusy] = useState(false);

  const moveOutBuffer = policy.evMoveOutBufferMinutes;
  const update = (patch: Partial<ReserveForm>) => {
    setForm((current) => {
      const next = { ...current, ...patch };
      if (next.parkingType === 'ev' && next.stayFollowsCharging) {
        next.stayMin = next.chargeOffsetMin + next.chargeMin + moveOutBuffer;
      }
      return next;
    });
    setError(null);
  };

  const isEv = form.parkingType === 'ev';
  const isGuest = form.bookedFor === 'guest';
  const evVehicles = mine.vehicles.filter((v) => v.ev);
  const vehicle = evVehicles.find((v) => v.id === form.vehicleId);
  const start = startOf(form);
  const end = endOf(form);
  const { start: chargeStart, end: chargeEnd } = chargingWindow(form);
  const property = db.properties.find((p) => p.id === form.propertyId);

  const toInput = (spaceId: string): ReservationInput => ({
    propertyId: form.propertyId,
    residentId,
    bookedFor: form.bookedFor,
    guest: isGuest ? { name: form.guestName, phone: form.guestPhone || undefined, email: form.guestEmail || undefined } : undefined,
    vehiclePlate: isGuest ? (form.visitorAddsVehicle ? undefined : form.plate) : vehicle?.plate,
    vehicleId: isGuest ? undefined : vehicle?.id,
    parkingType: form.parkingType,
    start,
    end,
    spaceId,
    charging:
      isEv && form.connectorType
        ? {
            connectorType: form.connectorType,
            start: chargeStart,
            end: chargeEnd,
            targetKwh: form.targetKwh === 'none' ? undefined : Number(form.targetKwh),
          }
        : undefined,
  });

  // Re-run on every render: it is cheap, and bookings or the clock may have moved.
  const options =
    step === 'space'
      ? searchSpaces(
          db,
          {
            propertyId: form.propertyId,
            kind: isEv ? 'ev' : 'visitor',
            start,
            end,
            connectorType: form.connectorType ?? undefined,
            chargingStart: isEv ? chargeStart : undefined,
            chargingEnd: isEv ? chargeEnd : undefined,
            excludeReservationId: editing?.id,
          },
          now,
        )
      : [];
  const available = options.filter((o) => o.available);
  const unavailable = options.filter((o) => !o.available);
  const recommended = available[0];
  // The resident's pick (or, when editing, the booking's own bay) while it is free
  // for the whole time; otherwise the recommended, nearest free space.
  const picked = form.spaceId ? options.find((o) => o.space.id === form.spaceId && o.available) : undefined;
  const chosen = picked ?? recommended;
  const pickedLabel = db.spaces.find((sp) => sp.id === form.spaceId)?.label;
  const pickLost = Boolean(form.spaceId) && !picked && options.length > 0;

  /* -------------------------------------------------------- Navigation */

  const goTo = (next: Step) => {
    setError(null);
    setStep(next);
  };
  // Each step starts at the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [step]);

  const validateDetails = (): { message: string; field?: 'name' | 'plate' } | null => {
    if (isGuest && !form.guestName.trim()) return { message: copy.needName, field: 'name' };
    if (isGuest && !form.visitorAddsVehicle && !form.plate.trim()) {
      return { message: copy.needPlate, field: 'plate' };
    }
    if (!isGuest && !vehicle) return { message: copy.needVehicle };
    if (isEv && !form.connectorType) return { message: copy.needConnector };
    try {
      validateRequest(db, toInput(form.spaceId ?? ''), now, editing?.id);
      return null;
    } catch (e) {
      return { message: e instanceof ParkingError ? parkingErrorIn(e, lang) : copy.checkDetails };
    }
  };

  const findSpace = () => {
    const problem = validateDetails();
    if (problem) {
      setError(problem);
      return;
    }
    setShowAll(false);
    goTo('space');
  };

  const back = () => (step === 'details' ? navigation.goBack() : goTo('details'));

  const confirm = async () => {
    if (!chosen) return;
    setBusy(true);
    setError(null);
    try {
      const input = toInput(chosen.space.id);
      const saved = editing
        ? await service.editReservation(
            editing.id,
            {
              start: input.start,
              end: input.end,
              spaceId: input.spaceId,
              guest: input.guest,
              vehiclePlate: input.vehiclePlate ?? '',
              charging: input.charging,
            },
            editVersion,
          )
        : await service.createReservation(input);
      navigation.replace(
        'ReservationDetails',
        editing ? { reservationId: saved.id, justEdited: true } : { reservationId: saved.id, justBooked: true },
      );
    } catch (e) {
      const err = e instanceof ParkingError ? e : null;
      setError({ message: err ? parkingErrorIn(err, lang) : copy.saveFailed, code: err?.code });
      setBusy(false);
    }
  };

  /* ------------------------------------------------------ Time controls */

  // The earliest arrival on a date: the next slot today, or the booking's own start when editing.
  const earliest = Math.min(nextSlot(now, policy), editing ? ms(editing.scheduledStart) : Number.POSITIVE_INFINITY);
  const earliestArrivalOn = (dateKey: string) => {
    const floorKey = siteDateKey(earliest);
    if (dateKey === floorKey) return siteMinuteOfDay(earliest);
    return dateKey < floorKey ? 24 * 60 : 0;
  };
  const minArrival = earliestArrivalOn(form.dateKey);
  const today = siteDateKey(now);
  const dateOptions: ChipOption<string>[] = Array.from({ length: policy.bookingHorizonDays }, (_, i) => {
    const key = addDaysToKey(today, i);
    return { value: key, label: relativeDayIn(key, now, lang), disabled: earliestArrivalOn(key) >= 24 * 60 };
  });
  const slot = policy.slotMinutes;
  const maxStay = isEv ? policy.maxEvParkingDurationMinutes : policy.maxStandardDurationMinutes;
  const minStay = isEv ? form.chargeOffsetMin + form.chargeMin : 30;
  const crossesDay = siteDateKey(end) !== form.dateKey;

  /* ---------------------------------------------------------- Step 1 */

  const title = editing ? copy.editTitle : mode === 'ev' ? copy.evTitle : copy.guestTitle;
  const stepIndex = STEPS.indexOf(step);

  const renderDetails = () => (
    <>
      <Panel title={isGuest ? copy.guest : copy.yourVehicle} icon={isGuest ? 'person-outline' : 'car-outline'}>
        {mine.properties.length > 1 && !editing ? (
          <ChipGroup
            label={copy.property}
            options={mine.properties.map((p) => ({ value: p.id, label: propertyIn(p.label, lang) }))}
            value={form.propertyId}
            onChange={(propertyId) => update({ propertyId, spaceId: null })}
          />
        ) : null}
        {mode === 'ev' && !editing ? (
          <ChipGroup
            label={copy.chargingFor}
            options={[
              { value: 'resident', label: copy.myVehicle, icon: 'person-outline' },
              { value: 'guest', label: copy.aVisitor, icon: 'people-outline' },
            ]}
            value={form.bookedFor}
            onChange={(bookedFor) => update({ bookedFor })}
          />
        ) : null}

        {isGuest ? (
          <>
            <Field
              label={copy.guestName}
              value={form.guestName}
              onChangeText={(guestName) => update({ guestName })}
              placeholder={copy.fullName}
              autoCapitalize="words"
              autoComplete="name"
              icon="person-outline"
              error={error?.field === 'name' ? error.message : undefined}
            />
            {showContact ? (
              <>
                <Field
                  label={copy.mobile}
                  value={form.guestPhone}
                  onChangeText={(guestPhone) => update({ guestPhone })}
                  placeholder="+968 9123 4567"
                  keyboardType="phone-pad"
                  icon="call-outline"
                />
                <Field
                  label={copy.email}
                  value={form.guestEmail}
                  onChangeText={(guestEmail) => update({ guestEmail })}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                />
              </>
            ) : (
              <Pressable onPress={() => setShowContact(true)} accessibilityRole="button" style={styles.linkRow}>
                <Ionicons name="add-circle-outline" size={18} color={theme.colors.accent} />
                <AppText variant="bodyStrong" color={theme.colors.accent}>
                  {copy.addContact}
                </AppText>
              </Pressable>
            )}
            {!form.visitorAddsVehicle ? (
              <Field
                label={copy.plate}
                value={form.plate}
                onChangeText={(plate) => update({ plate })}
                placeholder={copy.platePlaceholder}
                autoCapitalize="characters"
                autoCorrect={false}
                icon="car-outline"
                error={error?.field === 'plate' ? error.message : undefined}
              />
            ) : null}
            <CheckRow
              label={copy.vehicleLater}
              detail={copy.vehicleLaterDetail}
              checked={form.visitorAddsVehicle}
              onChange={(visitorAddsVehicle) => update({ visitorAddsVehicle })}
            />
          </>
        ) : (
          <ChipGroup
            label={copy.electricVehicle}
            options={evVehicles.map((v) => ({ value: v.id, label: `${v.make} ${v.model}`, detail: v.plate }))}
            value={form.vehicleId}
            onChange={(vehicleId) => {
              const choice = evVehicles.find((v) => v.id === vehicleId);
              update({ vehicleId, connectorType: choice?.ev?.connectors[0] ?? null });
            }}
          />
        )}

        {mode === 'guest' && !editing ? (
          <ChipGroup
            label={copy.parking}
            options={[
              { value: 'standard', label: copy.visitorBay, icon: 'car-outline' },
              { value: 'ev', label: copy.evBay, icon: 'flash-outline' },
            ]}
            value={form.parkingType}
            onChange={(parkingType) => update({ parkingType, spaceId: null, stayFollowsCharging: parkingType === 'ev' })}
          />
        ) : null}
      </Panel>

      <Panel title={copy.when} icon="calendar-outline" subtitle={copy.siteTime}>
        <ChipGroup scroll options={dateOptions} value={form.dateKey} onChange={(dateKey) => update({ dateKey, arrivalMin: Math.max(form.arrivalMin, earliestArrivalOn(dateKey)) })} />
        <Stepper
          label={copy.arrival}
          display={minuteOfDayIn(form.arrivalMin, lang)}
          detail={relativeDayIn(form.dateKey, now, lang)}
          canDecrement={form.arrivalMin - slot >= minArrival}
          canIncrement={form.arrivalMin + slot < 24 * 60}
          onDecrement={() => update({ arrivalMin: form.arrivalMin - slot })}
          onIncrement={() => update({ arrivalMin: form.arrivalMin + slot })}
        />
        {!isEv ? (
          <ChipGroup
            label={copy.howLong}
            options={STAY_PRESETS.filter((m) => m <= maxStay).map((m) => ({ value: String(m), label: duration(m) }))}
            value={STAY_PRESETS.some((m) => m === form.stayMin) ? String(form.stayMin) : null}
            onChange={(value) => update({ stayMin: Number(value), stayFollowsCharging: false })}
          />
        ) : null}
        <Stepper
          label={isEv ? copy.parkingUntil : copy.departure}
          display={time(end)}
          detail={copy.stay(duration(form.stayMin), crossesDay)}
          canDecrement={form.stayMin - slot >= minStay}
          canIncrement={form.stayMin + slot <= maxStay}
          onDecrement={() => update({ stayMin: form.stayMin - slot, stayFollowsCharging: false })}
          onIncrement={() => update({ stayMin: form.stayMin + slot, stayFollowsCharging: false })}
        />
      </Panel>

      {isEv ? (
        <Panel title={copy.charging} icon="flash-outline" subtitle={copy.evDeparture}>
          <ChipGroup
            label={copy.connector}
            options={CONNECTORS.map((c) => ({
              value: c,
              label: c,
              disabled: !(isGuest ? CONNECTORS : (vehicle?.ev?.connectors ?? CONNECTORS)).includes(c),
            }))}
            value={form.connectorType}
            onChange={(connectorType) => update({ connectorType })}
          />
          <Stepper
            label={copy.chargingStarts}
            display={time(chargeStart)}
            detail={form.chargeOffsetMin === 0 ? copy.onArrival : copy.afterArrival(duration(form.chargeOffsetMin))}
            canDecrement={form.chargeOffsetMin - slot >= 0}
            canIncrement={form.chargeOffsetMin + slot + form.chargeMin <= maxStay}
            onDecrement={() => update({ chargeOffsetMin: form.chargeOffsetMin - slot })}
            onIncrement={() => update({ chargeOffsetMin: form.chargeOffsetMin + slot })}
          />
          <Stepper
            label={copy.chargingEnds}
            display={time(chargeEnd)}
            detail={copy.ofCharging(duration(form.chargeMin))}
            canDecrement={form.chargeMin - slot >= 30}
            canIncrement={form.chargeMin + slot <= policy.maxChargingDurationMinutes && form.chargeOffsetMin + form.chargeMin + slot <= maxStay}
            onDecrement={() => update({ chargeMin: form.chargeMin - slot })}
            onIncrement={() => update({ chargeMin: form.chargeMin + slot })}
          />
          <ChipGroup
            label={copy.energy}
            options={ENERGY_TARGETS.map((t) => ({ value: t, label: t === 'none' ? copy.untilSlotEnds : copy.kwh(t) }))}
            value={form.targetKwh}
            onChange={(targetKwh) => update({ targetKwh })}
          />
        </Panel>
      ) : null}
    </>
  );

  /* ---------------------------------------------------------- Step 2 */

  const marks: Record<string, BayMark> = {};
  const reasons: Record<string, string> = {};
  for (const o of options) {
    marks[o.space.id] = o.available ? 'free' : 'taken';
    if (o.reason) reasons[o.space.id] = reasonIn(o.reason, lang) ?? o.reason;
  }

  const zoneLine = (o: SpaceOption) => {
    const zone = db.zones.find((z) => z.id === o.space.zoneId);
    return zone ? `${nameIn(zone.name, lang)} · ${nameIn(zone.level, lang)}` : '';
  };

  // The chosen bay first, then the nearest others; the rest behind "Show more".
  const ordered = chosen ? [chosen, ...available.filter((o) => o !== chosen)] : available;
  const listed = showAll ? ordered : ordered.slice(0, LIST_PREVIEW);

  const renderSpace = () => {
    const zone = chosen ? db.zones.find((z) => z.id === chosen.space.zoneId) : undefined;
    const connector = db.connectors.find((c) => c.id === chosen?.connectorId);
    const charger = db.chargers.find((c) => c.id === connector?.chargerId);
    const rate = charger ? chargingRateKw(charger, vehicle) : 0;
    const target = form.targetKwh === 'none' ? null : Number(form.targetKwh);
    return (
      <>
        <Pressable onPress={() => goTo('details')} accessibilityRole="button" accessibilityLabel={copy.editDetails}>
          <Panel>
            <View style={styles.summary}>
              <View style={styles.summaryBadge}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.textPrimary} />
              </View>
              <View style={styles.summaryText}>
                <AppText variant="bodyStrong">
                  {isGuest
                    ? `${form.guestName.trim()} · ${form.visitorAddsVehicle ? copy.plateToFollow : plateIn(form.plate.trim().toUpperCase(), lang)}`
                    : `${vehicle?.make} ${vehicle?.model} · ${vehicle ? plateIn(vehicle.plate, lang) : ''}`}
                </AppText>
                <AppText variant="label" color={theme.colors.textSupport}>
                  {`${rangeIn(start, end, lang)} (${duration(form.stayMin)})`}
                </AppText>
                {isEv ? (
                  <AppText variant="label" color={theme.colors.textSupport}>
                    {copy.chargingWindow(time(chargeStart), time(chargeEnd), form.connectorType ?? '')}
                  </AppText>
                ) : null}
              </View>
              <AppText variant="bodyStrong" color={theme.colors.accent}>
                {copy.edit}
              </AppText>
            </View>
          </Panel>
        </Pressable>

        {pickLost && chosen ? (
          <Notice tone="warning" title={copy.pickLost(pickedLabel ?? '')}>
            {copy.pickedInstead(chosen.space.label)}
          </Notice>
        ) : null}

        <ChipGroup
          options={[
            { value: 'list', label: copy.list, icon: 'list-outline' },
            { value: 'map', label: copy.map, icon: 'map-outline' },
          ]}
          value={view}
          onChange={setView}
        />

        {view === 'map' ? (
          <SiteMap
            framed
            db={db}
            now={now}
            mode="select"
            marks={marks}
            reasons={reasons}
            targetSpaceId={chosen?.space.id}
            onSelectSpace={(spaceId) => update({ spaceId })}
            lang={lang}
          />
        ) : (
          <Panel
            title={copy.availableTitle}
            icon="checkmark-circle-outline"
            subtitle={copy.availableCount(n(available.length), n(options.length), isEv)}
          >
            {available.length === 0 ? (
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {`${copy.noSpace}. ${copy.noSpaceDetail}`}
              </AppText>
            ) : (
              listed.map((o, index) => {
                const selected = o === chosen;
                const rank = available.indexOf(o);
                return (
                  <ListRow
                    key={o.space.id}
                    divided={index > 0}
                    icon={selected ? 'radio-button-on' : 'radio-button-off'}
                    title={`${o.space.label}${o === recommended ? copy.recommended : ''}`}
                    lines={[zoneLine(o), copy.nearest(rank, property ? propertyIn(property.label, lang) : '')]}
                    statusLabel={selected ? copy.selected : undefined}
                    statusTone={selected ? 'teal' : undefined}
                    onPress={() => update({ spaceId: o.space.id })}
                  />
                );
              })
            )}
            {ordered.length > LIST_PREVIEW ? (
              <ParkingButton
                compact
                icon={showAll ? 'chevron-up' : 'chevron-down'}
                label={showAll ? copy.showFewer : copy.showMore(n(ordered.length - LIST_PREVIEW))}
                onPress={() => setShowAll((v) => !v)}
              />
            ) : null}
          </Panel>
        )}

        {unavailable.length > 0 && view === 'list' ? (
          <View>
            <Pressable
              onPress={() => setShowUnavailable((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: showUnavailable }}
              style={styles.linkRow}
            >
              <Ionicons name={showUnavailable ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textSupport} />
              <AppText variant="label" color={theme.colors.textSupport}>
                {copy.notAvailable(n(unavailable.length))}
              </AppText>
            </Pressable>
            {showUnavailable ? (
              <Panel>
                {unavailable.map((o, index) => (
                  <ListRow key={o.space.id} divided={index > 0} icon="remove-circle-outline" title={o.space.label} lines={[reasonIn(o.reason, lang) ?? copy.unavailable]} />
                ))}
              </Panel>
            ) : null}
          </View>
        ) : null}

        {chosen && isEv && charger ? (
          <Notice>
            {`${copy.chargesOn(
              chosen.space.label,
              chargerNameIn(charger.label, lang),
              target ? copy.estimate(n(target), duration((target / Math.max(rate, 0.1)) * 60), n(rate)) : '',
            )} ${copy.estimateNote}`}
          </Notice>
        ) : null}
        {chosen ? (
          <AppText variant="label" color={theme.colors.textMuted} style={styles.note}>
            {`${chosen.space.label} · ${zone ? nameIn(zone.name, lang) : ''}. ${copy.autoConfirm}`}
          </AppText>
        ) : null}
      </>
    );
  };

  /** The pinned card under step 2: the bay picked on the map or list, and the button that books it. */
  const renderSelected = () => {
    const space = chosen?.space;
    const zone = space ? db.zones.find((z) => z.id === space.zoneId) : undefined;
    const building = space ? db.buildings.find((b) => b.id === space.buildingId) : undefined;
    const ev = space?.kind === 'ev';
    return (
      <Panel>
        <View style={styles.selected} accessibilityLiveRegion="polite">
          <View style={[styles.selectedBadge, !space && styles.selectedBadgeEmpty]}>
            <AppText variant="bodyStrong" numberOfLines={1}>
              {space ? space.label : '—'}
            </AppText>
            {ev ? <Ionicons name="flash" size={14} color={theme.colors.success} /> : null}
          </View>
          <View style={styles.summaryText}>
            <AppText variant="label" color={theme.colors.chipVioletText}>
              {space ? copy.selected : copy.noSpace}
            </AppText>
            <AppText variant="subheading">{space ? space.label : copy.noSpaceDetail}</AppText>
            {space ? (
              <AppText variant="label" color={theme.colors.textSupport}>
                {[
                  zone ? nameIn(zone.level, lang) : undefined,
                  building ? copy.near(nameIn(building.name, lang)) : zone ? nameIn(zone.name, lang) : undefined,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </AppText>
            ) : null}
          </View>
        </View>
        <ParkingButton
          label={space ? copy.confirmBay(space.label, Boolean(editing)) : copy.changeTime}
          icon={space ? 'checkmark-circle-outline' : 'time-outline'}
          tone="primary"
          loading={busy}
          disabled={editing ? editing.status !== 'confirmed' : false}
          onPress={() => {
            if (space) void confirm();
            else goTo('details');
          }}
        />
      </Panel>
    );
  };

  const footer =
    step === 'details' ? (
      <ParkingButton label={copy.findSpace} icon="search-outline" tone="primary" onPress={findSpace} />
    ) : (
      renderSelected()
    );

  return (
    <ParkingFrame
      title={step === 'space' ? copy.chooseTitle : title}
      subtitle={`${copy.stepOf(stepIndex + 1, STEPS.length)}${step === 'details' ? ` · ${copy.steps.details}` : ''}`}
      onBack={back}
      scrollRef={scrollRef}
      bottomBar={false}
      footer={footer}
    >

      {editing && editing.status !== 'confirmed' ? (
        <Notice tone="warning" title={copy.notEditableTitle}>
          {copy.notEditableBody}
        </Notice>
      ) : null}

      {step === 'details' ? renderDetails() : renderSpace()}

      {error && !error.field ? (
        <Notice
          tone="error"
          title={copy.notBookedTitle}
          actions={
            step === 'space' && (error.code === 'space-unavailable' || error.code === 'charger-unavailable') ? (
              <ParkingButton compact label={copy.pickAnother} onPress={() => setError(null)} />
            ) : undefined
          }
        >
          {error.message}
        </Notice>
      ) : null}

    </ParkingFrame>
  );
}
