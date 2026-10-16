import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

interface CommunityIconProps extends IconProps {
  strokeWidth?: number;
}

/** Three people, the centre one larger and in front (Community tile and tab). */
export function CommunityIcon({ size, color, strokeWidth = 1.5 }: CommunityIconProps) {
  const stroke = { stroke: color, strokeWidth, strokeLinejoin: 'round' as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={6.4} r={3.4} {...stroke} />
      <Path d="M5.6 20.4C5.6 16.4 8.4 13.4 12 13.4C15.6 13.4 18.4 16.4 18.4 20.4Z" {...stroke} />
      <Circle cx={4.6} cy={9.6} r={2.2} {...stroke} />
      <Circle cx={19.4} cy={9.6} r={2.2} {...stroke} />
      <Path
        d="M6.6 14.2C6 13.9 5.3 13.8 4.6 13.8C2.6 13.8 1.2 15.4 1.2 17.6V18.6H5.4M17.4 14.2C18 13.9 18.7 13.8 19.4 13.8C21.4 13.8 22.8 15.4 22.8 17.6V18.6H18.6"
        {...stroke}
        strokeLinecap="round"
      />
    </Svg>
  );
}
