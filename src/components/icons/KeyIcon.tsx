import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Key with a round bow (handover preparation). */
export function KeyIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.4 10.2C11.9 9.5 11.6 8.6 11.6 7.7C11.6 5.1 13.7 3 16.3 3C18.9 3 21 5.1 21 7.7C21 10.3 18.9 12.4 16.3 12.4C15.4 12.4 14.5 12.1 13.8 11.6L4.6 20.8C4.2 21.2 3.6 21.2 3.2 20.8C2.8 20.4 2.8 19.8 3.2 19.4L12.4 10.2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Circle cx={16.6} cy={7.4} r={1.6} stroke={color} strokeWidth={1.4} />
    </Svg>
  );
}
