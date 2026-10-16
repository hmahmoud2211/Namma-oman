import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/**
 * Three heavy, round-capped bars (Home header menu).
 * Wider than tall: `size` is the width, the height is two thirds of it.
 */
export function MenuIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={(size * 2) / 3} viewBox="0 0 24 16" fill="none">
      <Path
        d="M2.4 3.1H21.6M2.4 8H21.6M2.4 12.9H21.6"
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
