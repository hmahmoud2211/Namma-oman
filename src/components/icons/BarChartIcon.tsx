import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Three solid bars on a baseline (monthly progress). */
export function BarChartIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={10} width={4.6} height={10.4} rx={0.6} fill={color} />
      <Rect x={9.7} y={3} width={4.6} height={17.4} rx={0.6} fill={color} />
      <Rect x={16.4} y={7.4} width={4.6} height={13} rx={0.6} fill={color} />
      <Path d="M2.2 21.4H21.8" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}
