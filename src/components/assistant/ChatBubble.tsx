import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { assistantStrings, chatFailureText } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { ChatMessage } from '@/hooks/useAssistantChat';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { formatTime } from '@/utils/date';
import { makeStyles } from '@/utils/makeStyles';

import { AssistantAvatar } from './AssistantAvatar';
import { InsightBadges } from './InsightBadges';
import type { IntentMeta } from './insights';
import { isRtlText, RichText } from './RichText';

interface ChatBubbleProps {
  message: ChatMessage;
  /** New arrivals spring in and type out; history renders at rest. */
  animateIn: boolean;
  reduceMotion: boolean;
  onRetry?: (messageId: string) => void;
  onSignIn?: () => void;
  onOpenRoute?: (route: NonNullable<IntentMeta['route']>) => void;
}

/** The reveal finishes in about this many ticks, however long the answer. */
const REVEAL_TICKS = 40;
const REVEAL_TICK_MS = 18;

const timeOf = (timestamp: number, locale: 'en' | 'ar') => {
  const date = new Date(timestamp);
  return formatTime(`${date.getHours()}:${date.getMinutes()}`, locale);
};

/** Reveals `text` a few words per tick; returns the visible part and whether it is done. */
function useTypewriter(text: string, enabled: boolean) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const [count, setCount] = useState(enabled ? 0 : words.length);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const step = Math.max(1, Math.ceil(words.length / REVEAL_TICKS));
    const timer = setInterval(() => {
      setCount((current) => {
        const next = Math.min(words.length, current + step);
        if (next >= words.length) {
          clearInterval(timer);
        }
        return next;
      });
    }, REVEAL_TICK_MS);
    return () => clearInterval(timer);
  }, [enabled, words]);

  const done = !enabled || count >= words.length;
  return { visible: done ? text : words.slice(0, count).join(''), done };
}

function ChatBubbleView({
  message,
  animateIn,
  reduceMotion,
  onRetry,
  onSignIn,
  onOpenRoute,
}: ChatBubbleProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const isUser = message.role === 'user';
  const failed = message.status === 'failed';
  const animate = animateIn && !reduceMotion;
  const text = failed
    ? chatFailureText[locale][message.failure ?? 'unknown']
    : message.text || (isUser ? '' : copy.emptyAnswer);

  const [appear] = useState(() => new Animated.Value(animate ? 0 : 1));
  useEffect(() => {
    if (!animate) {
      return undefined;
    }
    const spring = Animated.spring(appear, {
      toValue: 1,
      damping: 16,
      stiffness: 190,
      mass: 0.9,
      useNativeDriver: true,
    });
    spring.start();
    return () => spring.stop();
  }, [animate, appear]);

  const { visible, done } = useTypewriter(text, animate && !isUser && !failed);

  const [footer] = useState(() => new Animated.Value(animate ? 0 : 1));
  useEffect(() => {
    if (!done || !animate) {
      return undefined;
    }
    const fade = Animated.timing(footer, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    fade.start();
    return () => fade.stop();
  }, [animate, done, footer]);

  const entry = {
    opacity: appear.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 1, 1] }),
    transform: [
      { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [scale(14), 0] }) },
      { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
    ],
  };

  if (isUser) {
    const rtl = isRtlText(message.text);
    return (
      <Animated.View style={[styles.row, styles.rowUser, entry]}>
        <LinearGradient
          colors={colors.userBubbleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}
        >
          <AppText
            variant="chatBody"
            color={colors.userBubbleText}
            style={rtl ? styles.rtl : styles.ltr}
            selectable
          >
            {message.text}
          </AppText>
        </LinearGradient>
        <AppText variant="labelTiny" color={colors.textOnBackgroundSubtle} style={styles.time}>
          {timeOf(message.createdAt, locale)}
        </AppText>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.row, entry]}>
      <View style={[styles.bubble, styles.assistantBubble, failed && styles.failedBubble]}>
        {!failed ? (
          <LinearGradient
            colors={colors.menuGradient}
            style={[StyleSheet.absoluteFill, styles.fill]}
          />
        ) : null}
        <View style={styles.header}>
          {failed ? (
            <AppIcon
              set="ionicons"
              name="cloud-offline-outline"
              size={scale(10)}
              color={colors.chipDangerText}
            />
          ) : (
            <AssistantAvatar size={10} />
          )}
          <AppText variant="labelSmall" color={colors.surfaceTextMuted} style={styles.sender}>
            {copy.assistantName}
          </AppText>
          <AppText variant="labelTiny" color={colors.surfaceTextSubtle}>
            {timeOf(message.createdAt, locale)}
          </AppText>
        </View>

        <RichText
          color={failed ? colors.chipDangerText : colors.surfaceText}
          markerColor={colors.surfaceAccentText}
        >
          {visible}
        </RichText>

        {failed && onRetry ? (
          <Pressable
            onPress={() => onRetry(message.id)}
            accessibilityRole="button"
            accessibilityLabel={copy.retry}
            style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
          >
            <AppIcon set="ionicons" name="refresh" size={scale(9)} color={colors.chipDangerText} />
            <AppText variant="label" color={colors.chipDangerText}>
              {copy.retry}
            </AppText>
          </Pressable>
        ) : null}

        {!failed ? (
          <Animated.View style={{ opacity: footer }}>
            {done ? (
              <InsightBadges
                summary={message.summary}
                onSignIn={onSignIn}
                onOpenRoute={onOpenRoute}
                style={styles.badges}
              />
            ) : null}
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  row: {
    alignItems: 'flex-start',
    marginBottom: scale(10),
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: scale(14),
    paddingHorizontal: scale(11),
    paddingVertical: scale(8),
  },
  fill: {
    borderRadius: scale(14),
  },
  userBubble: {
    borderEndEndRadius: scale(5),
    borderWidth: scale(0.6),
    borderColor: colors.userBubbleBorder,
  },
  assistantBubble: {
    borderEndStartRadius: scale(5),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    minWidth: scale(150),
    overflow: 'hidden',
  },
  failedBubble: {
    backgroundColor: colors.chipDangerFill,
    borderColor: colors.chipDangerBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
    marginBottom: scale(4),
  },
  sender: {
    flex: 1,
  },
  time: {
    marginTop: scale(3),
    marginHorizontal: scale(3),
  },
  ltr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  badges: {
    marginTop: scale(7),
  },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: scale(4),
    marginTop: scale(7),
    height: scale(20),
    paddingHorizontal: scale(9),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.6),
    borderColor: colors.chipDangerBorder,
  },
  pressed: {
    opacity: 0.7,
  },
}));

export const ChatBubble = memo(ChatBubbleView);
