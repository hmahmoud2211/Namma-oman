import { Image, Pressable, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CheckIcon } from '@/components/icons/CheckIcon';
import type { SiteUpdate } from '@/components/ui/LatestUpdateCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

import {
  constructionContent,
  sheetContent,
  type DemoNotification,
  type StageDetail,
  type UnitConstruction,
} from './ConstructionProgressScreen.data';

/** Design dp for the sheet bodies (not in the export; sized to match the page's cards). */
const d = {
  unitRow: { padding: 7, gap: 9, radius: 10, marginTop: 8 },
  unitPhoto: { width: 62, height: 38, radius: 6 },
  check: 11,
  stageRing: { size: 66, stroke: 4.5, doneStroke: 1.5, tick: 22 },
  stageGap: 16,
  row: { gap: 6 },
  section: 16,
  textGap: 3,
  updatePhoto: { height: 150, radius: 10 },
  marker: { size: 16, border: 1.2, tick: 9 },
  stepGap: 14,
  dot: 6,
} as const;

/** Joins a stage's two-line grid label for use in a sentence or title. */
export const stageName = (stage: StageDetail) => stage.label.replace('\n', ' ');

export function UnitPickerSheet({
  units,
  selectedId,
  onSelect,
}: {
  units: readonly UnitConstruction[];
  selectedId: string;
  onSelect: (unit: UnitConstruction) => void;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const copy = sheetContent[locale];
  const page = constructionContent[locale];
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View>
      <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
        {copy.unitPickerHint}
      </AppText>
      {units.map((unit) => {
        const isSelected = unit.id === selectedId;
        return (
          <Pressable
            key={unit.id}
            onPress={() => onSelect(unit)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`${unit.projectName}, ${unit.unitName}, ${unit.overall.percent}% ${page.percentLabel}`}
            style={({ pressed }) => [
              styles.unitRow,
              isSelected && styles.unitRowSelected,
              pressed && styles.pressed,
            ]}
          >
            <Image source={unit.photo} resizeMode="cover" style={styles.unitPhoto} />
            <View style={styles.fill}>
              <AppText variant="panelHeading" color={colors.surfaceText}>
                {unit.unitName}
              </AppText>
              <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
                {`${unit.projectName} · ${unit.role}`}
              </AppText>
            </View>
            <AppText variant="statMedium" color={colors.progressText}>
              {`${unit.overall.percent}%`}
            </AppText>
            <View style={styles.checkSlot}>
              {isSelected && <CheckIcon size={scale(d.check)} color={colors.surfaceIcon} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function StageDetailSheet({ stage }: { stage: StageDetail }) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const copy = sheetContent[locale];
  const { scale } = useResponsive();
  const styles = useStyles();
  const isDone = stage.percent >= 100;
  const status = isDone
    ? copy.stageCompleted
    : stage.startedOn
      ? copy.stageInProgress
      : copy.stageNotStarted;

  return (
    <View>
      <View style={styles.stageSummary}>
        <ProgressRing
          size={scale(d.stageRing.size)}
          strokeWidth={scale(isDone ? d.stageRing.doneStroke : d.stageRing.stroke)}
          progress={isDone ? 0 : stage.percent / 100}
          color={colors.progressText}
          trackColor={isDone ? colors.progressText : colors.progressTrack}
        >
          {isDone ? (
            <CheckIcon size={scale(d.stageRing.tick)} color={colors.progressText} />
          ) : (
            <AppText variant="statMedium" color={colors.progressText}>
              {`${stage.percent}%`}
            </AppText>
          )}
        </ProgressRing>
        <View style={styles.fill}>
          <View style={styles.statusPill}>
            <AppText variant="label" color={colors.badgeText}>
              {status}
            </AppText>
          </View>
          {stage.startedOn && <DetailRow label={copy.stageStarted} value={stage.startedOn} />}
          <DetailRow
            label={isDone ? copy.stageCompleted : copy.stageExpected}
            value={stage.finishOn}
          />
        </View>
      </View>
      <AppText variant="label" color={colors.surfaceAccentText} style={styles.sectionLabel}>
        {copy.stageNote}
      </AppText>
      <AppText variant="bodyLarge" color={colors.surfaceText} style={styles.textGap}>
        {stage.note}
      </AppText>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  return (
    <View style={styles.detailRow}>
      <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
        {label}
      </AppText>
      <AppText variant="labelLarge" color={colors.surfaceText}>
        {value}
      </AppText>
    </View>
  );
}

export function UpdateDetailSheet({ update }: { update: SiteUpdate }) {
  const { colors } = useAppTheme();
  const styles = useStyles();

  return (
    <View>
      <Image source={update.photo} resizeMode="cover" style={styles.updatePhoto} />
      <AppText variant="label" color={colors.surfaceAccentText} style={styles.sectionLabel}>
        {update.date}
      </AppText>
      <AppText variant="panelTitle" color={colors.surfaceText} style={styles.textGap}>
        {update.title}
      </AppText>
      <AppText variant="bodyLarge" color={colors.surfaceTextMuted} style={styles.textGap}>
        {update.body}
      </AppText>
    </View>
  );
}

export function HandoverSheet({ handover }: { handover: UnitConstruction['handover'] }) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const copy = sheetContent[locale];
  const page = constructionContent[locale];
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View>
      <AppText variant="displaySerif" color={colors.surfaceText}>
        {handover.estimate}
      </AppText>
      <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
        {`${page.estimateLabel} · ${copy.handoverIntro}`}
      </AppText>
      {handover.steps.map((step) => (
        <View
          key={step.id}
          style={styles.step}
          accessible
          accessibilityLabel={`${step.title}: ${step.statusLabel}. ${step.date}. ${step.detail}`}
        >
          <View style={[styles.marker, step.reached && styles.markerReached]}>
            {step.reached && <CheckIcon size={scale(d.marker.tick)} color={colors.timelineTick} />}
          </View>
          <View style={styles.fill}>
            <View style={styles.detailRow}>
              <AppText variant="panelHeading" color={colors.surfaceText}>
                {step.title}
              </AppText>
              <AppText variant="label" color={colors.badgeText}>
                {step.statusLabel}
              </AppText>
            </View>
            <AppText variant="label" color={colors.surfaceTextSubtle}>
              {step.date}
            </AppText>
            <AppText variant="labelLarge" color={colors.surfaceTextMuted} style={styles.textGap}>
              {step.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

export function NotificationsSheet({
  notifications,
}: {
  notifications: readonly DemoNotification[];
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const copy = sheetContent[locale];
  const styles = useStyles();

  if (notifications.length === 0) {
    return (
      <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
        {copy.noNotifications}
      </AppText>
    );
  }

  return (
    <View>
      {notifications.map((item, index) => (
        <View
          key={item.id}
          style={[styles.notification, index > 0 && styles.notificationDivider]}
          accessible
          accessibilityLabel={`${item.title}. ${item.body}. ${item.time}`}
        >
          <View style={styles.notificationDot} />
          <View style={styles.fill}>
            <View style={styles.detailRow}>
              <AppText variant="panelHeading" color={colors.surfaceText}>
                {item.title}
              </AppText>
              <AppText variant="label" color={colors.surfaceTextSubtle}>
                {item.time}
              </AppText>
            </View>
            <AppText variant="labelLarge" color={colors.surfaceTextMuted} style={styles.textGap}>
              {item.body}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  fill: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  textGap: {
    marginTop: scale(d.textGap),
  },
  sectionLabel: {
    marginTop: scale(d.section),
  },
  unitRow: {
    marginTop: scale(d.unitRow.marginTop),
    padding: scale(d.unitRow.padding),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.unitRow.gap),
    borderRadius: scale(d.unitRow.radius),
    borderWidth: scale(0.5),
    borderColor: colors.surfaceDivider,
  },
  unitRowSelected: {
    borderColor: colors.surfaceIcon,
    backgroundColor: colors.menuActiveFill,
  },
  // Explicit width/height: Image pre-fills the asset's intrinsic size.
  unitPhoto: {
    width: scale(d.unitPhoto.width),
    height: scale(d.unitPhoto.height),
    borderRadius: scale(d.unitPhoto.radius),
    borderWidth: scale(0.5),
    borderColor: colors.photoBorder,
  },
  checkSlot: {
    width: scale(d.check),
    alignItems: 'center',
  },
  stageSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.stageGap),
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: scale(7),
    paddingVertical: scale(2),
    marginBottom: scale(d.row.gap),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.6),
    borderColor: colors.badgeBorder,
    backgroundColor: colors.badgeFill,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: scale(d.row.gap),
    marginTop: scale(d.textGap),
  },
  updatePhoto: {
    width: '100%',
    height: scale(d.updatePhoto.height),
    borderRadius: scale(d.updatePhoto.radius),
    borderWidth: scale(0.5),
    borderColor: colors.photoBorder,
  },
  step: {
    marginTop: scale(d.stepGap),
    flexDirection: 'row',
    columnGap: scale(10),
  },
  marker: {
    marginTop: scale(2),
    width: scale(d.marker.size),
    height: scale(d.marker.size),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.marker.border),
    borderColor: colors.timelinePending,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerReached: {
    borderColor: colors.surfaceIcon,
    backgroundColor: colors.surfaceIcon,
  },
  notification: {
    flexDirection: 'row',
    columnGap: scale(10),
    paddingVertical: scale(10),
  },
  notificationDivider: {
    borderTopWidth: scale(0.5),
    borderTopColor: colors.surfaceDivider,
  },
  notificationDot: {
    marginTop: scale(4),
    width: scale(d.dot),
    height: scale(d.dot),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.notificationDot,
  },
}));
