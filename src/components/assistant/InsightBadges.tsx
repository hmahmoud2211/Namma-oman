import { memo, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { toneColors, type StatusTone } from '@/components/ui/StatusChip';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { AnswerSummary } from '@/services/assistant/assistant.types';
import { makeStyles } from '@/utils/makeStyles';

import {
  insightsFor,
  intentMeta,
  type Insight,
  type InsightTone,
  type IntentMeta,
} from './insights';

interface InsightBadgesProps {
  summary?: AnswerSummary;
  /** Opens the screen behind the topic tag, when it has one. */
  onOpenRoute?: (route: NonNullable<IntentMeta['route']>) => void;
  onSignIn?: () => void;
  style?: StyleProp<ViewStyle>;
}

const STAGGER_MS = 70;
const TONE: Record<InsightTone, StatusTone> = {
  info: 'neutral',
  warning: 'warning',
  error: 'danger',
};
const OPEN: { en: string; ar: string } = { en: 'Open', ar: 'فتح' };

/** The topic of a reply and its data caveats, as small pills that pop in one after another. */
function InsightBadgesView({ summary, onOpenRoute, onSignIn, style }: InsightBadgesProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const intent = intentMeta(summary?.intent, locale);
  const insights = useMemo(() => insightsFor(summary, locale), [summary, locale]);

  if (!intent && insights.length === 0) {
    return null;
  }
  const route = intent?.route;
  const topic = toneColors(colors, 'positive');

  return (
    <View style={[styles.row, style]}>
      {intent ? (
        <PopIn index={0}>
          <Pressable
            disabled={!route || !onOpenRoute}
            onPress={() => route && onOpenRoute?.(route)}
            accessibilityRole={route ? 'link' : 'text'}
            accessibilityLabel={route ? `${OPEN[locale]} ${intent.label}` : intent.label}
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor: topic.fill, borderColor: topic.border },
              pressed && styles.pressed,
            ]}
          >
            <AppIcon {...intent.icon} size={scale(9)} color={topic.text} />
            <AppText variant="label" color={topic.text}>
              {intent.label}
            </AppText>
            {route ? (
              <AppIcon
                set="ionicons"
                name={locale === 'ar' ? 'arrow-back' : 'arrow-forward'}
                size={scale(8)}
                color={topic.text}
              />
            ) : null}
          </Pressable>
        </PopIn>
      ) : null}
      {insights.map((insight, index) => (
        <PopIn key={insight.id} index={index + 1}>
          <InsightChip
            insight={insight}
            onPress={insight.action === 'sign-in' ? onSignIn : undefined}
          />
        </PopIn>
      ))}
    </View>
  );
}

function InsightChip({ insight, onPress }: { insight: Insight; onPress?: () => void }) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const tone = toneColors(colors, TONE[insight.tone]);
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: tone.fill, borderColor: tone.border },
        pressed && styles.pressed,
      ]}
    >
      <AppIcon {...insight.icon} size={scale(9)} color={tone.text} />
      <AppText variant="label" color={tone.text}>
        {insight.label}
      </AppText>
    </Pressable>
  );
}

/** Fades and springs a pill in, after those before it. */
function PopIn({ index, children }: { index: number; children: ReactNode }) {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 320,
      delay: index * STAGGER_MS,
      easing: Easing.out(Easing.back(1.6)),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [index, progress]);
  return (
    <Animated.View
      style={{
        opacity: progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }),
        transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

const useStyles = makeStyles(({ borderRadius }, { scale }) => ({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(4),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(3),
    minHeight: scale(16),
    paddingHorizontal: scale(6),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.6),
  },
  pressed: {
    opacity: 0.7,
  },
}));

export const InsightBadges = memo(InsightBadgesView);
