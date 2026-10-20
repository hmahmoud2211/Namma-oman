import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { AppText } from '../../components/parking/compat/AppText';
import { ChipGroup, FactGrid, InfoRow, type Fact } from '../../components/parking/Controls';
import { GuestTrackerStrip } from '../../components/parking/GuestTrackerCard';
import { Notice, type NoticeTone } from '../../components/parking/Notice';
import { Panel } from '../../components/parking/Panel';
import { ParkingButton } from '../../components/parking/ParkingButton';
import { ParkingFrame } from '../../components/parking/ParkingFrame';
import { Timeline } from '../../components/parking/Rows';
import { chargingStateLabel } from '../../components/parking/presenters';
import { StatusChip } from '../../components/parking/compat/StatusChip';
import { useAppTheme } from '../../components/parking/compat/theme';
import { useParkingLang } from '../../components/parking/useParkingLang';
import { useParking } from '../../hooks/useParking';
import { dateTimeIn, digitsIn, gateNameIn, nameIn, parkingErrorIn, plateIn, propertyIn, rangeIn, timeIn, chargerNameIn, failedIn, type Lang } from '../../services/parking/i18n';
import { siteInfo } from '../../services/parking/policy';
import { findReservation, inviteUrl, reservationView } from '../../services/parking/selectors';
import { MINUTE_MS, ms } from '../../services/parking/time';
import { encodePassSnapshot } from '../../services/parking/passLink';
import { guestTracker, type ShareChannel } from '../../services/parking/tracking';
import { ParkingError } from '../../services/parking/tx';
import type { RootStackScreenProps } from '../../types/navigation.types';
import {
  copyText,
  internationalDigits,
  openLink,
  shareOutcomeMessage,
  shareText,
  whatsappUrl,
} from '../../utils/share';
import {
  EXTEND_OPTIONS,
  MESSAGE_LANGUAGES,
  detailsCopy,
  passLink,
  passMessage,
  timelineFor,
} from './ReservationDetailsScreen.data';
import { createStyles } from './ReservationDetailsScreen.styles';

type Confirming = 'cancel' | 'replace' | null;

/**
 * One booking, most important first: who, when and where with where the
 * visit stands; then the one job left (send the pass, or charge); then
 * changes. Directions live on the map page and the full log behind a tap,
 * so nothing is said twice.
 */
