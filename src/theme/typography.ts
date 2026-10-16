import { Montserrat_300Light } from '@expo-google-fonts/montserrat/300Light';
import { OpenSans_700Bold } from '@expo-google-fonts/open-sans/700Bold';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display/400Regular';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display/700Bold';
import type { TextStyle } from 'react-native';

/**
 * Closest Google Fonts matches for the Figma typefaces (unconfirmed).
 * Swap the files here once the exact fonts are supplied.
 * Variants without a `fontFamily` use the platform UI font (SF Pro on iOS, Roboto on
 * Android) — the closest match for the Sign In screen's sans-serif text.
 */
export const fontFamilies = {
  serifRegular: 'PlayfairDisplay_400Regular',
  serifBold: 'PlayfairDisplay_700Bold',
  sansLight: 'Montserrat_300Light',
  sansBold: 'OpenSans_700Bold',
} as const;

/** Passed to `useFonts` at startup. Only the faces listed here are bundled. */
export const fontAssets = {
  [fontFamilies.serifRegular]: PlayfairDisplay_400Regular,
  [fontFamilies.serifBold]: PlayfairDisplay_700Bold,
  [fontFamilies.sansLight]: Montserrat_300Light,
  [fontFamilies.sansBold]: OpenSans_700Bold,
};

export type TextVariant =
  | 'heading'
  | 'subheading'
  | 'button'
  | 'display'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'micro'
  | 'input'
  | 'buttonLabel'
  | 'link';

/**
 * Sizes are in design dp (360-wide Figma frame); AppText scales them per device.
 * Values are calibrated against the Figma exports in /Assets/screens.
 */
export const textVariants: Record<TextVariant, TextStyle> = {
  // Welcome (start 1.png)
  heading: {
    fontFamily: fontFamilies.serifRegular,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.75,
  },
  subheading: {
    fontFamily: fontFamilies.sansLight,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 1.6,
  },
  button: {
    fontFamily: fontFamilies.sansBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.42,
  },

  // Sign In (sign in.png)
  display: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 22.9,
    lineHeight: 28,
    letterSpacing: -1.7,
  },
  body: {
    fontWeight: '300',
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.95,
  },
  bodySmall: {
    fontWeight: '300',
    fontSize: 9.9,
    lineHeight: 12,
    letterSpacing: -0.7,
  },
  caption: {
    fontWeight: '300',
    fontSize: 9.3,
    lineHeight: 11,
    letterSpacing: -0.9,
  },
  micro: {
    fontWeight: '400',
    fontSize: 7.5,
    lineHeight: 9,
  },
  input: {
    fontWeight: '300',
    fontSize: 10.6,
    lineHeight: 13,
    letterSpacing: -0.85,
  },
  buttonLabel: {
    fontWeight: '600',
    fontSize: 12.45,
    lineHeight: 15,
    letterSpacing: -0.8,
  },
  link: {
    fontWeight: '600',
    fontSize: 11.35,
    lineHeight: 14,
    letterSpacing: -1,
  },
};

export const typography = {
  fontFamilies,
  variants: textVariants,
};

export type Typography = typeof typography;
