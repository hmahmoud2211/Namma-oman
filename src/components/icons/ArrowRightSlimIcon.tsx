import Svg, { Path } from 'react-native-svg';

import { useLocale } from '@/hooks/useLocale';

import type { IconProps } from './types';

/** Forward/back glyphs point the other way in right-to-left layouts. */
const MIRRORED = { transform: [{ scaleX: -1 }] };

/** Long, flat-headed right arrow from the Sign In button (wider than tall). */
export function ArrowRightSlimIcon({ size, color }: IconProps) {
  const { isRTL } = useLocale();
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      style={isRTL ? MIRRORED : undefined}
    >
      <Path
        d="M0.3 5H9.6M5.6 2.05L9.6 5L5.6 7.95"
        stroke={color}
        strokeWidth={0.95}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
