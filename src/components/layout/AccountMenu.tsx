import { useCallback, useRef, useState } from 'react';
import type { ViewInstance } from 'react-native';

import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { POPOVER_MENU_WIDTH, PopoverMenu, type PopoverAnchor } from '@/components/ui/PopoverMenu';
import { appearanceMenu } from '@/constants/appearance';
import { useLocale } from '@/hooks/useLocale';
import { useLogout } from '@/hooks/useLogout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemePreference } from '@/hooks/useThemePreference';
import type { ColorScheme } from '@/theme';

/** Gap between the avatar and the menu under it, in design dp. */
const MENU_GAP = 6;

/**
 * The profile avatar's menu (appearance and log out), as on Construction Progress.
 * Attach `avatarRef` to the avatar, call `open` on press, and render `menu` in the screen's
 * full-screen overlay.
 */
export function useAccountMenu() {
  const { locale, isRTL } = useLocale();
  const { scale } = useResponsive();
  const { scheme, setPreference } = useThemePreference();
  const logout = useLogout();
  const avatarRef = useRef<ViewInstance>(null);
  const [anchor, setAnchor] = useState<PopoverAnchor | null>(null);

  const open = useCallback(() => {
    avatarRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        // The avatar sits at the far edge: the menu lines up with its outer side.
        x: isRTL ? x : x + width - scale(POPOVER_MENU_WIDTH),
        y: y + height + scale(MENU_GAP),
      });
    });
  }, [isRTL, scale]);

  const close = useCallback(() => setAnchor(null), []);

  const handleSelectScheme = useCallback(
    (selected: ColorScheme) => {
      setPreference(selected);
      setAnchor(null);
    },
    [setPreference],
  );

  const handleLogout = useCallback(() => {
    setAnchor(null);
    logout();
  }, [logout]);

  const menu = anchor ? (
    <PopoverMenu
      anchor={anchor}
      title={appearanceMenu[locale].title}
      options={appearanceMenu[locale].options}
      selectedKey={scheme}
      onSelect={handleSelectScheme}
      onClose={close}
      actions={[
        {
          key: 'logout',
          label: appearanceMenu[locale].logoutLabel,
          Icon: LogoutIcon,
          destructive: true,
          onPress: handleLogout,
        },
      ]}
    />
  ) : null;

  return { avatarRef, open, menu };
}
