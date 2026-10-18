import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { assistantStrings } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { VoiceQueryResult, VoiceTurn } from '@/hooks/useVoiceSession';
import { makeStyles } from '@/utils/makeStyles';

import { AssistantAvatar } from './AssistantAvatar';
import { InsightBadges } from './InsightBadges';
import type { IntentMeta } from './insights';
import { isRtlText } from './RichText';

interface VoiceTranscriptProps {
  turns: readonly VoiceTurn[];
  onOpenRoute?: (route: NonNullable<IntentMeta['route']>) => void;
  onSignIn?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** The conversation so far, as live captions that follow the latest line. */
export function VoiceTranscript({ turns, onOpenRoute, onSignIn, style }: VoiceTranscriptProps) {
  const styles = useStyles();
  const scroll = useRef<ScrollViewInstance>(null);

  return (
    <ScrollView
      ref={scroll}
      style={style}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
    >
      {turns.map((turn, index) => (
        <TurnRow
          key={turn.id}
          turn={turn}
          latest={index === turns.length - 1}
          onOpenRoute={onOpenRoute}
          onSignIn={onSignIn}
        />
      ))}
    </ScrollView>
  );
}

interface TurnRowProps {
  turn: VoiceTurn;
  latest: boolean;
  onOpenRoute?: VoiceTranscriptProps['onOpenRoute'];
  onSignIn?: () => void;
}

const TurnRow = memo(function TurnRow({ turn, latest, onOpenRoute, onSignIn }: TurnRowProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const [appear] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(appear, {
      toValue: 1,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [appear]);

  const direction = isRtlText(turn.text) ? styles.rtl : styles.ltr;
  const entry = {
    opacity: appear,
    transform: [
      { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [scale(8), 0] }) },
    ],
  };

  if (turn.role === 'user') {
    return (
      <Animated.View style={[styles.userRow, entry]}>
        <AppText variant="labelSmall" color={colors.textOnBackgroundSubtle} style={styles.who}>
          {copy.you}
        </AppText>
        <AppText variant="chatBody" color={colors.textOnBackgroundMuted} style={direction}>
          {turn.text || '…'}
        </AppText>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.assistantRow, entry, !latest && styles.past]}>
      <View style={styles.assistantHead}>
        <AssistantAvatar size={10} />
        <AppText variant="labelSmall" color={colors.textOnBackgroundMuted}>
          {copy.assistantName}
        </AppText>
        {turn.interrupted ? (
          <AppText variant="labelSmall" color={colors.textOnBackgroundSubtle}>
            {`· ${copy.interrupted}`}
          </AppText>
        ) : null}
      </View>
      <AppText variant="voiceCaption" color={colors.textPrimary} style={direction}>
        {turn.text}
        {!turn.final && !turn.interrupted ? (
          <AppText variant="voiceCaption" color={colors.accent}>
            {' |'}
          </AppText>
        ) : null}
      </AppText>
      {turn.query ? (
        <QueryCard query={turn.query} onOpenRoute={onOpenRoute} onSignIn={onSignIn} />
      ) : null}
    </Animated.View>
  );
});

/** The lookup the assistant made for this reply: where it looked and what it found. */
function QueryCard({
  query,
  onOpenRoute,
  onSignIn,
}: {
  query: VoiceQueryResult;
  onOpenRoute?: VoiceTranscriptProps['onOpenRoute'];
  onSignIn?: () => void;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const resident = query.fn === 'query_resident_services';

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={colors.menuGradient}
        style={[StyleSheet.absoluteFill, styles.cardFill]}
      />
      <View style={styles.cardHead}>
        <AppIcon
          set="ionicons"
          name={resident ? 'home-outline' : 'business-outline'}
          size={scale(10)}
          color={colors.surfaceIcon}
        />
        <AppText variant="labelSmall" color={colors.surfaceText} style={styles.cardTitle}>
          {resident ? copy.yourRecords : copy.buildingData}
        </AppText>
        <AppText
          variant="labelSmall"
          color={query.found ? colors.statusPositive : colors.surfaceTextSubtle}
        >
          {query.found ? copy.records(query.recordsFound) : copy.nothingFound}
        </AppText>
      </View>
      <InsightBadges
        summary={query.summary}
        onOpenRoute={onOpenRoute}
        onSignIn={onSignIn}
        style={styles.cardBadges}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  content: {
    paddingTop: scale(6),
    paddingBottom: scale(10),
  },
  ltr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  userRow: {
    marginBottom: scale(10),
  },
  who: {
    marginBottom: scale(2),
  },
  assistantRow: {
    marginBottom: scale(14),
  },
  past: {
    opacity: 0.72,
  },
  assistantHead: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
    marginBottom: scale(3),
  },
  card: {
    marginTop: scale(7),
    padding: scale(8),
    borderRadius: scale(9),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  cardFill: {
    borderRadius: scale(9),
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
  },
  cardTitle: {
    flex: 1,
  },
  cardBadges: {
    marginTop: scale(6),
  },
}));
