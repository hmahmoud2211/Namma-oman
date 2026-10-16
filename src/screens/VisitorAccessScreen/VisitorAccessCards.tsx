import { Pressable, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { Avatar } from '@/components/ui/Avatar';
import { Panel } from '@/components/ui/Panel';
import { StatusChip, type StatusTone } from '@/components/ui/StatusChip';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

/** Design dp. */
const d = {
  qr: { size: 52, padding: 3, border: 1.2, radius: 4 },
  detailsGap: 10,
  info: { icon: 9, gap: 4, separator: 9, separatorGap: 7 },
  more: { column: 18, icon: 11 },
  row: { height: 38, avatar: 24, gap: 7, car: 10, plate: 38, chip: 50, chevron: 8 },
} as const;

interface VisitorPassCardProps {
  /** Encoded into the QR code. */
  qrValue: string;
  qrLabel: string;
  name: string;
  /** Date and time, e.g. "Today • 02:30 PM". */
  schedule: string;
  guestsLabel: string;
  /** Car plate; left out when there is none. */
  plate?: string;
  caption: string;
  statusLabel: string;
  statusIcon: Glyph;
  moreLabel: string;
  onMorePress: () => void;
}

/** The active visitor pass: QR code, holder, visit details and status, with its options. */
export function VisitorPassCard({
  qrValue,
  qrLabel,
  name,
  schedule,
  guestsLabel,
  plate,
  caption,
  statusLabel,
  statusIcon,
  moreLabel,
  onMorePress,
}: VisitorPassCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Panel style={styles.card}>
      <View
        style={styles.qrFrame}
        accessible
        accessibilityRole="image"
        accessibilityLabel={qrLabel}
      >
        <QRCode
          value={qrValue}
          size={scale(d.qr.size)}
          // Low correction keeps the code coarse enough to read at this size.
          ecl="L"
          color={colors.qrModule}
          backgroundColor={colors.qrBackground}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.nameRow}>
          <AppText
            variant="panelHeading"
            color={colors.surfaceText}
            numberOfLines={2}
            style={styles.flex}
          >
            {name}
          </AppText>
          {/* The active pass is always drawn in the positive tone, whatever its status. */}
          <StatusChip label={statusLabel} tone="positive" icon={statusIcon} />
        </View>
        <AppText variant="label" color={colors.surfaceTextMuted} style={styles.gapSmall}>
          {schedule}
        </AppText>
        <View style={styles.infoRow}>
          <AppIcon
            set="ionicons"
            name="people-outline"
            size={scale(d.info.icon)}
            color={colors.surfaceIcon}
          />
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {guestsLabel}
          </AppText>
          {plate ? (
            <>
              <View style={styles.infoSeparator} />
              <AppIcon
                set="ionicons"
                name="car-outline"
                size={scale(d.info.icon)}
                color={colors.surfaceIcon}
              />
              <AppText variant="label" color={colors.surfaceTextMuted}>
                {plate}
              </AppText>
            </>
          ) : null}
        </View>
        <AppText variant="labelSmall" color={colors.surfaceTextMuted} style={styles.gap}>
          {caption}
        </AppText>
      </View>

      <View style={styles.divider} />
      <Pressable
        onPress={onMorePress}
        hitSlop={{ top: scale(10), bottom: scale(10), left: scale(4), right: scale(4) }}
        accessibilityRole="button"
        accessibilityLabel={moreLabel}
        style={({ pressed }) => [styles.more, pressed && styles.pressed]}
      >
        <AppIcon
          set="ionicons"
          name="ellipsis-vertical"
          size={scale(d.more.icon)}
          color={colors.surfaceText}
        />
      </Pressable>
    </Panel>
  );
}

interface VisitorRowProps {
  name: string;
  /** Visit time and party size, e.g. "Today, 11:00 AM • 1 Guest". */
  meta: string;
  initials: string;
  plate?: string;
  statusLabel: string;
  statusTone: StatusTone;
  /** Hairline along the top, separating the row from the one above. */
  divided: boolean;
  hint: string;
  onPress: () => void;
}

/** One visitor in Upcoming Visitors: who, when, car and status. Tapping it shows their pass. */
export function VisitorRow({
  name,
  meta,
  initials,
  plate,
  statusLabel,
  statusTone,
  divided,
  hint,
  onPress,
}: VisitorRowProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[name, meta, plate, statusLabel].filter(Boolean).join(', ')}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.row, divided && styles.rowDivided, pressed && styles.pressed]}
    >
      <Avatar initials={initials} size={d.row.avatar} />
      <View style={styles.rowText}>
        <AppText variant="panelLabel" color={colors.surfaceText} numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="labelSmall" color={colors.surfaceTextMuted} numberOfLines={1}>
          {meta}
        </AppText>
      </View>
      <AppIcon
        set="ionicons"
        name="car-outline"
        size={scale(d.row.car)}
        color={colors.surfaceIcon}
      />
      <AppText
        variant="labelSmall"
        color={colors.surfaceTextMuted}
        numberOfLines={1}
        style={styles.plate}
      >
        {plate || '—'}
      </AppText>
      <View style={styles.chip}>
        <StatusChip label={statusLabel} tone={statusTone} />
      </View>
      <ChevronIcon size={scale(d.row.chevron)} color={colors.surfaceText} strokeWidth={3} />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrFrame: {
    padding: scale(d.qr.padding),
    borderRadius: scale(d.qr.radius),
    borderWidth: scale(d.qr.border),
    borderColor: colors.qrFrame,
    backgroundColor: colors.qrBackground,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: scale(6), color: colors.homeDiscGlow }],
  },
  details: {
    flex: 1,
    marginHorizontal: scale(d.detailsGap),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: scale(6),
  },
  gapSmall: {
    marginTop: scale(3),
  },
  gap: {
    marginTop: scale(6),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.info.gap),
    marginTop: scale(6),
  },
  infoSeparator: {
    width: StyleSheet.hairlineWidth,
    height: scale(d.info.separator),
    marginHorizontal: scale(d.info.separatorGap - d.info.gap),
    backgroundColor: colors.surfaceDivider,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: scale(6),
    backgroundColor: colors.surfaceDivider,
  },
  more: {
    width: scale(d.more.column),
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    height: scale(d.row.height),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.row.gap),
  },
  rowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceDivider,
  },
  rowText: {
    flex: 1,
  },
  plate: {
    width: scale(d.row.plate),
  },
  chip: {
    width: scale(d.row.chip),
    alignItems: 'center',
  },
}));
