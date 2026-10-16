import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Circle with a diagonal compass needle (Discover tab). */
export function CompassIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10.2} stroke={color} strokeWidth={1.7} />
      <Path
        d="M16.4 7.6L13.3 13.3L7.6 16.4L10.7 10.7Z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path d="M16.4 7.6L10.7 10.7L13.3 13.3Z" fill={color} />
    </Svg>
  );
}
