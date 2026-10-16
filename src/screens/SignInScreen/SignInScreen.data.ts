import type { ComponentType } from 'react';

import { FaceIdIcon } from '@/components/icons/FaceIdIcon';
import { FingerprintIcon } from '@/components/icons/FingerprintIcon';
import { MoreHorizontalIcon } from '@/components/icons/MoreHorizontalIcon';
import type { IconProps } from '@/components/icons/types';

/** Copy exactly as shown in Assets/screens/sign in.png. */
export const signInContent = {
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
} as const;

export type QuickSignInMethod = 'face-id' | 'touch-id' | 'more';

export interface QuickSignInOption {
  id: QuickSignInMethod;
  label: string;
  accessibilityLabel: string;
  Icon: ComponentType<IconProps>;
  /** Icon box in design dp, sized to the glyph in the export. */
  iconSize: number;
}

export const quickSignInOptions: readonly QuickSignInOption[] = [
  {
    id: 'face-id',
    label: 'Face ID',
    accessibilityLabel: 'Sign in with Face ID',
    Icon: FaceIdIcon,
    iconSize: 21.6,
  },
  {
    id: 'touch-id',
    label: 'Touch ID',
    accessibilityLabel: 'Sign in with Touch ID',
    Icon: FingerprintIcon,
    iconSize: 25.7,
  },
  {
    id: 'more',
    label: 'More',
    accessibilityLabel: 'More sign-in options',
    Icon: MoreHorizontalIcon,
    iconSize: 17.9,
  },
];
