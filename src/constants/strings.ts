import type { Localized } from '@/context/LocaleContext';

/** Copy used by shared components (screen copy lives in each screen's `.data.ts`). */
export const commonStrings: Localized<{
  brandName: string;
  close: string;
  closeMenu: string;
}> = {
  en: { brandName: 'Nama Real Estate', close: 'Close', closeMenu: 'Close menu' },
  ar: { brandName: 'نماء العقارية', close: 'إغلاق', closeMenu: 'إغلاق القائمة' },
};
