import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Cross (close a sheet). */
export function CloseIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 5.5L18.5 18.5M18.5 5.5L5.5 18.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
