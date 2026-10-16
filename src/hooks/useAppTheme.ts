import { useContext } from 'react';

import { ThemeContext } from '@/context/ThemeContext';
import type { AppTheme } from '@/theme';

export function useAppTheme(): AppTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useAppTheme must be used inside <ThemeProvider>.');
  }
  return theme;
}
