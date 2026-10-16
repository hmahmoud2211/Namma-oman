import type { Localized } from '@/context/LocaleContext';

/** Copy used by shared components (screen copy lives in each screen's `.data.ts`). */
export const commonStrings: Localized<{
  brandName: string;
  close: string;
  closeMenu: string;
  /** Toast shown for anything whose screen isn't built yet. */
  underDevelopmentTitle: string;
  underDevelopmentBody: string;
}> = {
  en: {
    brandName: 'Nama Real Estate',
    close: 'Close',
    closeMenu: 'Close menu',
    underDevelopmentTitle: 'Under development',
    underDevelopmentBody: 'This feature is coming soon.',
  },
  ar: {
    brandName: 'نماء العقارية',
    close: 'إغلاق',
    closeMenu: 'إغلاق القائمة',
    underDevelopmentTitle: 'قيد التطوير',
    underDevelopmentBody: 'هذه الميزة ستتوفر قريباً.',
  },
};
