import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** House outline with a chimney and a square window (Home "My Unit"). */
export function HouseIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1.8 11.6L12 2.6L22.2 11.6M4.6 9.3V21.4H19.4V9.3M16.6 5V2.6H19.2V7.4"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x={9.4} y={11.6} width={5.2} height={5.2} stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}
