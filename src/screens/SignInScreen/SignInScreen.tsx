import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Keyboard, Pressable, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppText } from '@/components/common/AppText';
import { BrandLogo } from '@/components/common/BrandLogo';
import { GlassCard } from '@/components/common/GlassCard';
import { TextLink } from '@/components/common/TextLink';
import { ArrowRightSlimIcon } from '@/components/icons/ArrowRightSlimIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { MailIcon } from '@/components/icons/MailIcon';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { IconTile } from '@/components/ui/IconTile';
import { TextDivider } from '@/components/ui/TextDivider';
import { images } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import { useResponsive } from '@/hooks/useResponsive';

import { quickSignInOptions, signInContent, type QuickSignInMethod } from './SignInScreen.data';
import { SIGN_IN_FRAME, signInDesign, useSignInStyles } from './SignInScreen.styles';

const EYE_HIT_SLOP = 10;

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const styles = useSignInStyles(insets);
  const { colors } = useAppTheme();
  const { scale } = useResponsive(SIGN_IN_FRAME);
  const { locale } = useLocale();
  const content = signInContent[locale];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);
  const navigation = useNavigation();

  const iconColor = colors.textOnGlassStrong;
  const icons = signInDesign.icons;

  const focusPassword = useCallback(() => passwordRef.current?.focus(), []);
  const togglePasswordVisibility = useCallback(
    () => setIsPasswordVisible((visible) => !visible),
    [],
  );

  const handleSignIn = useCallback(() => {
    Keyboard.dismiss();
    // TODO(auth): validate `email` / `password` with the auth service before entering the app.
    // Reset rather than push, so Back from Home doesn't return to the sign-in form.
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }, [navigation]);

  // Shown by everything here whose screen or service isn't built yet.
  const showUnderDevelopment = useUnderDevelopment();

  // TODO(navigation): open the password-reset and Sign Up screens once they are designed.
  const handleForgotPassword = showUnderDevelopment;
  const handleSignUp = showUnderDevelopment;

  const handleQuickSignIn = useCallback(
    (_method: QuickSignInMethod) => {
      // TODO(auth): Face ID / Touch ID need stored credentials from the auth service; "More" needs its design.
      showUnderDevelopment();
    },
    [showUnderDevelopment],
  );

  return (
    <ScreenWrapper background={images.signInBackground} scrollable keyboardAvoiding>
      <View style={styles.content}>
        <BrandLogo width={scale(signInDesign.logo.width)} style={styles.logo} />

        <GlassCard style={styles.card}>
          <AppText variant="display" color={colors.textOnGlassStrong} style={styles.title}>
            {content.titleLead}{' '}
            <AppText variant="display" style={styles.titleAccent}>
              {content.titleAccent}
            </AppText>
          </AppText>
          <AppText variant="body" color={colors.textOnGlass} style={styles.subtitle}>
            {content.subtitle}
          </AppText>

          <AppInput
            style={styles.emailField}
            icon={<MailIcon size={scale(icons.mail)} color={iconColor} />}
            value={email}
            onChangeText={setEmail}
            placeholder={content.emailPlaceholder}
            accessibilityLabel={content.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={focusPassword}
          />
          <AppInput
            ref={passwordRef}
            style={styles.passwordField}
            icon={<LockIcon size={scale(icons.lock)} color={iconColor} />}
            trailing={
              <Pressable
                onPress={togglePasswordVisibility}
                hitSlop={scale(EYE_HIT_SLOP)}
                accessibilityRole="button"
                accessibilityLabel={
                  isPasswordVisible ? content.hidePasswordLabel : content.showPasswordLabel
                }
              >
                <EyeIcon size={scale(icons.eye)} color={iconColor} crossed={!isPasswordVisible} />
              </Pressable>
            }
            value={password}
            onChangeText={setPassword}
            placeholder={content.passwordPlaceholder}
            accessibilityLabel={content.passwordPlaceholder}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleSignIn}
          />

          <TextLink
            title={content.forgotPassword}
            variant="bodySmall"
            color={colors.textOnGlass}
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          />

          <AppButton
            title={content.submitLabel}
            variant="emerald"
            size="medium"
            icon={<ArrowRightSlimIcon size={scale(icons.arrow)} color={colors.buttonEmeraldText} />}
            iconPosition="trailing"
            onPress={handleSignIn}
            style={styles.submit}
          />

          <TextDivider
            label={content.dividerLabel}
            textColor={colors.textOnGlass}
            lineColor={colors.dividerOnGlass}
            style={styles.divider}
          />

          <View style={styles.tiles}>
            {quickSignInOptions.map(({ id, label, accessibilityLabel, Icon, iconSize }) => (
              <IconTile
                key={id}
                label={label[locale]}
                labelColor={colors.textOnGlass}
                accessibilityLabel={accessibilityLabel[locale]}
                icon={<Icon size={scale(iconSize)} color={iconColor} />}
                onPress={() => handleQuickSignIn(id)}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <AppText variant="bodySmall" color={colors.textOnGlass}>
              {content.signUpPrompt}
            </AppText>
            <TextLink
              title={content.signUpLabel}
              variant="link"
              color={colors.textOnGlassStrong}
              underline
              onPress={handleSignUp}
              style={styles.signUpLink}
            />
          </View>
        </GlassCard>
      </View>
    </ScreenWrapper>
  );
}