export function ReservationDetailsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<RootStackScreenProps<'ReservationDetails'>['navigation']>();
  const { params } = useRoute<RootStackScreenProps<'ReservationDetails'>['route']>();
  const { db, now, service, inviteOrigin, storageKind } = useParking();
  // The page reads in the app's language; `lang` below is the message and pass language.
  const ui = useParkingLang();
  const copy = detailsCopy[ui];
  const time = (value: string | number) => timeIn(value, ui);
  const [message, setMessage] = useState<{ tone: NoticeTone; text: string } | null>(null);
  const [confirming, setConfirming] = useState<Confirming>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(ui);
  const [showActivity, setShowActivity] = useState(false);

  const reservation = findReservation(db, params.reservationId);
  const view = useMemo(() => (reservation ? reservationView(db, reservation, now, ui) : null), [db, reservation, now, ui]);
  const timeline = useMemo(() => (reservation ? timelineFor(db, reservation, ui) : []), [db, reservation, ui]);

  if (!reservation || !view) {
    return (
      <ParkingFrame title={copy.title}>
        <Notice tone="warning" title={copy.notFoundTitle}>
          {copy.notFoundBody}
        </Notice>
      </ParkingFrame>
    );
  }

  const r = reservation;
  const live = r.status === 'confirmed' || r.status === 'checked-in';
  const isGuest = r.bookedFor === 'guest';
  const link = view.invitation ? passLink(inviteUrl(inviteOrigin, view.invitation), lang, encodePassSnapshot(view)) : undefined;
  const phoneDigits = internationalDigits(r.guest?.phone, siteInfo.countryCallingCode);
  const firstName = r.guest?.name.trim().split(/\s+/)[0] ?? copy.yourGuest;
  const [gateShort, gateRest] = gateNameIn(view.gate.id, ui).split(' · ');

  const run = async (key: string, action: () => Promise<unknown>, success: string) => {
    setBusy(key);
    setMessage(null);
    try {
      await action();
      setMessage({ tone: 'success', text: success });
    } catch (e) {
      setMessage({ tone: 'error', text: e instanceof ParkingError ? parkingErrorIn(e, ui) : failedIn(ui) });
    } finally {
      setBusy(null);
      setConfirming(null);
    }
  };

  /** Logs how the pass went out, for the tracker. Never blocks the share itself. */
  const recordShare = (channel: ShareChannel) => service.recordShare(r.id, channel).catch(() => undefined);

  const sendWhatsApp = async () => {
    if (!link) return;
    const opened = await openLink(whatsappUrl(`${passMessage(view, lang)}\n${link}`, phoneDigits));
    if (opened) {
      await recordShare('whatsapp');
    }
    setMessage(opened ? { tone: 'info', text: copy.whatsappOpened } : { tone: 'error', text: copy.openFailed(ui === 'ar' ? 'واتساب' : 'WhatsApp') });
  };
  const sharePass = async () => {
    if (!link) return;
    const outcome = await shareText(copy.passWord, passMessage(view, lang), link);
    if (outcome === 'shared' || outcome === 'copied') {
      await recordShare(outcome === 'shared' ? 'share' : 'copy');
    }
    setMessage({ tone: outcome === 'failed' ? 'error' : 'info', text: shareOutcomeMessage(outcome, copy.passLinkWord, ui) });
  };
  const copyLink = async () => {
    if (!link) return;
    const ok = await copyText(link);
    if (ok) {
      await recordShare('copy');
    }
    setMessage({ tone: ok ? 'info' : 'error', text: ok ? copy.linkCopied : copy.copyFailed(link) });
  };

  /** Only what needs attention gets a banner; the good news is said where the next step is. */
  const statusNotice = () => {
    if (r.needsReassignment) {
      return (
        <Notice
          tone="warning"
          title={copy.needsBayTitle}
          actions={
            <ParkingButton
              compact
              tone="primary"
              icon="swap-horizontal-outline"
              label={copy.moveBay}
              loading={busy === 'reassign'}
              onPress={() => void run('reassign', () => service.reassign(r.id, 'resident'), copy.moved)}
            />
          }
        >
          {ui === 'ar' ? copy.needsBayBody : r.needsReassignment.reason}
        </Notice>
      );
    }
    if (view.overdue) {
      return (
        <Notice tone="error" title={copy.overdueTitle(time(r.scheduledEnd))}>
          {copy.overdueBody(view.title, view.space.label)}
        </Notice>
      );
    }
    if (r.status === 'no-show') {
      return (
        <Notice tone="warning" title={copy.noShowTitle}>
          {copy.noShowBody(time(r.noShowAt!))}
        </Notice>
      );
    }
    if (params.justBooked && !isGuest) {
      return <Notice tone="success" title={copy.justBooked}>{copy.evReserved}</Notice>;
    }
    if (params.justEdited) {
      return <Notice tone="success" title={copy.justEdited}>{isGuest ? copy.justEditedBody : copy.evUpdated}</Notice>;
    }
    return null;
  };

  const extendTo = (minutes: number) => ms(r.scheduledEnd) + minutes * MINUTE_MS;

  const actual = [
    r.actualEntryAt ? copy.arrivedIn(time(r.actualEntryAt)) : '',
    r.bayVacatedAt && !r.actualExitAt ? copy.leftBay(time(r.bayVacatedAt)) : '',
    r.actualExitAt ? copy.out(time(r.actualExitAt)) : '',
  ]
    .filter(Boolean)
    .join(' · ');
  const facts: Fact[] = [
    { icon: 'time-outline', label: copy.when, value: rangeIn(r.scheduledStart, r.scheduledEnd, ui), detail: actual || undefined, wide: true },
    { icon: 'location-outline', label: copy.bay, value: view.space.label, detail: `${nameIn(view.zone.name, ui)} · ${nameIn(view.zone.level, ui)}` },
    { icon: 'enter-outline', label: copy.entrance, value: gateShort, detail: gateRest },
    { icon: 'car-outline', label: copy.vehicle, value: r.vehiclePlate ? plateIn(r.vehiclePlate, ui) : copy.guestAddsIt, wide: true },
  ];

  const sendCard =
    isGuest && link && live ? (
      <Panel
        title={params.justBooked ? copy.bookedSendTitle(firstName) : copy.sendTitle}
        icon="paper-plane-outline"
        subtitle={r.guest?.phone && phoneDigits ? copy.sendTo(r.guest.phone) : copy.noPhoneShort}
      >
        <ChipGroup fill options={MESSAGE_LANGUAGES} value={lang} onChange={setLang} />
        <ParkingButton label={copy.sendWhatsApp} icon="logo-whatsapp" tone="primary" onPress={() => void sendWhatsApp()} />
        <View style={styles.row}>
          <ParkingButton compact label={copy.share} icon="share-social-outline" onPress={() => void sharePass()} style={styles.grow} />
          <ParkingButton compact label={copy.copyLink} icon="link-outline" onPress={() => void copyLink()} style={styles.grow} />
          <ParkingButton
            compact
            label={copy.preview}
            icon="eye-outline"
            onPress={() => navigation.navigate('GuestPass', { invite: view.invitation!.inviteToken, lang })}
            style={styles.grow}
          />
        </View>
        <AppText variant="label" color={theme.colors.textMuted}>
          {storageKind !== 'memory' ? `${copy.sendNote} ${copy.localOnlyShort}` : copy.sendNote}
        </AppText>
      </Panel>
    ) : null;
  // Until the pass is out, sending it is the one job left, so it leads.
  const sendFirst = r.status === 'confirmed' && !db.audit.some((a) => a.entityId === r.id && a.action === 'pass.shared');

  return (
    <ParkingFrame title={copy.title}>
      {statusNotice()}
      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
      {sendFirst ? sendCard : null}

      <Panel
        title={view.title}
        subtitle={`${r.reference} · ${propertyIn(view.property.label, ui)}`}
        icon={r.parkingType === 'ev' ? 'flash-outline' : 'people-outline'}
        trailing={<StatusChip label={view.status.label} tone={view.status.tone} glow />}
      >
        <FactGrid facts={facts} />
        {isGuest ? (
          <View style={styles.divided}>
            <GuestTrackerStrip tracker={guestTracker(db, r, now, ui)} />
          </View>
        ) : null}
        <View style={styles.row}>
          <ParkingButton
            compact
            label={copy.directions}
            icon="map-outline"
            onPress={() => navigation.navigate('ParkingMap', { reservationId: r.id })}
            style={styles.grow}
          />
          {timeline.length > 0 ? (
            <ParkingButton
              compact
              label={showActivity ? copy.hideActivity : copy.activity(digitsIn(timeline.length, ui))}
              icon={showActivity ? 'chevron-up' : 'list-outline'}
              onPress={() => setShowActivity((v) => !v)}
              style={styles.grow}
            />
          ) : null}
        </View>
        {showActivity ? <Timeline items={timeline} /> : null}
        {isGuest ? (
          <AppText variant="label" color={theme.colors.textMuted}>
            {copy.trackerNote}
          </AppText>
        ) : null}
      </Panel>

      {!sendFirst ? sendCard : null}

      {view.allocation && view.charging ? (
        <Panel title={copy.charging} icon="flash-outline" subtitle={chargingStateLabel(view.charging.state, ui)}>
          <InfoRow
            icon="battery-charging-outline"
            label={copy.chargingSlot}
            value={`${time(view.allocation.start)}–${time(view.allocation.end)}`}
            detail={`${chargerNameIn(view.charger?.label, ui)} · ${view.connector?.type}${view.allocation.targetKwh ? copy.requested(digitsIn(view.allocation.targetKwh, ui)) : ''}`}
          />
          {r.status === 'checked-in' || view.charging.state !== 'reserved' ? (
            <ParkingButton compact label={copy.openSession} icon="speedometer-outline" onPress={() => navigation.navigate('ChargingSession', { reservationId: r.id })} />
          ) : null}
        </Panel>
      ) : null}

      {live ? (
        <Panel title={copy.manage} icon="settings-outline">
          {r.status === 'confirmed' ? (
            <View style={styles.row}>
              <ParkingButton
                compact
                label={copy.edit}
                icon="create-outline"
                onPress={() => navigation.navigate('ReserveParking', { mode: r.parkingType === 'ev' ? 'ev' : 'guest', reservationId: r.id })}
                style={styles.grow}
              />
              {isGuest ? <ParkingButton compact label={copy.replaceQr} icon="refresh-outline" onPress={() => setConfirming('replace')} style={styles.grow} /> : null}
              <ParkingButton compact label={copy.cancel} icon="close-circle-outline" tone="danger" onPress={() => setConfirming('cancel')} style={styles.grow} />
            </View>
          ) : null}

          {!r.bayVacatedAt ? (
            <View style={styles.extend}>
              <AppText variant="label" color={theme.colors.textSupport}>
                {copy.extend(time(r.scheduledEnd))}
              </AppText>
              <View style={styles.row}>
                {EXTEND_OPTIONS.map((minutes) => (
                  <ParkingButton
                    key={minutes}
                    compact
                    label={copy.extendBy(minutes)}
                    loading={busy === `extend-${minutes}`}
                    onPress={() =>
                      void run(`extend-${minutes}`, () => service.extendReservation(r.id, extendTo(minutes), r.version), copy.extended(time(extendTo(minutes))))
                    }
                    style={styles.grow}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {r.status === 'checked-in' ? (
            <AppText variant="label" color={theme.colors.textMuted}>
              {copy.inside}
            </AppText>
          ) : null}

          {confirming ? (
            <Notice
              tone="warning"
              title={confirming === 'cancel' ? copy.cancelTitle : copy.replaceTitle}
              actions={
                <>
                  <ParkingButton compact label={copy.keep} onPress={() => setConfirming(null)} />
                  <ParkingButton
                    compact
                    tone={confirming === 'cancel' ? 'danger' : 'primary'}
                    label={confirming === 'cancel' ? copy.yesCancel : copy.issueQr}
                    loading={busy === confirming}
                    onPress={() =>
                      void (confirming === 'cancel'
                        ? run('cancel', () => service.cancelReservation(r.id), copy.cancelled)
                        : run('replace', () => service.replacePass(r.id), copy.replaced))
                    }
                  />
                </>
              }
            >
              {confirming === 'cancel' ? copy.cancelConfirm : copy.replaceConfirm}
            </Notice>
          ) : null}
        </Panel>
      ) : (
        <>
          {r.status === 'cancelled' || r.status === 'completed' ? (
            <AppText variant="label" color={theme.colors.textSupport} style={styles.endNote}>
              {r.status === 'cancelled'
                ? copy.cancelledAt(dateTimeIn(r.cancelledAt!, ui))
                : copy.completed}
            </AppText>
          ) : null}
          <ParkingButton
            label={copy.bookAgain}
            icon="repeat-outline"
            tone="primary"
            onPress={() => navigation.navigate('ReserveParking', { mode: r.parkingType === 'ev' ? 'ev' : 'guest' })}
          />
        </>
      )}
    </ParkingFrame>
  );
}
