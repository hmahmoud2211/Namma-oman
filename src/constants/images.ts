import type { ImageSource } from 'expo-image';

type ImageKey =
  | 'welcomeBackground'
  | 'signInBackground'
  | 'homeBackground'
  | 'homeBackgroundLight'
  | 'brandLogo'
  | 'brandLogoOnLight'
  | 'myUnitPhoto'
  | 'featuredCommunityOpal'
  | 'constructionUpdateFacade'
  | 'parkingHero'
  | 'parkingSlot'
  | 'registeredVehicle';

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
  // Assets/bg/bg home.png: the dark theme's artwork behind Home and the service screens.
  homeBackground: require('../assets/images/backgrounds/home-background.webp'),
  // Assets/bg/bg home mode 2.png: the light theme's cream artwork. The export is slightly
  // transparent with rounded mockup corners, so it is flattened onto its own cream (the light
  // theme's `background`) and trimmed 52 px a side to drop the corners.
  homeBackgroundLight: require('../assets/images/backgrounds/home-background-light.webp'),
  // TEMPORARY: cut out of the Figma screenshot (Assets/screens/start 1.png) at 2x.
  // Replace this file with the official logo export (SVG or 3x PNG) — no code changes needed.
  brandLogo: require('../assets/images/logos/nama-logo.png'),
  // The same logo for cream backgrounds: its white wordmark recoloured to the forest ink
  // (the gold is unchanged). Replace with the official dark-on-light export when supplied.
  brandLogoOnLight: require('../assets/images/logos/nama-logo-on-light.png'),
  // Assets/helper photos, sized to about 3x their largest on-screen size.
  myUnitPhoto: require('../assets/images/photos/my-unit.webp'),
  featuredCommunityOpal: require('../assets/images/photos/featured-community-opal.webp'),
  // TEMPORARY: cut out of the Construction Progress Figma export at 2x (no source photo was
  // supplied). Replace this file with the original photo — no code changes needed.
  constructionUpdateFacade: require('../assets/images/photos/construction-update-facade.webp'),
  // Parking's photos, from the Parklane app (src/assets/images/illustrations there). The hero is
  // cropped to its left 200 px, leaving out the Parklane sign; the vehicle is a cut-out.
  parkingHero: require('../assets/images/photos/parking-hero.webp'),
  parkingSlot: require('../assets/images/photos/parking-slot.webp'),
  registeredVehicle: require('../assets/images/photos/registered-vehicle.webp'),
};

/** Width ÷ height of the parking photos, for sizing them without stretching. */
export const imageAspects = {
  parkingHero: 200 / 149,
  parkingSlot: 306 / 136,
  registeredVehicle: 207 / 99,
} as const;

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
