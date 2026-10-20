import type Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { AppText } from '@/components/parking/compat/AppText';
import { StatusChip } from '@/components/parking/compat/StatusChip';
import { Panel } from '@/components/parking/Panel';
import { ParkingButton } from '@/components/parking/ParkingButton';
import { ParkingFrame } from '@/components/parking/ParkingFrame';
import { reservationIcon, reservationLines } from '@/components/parking/presenters';
import { ListRow } from '@/components/parking/Rows';
import { useParkingLang } from '@/components/parking/useParkingLang';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { images } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useParking } from '@/hooks/useParking';
import { useResponsive } from '@/hooks/useResponsive';
import {
  dashboardCounts,
  myParking,
  reservationView,
  residentActivity,
  residentReservations,
  type ActivityItem,
} from '@/services/parking/selectors';
import { dateTimeIn, nameIn, timeIn } from '@/services/parking/i18n';

import {
  SEPARATOR,
  parkingActions,
  parkingCopy,
  parkingStats,
  type ActionTone,
  type ParkingAction,
} from './ParkingScreen.data';
import { BANNER_RADIUS, useParkingStyles } from './ParkingScreen.styles';

/** Design dp. */
const META_ICON = 11;

/** The banner's copy is broken for a wide banner; the summary card sets it as one run. */
const oneLine = (text: string) => text.replace(/\n/g, ' ');

/** Upcoming and active guest bookings shown before "View All". */
const GUEST_LIMIT = 3;

const ACTIVITY_ICONS: Record<ActivityItem['kind'], keyof typeof Ionicons.glyphMap> = {
  entry: 'log-in-outline',
  exit: 'log-out-outline',
  booked: 'calendar-outline',
  cancelled: 'close-circle-outline',
  'no-show': 'person-remove-outline',
};

/**
 * Parking, after the Parklane app's parking demo: the resident's bay and car, live counts from
 * the parking store, the three actions into the booking flow and the map, the guest bookings
 * and the gate activity. Every figure comes from the same store as the passes and the gate.
 */
