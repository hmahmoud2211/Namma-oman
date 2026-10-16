import { StatusBar } from 'expo-status-bar';
import type { ReactNode, Ref } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/common/AppBackground';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ScreenWrapperProps {
  children: ReactNode;
  /** Full-bleed background artwork drawn behind the system bars. */
  background?: ImageSourcePropType;
  /** Colour wash over `background`, e.g. a theme's `backgroundTint`. */
  backgroundTint?: string;
  /** Wrap content in a ScrollView for screens taller than small devices. */
  scrollable?: boolean;
  /** Keep focused inputs above the keyboard (form screens). Best combined with `scrollable`. */
  keyboardAvoiding?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Drawn above the content and outside the scroll view, e.g. a floating tab bar.
   * Position it absolutely; it is not padded to the safe area.
   */
  overlay?: ReactNode;
  /** Ref to the ScrollView when `scrollable` (e.g. to scroll back to the top). */
  scrollRef?: Ref<ScrollViewInstance>;
}

/**
 * Standard screen shell: edge-to-edge background, status bar style from the theme,
 * and content padded to the safe area so nothing sits under the notch or home indicator.
 */
export function ScreenWrapper({
  children,
  background,
  backgroundTint,
  scrollable = false,
  keyboardAvoiding = false,
  contentStyle,
  overlay,
  scrollRef,
}: ScreenWrapperProps) {
  const { statusBarStyle } = useAppTheme();
  const insets = useSafeAreaInsets();
  const safeAreaPadding: ViewStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const content = scrollable ? (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[styles.scrollContent, safeAreaPadding, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, safeAreaPadding, contentStyle]}>{children}</View>
  );

  return (
    <AppBackground source={background} tint={backgroundTint}>
      <StatusBar style={statusBarStyle} />
      {keyboardAvoiding ? (
        // Expo's guidance: `padding` on iOS; on Android the view alone is enough.
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
      {overlay}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
