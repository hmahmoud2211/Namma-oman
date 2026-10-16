import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ComponentType } from 'react';
import { AccessibilityInfo, Animated, View } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import type { IconProps } from '@/components/icons/types';
import { getMainTabBarInset } from '@/components/layout/MainTabBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { directionProps, directionStyle } from '@/utils/direction';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

export interface ToastMessage {
  /** Changes for every show, so the same message shown twice restarts the timer. */
  id: number;
  title: string;
  body?: string;
  Icon?: ComponentType<IconProps>;
}

interface ToastProps {
  message: ToastMessage;
  onHidden: () => void;
}

/** Design dp. */
const d = {
  side: 24,
  gap: 10,
  radius: 14,
  borderWidth: 0.6,
  padding: { vertical: 11, horizontal: 14 },
  icon: 18,
  iconGap: 11,
  slide: 14,
} as const;
const IN_MS = 200;
const VISIBLE_MS = 2400;
const OUT_MS = 220;

/**
 * Short glass notice floating just above the tab bar. Shown through `useToast()`; it never
 * blocks touches, and screen readers announce it.
 */
export function Toast({ message, onHidden }: ToastProps) {
  const { colors } = useAppTheme();
  const { isRTL } = useLocale();
  const { scale } = useResponsive();
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  // State, not a ref: one stable value, and react-native-web has no `useAnimatedValue`.
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      message.body ? `${message.title}. ${message.body}` : message.title,
    );
    progress.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: IN_MS, useNativeDriver: true }),
      Animated.delay(VISIBLE_MS),
      Animated.timing(progress, { toValue: 0, duration: OUT_MS, useNativeDriver: true }),
    ]);
    animation.start(({ finished }) => {
      if (finished) onHidden();
    });
    return () => animation.stop();
  }, [message, onHidden, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [scale(d.slide), 0] });
  const { Icon } = message;

  return (
    <View style={styles.dock} pointerEvents="none">
      <Animated.View
        {...directionProps(isRTL ? 'rtl' : 'ltr')}
        style={[
          styles.toast,
          directionStyle(isRTL ? 'rtl' : 'ltr'),
          { opacity: progress, transform: [{ translateY }] },
        ]}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
      >
        <LinearGradient colors={colors.menuGradient} style={styles.fill} />
        {Icon && (
          <View style={styles.icon}>
            <Icon size={scale(d.icon)} color={colors.surfaceIcon} />
          </View>
        )}
        <View style={styles.text}>
          <AppText variant="panelHeading" color={colors.surfaceText}>
            {message.title}
          </AppText>
          {message.body && (
            <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
              {message.body}
            </AppText>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles(
  ({ colors, shadows }, { width, height, scale }, insets: EdgeInsets) => ({
    // Same distance from the bottom as the end of a tab screen's content: just above the bar.
    dock: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: getMainTabBarInset(width, height, insets),
      alignItems: 'center',
    },
    toast: {
      width: '100%',
      maxWidth: scale(DESIGN_FRAME.width - d.side * 2),
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(d.padding.vertical),
      paddingHorizontal: scale(d.padding.horizontal),
      borderRadius: scale(d.radius),
      borderWidth: scale(d.borderWidth),
      borderColor: colors.surfaceBorder,
      overflow: 'hidden',
      boxShadow: toBoxShadow(shadows.tabBarShadow, scale),
    },
    fill: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    icon: {
      marginEnd: scale(d.iconGap),
    },
    text: {
      flex: 1,
    },
  }),
);