export function ParkingScreen() {
  const navigation = useNavigation();
  const styles = useParkingStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const { db, now, residentId } = useParking();
  const lang = useParkingLang();
  const copy = parkingCopy[lang];

  const counts = useMemo(() => dashboardCounts(db, now), [db, now]);
  const stats = useMemo(() => parkingStats(counts, lang), [counts, lang]);
  const mine = useMemo(() => myParking(db, residentId), [db, residentId]);
  const myCar = mine.vehicles.find((vehicle) => !vehicle.ev) ?? mine.vehicles[0];
  const evCount = mine.vehicles.filter((vehicle) => vehicle.ev).length;

  const guestBookings = useMemo(
    () =>
      residentReservations(db, residentId)
        .map((reservation) => reservationView(db, reservation, now, lang))
        .filter(
          (view) =>
            view.reservation.bookedFor === 'guest' &&
            (view.reservation.status === 'confirmed' || view.reservation.status === 'checked-in'),
        ),
    [db, residentId, now, lang],
  );
  // Bookings are listed above; activity keeps what happened at the gate and what changed.
  const activity = useMemo(
    () => residentActivity(db, residentId, 20, lang).filter((item) => item.kind !== 'booked').slice(0, 3),
    [db, residentId, lang],
  );

  const mySpace = mine.space;
  const parked = mySpace?.occupancy === 'occupied';

  const openAction = (id: ParkingAction['id']) => {
    switch (id) {
      case 'navigate':
        navigation.navigate('ParkingMap', { spaceId: mySpace?.id });
        return;
      case 'reserve-guest':
        navigation.navigate('ReserveParking', { mode: 'guest' });
        return;
      case 'reserve-ev':
        navigation.navigate('ReserveParking', { mode: 'ev' });
    }
  };

  const actionLook = (tone: ActionTone) =>
    tone === 'primary'
      ? { gradient: colors.buttonEmeraldGradient, text: colors.buttonEmeraldText, style: styles.actionPrimary }
      : tone === 'accent'
        ? { gradient: colors.buttonPrimaryGradient, text: colors.buttonPrimaryText, style: styles.actionAccent }
        : { gradient: null, text: colors.surfaceText, style: styles.actionPlain };

  return (
    <ParkingFrame title={copy.title} subtitle={copy.subtitle}>
      <SummaryCard
        photo={images.parkingHero}
        title={oneLine(copy.bannerTitle)}
        meta={oneLine(copy.bannerBody)}
        metaLines={2}
      />

      {mySpace ? (
        <SummaryCard
          photo={images.parkingSlot}
          title={copy.slot(mySpace.label)}
          subtitle={copy.myParkingTitle}
          badge={<StatusChip label={parked ? copy.carParked : copy.bayFree} tone={parked ? 'teal' : 'slate'} />}
          meta={`${mine.building ? nameIn(mine.building.name, lang) : ''}${SEPARATOR}${mine.zone ? nameIn(mine.zone.level, lang) : ''}`}
          metaIcon={<AppIcon set="material" name="alpha-p-box-outline" size={scale(META_ICON)} color={colors.surfaceIcon} />}
          onPress={() => navigation.navigate('ParkingMap', { spaceId: mySpace.id })}
          accessibilityHint={copy.myParkingHint}
        />
      ) : null}

      {myCar ? (
        <SummaryCard
          photo={images.registeredVehicle}
          photoFit="contain"
          title={`${myCar.make} ${myCar.model}`}
          subtitle={copy.vehicleTitle}
          badge={evCount > 0 ? <StatusChip label={copy.evRegistered(evCount)} tone="indigo" /> : undefined}
          meta={`${nameIn(myCar.colour, lang)}${SEPARATOR}${copy.plate(myCar.plateCountry, myCar.plate)}`}
          metaIcon={<AppIcon set="ionicons" name="car-outline" size={scale(META_ICON)} color={colors.surfaceIcon} />}
        />
      ) : null}

      <View style={styles.stats}>
        {stats.map((stat) => (
          <SurfaceCard key={stat.id} radius={BANNER_RADIUS} rim="feature" style={styles.stat}>
            <AppIcon {...stat.icon} size={scale(15)} color={colors.surfaceIcon} />
            <View
              style={styles.statValue}
              accessible
              accessibilityLabel={`${stat.label}: ${stat.value}${stat.total ? ` ${copy.of} ${stat.total}` : ''}`}
            >
              <AppText variant="figure" color={colors.surfaceText} style={styles.statFigure}>
                {stat.value}
              </AppText>
              {stat.total ? (
                <AppText variant="label" color={colors.surfaceTextMuted}>
                  {` / ${stat.total}`}
                </AppText>
              ) : null}
            </View>
            {stat.progress !== undefined ? (
              <ProgressBar progress={stat.progress} height={3} style={styles.statBar} />
            ) : null}
            <AppText
              variant="label"
              color={colors.surfaceTextMuted}
              numberOfLines={2}
              style={styles.statLabel}
            >
              {stat.label}
            </AppText>
          </SurfaceCard>
        ))}
      </View>
      <AppText variant="label" color={colors.textOnBackgroundMuted}>
        {copy.countsNote(timeIn(now, lang))}
      </AppText>

      <View style={styles.actions}>
        {parkingActions.map((action) => {
          const look = actionLook(action.tone);
          return (
            <Pressable
              key={action.id}
              onPress={() => openAction(action.id)}
              accessibilityRole="button"
              accessibilityLabel={action.label[lang].replace('\n', ' ')}
              style={({ pressed }) => [styles.action, look.style, pressed && styles.pressed]}
            >
              {look.gradient ? (
                <LinearGradient
                  colors={look.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, styles.actionFill]}
                />
              ) : null}
              <AppIcon {...action.icon} size={scale(15)} color={look.text} />
              <AppText variant="bodyStrong" color={look.text} numberOfLines={2} style={styles.actionLabel}>
                {action.label[lang]}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Panel
        title={copy.guestRequestTitle}
        icon="people-outline"
        trailing={
          <Pressable
            onPress={() => navigation.navigate('ReservationHistory')}
            hitSlop={10}
            accessibilityRole="link"
            accessibilityLabel={copy.viewAllLabel}
          >
            <AppText variant="label" color={colors.surfaceAccentText}>
              {copy.viewAll}
            </AppText>
          </Pressable>
        }
      >
        {guestBookings.length === 0 ? (
          <AppText variant="caption" color={colors.surfaceTextMuted}>
            {copy.guestRequestEmpty}
          </AppText>
        ) : (
          guestBookings.slice(0, GUEST_LIMIT).map((view, index) => (
            <ListRow
              key={view.reservation.id}
              divided={index > 0}
              icon={reservationIcon(view)}
              title={view.title}
              lines={reservationLines(view, now, lang)}
              statusLabel={view.status.label}
              statusTone={view.status.tone}
              onPress={() => navigation.navigate('ReservationDetails', { reservationId: view.reservation.id })}
            />
          ))
        )}
        <ParkingButton
          label={copy.reserveGuest}
          icon="add-circle-outline"
          tone="primary"
          onPress={() => navigation.navigate('ReserveParking', { mode: 'guest' })}
        />
      </Panel>

      <Panel title={copy.activityTitle} icon="time-outline">
        {activity.length === 0 ? (
          <AppText variant="caption" color={colors.surfaceTextMuted}>
            {copy.activityEmpty}
          </AppText>
        ) : (
          activity.map((item, index) => (
            <ListRow
              key={item.id}
              divided={index > 0}
              icon={ACTIVITY_ICONS[item.kind]}
              title={item.title}
              lines={[item.detail, item.timeLabel]}
            />
          ))
        )}
      </Panel>

      {/* Demo tooling, kept apart from the resident's own actions. */}
      <Pressable
        onPress={() => navigation.navigate('DemoControls')}
        accessibilityRole="button"
        accessibilityLabel={copy.demoLabel}
        style={({ pressed }) => [styles.demoStrip, pressed && styles.pressed]}
      >
        <AppIcon set="ionicons" name="construct-outline" size={scale(14)} color={colors.textOnBackgroundMuted} />
        <AppText variant="label" color={colors.textOnBackgroundMuted} style={styles.flex}>
          {copy.demo(dateTimeIn(now, lang))}
        </AppText>
      </Pressable>
    </ParkingFrame>
  );
}
