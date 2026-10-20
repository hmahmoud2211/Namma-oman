import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { AppText } from '../../components/parking/compat/AppText';
import { ChipGroup, Field, type ChipOption } from '../../components/parking/Controls';
import { Notice, type NoticeTone } from '../../components/parking/Notice';
import { Panel } from '../../components/parking/Panel';
import { ParkingButton } from '../../components/parking/ParkingButton';
import { ParkingFrame } from '../../components/parking/ParkingFrame';
import { QrScanner } from '../../components/parking/QrScanner';
import { ListRow } from '../../components/parking/Rows';
import { notificationIcon } from '../../components/parking/presenters';
import { useAppTheme } from '../../components/parking/compat/theme';
import { useParkingLang } from '../../components/parking/useParkingLang';
import { useParking } from '../../hooks/useParking';
import type { ScanResult } from '../../services/parking/gate';
import { notificationsFor, reservationView } from '../../services/parking/selectors';
import { dateTimeIn, gateNameIn, gateResultIn, parkingErrorIn, plateIn, timeIn } from '../../services/parking/i18n';
import { ms } from '../../services/parking/time';
import { expectedArrivals, type ExpectedArrival } from '../../services/parking/tracking';
import { ParkingError } from '../../services/parking/tx';
import type { OccupancyState, ScanDirection } from '../../services/parking/types';
import { arrivalTone, consoleCopy, keepTogether, needsBayTone, resultTone } from './SecurityConsoleScreen.data';
import { createStyles } from './SecurityConsoleScreen.styles';

type Feedback = { tone: NoticeTone; text: string };

/**
 * The security desk's view (demo role): scan or paste a pass at a chosen
 * gate, see the decision and its reason, work the exception queue and
 * record logged overrides.
 */
