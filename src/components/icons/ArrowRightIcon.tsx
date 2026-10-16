import Svg, { Path } from 'react-native-svg';

import { useLocale } from '@/hooks/useLocale';

import type { IconProps } from './types';

/** Forward/back glyphs point the other way in right-to-left layouts. */
const MIRRORED = { transform: [{ scaleX: -1 }] };

/** Thin right arrow traced from the Get Started button in the Figma export. */
export function ArrowRightIcon({ size, color }: IconProps) {
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
        d="M0.4 5H9.3M4.9 0.6L9.3 5L4.9 9.4"
        stroke={color}
        strokeWidth={0.95}
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
