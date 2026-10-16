import Svg, { Path } from 'react-native-svg';

import { useLocale } from '@/hooks/useLocale';

import type { IconProps } from './types';

/** "Leave" points the other way in right-to-left layouts. */
const MIRRORED = { transform: [{ scaleX: -1 }] };

/** Door frame with an arrow leaving it (log out). */
export function LogoutIcon({ size, color }: IconProps) {
  const { isRTL } = useLocale();
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={isRTL ? MIRRORED : undefined}
    >
      <Path
        d="M9.5 3.5H6C4.9 3.5 4 4.4 4 5.5V18.5C4 19.6 4.9 20.5 6 20.5H9.5M15.5 7.5L20 12L15.5 16.5M20 12H9"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
