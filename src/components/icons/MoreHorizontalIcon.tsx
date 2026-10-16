import Svg, { Circle } from 'react-native-svg';

import type { IconProps } from './types';

/** Three horizontal dots. */
export function MoreHorizontalIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={3.55} cy={12} r={2.55} fill={color} />
      <Circle cx={12} cy={12} r={2.55} fill={color} />
      <Circle cx={20.45} cy={12} r={2.55} fill={color} />
    </Svg>
  );
}
