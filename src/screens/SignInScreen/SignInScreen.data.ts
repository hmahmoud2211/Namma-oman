import type { ComponentType } from 'react';

import { FaceIdIcon } from '@/components/icons/FaceIdIcon';
import { FingerprintIcon } from '@/components/icons/FingerprintIcon';
import { MoreHorizontalIcon } from '@/components/icons/MoreHorizontalIcon';
import type { IconProps } from '@/components/icons/types';
import type { Localized } from '@/context/LocaleContext';

/** English copy exactly as shown in Assets/screens/sign in.png. */
export const signInContent: Localized<{
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  forgotPassword: string;
  submitLabel: string;
  dividerLabel: string;
  signUpPrompt: string;
  signUpLabel: string;
}> = {
  en: {
    titleLead: 'WELCOME',
    titleAccent: 'BACK',
    subtitle: 'Sign in to your Nama account.',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    showPasswordLabel: 'Show password',
    hidePasswordLabel: 'Hide password',
    forgotPassword: 'Forgot Password?',
    submitLabel: 'Sign In',
    dividerLabel: 'OR',
    signUpPrompt: 'Don’t have an account?',
    signUpLabel: 'Sign Up',
  },
  ar: {
    titleLead: 'مرحباً',
    titleAccent: 'بعودتك',
    subtitle: 'سجّل الدخول إلى حسابك في نماء.',
    emailPlaceholder: 'البريد الإلكتروني',
    passwordPlaceholder: 'كلمة المرور',
    showPasswordLabel: 'إظهار كلمة المرور',
    hidePasswordLabel: 'إخفاء كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    submitLabel: 'تسجيل الدخول',
    dividerLabel: 'أو',
    signUpPrompt: 'ليس لديك حساب؟',
    signUpLabel: 'إنشاء حساب',
  },
};

export type QuickSignInMethod = 'face-id' | 'touch-id' | 'more';

export interface QuickSignInOption {
  id: QuickSignInMethod;
  label: Localized<string>;
  accessibilityLabel: Localized<string>;
  Icon: ComponentType<IconProps>;
  /** Icon box in design dp, sized to the glyph in the export. */
  iconSize: number;
}

export const quickSignInOptions: readonly QuickSignInOption[] = [
  {
    id: 'face-id',
    label: { en: 'Face ID', ar: 'بصمة الوجه' },
    accessibilityLabel: { en: 'Sign in with Face ID', ar: 'تسجيل الدخول ببصمة الوجه' },
    Icon: FaceIdIcon,
    iconSize: 21.6,
  },
  {
    id: 'touch-id',
    label: { en: 'Touch ID', ar: 'البصمة' },
    accessibilityLabel: { en: 'Sign in with Touch ID', ar: 'تسجيل الدخول ببصمة الإصبع' },
    Icon: FingerprintIcon,
    iconSize: 25.7,
  },
  {
    id: 'more',
    label: { en: 'More', ar: 'المزيد' },
    accessibilityLabel: { en: 'More sign-in options', ar: 'خيارات تسجيل دخول أخرى' },
    Icon: MoreHorizontalIcon,
    iconSize: 17.9,
  },
];
