import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { GlassLayer } from '@/components/common/GlassLayer';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { commonStrings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

interface BottomSheetProps {
  title: string;
  /** Called once the closing animation has finished. */
  onClose: () => void;
  closeLabel?: string;
  /** Content, or a function that receives `close` (animates out, then calls `onClose`). */
  children: ReactNode | ((close: () => void) => ReactNode);
}

/** Design dp. */
const d = {
  radius: 18,
  borderWidth: 0.6,
  handle: { width: 34, height: 3.5, top: 7 },
  header: { top: 18, side: 18, height: 28 },
  close: { size: 26, icon: 11 },
  content: { top: 10, side: 18, bottom: 18 },
  slide: 48,
  /** Share of the window height the sheet may take before its content scrolls. */
  maxHeight: 0.78,
} as const;
const OPEN_MS = 220;
const CLOSE_MS = 160;

/**
 * Glass sheet that slides up from the bottom over a dimmed backdrop. Render it in a
 * full-screen layer (ScreenWrapper's `overlay`) so blur works on Android; tapping the
 * backdrop, the close button or the Android back button closes it.
 */
export function BottomSheet({ title, onClose, closeLabel, children }: BottomSheetProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const closeText = closeLabel ?? commonStrings[locale].close;
  const { scale, height } = useResponsive();
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  // State, not a ref: one stable value, and react-native-web has no `useAnimatedValue`.
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: OPEN_MS, useNativeDriver: true }).start();
  }, [progress]);

  const close = useCallback(() => {
    Animated.timing(progress, { toValue: 0, duration: CLOSE_MS, useNativeDriver: true }).start(() =>
      onClose(),
    );
  }, [onClose, progress]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => subscription.remove();
  }, [close]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [scale(d.slide), 0] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={closeText}
        />
      </Animated.View>
      {/* Lifts the sheet over the keyboard when it holds a form (iOS; Android resizes itself). */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.panel,
            { maxHeight: height * d.maxHeight, opacity: progress, transform: [{ translateY }] },
          ]}
          accessibilityViewIsModal
        >
          <GlassLayer borderRadius={scale(d.radius)} colors={colors.menuGradient} />
          <View style={styles.handle} />
          <View style={styles.header}>
            <AppText variant="panelTitle" color={colors.surfaceText} accessibilityRole="header">
              {title}
            </AppText>
            <Pressable
              onPress={close}
              hitSlop={scale(8)}
              accessibilityRole="button"
              accessibilityLabel={closeText}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <CloseIcon size={scale(d.close.icon)} color={colors.surfaceText} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {typeof children === 'function' ? children(close) : children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const useStyles = makeStyles(
  ({ colors, borderRadius, shadows }, { scale }, insets: EdgeInsets) => ({
    backdrop: {
      backgroundColor: colors.menuBackdrop,
    },
    panel: {
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
      width: '100%',
      maxWidth: scale(DESIGN_FRAME.width),
      borderTopLeftRadius: scale(d.radius),
      borderTopRightRadius: scale(d.radius),
      borderWidth: scale(d.borderWidth),
      borderBottomWidth: 0,
      borderColor: colors.surfaceBorder,
      boxShadow: toBoxShadow(shadows.tabBarShadow, scale),
      overflow: 'hidden',
    },
    handle: {
      position: 'absolute',
      top: scale(d.handle.top),
      alignSelf: 'center',
      width: scale(d.handle.width),
      height: scale(d.handle.height),
      borderRadius: borderRadius.pill,
      backgroundColor: colors.surfaceDivider,
    },
    header: {
      marginTop: scale(d.header.top),
      marginHorizontal: scale(d.header.side),
      minHeight: scale(d.header.height),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    close: {
      width: scale(d.close.size),
      height: scale(d.close.size),
      borderRadius: borderRadius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.menuActiveFill,
    },
    pressed: {
      opacity: 0.7,
    },
    scroll: {
      flexGrow: 0,
    },
    content: {
      paddingTop: scale(d.content.top),
      paddingHorizontal: scale(d.content.side),
      paddingBottom: insets.bottom + scale(d.content.bottom),
    },
  }),
);
