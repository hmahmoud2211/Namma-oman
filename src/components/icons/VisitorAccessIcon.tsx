import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Person in front of an access card (Visitor Access). */
export function VisitorAccessIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.2 4.6V3.6C9.2 2.7 9.9 2 10.8 2H19.4C20.3 2 21 2.7 21 3.6V18.4C21 19.3 20.3 20 19.4 20H17.6"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx={9} cy={10.6} r={3.4} stroke={color} strokeWidth={1.6} />
      <Path
        d="M2.8 21.2C2.8 17.7 5.6 15.4 9 15.4C12.4 15.4 15.2 17.7 15.2 21.2C15.2 21.6 14.9 22 14.4 22H3.6C3.1 22 2.8 21.6 2.8 21.2Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
