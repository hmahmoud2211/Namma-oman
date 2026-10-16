import type { TextStyle } from 'react-native';

/**
 * Closest Google Fonts matches for the Figma typefaces (unconfirmed).
 * Swap the files here once the exact fonts are supplied.
 * Variants without a `fontFamily` use the platform UI font (SF Pro on iOS, Roboto on
 * Android) — the closest match for the Sign In screen's sans-serif text.
 * Home's rounded sans-serif matches Nunito Sans.
 * None of these has Arabic glyphs, so Arabic text uses IBM Plex Sans Arabic throughout
 * (see `arabicTextVariants`); its geometric forms sit close to the logo's Arabic wordmark.
 */
export const fontFamilies = {
  serifRegular: 'PlayfairDisplay_400Regular',
  serifBold: 'PlayfairDisplay_700Bold',
  sansLight: 'Montserrat_300Light',
  sansBold: 'OpenSans_700Bold',
  roundedRegular: 'NunitoSans_400Regular',
  roundedMedium: 'NunitoSans_500Medium',
  roundedSemiBold: 'NunitoSans_600SemiBold',
  roundedBold: 'NunitoSans_700Bold',
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
  [fontFamilies.serifRegular]: require('../assets/fonts/PlayfairDisplay_400Regular.ttf'),
  [fontFamilies.sansLight]: require('../assets/fonts/Montserrat_300Light.ttf'),
  [fontFamilies.sansBold]: require('../assets/fonts/OpenSans_700Bold.ttf'),
};

/** The other Latin faces: loaded in the background once the first screen is showing. */
export const deferredFontAssets = {
  [fontFamilies.serifBold]: require('../assets/fonts/PlayfairDisplay_700Bold.ttf'),
  [fontFamilies.roundedRegular]: require('../assets/fonts/NunitoSans_400Regular.ttf'),
  [fontFamilies.roundedMedium]: require('../assets/fonts/NunitoSans_500Medium.ttf'),
  [fontFamilies.roundedSemiBold]: require('../assets/fonts/NunitoSans_600SemiBold.ttf'),
  [fontFamilies.roundedBold]: require('../assets/fonts/NunitoSans_700Bold.ttf'),
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
  | 'initials';

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

  // Home (home 1.png)
  greeting: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 11,
    lineHeight: 13,
  },
  greetingName: {
    fontFamily: fontFamilies.roundedBold,
    fontSize: 16.2,
    lineHeight: 17,
  },
  cardTitle: {
    fontFamily: fontFamilies.roundedSemiBold,
    fontSize: 11.25,
    lineHeight: 14,
  },
  cardLabel: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 7.8,
    lineHeight: 10,
  },
  value: {
    fontFamily: fontFamilies.roundedMedium,
    fontSize: 10.6,
    lineHeight: 13,
  },
  amount: {
    fontFamily: fontFamilies.roundedBold,
    fontSize: 14,
    lineHeight: 17,
  },
  badge: {
    fontFamily: fontFamilies.roundedMedium,
    fontSize: 7.5,
    lineHeight: 9,
  },
  tileLabel: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 5.3,
    lineHeight: 7,
  },
  overline: {
    fontFamily: fontFamilies.roundedMedium,
    fontSize: 6.7,
    lineHeight: 8.5,
    letterSpacing: 0.92,
  },
  heroTitle: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 21.5,
    lineHeight: 26,
    letterSpacing: -1.35,
  },
  heroTagline: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 10.4,
    lineHeight: 13,
  },
  heroBody: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 6.65,
    lineHeight: 9.8,
  },
  pillLabel: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 6.8,
    lineHeight: 9,
  },
  counter: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 6.5,
    lineHeight: 8,
  },
  tabLabel: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 6.2,
    lineHeight: 8,
  },
  tabLabelActive: {
    fontFamily: fontFamilies.roundedSemiBold,
    fontSize: 6.45,
    lineHeight: 8,
  },

  // Construction Progress (construction.png). Sizes match the export's text widths:
  // Nunito Sans runs wider than the design's sans, so its caps sit a little lower.
  pageOverline: {
    fontFamily: fontFamilies.roundedSemiBold,
    fontSize: 7.2,
    lineHeight: 9,
    letterSpacing: 2.05,
  },
  pageTitle: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 23.1,
    lineHeight: 24,
    letterSpacing: -0.9,
  },
  pageSubtitle: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 10.55,
    lineHeight: 13,
  },
  sectionTitle: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: -0.3,
  },
  panelTitle: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 13.1,
    lineHeight: 16,
    letterSpacing: -0.4,
  },
  panelHeadline: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: -0.3,
  },
  panelHeading: {
    fontFamily: fontFamilies.roundedSemiBold,
    fontSize: 10.4,
    lineHeight: 13,
  },
  displaySerif: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 17.6,
    lineHeight: 20,
    letterSpacing: -0.2,
    // Playfair's default old-style figures would drop the "2"s below the baseline.
    fontVariant: ['lining-nums'],
  },
  statLarge: {
    fontFamily: fontFamilies.roundedBold,
    fontSize: 23,
    lineHeight: 26,
  },
  statMedium: {
    fontFamily: fontFamilies.roundedMedium,
    fontSize: 10,
    lineHeight: 12,
  },
  bodyLarge: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 10,
    lineHeight: 12.5,
  },
  bodyTight: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 7.25,
    lineHeight: 8.4,
  },
  panelLabel: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 8,
    lineHeight: 10,
  },
  labelLarge: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 8.3,
    lineHeight: 10.5,
  },
  label: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 7.4,
    lineHeight: 8.6,
  },
  labelSmall: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 6.7,
    lineHeight: 8.5,
  },
  labelTiny: {
    fontFamily: fontFamilies.roundedRegular,
    fontSize: 6.1,
    lineHeight: 7.5,
  },
  initials: {
    fontFamily: fontFamilies.roundedMedium,
    fontSize: 11,
    lineHeight: 13,
  },
};

/** The Arabic face standing in for each Latin face (by weight). */
const ARABIC_FAMILY: Readonly<Record<string, string>> = {
  [fontFamilies.serifRegular]: fontFamilies.arabicMedium,
  [fontFamilies.serifBold]: fontFamilies.arabicBold,
  [fontFamilies.sansLight]: fontFamilies.arabicLight,
  [fontFamilies.sansBold]: fontFamilies.arabicBold,
  [fontFamilies.roundedRegular]: fontFamilies.arabicRegular,
  [fontFamilies.roundedMedium]: fontFamilies.arabicMedium,
  [fontFamilies.roundedSemiBold]: fontFamilies.arabicSemiBold,
  [fontFamilies.roundedBold]: fontFamilies.arabicBold,
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
