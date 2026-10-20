import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { AppText } from '../../components/parking/compat/AppText';
import { ChipGroup, type ChipOption } from '../../components/parking/Controls';
import { Notice, type NoticeTone } from '../../components/parking/Notice';
import { Panel } from '../../components/parking/Panel';
import { ParkingButton } from '../../components/parking/ParkingButton';
import { ParkingFrame } from '../../components/parking/ParkingFrame';
import { ListRow } from '../../components/parking/Rows';
import { chargingStateLabel } from '../../components/parking/presenters';
import { useAppTheme } from '../../components/parking/compat/theme';
import { useParkingLang } from '../../components/parking/useParkingLang';
import { useParking } from '../../hooks/useParking';
import { runAcceptanceChecks, type CheckResult } from '../../services/parking/checks';
import type { ScanResult } from '../../services/parking/gate';
import type { PolicySettings } from '../../services/parking/policy';
import { reservationView } from '../../services/parking/selectors';
import { chargerNameIn, dateTimeIn, digitsIn, durationIn, gateResultIn, parkingErrorIn } from '../../services/parking/i18n';
import { ms } from '../../services/parking/time';
import { ParkingError } from '../../services/parking/tx';
import type { OccupancyState, Serviceability } from '../../services/parking/types';
import type { RootStackScreenProps } from '../../types/navigation.types';
import { clockSteps, demoCopy, policyLabels } from './DemoControlsScreen.data';
import { createStyles } from './DemoControlsScreen.styles';

type Feedback = { tone: NoticeTone; text: string };

