import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import type { Locale } from '@/context/LocaleContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { directionProps, directionStyle } from '@/utils/direction';
import { makeStyles } from '@/utils/makeStyles';

const OPTIONS: readonly { locale: Locale; label: string; accessibilityLabel: string }[] = [
  { locale: 'en', label: 'EN', accessibilityLabel: 'English' },
  { locale: 'ar', label: 'AR', accessibilityLabel: 'العربية' },
];

/** Design dp, sized to sit beside the Home bell. */
export const LANGUAGE_TOGGLE_SIZE = { width: 46, height: 20 };
const d = {
  ...LANGUAGE_TOGGLE_SIZE,
  borderWidth: 0.6,
  inset: 1.6,
  hitSlop: 6,
} as const;

interface LanguageToggleProps {
  style?: StyleProp<ViewStyle>;
}

/** EN | AR switch for the app language; each label is named in its own language for screen readers. */
export function LanguageToggle({ style }: LanguageToggleProps) {
  const { colors } = useAppTheme();
  const { locale, setLocale } = useLocale();
  const styles = useStyles();

  return (
    // Outer view: placed in the screen's direction. Inner: always "EN | AR".
    <View style={style}>
      <View
        {...directionProps('ltr')}
        style={[styles.track, directionStyle('ltr')]}
        accessibilityRole="radiogroup"
      >
        {OPTIONS.map((option) => {
          const isActive = option.locale === locale;
          return (
            <Pressable
              key={option.locale}
              onPress={() => setLocale(option.locale)}
              hitSlop={d.hitSlop}
              accessibilityRole="radio"
              accessibilityState={{ checked: isActive }}
              accessibilityLabel={option.accessibilityLabel}
              style={[styles.segment, isActive && styles.segmentActive]}
            >
              <AppText
                variant="tabLabelActive"
                color={isActive ? colors.background : colors.headerIcon}
                // Latin letters in both languages: keep the English face's metrics.
                allowFontScaling={false}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  track: {
    width: scale(d.width),
    height: scale(d.height),
    padding: scale(d.inset),
    flexDirection: 'row',
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.borderWidth),
    borderColor: colors.headerAvatarBorder,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
  },
  segmentActive: {
    backgroundColor: colors.headerAvatarBorder,
  },
}));
