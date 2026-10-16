import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { ColorTokens } from '@/theme/colors';
import { makeStyles } from '@/utils/makeStyles';

import {
  acModeLabels,
  climate,
  curtainActions,
  lighting,
  mediaSources,
  smartHomeContent,
  type AcMode,
  type BulbPreset,
  type ControlCardInfo,
  type CurtainAction,
  type IconTone,
} from './SmartHomeScreen.data';

/** Design dp, sized for a half-width card in Home's 296.8-dp column. */
const d = {
  headingIcon: 13,
  offOpacity: 0.4,
  bodyTop: 8,
  sun: { small: 9, large: 11 },
  slider: { height: 16, track: 3, thumb: 9, gap: 4, value: 24 },
  preset: { rowTop: 9, well: 19, dot: 9.5, ring: 1, colourRing: 12, colourStroke: 2 },
  step: { size: 20, icon: 11, borderWidth: 0.9 },
  rule: { top: 6 },
  fan: { rowTop: 5, icon: 11, bar: { width: 3.6, height: 6.5, gap: 1.6 }, barsGap: 5, chevron: 7 },
  curtain: { size: 30, icon: 12, labelGap: 3, borderWidth: 0.6 },
  media: { size: 24, icon: 13, radius: 6, labelGap: 3, borderWidth: 0.6 },
} as const;

export function toneColor(colors: ColorTokens, tone: IconTone): string {
  return tone === 'warm' ? colors.iconWarm : tone === 'cool' ? colors.iconCool : colors.surfaceIcon;
}

interface ControlCardProps {
  info: ControlCardInfo;
  on: boolean;
  onToggle: (next: boolean) => void;
  children: ReactNode;
}

/**
 * One of the half-width control cards (Lighting, AC, Curtains, TV & Media): icon, title,
 * supporting line and an on/off switch. Switching off dims and disables the controls below.
 */
export function ControlCard({ info, on, onToggle, children }: ControlCardProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const title = info.title[locale];

  return (
    <Panel style={styles.card}>
      <PanelHeading
        title={title}
        subtitle={info.subtitle[locale]}
        icon={
          <AppIcon
            {...info.icon}
            size={scale(d.headingIcon)}
            color={toneColor(colors, info.tone)}
          />
        }
        trailing={<ToggleSwitch value={on} onValueChange={onToggle} accessibilityLabel={title} />}
      />
      <View
        style={[styles.body, !on && styles.off]}
        pointerEvents={on ? 'auto' : 'none'}
        accessibilityElementsHidden={!on}
        importantForAccessibility={on ? 'auto' : 'no-hide-descendants'}
      >
        {children}
      </View>
    </Panel>
  );
}

