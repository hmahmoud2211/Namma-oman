import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

import { images } from '@/constants/images';
import { commonStrings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';

// Read from the bundled file, so swapping in the official logo keeps its own proportions.
// The light-artwork variant (the theme's `artwork.brandLogo`) has the same proportions.
// expo-asset works on iOS, Android and web (react-native-web has no Image.resolveAssetSource).
const { width: assetWidth, height: assetHeight } = Asset.fromModule(images.brandLogo);
const LOGO_ASPECT_RATIO = assetWidth && assetHeight ? assetWidth / assetHeight : 1;

interface BrandLogoProps {
  /** Rendered width in dp; height follows the logo's aspect ratio. */
  width: number;
  style?: StyleProp<ImageStyle>;
}

export function BrandLogo({ width, style }: BrandLogoProps) {
  const { locale } = useLocale();
  const { artwork } = useAppTheme();
  return (
    <Image
      source={artwork.brandLogo}
      contentFit="contain"
      // Loaded during the splash screen, so no fade: the logo is simply there.
      priority="high"
      // Explicit width and height, as for every image (see AGENTS.md).
      style={[{ width, height: width / LOGO_ASPECT_RATIO }, style]}
      accessibilityRole="image"
      accessibilityLabel={commonStrings[locale].brandName}
    />
  );
}
