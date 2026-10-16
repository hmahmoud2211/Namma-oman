import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

/** Design dp, sized for Home's 296.8-dp column. */
const d = {
  scene: { aspect: 1.08, radius: 7, icon: 12, bottom: 5, borderWidth: 0.6, activeBorder: 1.2 },
  gauge: { stroke: 6.5, glowStroke: 11, sweep: 270, leaf: 10, trendIcon: 7, overlap: 0.2 },
  energyRow: { height: 21, radius: 6, paddingX: 7, icon: 10, gap: 6 },
  device: {
    radius: 8,
    padding: 7,
    badge: 22,
    badgeIcon: 12,
    badgeGap: 7,
    dot: 4.5,
    statusTop: 5,
    chevron: 7,
  },
  automation: { minHeight: 36, radius: 8, paddingX: 8, icon: 13, iconBox: 18, gap: 8, chevron: 8 },
  borderWidth: 0.6,
} as const;

interface SceneTileProps {
  label: string;
  icon: Glyph;
  active: boolean;
  onPress: () => void;
}

/** One scene: a glass tile with its glyph and name; the running scene is rimmed in gold. */
export function SceneTile({ label, icon, active, onPress }: SceneTileProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.scene, active && styles.sceneGlow, pressed && styles.pressed]}
    >
      <View style={[styles.sceneFrame, active ? styles.sceneActive : styles.sceneIdle]}>
        <LinearGradient
          colors={colors.sceneTileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={colors.sceneScrim}
          locations={[0.25, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.sceneCaption}>
          <AppIcon
            {...icon}
            size={scale(d.scene.icon)}
            color={active ? colors.accent : colors.white}
          />
          <AppText variant="labelSmall" color={colors.white} align="center" numberOfLines={2}>
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

interface EnergyGaugeProps {
  /** e.g. "12.4 kWh". */
  value: string;
  caption: string;
  /** How full the arc is, 0-1. */
  fraction: number;
  /** e.g. "12%". */
  trend: string;
  /** True when usage is down, which draws the trend as a saving. */
  trendDown: boolean;
  trendCaption: string;
  /** Spoken in place of the arrow, e.g. "down". */
  trendWord: string;
  /** Diameter in design dp. */
  size: number;
}

/** A point on the gauge's circle, `degrees` clockwise from the top. */
function point(c: number, r: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return { x: c + r * Math.sin(radians), y: c - r * Math.cos(radians) };
}

function arc(c: number, r: number, from: number, to: number) {
  const a = point(c, r, from);
  const b = point(c, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

/** The Energy Usage dial: today's consumption against the day's budget, open at the bottom. */
export function EnergyGauge({
  value,
  caption,
  fraction,
  trend,
  trendDown,
  trendCaption,
  trendWord,
  size,
}: EnergyGaugeProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  const box = scale(size);
  const c = box / 2;
  const glow = scale(d.gauge.glowStroke);
  const r = (box - glow) / 2;
  const start = -d.gauge.sweep / 2;
  const end = start + d.gauge.sweep * Math.min(Math.max(fraction, 0), 1);
  const trendColor = trendDown ? colors.statusPositive : colors.statusWarning;

  return (
    <View
      style={{ width: box, height: box * (1 + d.gauge.overlap / 2) }}
      accessible
      accessibilityLabel={`${value} ${caption}, ${trendWord} ${trend} ${trendCaption}`}
    >
      <Svg width={box} height={box}>
        <Path
          d={arc(c, r, start, start + d.gauge.sweep)}
          stroke={colors.progressTrack}
          strokeWidth={scale(d.gauge.stroke)}
          strokeLinecap="round"
          fill="none"
        />
        {fraction > 0 ? (
          <>
            <Path
              d={arc(c, r, start, end)}
              stroke={colors.progressGlow}
              strokeWidth={glow}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d={arc(c, r, start, end)}
              stroke={colors.progressText}
              strokeWidth={scale(d.gauge.stroke)}
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : null}
      </Svg>

      <View style={[styles.gaugeCentre, { width: box, height: box }]} pointerEvents="none">
        <AppIcon
          set="ionicons"
          name="leaf-outline"
          size={scale(d.gauge.leaf)}
          color={colors.progressText}
        />
        <AppText variant="value" color={colors.surfaceText}>
          {value}
        </AppText>
        <AppText variant="labelSmall" color={colors.surfaceTextMuted}>
          {caption}
        </AppText>
      </View>

      <View style={styles.gaugeTrend} pointerEvents="none">
        <View style={styles.gaugeTrendRow}>
          <AppIcon
            set="ionicons"
            name={trendDown ? 'caret-down' : 'caret-up'}
            size={scale(d.gauge.trendIcon)}
            color={trendColor}
          />
          <AppText variant="panelLabel" color={trendColor}>
            {trend}
          </AppText>
        </View>
        <AppText variant="labelTiny" color={colors.surfaceTextMuted}>
          {trendCaption}
        </AppText>
      </View>
    </View>
  );
}

interface EnergyLineProps {
  label: string;
  value: string;
  icon: Glyph;
  iconColor: string;
}

/** One breakdown line: a category's (or a room's) use today. */
export function EnergyLine({ label, value, icon, iconColor }: EnergyLineProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  return (
    <View style={styles.energyLine} accessible accessibilityLabel={`${label}, ${value}`}>
      <AppIcon {...icon} size={scale(d.energyRow.icon)} color={iconColor} />
      <AppText
        variant="labelLarge"
        color={colors.surfaceText}
        numberOfLines={1}
        style={styles.flex}
      >
        {label}
      </AppText>
      <AppText variant="panelLabel" color={colors.surfaceText}>
        {value}
      </AppText>
    </View>
  );
}

interface DeviceCardProps {
  name: string;
  location: string;
  icon: Glyph;
  statusLabel: string;
  online: boolean;
  enabled: boolean;
  /** Omitted for devices with nothing to switch, e.g. sensors and cameras. */
  onToggle?: (next: boolean) => void;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** One device in Smart Devices: badge, name, room and status, with its switch. */
export function DeviceCard({
  name,
  location,
  icon,
  statusLabel,
  online,
  enabled,
  onToggle,
  onPress,
  style,
}: DeviceCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={[styles.device, style]}>
      {/* The switch sits beside the card's button: a button may not hold another. */}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${location}, ${statusLabel}`}
        style={({ pressed }) => [styles.deviceBody, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={colors.surfaceIconTileGradient}
          style={[styles.deviceBadge, !enabled && styles.dim]}
        >
          <AppIcon {...icon} size={scale(d.device.badgeIcon)} color={colors.surfaceIcon} />
        </LinearGradient>
        <View style={styles.deviceText}>
          <AppText
            variant="panelHeading"
            color={colors.surfaceText}
            numberOfLines={2}
            style={styles.deviceName}
          >
            {name}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted} numberOfLines={1}>
            {location}
          </AppText>
          <View style={styles.deviceStatus}>
            <View
              style={[
                styles.dot,
                { backgroundColor: online ? colors.statusPositive : colors.surfaceTextSubtle },
              ]}
            />
            <AppText variant="labelSmall" color={colors.surfaceTextMuted} style={styles.flex}>
              {statusLabel}
            </AppText>
            <ChevronIcon
              size={scale(d.device.chevron)}
              color={colors.surfaceText}
              strokeWidth={3}
            />
          </View>
        </View>
      </Pressable>
      {onToggle ? (
        <ToggleSwitch
          value={enabled}
          onValueChange={onToggle}
          accessibilityLabel={name}
          style={styles.deviceSwitch}
        />
      ) : null}
    </View>
  );
}

interface AutomationRowProps {
  title: string;
  summary: string;
  icon: Glyph;
  enabled: boolean;
  onToggle: (next: boolean) => void;
  onPress: () => void;
}

/** One routine in Device Automation: what it does, and a switch to arm it. */
export function AutomationRow({
  title,
  summary,
  icon,
  enabled,
  onToggle,
  onPress,
}: AutomationRowProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={styles.automation}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${summary}`}
        style={({ pressed }) => [styles.automationBody, pressed && styles.pressed]}
      >
        <View style={styles.automationIcon}>
          <AppIcon {...icon} size={scale(d.automation.icon)} color={colors.surfaceIcon} />
        </View>
        <View style={styles.flex}>
          <AppText variant="panelHeading" color={colors.surfaceText} numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted} numberOfLines={2}>
            {summary}
          </AppText>
        </View>
      </Pressable>
      <ToggleSwitch value={enabled} onValueChange={onToggle} accessibilityLabel={title} />
      <View style={styles.automationChevron} pointerEvents="none">
        <ChevronIcon
          size={scale(d.automation.chevron)}
          color={colors.surfaceText}
          strokeWidth={3}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  dim: {
    opacity: 0.45,
  },

  scene: {
    flex: 1,
    aspectRatio: d.scene.aspect,
    borderRadius: scale(d.scene.radius),
  },
  sceneGlow: {
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: scale(6), color: colors.homeDiscGlow }],
  },
  sceneFrame: {
    flex: 1,
    borderRadius: scale(d.scene.radius),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  sceneIdle: {
    borderWidth: scale(d.scene.borderWidth),
    borderColor: colors.surfaceBorder,
  },
  sceneActive: {
    borderWidth: scale(d.scene.activeBorder),
    borderColor: colors.sceneActive,
  },
  sceneCaption: {
    alignItems: 'center',
    rowGap: scale(2),
    paddingBottom: scale(d.scene.bottom),
    paddingHorizontal: scale(2),
  },

  gaugeCentre: {
    position: 'absolute',
    top: 0,
    start: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTrend: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    alignItems: 'center',
  },
  gaugeTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(2),
  },

  energyLine: {
    height: scale(d.energyRow.height),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.energyRow.gap),
    paddingHorizontal: scale(d.energyRow.paddingX),
    borderRadius: scale(d.energyRow.radius),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceDivider,
    backgroundColor: colors.fieldFill,
  },

  device: {
    flexGrow: 1,
    borderRadius: scale(d.device.radius),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.fieldBorder,
    backgroundColor: colors.fieldFill,
  },
  deviceBody: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: scale(d.device.padding),
  },
  deviceBadge: {
    width: scale(d.device.badge),
    height: scale(d.device.badge),
    borderRadius: scale(6),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceText: {
    flex: 1,
    marginStart: scale(d.device.badgeGap),
  },
  // Leaves room for the switch at the top end of the card.
  deviceName: {
    marginEnd: scale(26),
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(3),
    marginTop: 'auto',
    paddingTop: scale(d.device.statusTop),
  },
  dot: {
    width: scale(d.device.dot),
    height: scale(d.device.dot),
    borderRadius: borderRadius.pill,
  },
  deviceSwitch: {
    position: 'absolute',
    top: scale(d.device.padding),
    end: scale(d.device.padding),
  },

  automation: {
    minHeight: scale(d.automation.minHeight),
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: scale(d.automation.paddingX),
    borderRadius: scale(d.automation.radius),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceDivider,
    backgroundColor: colors.fieldFill,
  },
  automationBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.automation.gap),
    paddingStart: scale(d.automation.paddingX),
    paddingEnd: scale(d.automation.gap),
    paddingVertical: scale(5),
  },
  automationIcon: {
    width: scale(d.automation.iconBox),
    alignItems: 'center',
  },
  automationChevron: {
    marginStart: scale(8),
  },
}));
