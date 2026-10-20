import { useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { AppText } from '../../components/parking/compat/AppText';
import { InfoRow } from '../../components/parking/Controls';
import { Notice, type NoticeTone } from '../../components/parking/Notice';
import { Panel } from '../../components/parking/Panel';
import { ParkingButton } from '../../components/parking/ParkingButton';
import { ParkingFrame } from '../../components/parking/ParkingFrame';
import { chargingStateLabel } from '../../components/parking/presenters';
import { ProgressBar } from '../../components/parking/compat/ProgressBar';
import { StatusChip, type StatusTone } from '../../components/parking/compat/StatusChip';
import { useAppTheme } from '../../components/parking/compat/theme';
import { useParkingLang } from '../../components/parking/useParkingLang';
import { useParking } from '../../hooks/useParking';
import { chargingRateKw, moveOutDeadline } from '../../services/parking/charging';
import { findReservation, reservationView } from '../../services/parking/selectors';
import { chargerNameIn, durationIn, failedIn, parkingErrorIn, timeIn } from '../../services/parking/i18n';
import { ms } from '../../services/parking/time';
import { ParkingError } from '../../services/parking/tx';
import type { ChargingState } from '../../services/parking/types';
import type { RootStackScreenProps } from '../../types/navigation.types';
import { chargingCopy } from './ChargingSessionScreen.data';
import { createStyles } from './ChargingSessionScreen.styles';

const stateTone: Record<ChargingState, StatusTone> = {
  reserved: 'violet',
  'waiting-for-plug-in': 'indigo',
  charging: 'teal',
  completed: 'slate',
  interrupted: 'amber',
  faulted: 'red',
};

export function ChargingSessionScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { params } = useRoute<RootStackScreenProps<'ChargingSession'>['route']>();
  const { db, now, service } = useParking();
  const [message, setMessage] = useState<{ tone: NoticeTone; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const lang = useParkingLang();
  const copy = chargingCopy[lang];
  const ar = lang === 'ar';
  const time = (value: string | number) => timeIn(value, lang);
  const duration = (minutes: number) => durationIn(minutes, lang);

  const reservation = findReservation(db, params.reservationId);
  const view = useMemo(() => (reservation ? reservationView(db, reservation, now, lang) : null), [db, reservation, now, lang]);

  if (!view || !view.charging || !view.allocation) {
    return (
      <ParkingFrame title={copy.title}>
        <Notice tone="warning">{copy.noSlot}</Notice>
      </ParkingFrame>
    );
  }

  const { charging, allocation, charger, connector, space } = view;
  const r = view.reservation;
  const projection = view.chargingProjection!;
  const rate = charging.rateKw || (charger ? chargingRateKw(charger, view.vehicle) : 0);
  const remainingKwh = projection.targetKwh ? Math.max(0, projection.targetKwh - projection.energyKwh) : null;
  const moveOutBy = moveOutDeadline(db, charging);

  const run = async (key: string, action: () => Promise<unknown>, success: string) => {
    setBusy(key);
    setMessage(null);
    try {
      await action();
      setMessage({ tone: 'success', text: success });
    } catch (e) {
      setMessage({ tone: 'error', text: e instanceof ParkingError ? parkingErrorIn(e, lang) : failedIn(lang) });
    } finally {
      setBusy(null);
    }
  };

  return (
    <ParkingFrame title={copy.title}>
      <Panel
        title={`${space.label} · ${chargerNameIn(charger?.label, lang)}`}
        subtitle={`${view.title} · ${connector?.type ?? ''}`}
        icon="flash-outline"
        trailing={<StatusChip label={chargingStateLabel(charging.state, lang)} tone={stateTone[charging.state]} glow />}
      >
        <View style={styles.figures}>
          <View style={styles.figure}>
            <AppText variant="label" color={theme.colors.textSupport}>
              {copy.energy}
            </AppText>
            <AppText variant="figure">{copy.kwh(projection.energyKwh)}</AppText>
          </View>
          <View style={styles.figure}>
            <AppText variant="label" color={theme.colors.textSupport}>
              {copy.rate}
            </AppText>
            <AppText variant="figure">{charging.state === 'charging' ? copy.kw(rate) : '—'}</AppText>
          </View>
        </View>
        <ProgressBar progress={projection.progress} height={10} accessibilityLabel={copy.progress} />
        <AppText variant="label" color={theme.colors.textSupport}>
          {projection.targetKwh ? copy.target(projection.targetKwh) : copy.until(time(allocation.end))}
          {charging.state === 'charging' && projection.completesAt ? copy.finishAbout(time(projection.completesAt)) : ''}
        </AppText>
        <AppText variant="label" color={theme.colors.textMuted}>
          {copy.demoValues}
        </AppText>
      </Panel>

      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}

      {charging.state === 'reserved' ? <Notice>{r.status === 'confirmed' ? copy.entryNote : copy.waiting}</Notice> : null}
      {charging.state === 'waiting-for-plug-in' ? (
        <Notice
          title={copy.inBay}
          actions={
            <ParkingButton
              label={copy.plugIn}
              icon="flash-outline"
              tone="primary"
              loading={busy === 'plug'}
              disabled={ms(allocation.start) > now}
              onPress={() => void run('plug', () => service.plugIn(r.id), copy.started)}
            />
          }
        >
          {ms(allocation.start) > now
            ? copy.slotStarts(time(allocation.start))
            : copy.plugBy(time(ms(allocation.start) + db.policy.chargingPlugInGraceMinutes * 60_000))}
        </Notice>
      ) : null}
      {charging.state === 'charging' ? (
        <ParkingButton
          label={copy.stop}
          icon="stop-circle-outline"
          loading={busy === 'stop'}
          onPress={() => void run('stop', () => service.stopCharging(r.id), copy.stopped)}
        />
      ) : null}
      {(charging.state === 'completed' || charging.state === 'interrupted') && r.status === 'checked-in' && !r.bayVacatedAt ? (
        <Notice tone={charging.moveOutOverstayAt ? 'error' : 'warning'} title={charging.moveOutOverstayAt ? copy.moveNow : copy.ended}>
          {`${charging.endReason && !ar ? `${charging.endReason}. ` : ''}${copy.moveOut(space.label, moveOutBy ? copy.by(time(moveOutBy)) : '')} ${copy.bayNote}`}
        </Notice>
      ) : null}

      <Panel title={copy.details} icon="information-circle-outline">
        <InfoRow icon="time-outline" label={copy.slot} value={`${time(allocation.start)}–${time(allocation.end)}`} detail={duration((ms(allocation.end) - ms(allocation.start)) / 60_000)} />
        <InfoRow icon="car-outline" label={copy.bayReserved} value={`${time(r.scheduledStart)}–${time(r.scheduledEnd)}`} detail={r.bayVacatedAt ? copy.leftBay(time(r.bayVacatedAt)) : undefined} />
        {charging.startedAt ? <InfoRow icon="play-outline" label={copy.startedAt} value={time(charging.startedAt)} /> : null}
        {charging.endedAt ? <InfoRow icon="stop-outline" label={copy.endedAt} value={time(charging.endedAt)} detail={ar ? undefined : charging.endReason} /> : null}
        {remainingKwh !== null && charging.state === 'charging' ? (
          <InfoRow icon="hourglass-outline" label={copy.remaining} value={copy.remainingValue(remainingKwh, duration((remainingKwh / Math.max(rate, 0.1)) * 60))} />
        ) : null}
      </Panel>

      <Notice>{copy.estimate}</Notice>
    </ParkingFrame>
  );
}
