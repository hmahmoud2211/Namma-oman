import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Three stacked sheets (Construction Stages section heading). */
export function LayersIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L21 7.6L12 12.2L3 7.6L12 3ZM3 12L12 16.6L21 12M3 16.4L12 21L21 16.4"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
