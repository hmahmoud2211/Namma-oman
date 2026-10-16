import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Leaf with its veins (landscape). */
export function LeafIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.6 3.4C12.2 3.4 6 7.6 6 14.2C6 15.8 6.5 17.2 7.3 18.3C14.2 18.3 20.6 13 20.6 3.4Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M3.4 21L16.6 7.6M10 14.4H14.2M12.6 11.8V7.8M8 16.4H10.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}
