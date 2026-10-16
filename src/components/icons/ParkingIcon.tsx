import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Car beside a "P" sign on a post (Parking). */
export function ParkingIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={14.8} y={1.6} width={7.6} height={8.2} rx={1.4} stroke={color} strokeWidth={1.5} />
      <Path
        d="M17.4 7.8V3.8H19C19.8 3.8 20.4 4.4 20.4 5.2C20.4 6 19.8 6.6 19 6.6H17.4M18.6 9.8V21.8M17 21.8H20.2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.4 14.4L4.6 11.2C4.9 10.5 5.6 10 6.4 10H11.4C12.2 10 12.9 10.5 13.2 11.2L14.4 14.4M2.6 15.6C2.6 14.9 3.1 14.4 3.8 14.4H14C14.7 14.4 15.2 14.9 15.2 15.6V19.2H2.6ZM4.2 19.2V21.4M13.6 19.2V21.4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={5.4} cy={16.8} r={0.9} fill={color} />
      <Circle cx={12.4} cy={16.8} r={0.9} fill={color} />
    </Svg>
  );
}
