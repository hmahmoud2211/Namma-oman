import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

interface ProgressBarProps {
  /** 0–1. */
  progress: number;
  /** Bar height in design dp. */
  height: number;
  style?: StyleProp<ViewStyle>;
}

const FILL_START = { x: 0, y: 0.5 };
const FILL_END = { x: 1, y: 0.5 };
const FILL_MS = 700;

/** Rounded horizontal progress bar with a glowing gradient fill that eases to its value. */
export function ProgressBar({ progress, height, style }: ProgressBarProps) {
  const { colors } = useAppTheme();
  const { isRTL } = useLocale();
  const styles = useStyles(height);
  const clamped = Math.min(Math.max(progress, 0), 1);
  // State, not a ref: one stable value, and react-native-web has no `useAnimatedValue`.
  const [fill] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Width can't use the native driver.
    Animated.timing(fill, {
      toValue: clamped,
      duration: FILL_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fill, clamped]);

  const width = fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.track, style]}>
      <Animated.View style={[styles.fill, { width }]}>
        <LinearGradient
          colors={colors.progressFillGradient}
          // The fill grows from the start edge, so its gradient runs from there too.
          start={isRTL ? FILL_END : FILL_START}
          end={isRTL ? FILL_START : FILL_END}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }, height: number) => ({
  track: {
    height: scale(height),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.progressTrack,
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.pill,
    boxShadow: toBoxShadow(shadows.progressGlow, scale),
  },
  gradient: {
    flex: 1,
    borderRadius: borderRadius.pill,
  },
}));
