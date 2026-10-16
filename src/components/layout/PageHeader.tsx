import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, type Ref } from 'react';
import { View, type ViewInstance } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CircleButton } from '@/components/common/CircleButton';
import { LanguageToggle, LANGUAGE_TOGGLE_SIZE } from '@/components/common/LanguageToggle';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import type { Localized } from '@/context/LocaleContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { RootStackParamList } from '@/types/navigation.types';
import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp, from the Construction Progress header (construction.png): back button, logo and
 * the profile avatar, with the EN | AR switch beside the avatar (as on Home, by the bell).
 */
export const pageHeaderDesign = {
  height: 36.6,
  button: { top: 4.4, size: 30.9 },
  back: { left: 27.4, chevron: 12, shiftX: -1 },
  logo: { left: 66.3, width: 93.5 },
  avatar: { left: 293.3 },
  toggleGap: 6,
  intro: { left: 27.4, titleGap: -1.5, subtitleGap: 1.9 },
} as const;
const d = pageHeaderDesign;

const LABELS: Localized<{ back: string; profile: string }> = {
  en: { back: 'Back', profile: 'Profile and appearance' },
  ar: { back: 'رجوع', profile: 'الملف الشخصي والمظهر' },
};

interface PageHeaderProps {
  /** Initials in the avatar button. */
  initials: string;
  onProfilePress: () => void;
  /** The avatar, so a menu can be anchored under it. */
  avatarRef?: Ref<ViewInstance>;
}

/** The inner screens' header row: back, logo, language and the profile avatar. */
export function PageHeader({ initials, onProfilePress, avatarRef }: PageHeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const labels = LABELS[locale];

  const handleBack = useCallback(() => {
    // A dev launch straight onto a screen has nothing to go back to.
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.popTo('Home');
    }
  }, [navigation]);

  return (
    <View style={styles.header}>
      <CircleButton
        size={d.button.size}
        borderColor={colors.headerButtonBorder}
        accessibilityLabel={labels.back}
        onPress={handleBack}
        style={styles.back}
      >
        <View style={styles.backChevron}>
          <ChevronIcon
            size={scale(d.back.chevron)}
            color={colors.headerIcon}
            direction="left"
            strokeWidth={2.4}
          />
        </View>
      </CircleButton>
      <BrandLogo width={scale(d.logo.width)} style={styles.logo} />
      <LanguageToggle style={styles.languageToggle} />
      <CircleButton
        ref={avatarRef}
        size={d.button.size}
        borderColor={colors.headerAvatarBorder}
        accessibilityLabel={labels.profile}
        onPress={onProfilePress}
        style={styles.avatar}
      >
        <AppText variant="initials" color={colors.headerIcon}>
          {initials}
        </AppText>
      </CircleButton>
    </View>
  );
}

interface PageIntroProps {
  overline: string;
  title: string;
  subtitle?: string;
}

/** Overline, serif title and supporting line under the header (as on Construction Progress). */
export function PageIntro({ overline, title, subtitle }: PageIntroProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  return (
    <View style={styles.intro}>
      <AppText variant="pageOverline" color={colors.accent}>
        {overline}
      </AppText>
      <AppText variant="pageTitle" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="pageSubtitle" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }, { scale }) => {
  const button = { position: 'absolute', top: scale(d.button.top) } as const;
  return {
    header: {
      height: scale(d.height),
    },
    back: {
      ...button,
      start: scale(d.back.left),
    },
    backChevron: {
      marginStart: scale(d.back.shiftX),
    },
    logo: {
      position: 'absolute',
      start: scale(d.logo.left),
      top: 0,
    },
    languageToggle: {
      position: 'absolute',
      start: scale(d.avatar.left - d.toggleGap - LANGUAGE_TOGGLE_SIZE.width),
      top: scale(d.button.top + (d.button.size - LANGUAGE_TOGGLE_SIZE.height) / 2),
    },
    avatar: {
      ...button,
      start: scale(d.avatar.left),
    },
    intro: {
      marginTop: scale(spacing.lg),
      marginHorizontal: scale(d.intro.left),
    },
    title: {
      marginTop: scale(d.intro.titleGap),
    },
    subtitle: {
      marginTop: scale(d.intro.subtitleGap),
    },
  };
});
