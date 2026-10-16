import { borderRadius, type BorderRadius } from './borderRadius';
import { darkColors, lightColors, type ColorTokens } from './colors';
import { createShadows, type Shadows } from './shadows';
import { spacing, type Spacing } from './spacing';
import { typography, type Typography } from './typography';

export type ColorScheme = 'light' | 'dark';

export interface AppTheme {
  scheme: ColorScheme;
  /** Drives the navigation chrome. */
  isDark: boolean;
  /**
   * Status bar content. Light in both themes: every screen's artwork is dark,
   * including behind the light theme's cream cards (mode 2.png).
   */
  statusBarStyle: 'light' | 'dark';
  colors: ColorTokens;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
}

/** Dark-green Nama look (Assets/screens/mode 1.png). */
export const darkTheme: AppTheme = {
  scheme: 'dark',
  isDark: true,
  statusBarStyle: 'light',
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows: createShadows(darkColors),
};

/** Cream cards over the dark-green artwork (Assets/screens/mode 2.png). */
export const lightTheme: AppTheme = {
  scheme: 'light',
  isDark: false,
  statusBarStyle: 'light',
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows: createShadows(lightColors),
};

export const themes: Readonly<Record<ColorScheme, AppTheme>> = {
  dark: darkTheme,
  light: lightTheme,
};
