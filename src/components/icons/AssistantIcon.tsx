import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Speech bubble with a four-point sparkle inside (the AI assistant). */
export function AssistantIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C6.9 3 2.8 6.6 2.8 11C2.8 13.3 3.9 15.4 5.7 16.8L5 20.6L9.1 18.6C10 18.9 11 19 12 19C17.1 19 21.2 15.4 21.2 11C21.2 6.6 17.1 3 12 3Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M12 6.9L12.9 9.8C13.1 10.3 13.4 10.6 13.9 10.8L16.6 11.6L13.9 12.4C13.4 12.6 13.1 12.9 12.9 13.4L12 16.3L11.1 13.4C10.9 12.9 10.6 12.6 10.1 12.4L7.4 11.6L10.1 10.8C10.6 10.6 10.9 10.3 11.1 9.8Z"
        fill={color}
      />
    </Svg>
  );
}
