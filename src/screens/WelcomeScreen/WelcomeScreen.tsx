import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { BrandLogo } from '@/components/common/BrandLogo';
import { DirectionView } from '@/components/common/DirectionView';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { images } from '@/constants/images';
import { useAppState } from '@/hooks/useAppState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';

import { welcomeContent } from './WelcomeScreen.data';
import { useWelcomeStyles, welcomeDesign } from './WelcomeScreen.styles';

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useWelcomeStyles(insets);
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const { markWelcomeSeen } = useAppState();
  const { locale } = useLocale();
  const content = welcomeContent[locale];

  const navigation = useNavigation();

  const handleGetStarted = useCallback(() => {
    markWelcomeSeen();
    navigation.navigate('SignIn');
  }, [markWelcomeSeen, navigation]);

  return (
    <ScreenWrapper background={images.welcomeBackground}>
      <View style={styles.content}>
        <BrandLogo width={scale(welcomeDesign.logo.width)} style={styles.logo} />

        {/* On the left in both languages: there it sits over the dark trees, where it reads;
            mirrored to the right, it would cross the brightly lit building. */}
        <DirectionView direction="ltr" style={styles.headline}>
          <AppText variant="heading" align="left" style={styles.title}>
            {content.title}
          </AppText>
          <View style={styles.accentRule} />
          <View style={styles.tagline}>
            {content.taglineLines.map((line) => (
              <AppText key={line} variant="subheading" align="left">
                {line}
              </AppText>
            ))}
          </View>
        </DirectionView>

        <AppButton
          title={content.ctaLabel}
          accessibilityLabel={content.ctaAccessibilityLabel}
          icon={
            <ArrowRightIcon
              size={scale(welcomeDesign.arrowIcon.size)}
              color={colors.buttonPrimaryText}
            />
          }
          accessibilityHint={content.ctaHint}
          onSlideComplete={handleGetStarted}
          style={styles.cta}
        />
      </View>
    </ScreenWrapper>
  );
}
