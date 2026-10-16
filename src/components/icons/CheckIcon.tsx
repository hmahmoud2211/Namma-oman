import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Tick mark for the selected option in a menu. */
export function CheckIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12.6L9.4 18L20 6.4"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
