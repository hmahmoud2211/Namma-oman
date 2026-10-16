import { MoonIcon } from '@/components/icons/MoonIcon';
import { SunIcon } from '@/components/icons/SunIcon';
import type { PopoverMenuOption } from '@/components/ui/PopoverMenu';
import type { Localized } from '@/context/LocaleContext';
import type { ColorScheme } from '@/theme';

/** The theme switch offered from the header menus (Home menu, Construction Progress avatar). */
export const appearanceMenu: Localized<{
  title: string;
  options: readonly PopoverMenuOption<ColorScheme>[];
}> = {
  en: {
    title: 'APPEARANCE',
    options: [
      { key: 'dark', label: 'Dark', Icon: MoonIcon },
      { key: 'light', label: 'Light', Icon: SunIcon },
    ],
  },
  ar: {
    title: 'المظهر',
    options: [
      { key: 'dark', label: 'داكن', Icon: MoonIcon },
      { key: 'light', label: 'فاتح', Icon: SunIcon },
    ],
  },
};
