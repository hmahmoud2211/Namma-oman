import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** House with a doorway and wireless arcs at the roof's corner (Smart Home). */
export function SmartHomeIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1.6 14.2L9.4 7.4L17.2 14.2M3.8 12.4V22H15V12.4M7.4 22V17.6H11.4V22"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.6 6.6C16.6 6.6 17.4 7.4 17.4 8.4M15.6 4C18.1 4 20 5.9 20 8.4M15.6 1.4C19.5 1.4 22.6 4.5 22.6 8.4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx={15.6} cy={8.4} r={0.9} fill={color} />
    </Svg>
  );
}
