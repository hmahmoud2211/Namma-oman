import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { ParkingIcon } from '@/components/icons/ParkingIcon';
import { InnerScreen } from '@/components/layout/InnerScreen';
import { ListRow } from '@/components/ui/ListRow';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusChip } from '@/components/ui/StatusChip';
import type { Locale } from '@/context/LocaleContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import { addDays, formatDay, formatTime, formatTimeRange } from '@/utils/date';

import { guestsLabel } from '../VisitorAccessScreen/VisitorAccessScreen.data';
import {
  SEPARATOR,
  activityKindDisplay,
  activityStatusLabel,
  guestRequestStatusDisplay,
  latestGuestRequest,
  mySlot,
  myVehicle,
  parkingActions,
  parkingContent,
  parkingStats,
  recentActivity,
  slotStatusDisplay,
  type ActionTone,
} from './ParkingScreen.data';
import { useParkingStyles } from './ParkingScreen.styles';

export function ParkingScreen() {
  const styles = useParkingStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const copy = parkingContent[locale];
  // Directions to the bay, the guest parking form, vehicle registration and the full lists
  // aren't designed yet (in Parklane either).
  const showUnderDevelopment = useUnderDevelopment();

  const slotStatus = slotStatusDisplay[mySlot.status];
  const request = latestGuestRequest;
  const requestStatus = guestRequestStatusDisplay[request.status];
  const viewAll = { actionLabel: copy.viewAll, onActionPress: showUnderDevelopment };

  const actionLook = (tone: ActionTone) =>
    tone === 'primary'
      ? {
          gradient: colors.buttonEmeraldGradient,
          text: colors.buttonEmeraldText,
          style: styles.actionPrimary,
        }
      : tone === 'accent'
        ? {
            gradient: colors.buttonPrimaryGradient,
            text: colors.buttonPrimaryText,
            style: styles.actionAccent,
          }
        : { gradient: null, text: colors.surfaceText, style: styles.actionPlain };

  return (
    <InnerScreen overline={copy.overline} title={copy.title} subtitle={copy.subtitle}>
      <Panel style={styles.feature}>
        <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.featureTile}>
          <ParkingIcon size={scale(26)} color={colors.surfaceIcon} />
        </LinearGradient>
        <View style={styles.featureText}>
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {copy.myParkingTitle}
          </AppText>
          <AppText variant="cardTitle" color={colors.surfaceText} style={styles.headline}>
            {copy.slot(mySlot.code)}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {`${mySlot.tower[locale]}${SEPARATOR}${mySlot.level[locale]}`}
          </AppText>
        </View>
        <StatusChip label={slotStatus.label[locale]} tone={slotStatus.tone} />
      </Panel>

      <Pressable
        onPress={showUnderDevelopment}
        accessibilityRole="button"
        accessibilityHint={copy.vehicleHint}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Panel style={styles.feature}>
          <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.featureTile}>
            <AppIcon
              set="ionicons"
              name="car-sport-outline"
              size={scale(26)}
              color={colors.surfaceIcon}
            />
          </LinearGradient>
          <View style={styles.featureText}>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.vehicleTitle}
            </AppText>
            <AppText variant="cardTitle" color={colors.surfaceText} style={styles.headline}>
              {`${myVehicle.make[locale]} ${myVehicle.model}`}
            </AppText>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {`${myVehicle.colour[locale]}${SEPARATOR}${copy.plate(myVehicle.plateCountry[locale], myVehicle.plate)}`}
            </AppText>
          </View>
          {/* Wrapped: a bare SVG would paint under the card's glass on web. */}
          <View>
            <ChevronIcon size={scale(10.4)} color={colors.surfaceText} strokeWidth={3} />
          </View>
        </Panel>
      </Pressable>

      <View style={styles.stats}>
        {parkingStats(locale).map((stat) => (
          <Panel key={stat.id} style={styles.stat}>
            <AppIcon {...stat.icon} size={scale(13)} color={colors.surfaceIcon} />
            <View
              style={styles.statValue}
              accessible
              accessibilityLabel={`${stat.label}: ${stat.value}${stat.total ? ` / ${stat.total}` : ''}`}
            >
              <AppText variant="cardTitle" color={colors.surfaceText}>
                {stat.value}
              </AppText>
              {stat.total ? (
                <AppText variant="labelSmall" color={colors.surfaceTextMuted}>
                  {` / ${stat.total}`}
                </AppText>
              ) : null}
            </View>
            {stat.progress !== undefined ? (
              <ProgressBar progress={stat.progress} height={3} style={styles.statBar} />
            ) : null}
            <AppText
              variant="labelSmall"
              color={colors.surfaceTextMuted}
              numberOfLines={2}
              style={styles.statLabel}
            >
              {stat.label}
            </AppText>
          </Panel>
        ))}
      </View>

      <View style={styles.actions}>
        {parkingActions.map((action) => {
          const look = actionLook(action.tone);
          const label = action.label[locale];
          return (
            <Pressable
              key={action.id}
              onPress={showUnderDevelopment}
              accessibilityRole="button"
              accessibilityLabel={label}
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
              <AppIcon {...action.icon} size={scale(13)} color={look.text} />
              <AppText
                variant="labelLarge"
                color={look.text}
                numberOfLines={2}
                style={styles.actionLabel}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Panel>
        <PanelHeading
          title={copy.guestRequestTitle}
          icon={{ set: 'ionicons', name: 'people-outline' }}
          {...viewAll}
        />
        <ListRow
          icon={{ set: 'ionicons', name: 'calendar-outline' }}
          title={formatDay(addDays(new Date(), request.dayOffset), locale)}
          details={[
            formatTimeRange(request.from, request.to, locale),
            guestsLabel(request.guests, locale),
          ]}
          trailing={<StatusChip label={requestStatus.label[locale]} tone={requestStatus.tone} />}
          onPress={showUnderDevelopment}
        />
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.activityTitle}
          icon={{ set: 'ionicons', name: 'time-outline' }}
          {...viewAll}
        />
        <View>
          {activityRows(locale).map((row, index) => (
            <ListRow
              key={row.id}
              divided={index > 0}
              icon={row.icon}
              title={row.title}
              details={[row.detail]}
              time={row.time}
              trailing={<StatusChip label={row.status} tone={row.tone} />}
            />
          ))}
        </View>
      </Panel>
    </InnerScreen>
  );
}

/** Today's activity entries as the rows show them. */
function activityRows(locale: Locale) {
  const today = formatDay(addDays(new Date(), 0), locale);
  return recentActivity.map((entry) => {
    const kind = activityKindDisplay[entry.kind];
    const detail =
      typeof entry.detail === 'string' ? entry.detail : guestsLabel(entry.detail.guests, locale);
    return {
      id: entry.id,
      icon: kind.icon,
      tone: kind.tone,
      title: kind.title[locale],
      detail: `${entry.subject[locale]}${SEPARATOR}${detail}`,
      time: `${today}, ${formatTime(entry.time, locale)}`,
      status: activityStatusLabel[locale][entry.status],
    };
  });
}
