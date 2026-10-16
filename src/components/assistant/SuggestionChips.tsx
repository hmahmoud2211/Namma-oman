import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import type { Suggestion } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface SuggestionChipsProps {
  suggestions: readonly Suggestion[];
  onPick: (text: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const STAGGER_MS = 55;
const BASE_DELAY_MS = 180;
/** Design dp. */
const d = { gap: 7, minHeight: 38, icon: 13, chevron: 8, radius: 10 } as const;

/** Example questions as cards, two across, that cascade in one after another. */
export function SuggestionChips({ suggestions, onPick, disabled, style }: SuggestionChipsProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const [progress] = useState(() => suggestions.map(() => new Animated.Value(0)));

  useEffect(() => {
    const cascade = Animated.stagger(
      STAGGER_MS,
      progress.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    );
    const timer = setTimeout(() => cascade.start(), BASE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      cascade.stop();
    };
  }, [progress]);

  return (
    <View style={[styles.wrap, style]}>
      {suggestions.map((suggestion, index) => {
        const value = progress[index];
        const text = suggestion.text[locale];
        return (
          <Animated.View
            key={suggestion.id}
            style={[
              styles.cell,
              value && {
                opacity: value,
                transform: [
                  {
                    translateY: value.interpolate({
                      inputRange: [0, 1],
                      outputRange: [scale(12), 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pressable
              disabled={disabled}
              onPress={() => onPick(text)}
              accessibilityRole="button"
              accessibilityLabel={text}
              style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={colors.menuGradient}
                style={[StyleSheet.absoluteFill, styles.fill]}
              />
              <AppIcon {...suggestion.icon} size={scale(d.icon)} color={colors.surfaceIcon} />
              <AppText
                variant="panelLabel"
                color={colors.surfaceText}
                numberOfLines={3}
                style={styles.label}
              >
                {text}
              </AppText>
              {/* Wrapped: a bare SVG would paint under the card's fill on web. */}
              <View>
                <ChevronIcon
                  size={scale(d.chevron)}
                  color={colors.surfaceTextMuted}
                  strokeWidth={3}
                />
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -scale(d.gap / 2),
  },
  cell: {
    width: '50%',
    padding: scale(d.gap / 2),
  },
  chip: {
    flex: 1,
    minHeight: scale(d.minHeight),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(7),
    paddingHorizontal: scale(9),
    paddingVertical: scale(6),
    borderRadius: scale(d.radius),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: scale(d.radius),
  },
  label: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
}));
