import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** GPS crosshair: a ring with a centre dot and four ticks (Tracker tab). */
export function TrackerIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={7.2} stroke={color} strokeWidth={1.8} />
      <Circle cx={12} cy={12} r={2.6} fill={color} />
      <Path
        d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
