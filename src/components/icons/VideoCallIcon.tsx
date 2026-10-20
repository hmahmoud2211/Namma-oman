import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

interface VideoCallIconProps extends IconProps {
  strokeWidth?: number;
}

/** A video camera: rounded body and the lens cone to its side (Video Call tab). */
export function VideoCallIcon({ size, color, strokeWidth = 1.5 }: VideoCallIconProps) {
  const stroke = { stroke: color, strokeWidth, strokeLinejoin: 'round' as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={6} width={13.6} height={12} rx={3} {...stroke} />
      <Path d="M15.6 10.2L20.9 7.1C21.4 6.8 22 7.2 22 7.8V16.2C22 16.8 21.4 17.2 20.9 16.9L15.6 13.8" {...stroke} strokeLinecap="round" />
    </Svg>
  );
}
