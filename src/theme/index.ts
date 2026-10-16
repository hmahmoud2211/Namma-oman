import { images } from '@/constants/images';

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
   * Status bar content: light over the dark artwork, dark over the light theme's cream one.
   * Welcome and Sign In always use the dark theme (their artwork is dark in both modes).
   */
  statusBarStyle: 'light' | 'dark';
  /** Artwork that changes with the theme: the background behind Home and the logo on it. */
  artwork: { homeBackground: number; brandLogo: number };
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
  artwork: { homeBackground: images.homeBackground, brandLogo: images.brandLogo },
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows: createShadows(darkColors),
};

/** Cream cards with deep-green ink over the cream artwork (Assets/bg/bg home mode 2.png). */
export const lightTheme: AppTheme = {
  scheme: 'light',
  isDark: false,
  statusBarStyle: 'dark',
  artwork: { homeBackground: images.homeBackgroundLight, brandLogo: images.brandLogoOnLight },
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
