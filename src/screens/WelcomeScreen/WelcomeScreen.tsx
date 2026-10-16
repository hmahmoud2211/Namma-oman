import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { images } from '@/constants/images';
import { useAppState } from '@/hooks/useAppState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';

import { welcomeContent } from './WelcomeScreen.data';
import { useWelcomeStyles, welcomeDesign } from './WelcomeScreen.styles';

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useWelcomeStyles(insets);
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const { markWelcomeSeen } = useAppState();

  const navigation = useNavigation();

  const handleGetStarted = useCallback(() => {
    markWelcomeSeen();
    navigation.navigate('SignIn');
  }, [markWelcomeSeen, navigation]);

  return (
    <ScreenWrapper background={images.welcomeBackground}>
      <View style={styles.content}>
        <BrandLogo width={scale(welcomeDesign.logo.width)} style={styles.logo} />

        <View style={styles.headline}>
          <AppText variant="heading" style={styles.title}>
            {welcomeContent.title}
          </AppText>
          <View style={styles.accentRule} />
          <View style={styles.tagline}>
            {welcomeContent.taglineLines.map((line) => (
              <AppText key={line} variant="subheading">
                {line}
              </AppText>
            ))}
          </View>
        </View>

        <AppButton
          title={welcomeContent.ctaLabel}
          accessibilityLabel={welcomeContent.ctaAccessibilityLabel}
          icon={
            <ArrowRightIcon
              size={scale(welcomeDesign.arrowIcon.size)}
              color={colors.buttonPrimaryText}
            />
          }
          onPress={handleGetStarted}
          style={styles.cta}
        />
      </View>
    </ScreenWrapper>
  );
}
