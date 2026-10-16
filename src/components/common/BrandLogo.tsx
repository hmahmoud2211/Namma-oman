import { Asset } from 'expo-asset';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

import { images } from '@/constants/images';

// Read from the bundled file, so swapping in the official logo keeps its own proportions.
// expo-asset works on iOS, Android and web (react-native-web has no Image.resolveAssetSource).
const { width: assetWidth, height: assetHeight } = Asset.fromModule(images.brandLogo);
const LOGO_ASPECT_RATIO = assetWidth && assetHeight ? assetWidth / assetHeight : 1;

interface BrandLogoProps {
  /** Rendered width in dp; height follows the logo's aspect ratio. */
  width: number;
  style?: StyleProp<ImageStyle>;
}

export function BrandLogo({ width, style }: BrandLogoProps) {
  return (
    <Image
      source={images.brandLogo}
      resizeMode="contain"
      // Explicit height (not aspectRatio): Image pre-fills the asset's intrinsic size,
      // and Yoga would derive the width from that height instead.
      style={[{ width, height: width / LOGO_ASPECT_RATIO }, style]}
      accessibilityRole="image"
      accessibilityLabel="Nama Real Estate"
    />
  );
}
