import type { Glyph } from '@/components/common/AppIcon';
import type { Localized } from '@/context/LocaleContext';
import type { ThemePreference } from '@/context/ThemeContext';

/** Settings: the main tab for the account and preferences (after Parklane's Settings). */

export const settingsContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  accountTitle: string;
}> = {
  en: {
    overline: 'ACCOUNT',
    title: 'Settings',
    subtitle: 'Manage your account and preferences.',
    accountTitle: 'Account & Preferences',
  },
  ar: {
    overline: 'الحساب',
    title: 'الإعدادات',
    subtitle: 'أدِر حسابك وتفضيلاتك.',
    accountTitle: 'الحساب والتفضيلات',
  },
};

export type SettingsAction = 'language' | 'appearance' | 'logout';

export interface SettingsItem {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  icon: Glyph;
  /** What the row does; rows without one show the "under development" notice. */
  action?: SettingsAction;
}

export const settingsItems: readonly SettingsItem[] = [
  {
    id: 'profile',
    title: { en: 'Profile', ar: 'الملف الشخصي' },
    description: {
      en: 'View and edit your personal information.',
      ar: 'اعرض معلوماتك الشخصية وعدّلها.',
    },
    icon: { set: 'ionicons', name: 'person-outline' },
  },
  {
    id: 'notifications',
    title: { en: 'Notifications', ar: 'الإشعارات' },
    description: { en: 'Manage your notification preferences.', ar: 'أدِر تفضيلات الإشعارات.' },
    icon: { set: 'ionicons', name: 'notifications-outline' },
  },
  {
    id: 'security',
    title: { en: 'Security', ar: 'الأمان' },
    description: {
      en: 'Update your password and security settings.',
      ar: 'حدّث كلمة المرور وإعدادات الأمان.',
    },
    icon: { set: 'ionicons', name: 'shield-checkmark-outline' },
  },
  {
    id: 'language',
    title: { en: 'Language', ar: 'اللغة' },
    description: { en: 'Choose your preferred language.', ar: 'اختر لغتك المفضّلة.' },
    icon: { set: 'ionicons', name: 'globe-outline' },
    action: 'language',
  },
  {
    id: 'appearance',
    title: { en: 'Appearance', ar: 'المظهر' },
    description: {
      en: 'Adjust app theme and display settings.',
      ar: 'اضبط سمة التطبيق وإعدادات العرض.',
    },
    icon: { set: 'ionicons', name: 'sunny-outline' },
    action: 'appearance',
  },
  {
    id: 'app-preferences',
    title: { en: 'App Preferences', ar: 'تفضيلات التطبيق' },
    description: { en: 'Customize your app experience.', ar: 'خصّص تجربتك في التطبيق.' },
    icon: { set: 'ionicons', name: 'options-outline' },
  },
  {
    id: 'help',
    title: { en: 'Help & Support', ar: 'المساعدة والدعم' },
    description: {
      en: 'Get assistance or explore FAQs.',
      ar: 'احصل على المساعدة أو تصفّح الأسئلة الشائعة.',
    },
    icon: { set: 'ionicons', name: 'headset-outline' },
  },
  {
    id: 'logout',
    title: { en: 'Log Out', ar: 'تسجيل الخروج' },
    description: { en: 'Sign out from your account.', ar: 'سجّل الخروج من حسابك.' },
    icon: { set: 'ionicons', name: 'log-out-outline' },
    action: 'logout',
  },
];

export const languageOptions: readonly { id: 'en' | 'ar'; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
];

export const appearanceOptions: Localized<
  readonly { id: ThemePreference; label: string; icon: Glyph }[]
> = {
  en: [
    {
      id: 'system',
      label: 'Match device',
      icon: { set: 'ionicons', name: 'phone-portrait-outline' },
    },
    { id: 'dark', label: 'Dark', icon: { set: 'ionicons', name: 'moon-outline' } },
    { id: 'light', label: 'Light', icon: { set: 'ionicons', name: 'sunny-outline' } },
  ],
  ar: [
    {
      id: 'system',
      label: 'حسب الجهاز',
      icon: { set: 'ionicons', name: 'phone-portrait-outline' },
    },
    { id: 'dark', label: 'داكن', icon: { set: 'ionicons', name: 'moon-outline' } },
    { id: 'light', label: 'فاتح', icon: { set: 'ionicons', name: 'sunny-outline' } },
  ],
};
