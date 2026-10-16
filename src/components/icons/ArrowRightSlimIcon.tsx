import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Long, flat-headed right arrow from the Sign In button (wider than tall). */
export function ArrowRightSlimIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path
        d="M0.3 5H9.6M5.6 2.05L9.6 5L5.6 7.95"
        stroke={color}
        strokeWidth={0.95}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