export function DemoControlsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<RootStackScreenProps<'DemoControls'>['navigation']>();
  const { db, now, service, storageKind } = useParking();
  const lang = useParkingLang();
  const copy = demoCopy[lang];
  const n = (value: number) => digitsIn(value, lang);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [simId, setSimId] = useState<string | null>(null);
  const [evId, setEvId] = useState<string | null>(null);
  const [bayId, setBayId] = useState<string | null>(null);
  const [checks, setChecks] = useState<CheckResult[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const views = useMemo(
    () => [...db.reservations].sort((a, b) => ms(a.scheduledStart) - ms(b.scheduledStart)).map((r) => reservationView(db, r, now, lang)),
    [db, now, lang],
  );
  const option = (v: (typeof views)[number]): ChipOption<string> => ({
    value: v.reservation.id,
    label: `${v.title} · ${v.space.label}`,
    detail: v.charging && v.reservation.status === 'checked-in' ? chargingStateLabel(v.charging.state, lang) : v.status.label,
  });
  const open = views.filter((v) => v.reservation.status === 'confirmed' || v.reservation.status === 'checked-in');
  const guestPasses = views.filter((v) => v.reservation.bookedFor === 'guest');
  const evOpen = open.filter((v) => v.reservation.parkingType === 'ev');

  const run = async (action: () => Promise<unknown>, success: string | ((value: unknown) => Feedback)) => {
    setFeedback(null);
    try {
      const value = await action();
      setFeedback(typeof success === 'string' ? { tone: 'success', text: success } : success(value));
    } catch (e) {
      setFeedback({ tone: 'error', text: e instanceof ParkingError ? parkingErrorIn(e, lang) : copy.failed });
    }
  };

  const simulateGate = (direction: 'entry' | 'exit') => {
    const v = views.find((x) => x.reservation.id === simId);
    const token = v?.credential?.displayToken;
    if (!v || !token) return;
    const gateId = direction === 'entry' ? v.space.gateId : v.reservation.entryGateId ?? v.space.gateId;
    void run(
      () => service.scan(token, gateId, direction),
      (value) => {
        const result = value as ScanResult;
        const tone: NoticeTone =
          result.outcome === 'accepted' ? 'success' : result.outcome === 'already-processed' ? 'warning' : 'error';
        const said = gateResultIn(result, lang);
        return { tone, text: `${said.title}: ${said.message}` };
      },
    );
  };

  const ev = views.find((x) => x.reservation.id === evId);
  const bay = db.spaces.find((s) => s.id === bayId);

  return (
    <ParkingFrame title={copy.title} bottomBar={false}>
      <Notice>{copy.intro}</Notice>
      {feedback ? <Notice tone={feedback.tone}>{feedback.text}</Notice> : null}

      <Panel title={copy.clockTitle} icon="time-outline" subtitle={copy.clockNote}>
        <AppText variant="figure">{dateTimeIn(now, lang)}</AppText>
        <AppText variant="label" color={theme.colors.textSupport}>
          {db.clockOffsetMs > 0 ? copy.ahead(durationIn(db.clockOffsetMs / 60_000, lang)) : copy.realTime}
        </AppText>
        <View style={styles.row}>
          {clockSteps.map((step) => (
            <ParkingButton
              key={step.label.en}
              compact
              label={step.label[lang]}
              onPress={() => void run(() => service.advanceClock(step.ms), copy.clockMoved(step.label[lang]))}
              style={styles.quarter}
            />
          ))}
        </View>
      </Panel>

      <Panel title={copy.viewAs} icon="people-outline" subtitle={copy.viewAsNote}>
        <View style={styles.row}>
          <ParkingButton label={copy.resident} icon="home-outline" onPress={() => navigation.navigate('Parking')} style={styles.grow} />
          <ParkingButton label={copy.security} icon="shield-checkmark-outline" onPress={() => navigation.navigate('SecurityConsole')} style={styles.grow} />
        </View>
        <ChipGroup label={copy.visitorPick} scroll options={guestPasses.map(option)} value={visitorId} onChange={setVisitorId} />
        <ParkingButton
          label={copy.openAsVisitor}
          icon="phone-portrait-outline"
          disabled={!visitorId}
          onPress={() => {
            const invite = views.find((x) => x.reservation.id === visitorId)?.invitation?.inviteToken;
            if (invite) navigation.navigate('GuestPass', { invite, lang });
          }}
        />
      </Panel>

      <Panel title={copy.gateTitle} icon="git-merge-outline" subtitle={copy.gateNote}>
        <ChipGroup scroll options={open.map(option)} value={simId} onChange={setSimId} />
        <View style={styles.row}>
          <ParkingButton compact label={copy.simEntry} icon="log-in-outline" disabled={!simId} onPress={() => simulateGate('entry')} style={styles.grow} />
          <ParkingButton compact label={copy.simExit} icon="log-out-outline" disabled={!simId} onPress={() => simulateGate('exit')} style={styles.grow} />
        </View>
      </Panel>

      <Panel title={copy.chargingTitle} icon="flash-outline">
        <ChipGroup scroll options={evOpen.map(option)} value={evId} onChange={setEvId} />
        {ev ? (
          <View style={styles.row}>
            <ParkingButton compact label={copy.plugIn} disabled={ev.charging?.state !== 'waiting-for-plug-in'} onPress={() => void run(() => service.plugIn(ev.reservation.id, 'demo'), copy.plugged)} style={styles.grow} />
            <ParkingButton compact label={copy.complete} disabled={ev.charging?.state !== 'charging'} onPress={() => void run(() => service.simulateChargingComplete(ev.reservation.id), copy.completed)} style={styles.grow} />
            <ParkingButton compact label={copy.movedOut} disabled={ev.reservation.status !== 'checked-in' || Boolean(ev.reservation.bayVacatedAt)} onPress={() => void run(() => service.markMovedOut(ev.reservation.id, 'demo', 'Simulated bay sensor'), copy.released)} style={styles.grow} />
            <ParkingButton compact label={copy.openSession} onPress={() => navigation.navigate('ChargingSession', { reservationId: ev.reservation.id })} style={styles.grow} />
          </View>
        ) : null}
        {db.chargers.map((c, index) => (
          <View key={c.id}>
            <ListRow divided={index > 0 || Boolean(ev)} icon="flash-outline" title={chargerNameIn(c.label, lang)} lines={[copy.upTo(c.maxConcurrent, db.connectors.filter((x) => x.chargerId === c.id).map((x) => x.type).join(', '))]} statusLabel={c.status === 'available' ? copy.inService : copy.fault} statusTone={c.status === 'available' ? 'teal' : 'red'} />
            <ParkingButton
              compact
              label={c.status === 'available' ? copy.simFault : copy.restore}
              tone={c.status === 'available' ? 'danger' : 'secondary'}
              onPress={() =>
                void (c.status === 'available'
                  ? run(() => service.faultCharger(c.id), copy.faulted(chargerNameIn(c.label, lang)))
                  : run(() => service.restoreCharger(c.id), copy.restored(chargerNameIn(c.label, lang))))
              }
            />
          </View>
        ))}
      </Panel>

      <Panel title={copy.baysTitle} icon="grid-outline" subtitle={copy.baysNote}>
        <ChipGroup scroll options={db.spaces.map((s) => ({ value: s.id, label: s.label, detail: `${copy.occupancy[s.occupancy]} · ${copy.serviceability[s.serviceability]}` }))} value={bayId} onChange={setBayId} />
        {bay ? (
          <>
            <View style={styles.row}>
              {(['occupied', 'vacant', 'unknown'] as OccupancyState[]).map((state) => (
                <ParkingButton key={state} compact label={copy.mark(copy.occupancy[state])} disabled={bay.occupancy === state} onPress={() => void run(() => service.setOccupancy(bay.id, state, 'demo', 'Simulated sensor'), copy.bayIs(bay.label, copy.occupancy[state]))} style={styles.quarter} />
              ))}
            </View>
            <View style={styles.row}>
              {(['in-service', 'maintenance', 'out-of-service'] as Serviceability[]).map((state) => (
                <ParkingButton key={state} compact label={copy.serviceability[state]} disabled={bay.serviceability === state} onPress={() => void run(() => service.setServiceability(bay.id, state, 'demo', 'Simulated'), copy.bayIs(bay.label, copy.serviceability[state]))} style={styles.quarter} />
              ))}
            </View>
          </>
        ) : null}
      </Panel>

      <Panel title={copy.checksTitle} icon="checkmark-done-outline" subtitle={copy.checksNote}>
        <ParkingButton
          label={checks ? copy.runAgain : copy.runChecks}
          icon="play-outline"
          tone="primary"
          loading={checking}
          onPress={() => {
            setChecking(true);
            void runAcceptanceChecks()
              .then(setChecks)
              .finally(() => setChecking(false));
          }}
        />
        {checks ? (
          <>
            <AppText variant="bodyStrong">{copy.passed(checks.filter((c) => c.passed).length, checks.length)}</AppText>
            {checks.map((c, index) => (
              <ListRow key={c.id} divided={index > 0} icon={c.passed ? 'checkmark-circle-outline' : 'close-circle-outline'} title={`${c.id}. ${c.name}`} lines={[c.detail]} statusLabel={c.passed ? copy.pass : copy.fail} statusTone={c.passed ? 'teal' : 'red'} />
            ))}
          </>
        ) : null}
      </Panel>

      <Panel title={copy.dataTitle} icon="server-outline">
        <AppText variant="caption" color={theme.colors.textSecondary}>
          {copy.storage[storageKind]}
        </AppText>
        <AppText variant="label" color={theme.colors.textMuted}>
          {copy.counts(db.reservations.length, db.scanEvents.length, db.audit.length, db.revision)}
        </AppText>
        {confirmReset ? (
          <Notice
            tone="warning"
            title={copy.resetTitle}
            actions={
              <>
                <ParkingButton compact label={copy.keep} onPress={() => setConfirmReset(false)} />
                <ParkingButton
                  compact
                  tone="danger"
                  label={copy.reset}
                  onPress={() => {
                    setConfirmReset(false);
                    void run(() => service.resetDemo(), copy.resetDone);
                  }}
                />
              </>
            }
          >
            {copy.resetConfirm}
          </Notice>
        ) : (
          <ParkingButton label={copy.resetData} icon="refresh-outline" tone="danger" onPress={() => setConfirmReset(true)} />
        )}
      </Panel>

      <Panel title={copy.policyTitle} icon="options-outline" subtitle={copy.policyNote}>
        {(Object.keys(policyLabels) as (keyof PolicySettings)[]).map((key) => (
          <View key={key} style={styles.policyRow}>
            <AppText variant="caption" color={theme.colors.textSecondary} style={styles.policyLabel}>
              {policyLabels[key][0][lang]}
            </AppText>
            <AppText variant="bodyStrong">{`${n(db.policy[key])}${policyLabels[key][1] ? ` ${copy.units[policyLabels[key][1] as 'min' | 'days']}` : ''}`}</AppText>
          </View>
        ))}
      </Panel>
    </ParkingFrame>
  );
}
