import type { ImageSource } from 'expo-image';

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
 *
 * Backgrounds and photos are WebP (about 80% smaller than the PNG/JPEG exports, transparent
 * corners kept); the originals are in /Assets. Re-export new artwork the same way:
 * backgrounds at quality 95, photos at quality 85 and at most 1000 px wide.
 */
export const images: Readonly<Record<ImageKey, number>> = {
  welcomeBackground: require('../assets/images/backgrounds/welcome-background.webp'),
  signInBackground: require('../assets/images/backgrounds/sign-in-background.webp'),
  // Assets/bg/bg home.png. Used by both themes: no separate light-mode background was supplied.
  homeBackground: require('../assets/images/backgrounds/home-background.webp'),
  // TEMPORARY: cut out of the Figma screenshot (Assets/screens/start 1.png) at 2x.
  // Replace this file with the official logo export (SVG or 3x PNG) — no code changes needed.
  brandLogo: require('../assets/images/logos/nama-logo.png'),
  // Assets/helper photos, sized to about 3x their largest on-screen size.
  myUnitPhoto: require('../assets/images/photos/my-unit.webp'),
  featuredCommunityOpal: require('../assets/images/photos/featured-community-opal.webp'),
  // TEMPORARY: cut out of the Construction Progress Figma export at 2x (no source photo was
  // supplied). Replace this file with the original photo — no code changes needed.
  constructionUpdateFacade: require('../assets/images/photos/construction-update-facade.webp'),
};

/** A bundled image (the `require()` id) or a remote one, as expo-image's `source` takes. */
export type AppImageSource = number | ImageSource;

/** Images fade in over this long (ms) instead of popping in. Cached ones appear at once. */
export const IMAGE_TRANSITION_MS = 220;

/** Needed for the first screen: loaded while the splash screen is still up. */
export const startupImages: readonly number[] = [images.welcomeBackground, images.brandLogo];

/** Everything else: warmed up in the background once the first screen is showing. */
export const deferredImages: readonly number[] = Object.values(images).filter(
  (image) => !startupImages.includes(image),
);