/** Six arcs around a circle, one per hue, so the ring reads as a colour wheel. */
function arcPath(index: number, count: number, size: number, stroke: number) {
  const r = (size - stroke) / 2;
  const c = size / 2;
  const span = (2 * Math.PI) / count;
  const start = index * span - Math.PI / 2;
  const end = start + span + 0.02; // A hair of overlap hides the seams.
  return `M ${c + r * Math.cos(start)} ${c + r * Math.sin(start)} A ${r} ${r} 0 0 1 ${
    c + r * Math.cos(end)
  } ${c + r * Math.sin(end)}`;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface LightingControlsProps {
  /** 0-1. */
  brightness: number;
  onBrightnessChange: (next: number) => void;
  presetId: BulbPreset;
  onPresetChange: (id: BulbPreset) => void;
  onCustomColourPress: () => void;
}

/** The Lighting card's body: brightness, colour presets and the custom-colour ring. */
export function LightingControls({
  brightness,
  onBrightnessChange,
  presetId,
  onPresetChange,
  onCustomColourPress,
}: LightingControlsProps) {
  const { colors } = useAppTheme();
  const { locale, isRTL } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = smartHomeContent[locale];
  const [trackWidth, setTrackWidth] = useState(0);
  const percent = Math.round(brightness * 100);

  // The slider's children ignore touches, so locationX is always across the track.
  // In Arabic the slider fills from the right.
  const seek = (event: GestureResponderEvent) => {
    if (trackWidth > 0) {
      const x = event.nativeEvent.locationX;
      onBrightnessChange(clamp((isRTL ? trackWidth - x : x) / trackWidth, 0, 1));
    }
  };
  const step = (direction: 1 | -1) =>
    onBrightnessChange(clamp(brightness + direction * lighting.brightnessStep, 0, 1));
  const ringSize = scale(d.preset.colourRing);
  const ringStroke = scale(d.preset.colourStroke);

  return (
    <View>
      <View style={styles.sliderRow}>
        <AppIcon
          set="ionicons"
          name="sunny-outline"
          size={scale(d.sun.small)}
          color={colors.iconWarm}
        />
        <View
          style={styles.slider}
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          // Holds the drag, so the page does not scroll out from under the thumb.
          onResponderTerminationRequest={() => false}
          onResponderGrant={seek}
          onResponderMove={seek}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={copy.brightness}
          accessibilityValue={{ min: 0, max: 100, now: percent, text: `${percent}%` }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(event) =>
            step(event.nativeEvent.actionName === 'increment' ? 1 : -1)
          }
        >
          <View style={styles.track} pointerEvents="none">
            <LinearGradient
              colors={colors.sliderGradient}
              start={{ x: isRTL ? 1 : 0, y: 0.5 }}
              end={{ x: isRTL ? 0 : 1, y: 0.5 }}
              style={[styles.fill, { width: `${percent}%` }]}
            />
          </View>
          <View
            pointerEvents="none"
            style={[styles.thumb, { start: trackWidth * brightness - scale(d.slider.thumb) / 2 }]}
          />
        </View>
        <AppIcon
          set="ionicons"
          name="sunny-outline"
          size={scale(d.sun.large)}
          color={colors.iconWarm}
        />
        <AppText variant="labelLarge" color={colors.surfaceText} style={styles.value}>
          {`${percent}%`}
        </AppText>
      </View>

      <View style={styles.presetRow}>
        <View style={styles.well} accessibilityRole="radiogroup">
          {lighting.presets.map((preset) => {
            const selected = preset.id === presetId;
            return (
              <Pressable
                key={preset.id}
                onPress={() => onPresetChange(preset.id)}
                hitSlop={scale(3)}
                accessibilityRole="radio"
                accessibilityLabel={preset.label[locale]}
                accessibilityState={{ selected }}
                style={[styles.dotRing, selected && styles.dotRingSelected]}
              >
                <View style={[styles.dot, { backgroundColor: colors.bulbPresets[preset.id] }]} />
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={onCustomColourPress}
          hitSlop={scale(4)}
          accessibilityRole="button"
          accessibilityLabel={copy.customColour}
          style={({ pressed }) => [styles.colourWell, pressed && styles.pressed]}
        >
          <Svg width={ringSize} height={ringSize}>
            {colors.hueRing.map((hue, index) => (
              <Path
                key={hue}
                d={arcPath(index, colors.hueRing.length, ringSize, ringStroke)}
                stroke={hue}
                strokeWidth={ringStroke}
                fill="none"
              />
            ))}
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

interface ClimateControlsProps {
  temperature: number;
  onTemperatureChange: (next: number) => void;
  fanSpeed: number;
  onFanSpeedChange: (next: number) => void;
  mode: AcMode;
  onModeChange: (next: AcMode) => void;
}

/** The AC card's body: set point, fan speed and mode. */
export function ClimateControls({
  temperature,
  onTemperatureChange,
  fanSpeed,
  onFanSpeedChange,
  mode,
  onModeChange,
}: ClimateControlsProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = smartHomeContent[locale];
  const modeLabels = acModeLabels[locale];

  const atMin = temperature <= climate.minTemperature;
  const atMax = temperature >= climate.maxTemperature;
  // No drop-down is designed, so the picker steps through the modes.
  const nextMode = climate.modes[(climate.modes.indexOf(mode) + 1) % climate.modes.length];

  const stepButton = (direction: -1 | 1) => {
    const disabled = direction < 0 ? atMin : atMax;
    return (
      <Pressable
        onPress={() => onTemperatureChange(temperature + direction)}
        disabled={disabled}
        hitSlop={scale(6)}
        accessibilityRole="button"
        accessibilityLabel={direction < 0 ? copy.lowerTemperature : copy.raiseTemperature}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.step,
          direction < 0 ? styles.stepCool : styles.stepWarm,
          (pressed || disabled) && styles.pressed,
        ]}
      >
        <AppIcon
          set="ionicons"
          name={direction < 0 ? 'remove' : 'add'}
          size={scale(d.step.icon)}
          color={colors.surfaceText}
        />
      </Pressable>
    );
  };

  return (
    <View>
      <View style={styles.setPointRow}>
        {stepButton(-1)}
        <AppText
          variant="statLarge"
          color={colors.surfaceText}
          align="center"
          style={styles.setPoint}
          accessibilityLiveRegion="polite"
          accessibilityLabel={copy.degrees(temperature)}
        >
          {`${temperature}°`}
        </AppText>
        {stepButton(1)}
      </View>

      <View style={styles.rule} />

      <View style={styles.fanRow}>
        <AppIcon set="material" name="fan" size={scale(d.fan.icon)} color={colors.surfaceIcon} />
        <View style={styles.bars}>
          {Array.from({ length: climate.fanLevels }, (_, index) => {
            const level = index + 1;
            return (
              <Pressable
                key={level}
                onPress={() => onFanSpeedChange(level)}
                hitSlop={{ top: scale(8), bottom: scale(8) }}
                accessibilityRole="button"
                accessibilityLabel={copy.fanSpeed(level)}
                accessibilityState={{ selected: level === fanSpeed }}
                style={[styles.bar, level <= fanSpeed ? styles.barLit : styles.barOff]}
              />
            );
          })}
        </View>
        <Pressable
          onPress={() => onModeChange(nextMode)}
          hitSlop={scale(6)}
          accessibilityRole="button"
          accessibilityLabel={copy.mode(modeLabels[mode])}
          accessibilityHint={copy.switchesTo(modeLabels[nextMode])}
          style={({ pressed }) => [styles.mode, pressed && styles.pressed]}
        >
          <AppText variant="panelLabel" color={colors.surfaceText}>
            {modeLabels[mode]}
          </AppText>
          <AppIcon
            set="ionicons"
            name="chevron-down"
            size={scale(d.fan.chevron)}
            color={colors.surfaceText}
          />
        </Pressable>
      </View>
    </View>
  );
}

interface CurtainControlsProps {
  action: CurtainAction | null;
  onAction: (action: CurtainAction) => void;
}

/** The Curtains card's body: open, pause and close. */
export function CurtainControls({ action, onAction }: CurtainControlsProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = smartHomeContent[locale];

  return (
    <View style={styles.optionRow}>
      {curtainActions.map((item) => {
        const active = item.id === action;
        const label = item.label[locale];
        return (
          <Pressable
            key={item.id}
            onPress={() => onAction(item.id)}
            accessibilityRole="button"
            accessibilityLabel={copy.curtains(label)}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}
          >
            <View style={[styles.curtainButton, active && styles.optionActive]}>
              <AppIcon
                {...item.icon}
                size={scale(d.curtain.icon)}
                color={active ? colors.chipAccentText : colors.surfaceText}
              />
            </View>
            <AppText variant="labelSmall" color={colors.surfaceText} style={styles.optionLabel}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

interface MediaControlsProps {
  sourceId: string | null;
  onSource: (id: string) => void;
}

/** The TV & Media card's body: the streaming apps and the app drawer. */
export function MediaControls({ sourceId, onSource }: MediaControlsProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={styles.optionRow} accessibilityRole="radiogroup">
      {mediaSources.map((source) => {
        const active = source.id === sourceId;
        const label = source.label[locale];
        return (
          <Pressable
            key={source.id}
            onPress={() => onSource(source.id)}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}
          >
            <View style={[styles.mediaTile, active && styles.optionActive]}>
              <AppIcon
                {...source.icon}
                size={scale(d.media.icon)}
                color={active ? colors.chipAccentText : colors.surfaceText}
              />
            </View>
            <AppText
              variant="labelTiny"
              color={colors.surfaceText}
              numberOfLines={1}
              style={styles.optionLabel}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => ({
  // Grows rather than flexes, so both cards in a row match the taller one.
  card: {
    flexGrow: 1,
  },
  body: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginTop: scale(d.bodyTop),
  },
  off: {
    opacity: d.offOpacity,
  },
  pressed: {
    opacity: 0.6,
  },

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: scale(d.slider.height),
    justifyContent: 'center',
    marginHorizontal: scale(d.slider.gap),
  },
  track: {
    height: scale(d.slider.track),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.sliderTrack,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.pill,
  },
  thumb: {
    position: 'absolute',
    top: scale((d.slider.height - d.slider.thumb) / 2),
    width: scale(d.slider.thumb),
    height: scale(d.slider.thumb),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.sliderThumb,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: scale(4), color: colors.sliderGradient[0] }],
  },
  value: {
    width: scale(d.slider.value),
    textAlign: 'right',
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
    marginTop: scale(d.preset.rowTop),
  },
  well: {
    flex: 1,
    height: scale(d.preset.well),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.wellFill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.surfaceDivider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: scale(2),
  },
  dotRing: {
    width: scale(d.preset.dot + 3),
    height: scale(d.preset.dot + 3),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.preset.ring),
    borderColor: colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotRingSelected: {
    borderColor: colors.surfaceText,
  },
  dot: {
    width: scale(d.preset.dot),
    height: scale(d.preset.dot),
    borderRadius: borderRadius.pill,
  },
  colourWell: {
    width: scale(d.preset.well),
    height: scale(d.preset.well),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.wellFill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.surfaceDivider,
    alignItems: 'center',
    justifyContent: 'center',
  },

  setPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: scale(d.step.size),
    height: scale(d.step.size),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.step.borderWidth),
    backgroundColor: colors.fieldFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The minus ring is lit cool, the plus ring warm.
  stepCool: {
    borderColor: colors.iconCool,
  },
  stepWarm: {
    borderColor: colors.surfaceAccentText,
  },
  setPoint: {
    flex: 1,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceDivider,
    marginTop: scale(d.rule.top),
  },
  fanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(d.fan.rowTop),
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.fan.bar.gap),
    marginStart: scale(d.fan.barsGap),
  },
  bar: {
    width: scale(d.fan.bar.width),
    height: scale(d.fan.bar.height),
    borderRadius: scale(1),
  },
  barLit: {
    backgroundColor: colors.progressText,
    boxShadow: toBoxShadowLite(shadows.progressGlow.color, scale(3)),
  },
  barOff: {
    backgroundColor: colors.progressTrack,
  },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(2),
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
  },
  optionLabel: {
    marginTop: scale(d.curtain.labelGap),
  },
  curtainButton: {
    width: scale(d.curtain.size),
    height: scale(d.curtain.size),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.curtain.borderWidth),
    borderColor: colors.fieldBorder,
    backgroundColor: colors.fieldFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaTile: {
    width: scale(d.media.size),
    height: scale(d.media.size),
    borderRadius: scale(d.media.radius),
    borderWidth: scale(d.media.borderWidth),
    borderColor: colors.fieldBorder,
    backgroundColor: colors.fieldFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    borderColor: colors.chipAccentBorder,
    backgroundColor: colors.chipAccentFill,
  },
}));

/** A soft glow of one colour, for small lit marks (fan bars). */
function toBoxShadowLite(color: string, blurRadius: number) {
  return [{ offsetX: 0, offsetY: 0, blurRadius, color }];
}
