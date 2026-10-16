import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  /** What the switch controls, e.g. "Lighting". */
  accessibilityLabel: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = { width: 24, height: 13.5, inset: 1.8, borderWidth: 0.5, hitSlop: 10 } as const;
const KNOB = d.height - d.inset * 2;
const TRAVEL = d.width - KNOB - d.inset * 2;
const DURATION_MS = 160;

/**
 * On/off switch for the service screens' cards and rows (lights, devices, automations).
 * The knob slides towards the end edge when on, so it mirrors in Arabic.
 */
export function ToggleSwitch({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  style,
}: ToggleSwitchProps) {
  const { colors } = useAppTheme();
  const { isRTL } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const reduceMotion = useReduceMotion();
  // State, not a ref: one stable value, and react-native-web has no `useAnimatedValue`.
  const [position] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      position.setValue(value ? 1 : 0);
      return undefined;
    }
    const animation = Animated.timing(position, {
      toValue: value ? 1 : 0,
      duration: DURATION_MS,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [position, reduceMotion, value]);

  const travel = scale(TRAVEL) * (isRTL ? -1 : 1);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={scale(d.hitSlop)}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={({ pressed }) => [styles.track, style, (pressed || disabled) && styles.dimmed]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: position }]} pointerEvents="none">
        <LinearGradient
          colors={colors.toggleOnGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.knob,
          {
            transform: [
              {
                translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.knobFace, !value && styles.knobOff]} />
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  track: {
    width: scale(d.width),
    height: scale(d.height),
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: colors.toggleOffTrack,
    borderWidth: scale(d.borderWidth),
    borderColor: colors.toggleTrackBorder,
  },
  knob: {
    position: 'absolute',
    start: scale(d.inset),
    width: scale(KNOB),
    height: scale(KNOB),
  },
  knobFace: {
    flex: 1,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.toggleKnob,
  },
  knobOff: {
    backgroundColor: colors.toggleKnobOff,
  },
  dimmed: {
    opacity: 0.6,
  },
}));
