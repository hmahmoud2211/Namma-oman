import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Thin right arrow traced from the Get Started button in the Figma export. */
export function ArrowRightIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path
        d="M0.4 5H9.3M4.9 0.6L9.3 5L4.9 9.4"
        stroke={color}
        strokeWidth={0.95}
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
