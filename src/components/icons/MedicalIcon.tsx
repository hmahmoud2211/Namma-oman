import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Outlined medical cross (Medical tab). */
export function MedicalIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 2.8h6v6.2h6.2v6H15v6.2H9V15H2.8V9H9z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
