import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Safety helmet with a centre ridge and brim (Construction Progress). */
export function HardHatIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.2 16.2V14.4C4.2 9.8 7.6 6 12 6C16.4 6 19.8 9.8 19.8 14.4V16.2M9.6 6.5V11.4M14.4 6.5V11.4M9.6 6.5C9.6 5.4 10.4 4.6 11.4 4.6H12.6C13.6 4.6 14.4 5.4 14.4 6.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.2 16.2H20.8C21.6 16.2 22.2 16.9 22 17.7L21.8 18.4C21.6 19 21 19.4 20.4 19.4H3.6C3 19.4 2.4 19 2.2 18.4L2 17.7C1.8 16.9 2.4 16.2 3.2 16.2Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
