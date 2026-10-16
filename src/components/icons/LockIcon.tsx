import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Padlock with a keyhole (Sign In password field). Drawn in the export's pixel units. */
export function LockIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="-1.75 1.5 37.5 37.5" fill="none">
      <Rect x={4.8} y={16.8} width={24.4} height={20.9} rx={3.4} stroke={color} strokeWidth={2.6} />
      <Path d="M11 16.8V9A6 6 0 0 1 23 9V16.8" stroke={color} strokeWidth={2.6} />
      <Circle cx={17} cy={25.9} r={2.6} fill={color} />
      <Path d="M17 26.5V31.2" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}
