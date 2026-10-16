import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { assistantStrings } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

import { AssistantAvatar } from './AssistantAvatar';

const DOT_COUNT = 3;
const BOUNCE_MS = 340;
const STAGGER_MS = 140;
/** Answers take 2-5s; the hint moves on so a long wait still feels alive. */
const HINT_MS = 2200;

/** The assistant's "typing" bubble: three bouncing dots and a changing hint. */
export function TypingIndicator() {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const hints = assistantStrings[locale].typing;
  const [dots] = useState(() => Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)));
  const [appear] = useState(() => new Animated.Value(0));
  const [hint, setHint] = useState(0);
  const [hintFade] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const entry = Animated.timing(appear, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    entry.start();
    return () => entry.stop();
  }, [appear]);

  useEffect(() => {
    if (reduce) {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.stagger(
        STAGGER_MS,
        dots.map((dot) =>
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: BOUNCE_MS,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: BOUNCE_MS,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );
    loop.start();
    return () => loop.stop();
  }, [dots, reduce]);

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(hintFade, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        setHint((index) => Math.min(index + 1, hints.length - 1));
        Animated.timing(hintFade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      });
    }, HINT_MS);
    return () => clearInterval(timer);
  }, [hintFade, hints.length]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          opacity: appear,
          transform: [
            { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [scale(10), 0] }) },
          ],
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={assistantStrings[locale].typingLabel}
    >
      <LinearGradient colors={colors.menuGradient} style={[StyleSheet.absoluteFill, styles.fill]} />
      <AssistantAvatar size={10} />
      <View style={styles.dots}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
                transform: [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -scale(3)],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
      <Animated.View style={{ opacity: hintFade }}>
        <AppText variant="labelSmall" color={colors.surfaceTextMuted}>
          {`${hints[hint]}…`}
        </AppText>
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: scale(30),
    paddingHorizontal: scale(11),
    marginBottom: scale(10),
    borderRadius: scale(14),
    borderEndStartRadius: scale(5),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: scale(14),
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(8),
    columnGap: scale(3),
  },
  dot: {
    width: scale(4.5),
    height: scale(4.5),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceAccentText,
  },
}));
