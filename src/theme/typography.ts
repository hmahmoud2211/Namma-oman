import type { TextStyle } from 'react-native';

/**
 * Latin text is set in Inter, as in the Parklane app; weights are chosen by family name, never
 * by `fontWeight`, so Android renders the real cut instead of synthesising one.
 * Inter has no Arabic glyphs, so Arabic text uses IBM Plex Sans Arabic throughout
 * (see `arabicTextVariants`); its geometric forms sit close to the logo's Arabic wordmark.
 */
export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  arabicLight: 'IBMPlexSansArabic_300Light',
  arabicRegular: 'IBMPlexSansArabic_400Regular',
  arabicMedium: 'IBMPlexSansArabic_500Medium',
  arabicSemiBold: 'IBMPlexSansArabic_600SemiBold',
  arabicBold: 'IBMPlexSansArabic_700Bold',
} as const;

/*
 * Font files are the Google Fonts faces cut down to the characters the app shows (about 70%
 * smaller), made by scripts/subset-fonts.py from the @expo-google-fonts packages. Re-run it
 * after changing a font. Only the faces listed below are bundled.
 */

/** The Welcome screen's faces: loaded while the splash screen is up (App.tsx). */
export const startupFontAssets = {
  [fontFamilies.regular]: require('../assets/fonts/Inter_400Regular.ttf'),
  [fontFamilies.semiBold]: require('../assets/fonts/Inter_600SemiBold.ttf'),
  [fontFamilies.bold]: require('../assets/fonts/Inter_700Bold.ttf'),
};

/** The other Latin faces: loaded in the background once the first screen is showing. */
export const deferredFontAssets = {
  [fontFamilies.medium]: require('../assets/fonts/Inter_500Medium.ttf'),
};

/**
 * Arabic faces: loaded only when the app first switches to Arabic, so English visitors never
 * download them (see LocaleProvider).
 */
export const arabicFontAssets = {
  [fontFamilies.arabicLight]: require('../assets/fonts/IBMPlexSansArabic_300Light.ttf'),
  [fontFamilies.arabicRegular]: require('../assets/fonts/IBMPlexSansArabic_400Regular.ttf'),
  [fontFamilies.arabicMedium]: require('../assets/fonts/IBMPlexSansArabic_500Medium.ttf'),
  [fontFamilies.arabicSemiBold]: require('../assets/fonts/IBMPlexSansArabic_600SemiBold.ttf'),
  [fontFamilies.arabicBold]: require('../assets/fonts/IBMPlexSansArabic_700Bold.ttf'),
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
  | 'link'
  | 'greeting'
  | 'greetingName'
  | 'cardTitle'
  | 'cardLabel'
  | 'value'
  | 'amount'
  | 'badge'
  | 'tileLabel'
  | 'overline'
  | 'heroTitle'
  | 'heroTagline'
  | 'heroBody'
  | 'pillLabel'
  | 'counter'
  | 'tabLabel'
  | 'tabLabelActive'
  | 'pageOverline'
  | 'pageTitle'
  | 'pageSubtitle'
  | 'sectionTitle'
  | 'panelTitle'
  | 'panelHeadline'
  | 'panelHeading'
  | 'displaySerif'
  | 'statLarge'
  | 'statMedium'
  | 'bodyLarge'
  | 'bodyTight'
  | 'panelLabel'
  | 'labelLarge'
  | 'label'
  | 'labelSmall'
  | 'labelTiny'
  | 'initials'
  | 'chatBody'
  | 'voiceCaption';

/**
 * Sizes are dp, the same as the Parklane app's type for each role (its src/theme/typography.ts),
 * and are not scaled with the screen width, as there. Weights are this app's (Inter by role).
 */
export const textVariants: Record<TextVariant, TextStyle> = {
  // Welcome (start 1.png)
  heading: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 29,
    lineHeight: 32,
  },
  subheading: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
  },
  button: {
    fontFamily: fontFamilies.bold,
    fontSize: 11.5,
    lineHeight: 15,
    letterSpacing: 0.5,
  },

  // Sign In (sign in.png)
  display: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 9.5,
    lineHeight: 13,
  },
  micro: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  input: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  buttonLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  link: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    lineHeight: 15,
  },

  // Home (home 1.png)
  greeting: {
    fontFamily: fontFamilies.regular,
    fontSize: 8,
    lineHeight: 11,
  },
  greetingName: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    lineHeight: 19,
  },
  cardTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  cardLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 8,
    lineHeight: 11,
  },
  value: {
    fontFamily: fontFamilies.medium,
    fontSize: 9.5,
    lineHeight: 13,
  },
  amount: {
    fontFamily: fontFamilies.bold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  badge: {
    fontFamily: fontFamilies.medium,
    fontSize: 8,
    lineHeight: 11,
  },
  tileLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 9.5,
    lineHeight: 13,
  },
  overline: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 20.5,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  heroTagline: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  heroBody: {
    fontFamily: fontFamilies.regular,
    fontSize: 8,
    lineHeight: 11,
  },
  pillLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 9.5,
    lineHeight: 13,
  },
  counter: {
    fontFamily: fontFamilies.regular,
    fontSize: 7,
    lineHeight: 10,
  },
  tabLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 8.5,
    lineHeight: 11,
    letterSpacing: 0.4,
  },
  tabLabelActive: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 8.5,
    lineHeight: 11,
    letterSpacing: 0.4,
  },

  // Construction Progress (construction.png). Sizes match the export's text widths:
  pageOverline: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  pageSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  panelTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  panelHeadline: {
    fontFamily: fontFamilies.bold,
    fontSize: 9.5,
    lineHeight: 13,
  },
  panelHeading: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  // A figure in a small stat card (the handover estimate): Parklane's StatTile value.
  displaySerif: {
    fontFamily: fontFamilies.bold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  statLarge: {
    fontFamily: fontFamilies.bold,
    fontSize: 20.5,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  statMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    lineHeight: 15,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: 9.5,
    lineHeight: 13,
  },
  bodyTight: {
    fontFamily: fontFamilies.regular,
    fontSize: 7,
    lineHeight: 10,
  },
  panelLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 9.5,
    lineHeight: 13,
  },
  labelLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: 8,
    lineHeight: 11,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: 8,
    lineHeight: 11,
  },
  labelSmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 7,
    lineHeight: 10,
  },
  labelTiny: {
    fontFamily: fontFamilies.regular,
    fontSize: 7,
    lineHeight: 10,
  },
  initials: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    lineHeight: 15,
  },

  // Assistant: chat answers and live voice captions, set larger than the cards' type for
  // reading at length.
  chatBody: {
    fontFamily: fontFamilies.regular,
    fontSize: 9.5,
    lineHeight: 15,
  },
  voiceCaption: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    lineHeight: 20,
  },
};

