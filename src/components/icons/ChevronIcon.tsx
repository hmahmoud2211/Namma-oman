import Svg, { Path } from 'react-native-svg';

import { useLocale } from '@/hooks/useLocale';

import type { IconProps } from './types';

/** Forward/back glyphs point the other way in right-to-left layouts. */
const MIRRORED = { transform: [{ scaleX: -1 }] };

interface ChevronIconProps extends IconProps {
  direction?: 'right' | 'left';
  /** Stroke in viewBox units (24 = icon size). */
  strokeWidth?: number;
}

/** Open chevron (card "go" affordance, back buttons); `right` means forward. */
export function ChevronIcon({
  size,
  color,
  direction = 'right',
  strokeWidth = 2.6,
}: ChevronIconProps) {
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
        d={direction === 'right' ? 'M8.5 3.5L17 12L8.5 20.5' : 'M15.5 3.5L7 12L15.5 20.5'}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
