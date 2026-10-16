import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Face scan glyph: corner brackets, eyes, nose and smile. Drawn in the export's pixel units. */
export function FaceIdIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="3 3 46 46" fill="none">
      <Path
        d={[
          'M5.5 16.5V9.5A4 4 0 0 1 9.5 5.5H17',
          'M35 5.5H42.5A4 4 0 0 1 46.5 9.5V16.5',
          'M46.5 35.5V42.5A4 4 0 0 1 42.5 46.5H35',
          'M17 46.5H9.5A4 4 0 0 1 5.5 42.5V35.5',
          'M18.5 19V24.5',
          'M33.5 19V24.5',
          'M26 19V28.6Q26 30.2 24.4 30.2H23.6',
          'M20.5 34.2Q26 38.8 31.5 34.2',
        ].join('')}
        stroke={color}
        strokeWidth={3.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
