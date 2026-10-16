import { useEffect, useState } from 'react';
import { Animated, Easing, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { voiceStatusLabel } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useResponsive } from '@/hooks/useResponsive';
import type { VoicePhase } from '@/hooks/useVoiceSession';
import type { ColorTokens } from '@/theme/colors';
import { makeStyles } from '@/utils/makeStyles';

interface VoiceStatusPillProps {
  phase: VoicePhase;
  queryFn: string | null;
  muted: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A glass pill naming what the session is doing, with a pulsing status light. */
export function VoiceStatusPill({ phase, queryFn, muted, style }: VoiceStatusPillProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const label = voiceStatusLabel(phase, queryFn, muted, locale);
  const live = phase !== 'idle' && phase !== 'error';

  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!live || reduce) {
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [live, pulse, reduce]);

  // The label slides in afresh each time it changes.
  const [swap] = useState(() => new Animated.Value(1));
  useEffect(() => {
    swap.setValue(0);
    const animation = Animated.timing(swap, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [label, swap]);

  const dotColor = colorFor(colors, phase, muted);

  return (
    <View
      style={[styles.pill, style]}
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={label}
    >
      <View style={styles.dotBox}>
        <Animated.View
          style={[
            styles.dot,
            styles.dotRing,
            {
              backgroundColor: dotColor,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
              transform: [
                { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) },
              ],
            },
          ]}
        />
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>
      <Animated.View
        style={{
          opacity: swap,
          transform: [
            { translateY: swap.interpolate({ inputRange: [0, 1], outputRange: [scale(5), 0] }) },
          ],
        }}
      >
        <AppText variant="panelLabel" color={colors.textPrimary}>
          {label}
        </AppText>
      </Animated.View>
    </View>
  );
}

function colorFor(colors: ColorTokens, phase: VoicePhase, muted: boolean): string {
  switch (phase) {
    case 'listening':
      return muted ? colors.statusWarning : colors.statusPositive;
    case 'hearing':
      return colors.statusPositive;
    case 'speaking':
      return colors.accent;
    case 'thinking':
    case 'searching':
    case 'looking':
      return colors.orbAccent;
    case 'connecting':
      return colors.statusWarning;
    case 'error':
      return colors.destructiveText;
    case 'idle':
    default:
      return colors.textOnBackgroundSubtle;
  }
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: scale(22),
    paddingHorizontal: scale(10),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.controlFill,
    borderWidth: scale(0.6),
    borderColor: colors.controlBorder,
  },
  dotBox: {
    width: scale(6),
    height: scale(6),
    marginEnd: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: borderRadius.pill,
  },
  dotRing: {
    position: 'absolute',
  },
}));
