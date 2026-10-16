import Svg, { Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** 2×2 grid of rounded squares (Services tab). */
export function ServicesIcon({ size, color }: IconProps) {
  const square = { width: 8, height: 8, rx: 1.8, stroke: color, strokeWidth: 1.8 };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2.2} y={2.2} {...square} />
      <Rect x={13.8} y={2.2} {...square} />
      <Rect x={2.2} y={13.8} {...square} />
      <Rect x={13.8} y={13.8} {...square} />
    </Svg>
  );
}
