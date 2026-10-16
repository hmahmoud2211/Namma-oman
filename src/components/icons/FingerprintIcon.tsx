import Svg, { G, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Loop fingerprint of nested ridges, tilted like the Touch ID glyph in the design. */
export function FingerprintIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <G
        // A transform string, not `rotation`/`origin`: on web those props become an
        // invalid `transform-origin` DOM attribute (react-native-svg).
        transform="rotate(-14 24 24)"
        stroke={color}
        strokeWidth={2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M4.6 20A19.8 19.8 0 0 1 20 4.6M26.8 4.5A19.8 19.8 0 0 1 43.4 19.6" />
        <Path d="M7.2 29V24.8A16.8 16.8 0 0 1 40.8 24.8V28" />
        <Path d="M10.2 35V24.8A13.8 13.8 0 0 1 37.8 24.8V33M37.8 37V39" />
        <Path d="M13.2 40V24.8A10.8 10.8 0 0 1 34.8 24.8V42" />
        <Path d="M16.2 43V24.8A7.8 7.8 0 0 1 31.8 24.8V36M31.8 40V44.5" />
        <Path d="M19.2 39V24.8A4.8 4.8 0 0 1 28.8 24.8V45" />
        <Path d="M22.4 44V24.8A1.6 1.6 0 0 1 25.6 24.8V38" />
      </G>
    </Svg>
  );
}
