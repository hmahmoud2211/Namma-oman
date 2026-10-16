import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

interface EyeIconProps extends IconProps {
  /** Draws the diagonal slash (the "hidden" state shown in the design). */
  crossed?: boolean;
}

/** Almond eye with pupil; crossed variant for a hidden password. Drawn in the export's pixel units. */
export function EyeIcon({ size, color, crossed = false }: EyeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="2.2 -0.3 34.1 34.1" fill="none">
      <Path
        d="M3.5 16.75Q19.25 1 35 16.75Q19.25 32.5 3.5 16.75Z"
        stroke={color}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <Circle cx={19.25} cy={16.75} r={4.2} stroke={color} strokeWidth={2.6} />
      {crossed && <Path d="M7 4.5L31.5 29" stroke={color} strokeWidth={2.6} strokeLinecap="round" />}
    </Svg>
  );
}
