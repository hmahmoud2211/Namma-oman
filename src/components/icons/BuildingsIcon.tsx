import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

const WINDOWS = [
  [11, 7],
  [13.6, 7],
  [11, 10],
  [13.6, 10],
  [11, 13],
  [13.6, 13],
  [11, 16],
  [13.6, 16],
  [6.6, 13.4],
  [6.6, 16.4],
  [17.6, 12.4],
  [17.6, 15.4],
] as const;

/** Tower flanked by two lower blocks, with lit windows (Structure, Facade). */
export function BuildingsIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.4 21H21.6M4.4 21V10.2H8.8M8.8 21V3.6H15.8V21M15.8 8.8H19.6V21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {WINDOWS.map(([cx, cy]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.85} fill={color} />
      ))}
    </Svg>
  );
}
