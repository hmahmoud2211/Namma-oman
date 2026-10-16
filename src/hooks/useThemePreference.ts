import { useContext } from 'react';

import { ThemePreferenceContext, type ThemePreferenceState } from '@/context/ThemeContext';

/** Reads or changes the light/dark preference (e.g. from a future settings screen). */
export function useThemePreference(): ThemePreferenceState {
  const state = useContext(ThemePreferenceContext);
  if (!state) {
    throw new Error('useThemePreference must be used inside <ThemeProvider>.');
  }
  return state;
}
