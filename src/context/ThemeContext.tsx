import * as SystemUI from 'expo-system-ui';
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { themes, type AppTheme, type ColorScheme } from '@/theme';

/** `system` follows the device appearance setting (app.json `userInterfaceStyle: automatic`). */
export type ThemePreference = ColorScheme | 'system';

export interface ThemePreferenceState {
  preference: ThemePreference;
  /** The scheme in effect after resolving `system`. */
  scheme: ColorScheme;
  setPreference: (preference: ThemePreference) => void;
}

export const ThemeContext = createContext<AppTheme | null>(null);
export const ThemePreferenceContext = createContext<ThemePreferenceState | null>(null);

/** Before the device reports a scheme (or where it can't), use the original dark look. */
const FALLBACK_SCHEME: ColorScheme = 'dark';

interface ThemeProviderProps {
  /** Starting preference; defaults to following the device. */
  initialPreference?: ThemePreference;
  children: ReactNode;
}

export function ThemeProvider({ initialPreference = 'system', children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);

  const scheme: ColorScheme =
    preference === 'system'
      ? systemScheme === 'light' || systemScheme === 'dark'
        ? systemScheme
        : FALLBACK_SCHEME
      : preference;

  // What shows past the screens: the page behind the app on web (when a phone browser's bar
  // collapses at the end of a scroll, or on overscroll) and the root window on native. Left
  // white, it shows as a white band under the dark artwork.
  const background = themes[scheme].colors.background;
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(background).catch(() => undefined);
  }, [background]);

  const preferenceState = useMemo(
    () => ({ preference, scheme, setPreference }),
    [preference, scheme],
  );

  return (
    <ThemePreferenceContext value={preferenceState}>
      <ThemeContext value={themes[scheme]}>{children}</ThemeContext>
    </ThemePreferenceContext>
  );
}
