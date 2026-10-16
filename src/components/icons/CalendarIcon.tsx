import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

const DAY_DOTS = [
  [8, 13.4],
  [12, 13.4],
  [16, 13.4],
  [8, 17.4],
  [12, 17.4],
  [16, 17.4],
] as const;

/** Calendar page with binder rings and a grid of days (Amenities Booking). */
export function CalendarIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2.6} y={4} width={18.8} height={18} rx={2.6} stroke={color} strokeWidth={1.6} />
      <Path
        d="M2.6 9H21.4M7.4 1.8V5.8M16.6 1.8V5.8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {DAY_DOTS.map(([cx, cy]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.05} fill={color} />
      ))}
    </Svg>
  );
}
