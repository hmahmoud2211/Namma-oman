import type { PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from './theme';

export interface GlassSurfaceProps extends PropsWithChildren {
  radius: number;
  /** Lit: the chosen state (gold edge, warm fill). */
  glow?: boolean;
  stroke?: 'hairline' | 'gradient';
  /** The edge colour is the first stop. */
  strokeColors?: readonly [string, string];
  /** Accepted for Parklane's API; this surface is never blurred. */
  blurred?: boolean;
  fillOpacity?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Parklane's glass surface as the parking chips use it: a field-coloured pill with a hairline
 * edge, warmed and edged in the frame gold when lit.
 */
export function GlassSurface({ radius, glow = false, strokeColors, style, children }: GlassSurfaceProps) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          borderRadius: radius,
          borderWidth: 1,
          borderColor: strokeColors?.[0] ?? colors.dividerSubtle,
          backgroundColor: glow ? colors.infoFill : colors.fieldFill,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
