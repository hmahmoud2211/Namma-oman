import { MoonIcon } from '@/components/icons/MoonIcon';
import { SunIcon } from '@/components/icons/SunIcon';
import type { PopoverMenuOption } from '@/components/ui/PopoverMenu';
import type { Localized } from '@/context/LocaleContext';
import type { ColorScheme } from '@/theme';

/**
 * The header menus (Home menu, Construction Progress avatar): the theme switch, then
 * account commands.
 */
export const appearanceMenu: Localized<{
  title: string;
  options: readonly PopoverMenuOption<ColorScheme>[];
  logoutLabel: string;
}> = {
  en: {
    title: 'APPEARANCE',
    options: [
      { key: 'dark', label: 'Dark', Icon: MoonIcon },
      { key: 'light', label: 'Light', Icon: SunIcon },
    ],
    logoutLabel: 'Log Out',
  },
  ar: {
    title: 'المظهر',
    options: [
      { key: 'dark', label: 'داكن', Icon: MoonIcon },
      { key: 'light', label: 'فاتح', Icon: SunIcon },
    ],
    logoutLabel: 'تسجيل الخروج',
  },
};
