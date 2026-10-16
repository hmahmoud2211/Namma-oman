import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Solid rounded house with a door cut-out (active Home tab). */
export function HomeFilledIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M10.7 2.1C11.4 1.5 12.6 1.5 13.3 2.1L21.4 9.2C21.8 9.6 22 10.1 22 10.7V20.5C22 21.3 21.3 22 20.5 22H15.3V16.2C15.3 15.6 14.8 15.1 14.2 15.1H9.8C9.2 15.1 8.7 15.6 8.7 16.2V22H3.5C2.7 22 2 21.3 2 20.5V10.7C2 10.1 2.2 9.6 2.6 9.2Z"
        fill={color}
      />
    </Svg>
  );
}
