type ImageKey =
  | 'welcomeBackground'
  | 'signInBackground'
  | 'homeBackground'
  | 'brandLogo'
  | 'myUnitPhoto'
  | 'featuredCommunityOpal'
  | 'constructionUpdateFacade';

/**
 * Every bundled image is referenced from here, never by path inside components.
 * Values are Metro asset IDs: valid as an Image `source` and for expo-asset's `Asset.fromModule`.
 */
export const images: Readonly<Record<ImageKey, number>> = {
  welcomeBackground: require('../assets/images/backgrounds/welcome-background.png'),
  signInBackground: require('../assets/images/backgrounds/sign-in-background.png'),
  // Assets/bg/bg home.png. Used by both themes: no separate light-mode background was supplied.
  homeBackground: require('../assets/images/backgrounds/home-background.png'),
  // TEMPORARY: cut out of the Figma screenshot (Assets/screens/start 1.png) at 2x.
  // Replace this file with the official logo export (SVG or 3x PNG) — no code changes needed.
  brandLogo: require('../assets/images/logos/nama-logo.png'),
  // Assets/helper photos, re-encoded as JPEG (still above 3x of their on-screen size).
  myUnitPhoto: require('../assets/images/photos/my-unit.jpg'),
  featuredCommunityOpal: require('../assets/images/photos/featured-community-opal.jpg'),
  // TEMPORARY: cut out of the Construction Progress Figma export at 2x (no source photo was
  // supplied). Replace this file with the original photo — no code changes needed.
  constructionUpdateFacade: require('../assets/images/photos/construction-update-facade.jpg'),
};
