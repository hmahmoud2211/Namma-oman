import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Tower crane with a hook beside a small building (overall construction progress). */
export function CraneIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.4 21.6V5.2M9.2 21.6V5.2M6.4 7.6L9.2 10.4L6.4 13.2L9.2 16L6.4 18.8L9.2 21.6M6.4 5.2L7.8 2.6L9.2 5.2M2.2 5.2H21M2.2 5.2V7.4H4.4V5.2M7.8 2.6L19.4 5.2M3.4 21.6H21.6"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.6 5.2V8M18.6 8C17.8 8 17.5 8.6 17.7 9.1C17.9 9.6 18.6 9.7 19 9.3"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M3.4 9.6L4.4 8.4L5.4 9.6" stroke={color} strokeWidth={1.1} strokeLinejoin="round" />
      <Rect x={12.4} y={12.2} width={7.4} height={9.4} rx={0.6} stroke={color} strokeWidth={1.3} />
      <Path d="M16.1 12.2V21.6M12.4 15.4H19.8M12.4 18.6H19.8" stroke={color} strokeWidth={1.1} />
    </Svg>
  );
}
