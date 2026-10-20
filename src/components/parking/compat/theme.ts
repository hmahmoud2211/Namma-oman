import { useMemo } from 'react';
import type { TextStyle } from 'react-native';

import { useAppTheme as useOmmanTheme } from '@/hooks/useAppTheme';
import type { AppTheme as OmmanTheme } from '@/theme';
import { parkingColors } from '@/theme/parkingColors';
import { fontFamilies } from '@/theme/typography';

/**
 * The parking flows were ported from the Parklane app, which reads its theme under its own
 * names. This builds that shape from this app's theme: colours by role (theme/parkingColors),
 * Parklane's type sizes set in this app's faces, and its spacing and radii. The flows import
 * `useAppTheme` and `AppTheme` from here instead of the app's, and otherwise run unchanged.
 */

type FontFamilies = { regular: string; medium: string; semiBold: string; bold: string };

const latinFamilies: FontFamilies = {
  regular: fontFamilies.regular,
  medium: fontFamilies.medium,
  semiBold: fontFamilies.semiBold,
  bold: fontFamilies.bold,
};
const arabicFamilies: FontFamilies = {
  regular: fontFamilies.arabicRegular,
  medium: fontFamilies.arabicMedium,
  semiBold: fontFamilies.arabicSemiBold,
  bold: fontFamilies.arabicBold,
};

/** A role's style; size and face are always set (the saved pass card draws with them). */
type TypeRole = TextStyle & { fontFamily: string; fontSize: number; lineHeight: number };

/** Parklane's sizes for each role the flows use (its src/theme/typography.ts). */
function typographyIn(f: FontFamilies, arabic: boolean) {
  // Arabic needs taller lines and no tracking, as in the app's own Arabic variants.
  const role = (fontFamily: string, fontSize: number, lineHeight: number, extra: TextStyle = {}): TypeRole =>
    arabic
      ? { fontFamily, fontSize, lineHeight: Math.max(lineHeight, fontSize * 1.4) }
      : { fontFamily, fontSize, lineHeight, ...extra };
  return {
    body: role(f.regular, 15, 22),
    bodyStrong: role(f.semiBold, 13, 18),
    caption: role(f.regular, 13, 18),
    label: role(f.medium, 11, 15, { letterSpacing: 0.2 }),
    subheading: role(f.semiBold, 18, 24),
    sectionTitle: role(f.semiBold, 13.5, 18),
    figure: role(f.bold, 22, 28, { letterSpacing: -0.2 }),
    heroTitle: role(f.bold, 20.5, 26, { letterSpacing: -0.2 }),
    overline: arabic
      ? role(f.medium, 10, 14)
      : role(f.medium, 10, 14, { letterSpacing: 2, textTransform: 'uppercase' }),
    statLabel: role(f.regular, 8, 11),
    tileCaption: role(f.regular, 7, 10),
  } satisfies Record<string, TypeRole>;
}

export type TypographyVariant = keyof ReturnType<typeof typographyIn>;

export function parkingTheme(theme: OmmanTheme) {
  return {
    isDark: theme.isDark,
    colors: parkingColors(theme.colors),
    typography: typographyIn(latinFamilies, false),
    arabicTypography: typographyIn(arabicFamilies, true),
    fontFamily: latinFamilies,
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, headerTop: 44 },
    borderRadius: { sm: 8, md: 12, lg: 16, pill: 999 },
    glass: { subtleFillOpacity: 0.05, strokeWidth: 1 },
  };
}

export type AppTheme = ReturnType<typeof parkingTheme>;

/** The parking flows' theme, following the app's light or dark mode. */
export function useAppTheme(): AppTheme {
  const theme = useOmmanTheme();
  return useMemo(() => parkingTheme(theme), [theme]);
}
