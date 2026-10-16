import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Solid location pin with a round hole (unit address). */
export function MapPinIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.6C7.8 1.6 4.6 4.8 4.6 8.9C4.6 14.3 12 22.4 12 22.4C12 22.4 19.4 14.3 19.4 8.9C19.4 4.8 16.2 1.6 12 1.6ZM12 6C13.6 6 14.9 7.3 14.9 8.9C14.9 10.5 13.6 11.8 12 11.8C10.4 11.8 9.1 10.5 9.1 8.9C9.1 7.3 10.4 6 12 6Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