/** The Arabic face standing in for each Latin face (by weight). */
const ARABIC_FAMILY: Readonly<Record<string, string>> = {
  [fontFamilies.regular]: fontFamilies.arabicRegular,
  [fontFamilies.medium]: fontFamilies.arabicMedium,
  [fontFamilies.semiBold]: fontFamilies.arabicSemiBold,
  [fontFamilies.bold]: fontFamilies.arabicBold,
};
/** Platform-font variants are matched by weight. */
const ARABIC_FAMILY_BY_WEIGHT: Readonly<Record<string, string>> = {
  '300': fontFamilies.arabicLight,
  '400': fontFamilies.arabicRegular,
  '500': fontFamilies.arabicMedium,
  '600': fontFamilies.arabicSemiBold,
  '700': fontFamilies.arabicBold,
};
/** Arabic needs taller lines than the Latin metrics the layouts were measured with. */
const ARABIC_MIN_LINE_HEIGHT = 1.4;

function toArabic(style: TextStyle): TextStyle {
  const fontSize = style.fontSize ?? 0;
  return {
    ...style,
    fontFamily:
      (style.fontFamily && ARABIC_FAMILY[style.fontFamily]) ??
      ARABIC_FAMILY_BY_WEIGHT[String(style.fontWeight ?? '400')] ??
      fontFamilies.arabicRegular,
    // The weight is in the family; a fontWeight on a custom font can fall back on Android.
    fontWeight: undefined,
    // Tracking breaks the joins between Arabic letters.
    letterSpacing: 0,
    lineHeight: Math.max(style.lineHeight ?? 0, fontSize * ARABIC_MIN_LINE_HEIGHT),
    fontVariant: undefined,
  };
}

/** The same variants for Arabic text (used by AppText when the app language is Arabic). */
export const arabicTextVariants = Object.fromEntries(
  Object.entries(textVariants).map(([name, style]) => [name, toArabic(style)]),
) as Record<TextVariant, TextStyle>;

export const typography = {
  fontFamilies,
  variants: textVariants,
  arabicVariants: arabicTextVariants,
};

export type Typography = typeof typography;
