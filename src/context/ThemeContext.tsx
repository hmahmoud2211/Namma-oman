import { createContext, type ReactNode } from 'react';

import { defaultTheme, type AppTheme } from '@/theme';

export const ThemeContext = createContext<AppTheme | null>(null);

interface ThemeProviderProps {
  /** Defaults to the Nama theme; pass another AppTheme to switch the whole UI. */
  theme?: AppTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}
