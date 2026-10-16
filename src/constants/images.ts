type ImageKey = 'welcomeBackground' | 'signInBackground' | 'brandLogo';

/**
 * Every bundled image is referenced from here, never by path inside components.
 * Values are Metro asset IDs: valid as an Image `source` and for expo-asset's `Asset.fromModule`.
 */
export const images: Readonly<Record<ImageKey, number>> = {
  welcomeBackground: require('../assets/images/backgrounds/welcome-background.png'),
  signInBackground: require('../assets/images/backgrounds/sign-in-background.png'),
  // TEMPORARY: cut out of the Figma screenshot (Assets/screens/start 1.png) at 2x.
  // Replace this file with the official logo export (SVG or 3x PNG) — no code changes needed.
  brandLogo: require('../assets/images/logos/nama-logo.png'),
};
