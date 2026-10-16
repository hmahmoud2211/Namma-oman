import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputKeyPressEvent,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { assistantStrings } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';
import { scaleTextStyle } from '@/utils/textStyle';

import { isRtlText } from './RichText';

interface ChatComposerProps {
  onSend: (text: string) => boolean;
  /** Shown in place of send while the field is empty. */
  onVoice: () => void;
  /** A reply is on its way; sending waits for it. */
  busy: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = {
  minHeight: 38,
  maxInput: 96,
  button: 28,
  inset: 5,
  sparkle: 14,
  icon: 14,
  ring: 1,
} as const;
const MAX_LENGTH = 600;
/**
 * react-native-web's textarea defaults to two rows, which sets the placeholder above the mic;
 * one row lines them up. `rows` is web-only, so it is spread in rather than typed.
 */
const WEB_SINGLE_ROW: object = Platform.OS === 'web' ? { rows: 1 } : {};

/**
 * The message field. Its trailing button is the mic while the field is empty and turns into
 * send as soon as there is text, spinning across.
 */
export function ChatComposer({ onSend, onVoice, busy, style }: ChatComposerProps) {
  const { colors, typography } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const [text, setText] = useState('');
  const hasText = text.trim().length > 0;

  const textStyle = useMemo(
    () =>
      scaleTextStyle(
        (locale === 'ar' ? typography.arabicVariants : typography.variants).chatBody,
        scale,
      ),
    [locale, scale, typography],
  );

  const [morph] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const spring = Animated.spring(morph, {
      toValue: hasText ? 1 : 0,
      damping: 14,
      stiffness: 220,
      useNativeDriver: true,
    });
    spring.start();
    return () => spring.stop();
  }, [hasText, morph]);

  const submit = useCallback(() => {
    if (!hasText || busy) {
      return;
    }
    if (onSend(text)) {
      setText('');
    }
  }, [busy, hasText, onSend, text]);

  // On the web, Enter sends and Shift+Enter adds a line, as in any chat app.
  const onKeyPress = useCallback(
    (event: TextInputKeyPressEvent) => {
      if (Platform.OS !== 'web') {
        return;
      }
      const native = event.nativeEvent as TextInputKeyPressEvent['nativeEvent'] & {
        shiftKey?: boolean;
      };
      if (native.key === 'Enter' && !native.shiftKey) {
        event.preventDefault();
        submit();
      }
    },
    [submit],
  );

  const sendStyle = {
    opacity: morph,
    transform: [
      { scale: morph.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
      { rotate: morph.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
    ],
  };
  const micStyle = {
    opacity: morph.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [{ scale: morph.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) }],
  };
  const rtlText = text ? isRtlText(text) : locale === 'ar';

  return (
    <View style={[styles.surface, style]}>
      <LinearGradient colors={colors.menuGradient} style={[StyleSheet.absoluteFill, styles.fill]} />
      <View style={styles.sparkle} pointerEvents="none">
        <AppIcon
          set="ionicons"
          name="sparkles-outline"
          size={scale(d.sparkle)}
          color={colors.surfaceAccentText}
        />
      </View>
      <View style={styles.field}>
        <TextInput
          value={text}
          onChangeText={setText}
          onKeyPress={onKeyPress}
          placeholder={copy.composerPlaceholder}
          placeholderTextColor={colors.fieldPlaceholder}
          selectionColor={colors.surfaceAccentText}
          underlineColorAndroid={colors.transparent}
          multiline
          {...WEB_SINGLE_ROW}
          maxLength={MAX_LENGTH}
          accessibilityLabel={copy.composerLabel}
          style={[
            textStyle,
            styles.input,
            { textAlign: rtlText ? 'right' : 'left', writingDirection: rtlText ? 'rtl' : 'ltr' },
          ]}
        />
      </View>

      <View style={styles.button}>
        <Animated.View
          style={[StyleSheet.absoluteFill, micStyle]}
          pointerEvents={hasText ? 'none' : 'auto'}
        >
          <Pressable
            onPress={onVoice}
            hitSlop={scale(5)}
            accessibilityRole="button"
            accessibilityLabel={copy.talkInstead}
            style={({ pressed }) => [styles.fill, pressed && styles.pressed]}
          >
            <LinearGradient colors={colors.userBubbleGradient} style={styles.mic}>
              <AppIcon
                set="ionicons"
                name="mic-outline"
                size={scale(d.icon)}
                color={colors.white}
              />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[StyleSheet.absoluteFill, sendStyle]}
          pointerEvents={hasText ? 'auto' : 'none'}
        >
          <Pressable
            onPress={submit}
            disabled={busy}
            hitSlop={scale(5)}
            accessibilityRole="button"
            accessibilityLabel={copy.send}
            accessibilityState={{ disabled: busy, busy }}
            style={({ pressed }) => [styles.fill, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={colors.callStartGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.send}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.callGlyph} />
              ) : (
                <AppIcon
                  set="ionicons"
                  name="arrow-up"
                  size={scale(d.icon)}
                  color={colors.callGlyph}
                />
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  surface: {
    minHeight: scale(d.minHeight),
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingStart: scale(10),
    paddingEnd: scale(d.inset),
    paddingVertical: scale(d.inset),
    borderRadius: scale(d.minHeight / 2),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    borderRadius: scale(d.minHeight / 2),
  },
  // As tall as the button, so the glyph stays on the first line's centre.
  sparkle: {
    height: scale(d.button),
    justifyContent: 'center',
    marginEnd: scale(7),
  },
  field: {
    flex: 1,
    marginEnd: scale(6),
  },
  input: {
    color: colors.surfaceText,
    maxHeight: scale(d.maxInput),
    minHeight: scale(d.button),
    paddingTop: scale(Platform.OS === 'ios' ? 7 : 5),
    paddingBottom: scale(Platform.OS === 'ios' ? 7 : 5),
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  button: {
    width: scale(d.button),
    height: scale(d.button),
  },
  mic: {
    flex: 1,
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.ring),
    borderColor: colors.userBubbleBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  send: {
    flex: 1,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
}));
