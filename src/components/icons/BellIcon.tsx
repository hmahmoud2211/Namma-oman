import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

interface BellIconProps extends IconProps {
  /** `solid` (Home header) or `outline` (Construction Progress header button). */
  variant?: 'solid' | 'outline';
}

/** Notification bell with a flared rim and clapper. */
export function BellIcon({ size, color, variant = 'solid' }: BellIconProps) {
  if (variant === 'outline') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 3.6C12.7 3.6 13.2 3.1 13.2 2.5C13.2 1.9 12.7 1.4 12 1.4C11.3 1.4 10.8 1.9 10.8 2.5C10.8 3.1 11.3 3.6 12 3.6ZM12 3.6C8.7 3.6 6.4 6.3 6.4 9.6V14.2C6.4 15.6 5.6 16.9 4.4 17.6L3.6 18.1H20.4L19.6 17.6C18.4 16.9 17.6 15.6 17.6 14.2V9.6C17.6 6.3 15.3 3.6 12 3.6ZM9.9 20.1C10.2 21.1 11 21.8 12 21.8C13 21.8 13.8 21.1 14.1 20.1"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.2C12.9 1.2 13.6 1.9 13.6 2.8V3.4C16.9 4.1 18.9 6.9 18.9 10.4V14.6C18.9 16 19.6 17.2 20.9 18L21.4 18.3C22 18.7 21.7 19.6 21 19.6H3C2.3 19.6 2 18.7 2.6 18.3L3.1 18C4.4 17.2 5.1 16 5.1 14.6V10.4C5.1 6.9 7.1 4.1 10.4 3.4V2.8C10.4 1.9 11.1 1.2 12 1.2ZM9.2 20.8H14.8C14.6 22 13.4 22.9 12 22.9C10.6 22.9 9.4 22 9.2 20.8Z"
        fill={color}
      />
    </Svg>
  );
}
