import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Paint roller (interior finishing). */
export function PaintRollerIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2.6} y={2.6} width={15.6} height={5.6} rx={1.6} stroke={color} strokeWidth={1.5} />
      <Path
        d="M18.2 5.4H20.4C20.9 5.4 21.4 5.8 21.4 6.4V10.2C21.4 10.8 20.9 11.2 20.4 11.2H12.4C11.9 11.2 11.4 11.7 11.4 12.2V14.2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x={9.8} y={14.2} width={3.2} height={7.4} rx={1.2} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
