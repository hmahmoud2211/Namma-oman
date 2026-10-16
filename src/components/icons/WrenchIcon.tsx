import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Open-ended wrench, head at top right (Maintenance). */
export function WrenchIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.6 2.4C12.2 3.2 10.9 5.8 11.6 8.2L2.9 16.9C2 17.8 2 19.3 2.9 20.2L3.8 21.1C4.7 22 6.2 22 7.1 21.1L15.8 12.4C18.2 13.1 20.8 11.8 21.6 9.4L18.2 9.8L15.6 7.2L16 3.8C15.5 3.6 15 3.4 14.6 2.4Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Circle cx={5} cy={19} r={1} stroke={color} strokeWidth={1.2} />
    </Svg>
  );
}
