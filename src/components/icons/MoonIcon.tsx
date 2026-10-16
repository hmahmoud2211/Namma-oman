import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface MoonIconProps {
  size: number;
  /** Lit edge and shaded edge of the crescent; omit `shadeColor` for a flat glyph. */
  color: string;
  shadeColor?: string;
}

/** Shaded crescent moon (Home weather card, "Clear Night"). */
export function MoonIcon({ size, color, shadeColor = color }: MoonIconProps) {
  const gradientId = `moon${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id={gradientId} x1="0.2" y1="0.15" x2="0.85" y2="0.95">
          <Stop offset="0" stopColor={color} />
          <Stop offset="0.6" stopColor={color} stopOpacity={0.92} />
          <Stop offset="1" stopColor={shadeColor} />
        </LinearGradient>
      </Defs>
      <Path
        d="M12.13 2.01A10.4 10.4 0 1 0 21.98 12.96A7.4 7.4 0 0 1 12.13 2.01Z"
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
}
