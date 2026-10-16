import { borderRadius, type BorderRadius } from './borderRadius';
import { colors, type ColorTokens } from './colors';
import { createShadows, type Shadows } from './shadows';
import { spacing, type Spacing } from './spacing';
import { typography, type Typography } from './typography';

export interface AppTheme {
  /** Drives the status bar and navigation chrome. */
  isDark: boolean;
  colors: ColorTokens;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
}

/**
 * The only theme for now (the dark-green Nama look).
 * A second theme (e.g. the cream "mode 2" design) is another AppTheme passed to ThemeProvider.
 */
export const defaultTheme: AppTheme = {
  isDark: true,
  colors,
  typography,
  spacing,
  borderRadius,
  shadows: createShadows(colors),
};
