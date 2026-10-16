import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Envelope outline (Sign In email field). */
export function MailIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={3} stroke={color} strokeWidth={2.2} />
      <Path
        d="M2.6 6.4L12 13L21.4 6.4"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