export function SecurityConsoleScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { db, now, service } = useParking();
  const lang = useParkingLang();
  const copy = consoleCopy[lang];
  const ar = lang === 'ar';

  const [gateId, setGateId] = useState(db.gates[0]?.id ?? '');
  const gate = db.gates.find((g) => g.id === gateId);
  const [direction, setDirection] = useState<ScanDirection>('entry');
  const effectiveDirection: ScanDirection = gate?.direction === 'exit' ? 'exit' : gate?.direction === 'entry' ? 'entry' : direction;

  const [camera, setCamera] = useState(false);
  const [pasted, setPasted] = useState('');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [arrivalId, setArrivalId] = useState<string | null>(null);

  const [manualId, setManualId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [plate, setPlate] = useState('');
  const [bayId, setBayId] = useState<string | null>(null);
  const [bayNote, setBayNote] = useState('');

  const reservations = useMemo(
    () => [...db.reservations].sort((a, b) => ms(b.scheduledStart) - ms(a.scheduledStart)).map((r) => reservationView(db, r, now, lang)),
    [db, now, lang],
  );
  const passOptions: ChipOption<string>[] = reservations.map((v) => ({
    value: v.reservation.id,
    label: `${v.title} · ${v.space.label}`,
    detail: `${v.status.label} · ${timeIn(v.reservation.scheduledStart, lang)}`,
  }));
  const openOptions = passOptions.filter((o) => {
    const r = db.reservations.find((x) => x.id === o.value);
    return r?.status === 'confirmed' || r?.status === 'checked-in';
  });
  const exceptions = notificationsFor(db, 'operator').filter((n) => !n.resolvedAt);
  const arrivals = expectedArrivals(db, now, 60, lang);
  // Gone from the list once the car is in, so its prompt goes too.
  const arrival = arrivals.find((a) => a.reservationId === arrivalId);
  const gateShort = (id: string) => (db.gates.some((g) => g.id === id) ? gateNameIn(id, lang, true) : '');
  const recentScans = [...db.scanEvents].sort((a, b) => ms(b.at) - ms(a.at)).slice(0, 8);

  const scan = async (input: string) => {
    if (!gate) return;
    setFeedback(null);
    try {
      setResult(await service.scan(input, gate.id, effectiveDirection));
    } catch (e) {
      setResult(null);
      setFeedback({ tone: 'error', text: e instanceof ParkingError ? parkingErrorIn(e, lang) : copy.scanFailed });
    }
  };

  const act = async (action: () => Promise<unknown>, success: string) => {
    setFeedback(null);
    try {
      const outcome = await action();
      if (outcome && typeof outcome === 'object' && 'outcome' in outcome) {
        setResult(outcome as ScanResult);
      } else {
        setFeedback({ tone: 'success', text: success });
      }
    } catch (e) {
      setFeedback({ tone: 'error', text: e instanceof ParkingError ? parkingErrorIn(e, lang) : copy.failed });
    }
  };

  /** Sets the console up for an expected car: its gate, the entry lane and its pass. */
  const prepareArrival = (picked: ExpectedArrival) => {
    setGateId(picked.gateId);
    setDirection('entry');
    setPickedId(picked.reservationId);
    setArrivalId(picked.reservationId);
    setResult(null);
    setFeedback(null);
  };

  const scanArrival = (picked: ExpectedArrival) => {
    const r = db.reservations.find((x) => x.id === picked.reservationId);
    const token = db.credentials.find((c) => c.id === r?.credentialId)?.displayToken;
    setArrivalId(null);
    if (token) void scan(token);
  };

  const picked = db.reservations.find((r) => r.id === pickedId);
  const pickedCredentials = picked ? db.credentials.filter((c) => c.reservationId === picked.id) : [];
  const olderCredential = pickedCredentials.find((c) => c.id !== picked?.credentialId);
  const manual = db.reservations.find((r) => r.id === manualId);
  const manualView = manual ? reservationView(db, manual, now, lang) : null;
  const said = result ? gateResultIn(result, lang) : null;
  const bay = db.spaces.find((s) => s.id === bayId);

  return (
    <ParkingFrame title={copy.title} bottomBar={false}>
      <Notice>{copy.roleNote}</Notice>

      <Panel title={copy.gate} icon="git-merge-outline">
        <ChipGroup
          options={db.gates.map((g) => ({ value: g.id, label: gateNameIn(g.id, lang), detail: g.direction === 'both' ? copy.entryAndExit : copy.exitOnly }))}
          value={gateId}
          onChange={setGateId}
        />
        <ChipGroup
          label={copy.lane}
          options={[
            { value: 'entry', label: copy.entry, icon: 'log-in-outline', disabled: gate?.direction === 'exit' },
            { value: 'exit', label: copy.exit, icon: 'log-out-outline', disabled: gate?.direction === 'entry' },
          ]}
          value={effectiveDirection}
          onChange={setDirection}
        />
      </Panel>

      <Panel title={copy.scanTitle} icon="scan-outline" subtitle={copy.laneLabel(gate ? gateNameIn(gate.id, lang) : '', effectiveDirection === 'entry')}>
        {camera ? (
          <QrScanner onScan={(data) => void scan(data)} onClose={() => setCamera(false)} />
        ) : (
          <ParkingButton label={copy.scanCamera} icon="camera-outline" tone="primary" onPress={() => setCamera(true)} />
        )}
        <Field
          label={copy.paste}
          value={pasted}
          onChangeText={setPasted}
          placeholder="plq_…"
          autoCapitalize="none"
          autoCorrect={false}
          icon="clipboard-outline"
        />
        <ParkingButton label={copy.validate} icon="checkmark-done-outline" disabled={!pasted.trim()} onPress={() => void scan(pasted.trim())} />
      </Panel>

      {result ? (
        <Notice tone={resultTone(result)} title={said?.title}>
          <View style={styles.result}>
            <Ionicons
              name={result.gateOpened ? 'lock-open-outline' : result.outcome === 'already-processed' ? 'information-circle-outline' : 'lock-closed-outline'}
              size={36}
              color={result.gateOpened ? theme.colors.success : result.outcome === 'already-processed' ? theme.colors.warning : theme.colors.error}
            />
            <AppText variant="bodyStrong" align="center">
              {result.gateOpened ? copy.opened : copy.closed}
            </AppText>
            <AppText variant="caption" align="center" color={theme.colors.textSecondary}>
              {said?.message}
            </AppText>
          </View>
        </Notice>
      ) : null}
      {feedback ? <Notice tone={feedback.tone}>{feedback.text}</Notice> : null}
      {arrival ? (
        <Notice
          title={`${arrival.name} · ${arrival.plate ? plateIn(arrival.plate, lang) : copy.plateToCome}`}
          actions={
            <>
              <ParkingButton
                compact
                tone="primary"
                icon="qr-code-outline"
                label={copy.arrivalScan(gateShort(arrival.gateId))}
                onPress={() => scanArrival(arrival)}
              />
              <ParkingButton compact label={copy.notNow} onPress={() => setArrivalId(null)} />
            </>
          }
        >
          {copy.arrivalPicked(gateShort(arrival.gateId))}
        </Notice>
      ) : null}

      <Panel title={copy.arrivals(arrivals.length)} icon="time-outline" subtitle={copy.arrivalsNote}>
        {arrivals.length === 0 ? (
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {copy.noArrivals}
          </AppText>
        ) : (
          arrivals.map((a, index) => {
            const chip = a.needsBay
              ? { label: copy.needsBay, tone: needsBayTone }
              : { label: copy.arrivalChip[a.phase], tone: arrivalTone[a.phase] };
            return (
              <ListRow
                key={a.reservationId}
                divided={index > 0}
                icon={a.ev ? 'flash-outline' : 'car-outline'}
                title={`${a.name} · ${a.plate ? plateIn(a.plate, lang) : copy.plateToCome}`}
                lines={[keepTogether(`${a.spaceLabel} · ${a.zoneName} · ${gateShort(a.gateId)}`), keepTogether(a.when)]}
                statusLabel={chip.label}
                statusTone={chip.tone}
                onPress={() => prepareArrival(a)}
                accessibilityHint={copy.arrivalHint}
              />
            );
          })
        )}
      </Panel>

      <Panel title={copy.simulateTitle} icon="phone-portrait-outline" subtitle={copy.simulateNote}>
        <ChipGroup scroll options={passOptions} value={pickedId} onChange={setPickedId} />
        <View style={styles.row}>
          <ParkingButton
            label={copy.scanCurrent}
            icon="qr-code-outline"
            disabled={!picked}
            onPress={() => {
              const token = pickedCredentials.find((c) => c.id === picked?.credentialId)?.displayToken;
              if (token) void scan(token);
            }}
            style={styles.grow}
          />
          {olderCredential ? (
            <ParkingButton label={copy.scanReplaced} icon="refresh-outline" onPress={() => void scan(olderCredential.displayToken)} style={styles.grow} />
          ) : null}
        </View>
      </Panel>

      <Panel title={copy.exceptions(exceptions.length)} icon="alert-circle-outline">
        {exceptions.length === 0 ? (
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {copy.nothing}
          </AppText>
        ) : (
          exceptions.map((n, index) => {
            const r = db.reservations.find((x) => x.id === n.reservationId);
            return (
              <View key={n.id}>
                <ListRow
                  divided={index > 0}
                  icon={notificationIcon[n.kind]}
                  title={ar ? copy.notification[n.kind] : n.title}
                  lines={ar ? [dateTimeIn(n.at, lang)] : [n.body, dateTimeIn(n.at, lang)]}
                />
                <View style={styles.row}>
                  {r?.needsReassignment && r.status === 'confirmed' ? (
                    <ParkingButton compact tone="primary" label={copy.reassign} onPress={() => void act(() => service.reassign(r.id, 'operator'), copy.reassigned)} style={styles.grow} />
                  ) : null}
                  {r ? <ParkingButton compact label={copy.resolveManually} onPress={() => setManualId(r.id)} style={styles.grow} /> : null}
                  <ParkingButton compact label={copy.markHandled} onPress={() => void act(() => service.resolveNotification(n.id, 'operator', 'Handled at the desk'), copy.handled)} style={styles.grow} />
                </View>
              </View>
            );
          })
        )}
      </Panel>

      <Panel title={copy.manualTitle} icon="hand-left-outline" subtitle={copy.manualNote}>
        <ChipGroup scroll options={openOptions} value={manualId} onChange={setManualId} />
        {manualView ? (
          <>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {`${manualView.reservation.reference} · ${manualView.reservation.vehiclePlate ? plateIn(manualView.reservation.vehiclePlate, lang) : copy.noPlate} · ${manualView.space.label} · ${manualView.status.label}`}
            </AppText>
            <Field label={copy.reason} value={reason} onChangeText={setReason} placeholder={copy.reasonPlaceholder} icon="create-outline" />
            {manual?.status === 'confirmed' && !manual.vehiclePlate ? (
              <Field label={copy.plateSeen} value={plate} onChangeText={setPlate} autoCapitalize="characters" icon="car-outline" />
            ) : null}
            <View style={styles.row}>
              {manual?.status === 'confirmed' ? (
                <ParkingButton compact label={copy.admitAt(gateShort(gateId))} icon="log-in-outline" onPress={() => void act(() => service.operatorEntry(manual.id, gateId, reason, plate || undefined), '')} style={styles.grow} />
              ) : null}
              {manual?.status === 'checked-in' ? (
                <ParkingButton compact label={copy.exitAt(gateShort(gateId))} icon="log-out-outline" onPress={() => void act(() => service.operatorExit(manual.id, gateId, reason), '')} style={styles.grow} />
              ) : null}
              {manual?.status === 'checked-in' && manual.parkingType === 'ev' && !manual.bayVacatedAt ? (
                <ParkingButton compact label={copy.movedOut} icon="swap-horizontal-outline" onPress={() => void act(() => service.markMovedOut(manual.id, 'operator', reason || undefined), copy.released)} style={styles.grow} />
              ) : null}
              {manualView.charging?.state === 'charging' ? (
                <ParkingButton compact label={copy.stopCharging} icon="stop-circle-outline" onPress={() => void act(() => service.stopCharging(manual!.id, 'operator'), copy.stopped)} style={styles.grow} />
              ) : null}
            </View>
            <AppText variant="label" color={theme.colors.textMuted}>
              {copy.emergency}
            </AppText>
          </>
        ) : null}
      </Panel>

      <Panel title={copy.bayTitle} icon="grid-outline" subtitle={copy.bayNote}>
        <ChipGroup
          scroll
          options={db.spaces.map((s) => ({
            value: s.id,
            label: s.label,
            detail:
              s.serviceability === 'in-service'
                ? copy.occupancy[s.occupancy]
                : `${copy.occupancy[s.occupancy]} · ${copy.serviceability[s.serviceability]}`,
          }))}
          value={bayId}
          onChange={setBayId}
        />
        {bay ? (
          <>
            <Field label={copy.note} value={bayNote} onChangeText={setBayNote} placeholder={copy.notePlaceholder} icon="create-outline" />
            <View style={styles.row}>
              {(['vacant', 'occupied', 'unknown'] as OccupancyState[]).map((state) => (
                <ParkingButton
                  key={state}
                  compact
                  label={state === bay.occupancy ? copy.nowState(copy.occupancy[state]) : copy.mark(copy.occupancy[state])}
                  disabled={state === bay.occupancy}
                  onPress={() => void act(() => service.setOccupancy(bay.id, state, 'operator', bayNote), copy.marked(bay.label, copy.occupancy[state]))}
                  style={styles.grow}
                />
              ))}
            </View>
          </>
        ) : null}
      </Panel>

      <Panel title={copy.logTitle} icon="list-outline">
        {recentScans.map((e, index) => {
          const r = db.reservations.find((x) => x.id === e.reservationId);
          const accepted = e.outcome === 'accepted';
          return (
            <ListRow
              key={e.id}
              divided={index > 0}
              icon={e.direction === 'entry' ? 'log-in-outline' : 'log-out-outline'}
              title={copy.logTitleFor(accepted, gateShort(e.gateId), e.direction === 'entry')}
              lines={[
                `${r?.guest?.name ?? r?.reference ?? copy.unknownPass} · ${dateTimeIn(e.at, lang)}`,
                e.operatorOverride
                  ? copy.override(e.operatorOverride.reason)
                  : gateResultIn({ code: e.code, title: '', message: e.message }, lang).message,
              ]}
              statusLabel={accepted ? copy.logOpened : copy.logRefused}
              statusTone={accepted ? 'teal' : 'red'}
            />
          );
        })}
        <AppText variant="label" color={theme.colors.textMuted}>
          {copy.entryNote}
        </AppText>
      </Panel>
    </ParkingFrame>
  );
}
