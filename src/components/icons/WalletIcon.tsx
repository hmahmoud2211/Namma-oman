import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Wallet with a raised flap and clasp (Financial Overview). */
export function WalletIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.4 7.4L13.8 2.6C14.6 2.2 15.4 2.8 15.4 3.6V6.6"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.6 10.4V8.4C18.6 7.4 17.8 6.6 16.8 6.6H5.2C4.2 6.6 3.4 7.4 3.4 8.4V19.6C3.4 20.6 4.2 21.4 5.2 21.4H16.8C17.8 21.4 18.6 20.6 18.6 19.6V17.6"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Rect x={14.6} y={10.4} width={6.4} height={7.2} rx={1.8} stroke={color} strokeWidth={1.6} />
      <Path d="M17.2 14H17.4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}
