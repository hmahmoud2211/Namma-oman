import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Sun with eight rays (light theme option). */
export function SunIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4.6} fill={color} />
      <Path
        d="M12 1.8V4.4M12 19.6V22.2M1.8 12H4.4M19.6 12H22.2M4.8 4.8L6.6 6.6M17.4 17.4L19.2 19.2M4.8 19.2L6.6 17.4M17.4 6.6L19.2 4.8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
