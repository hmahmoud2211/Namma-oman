import { useCallback, useId, useState, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { GlassLayer } from '@/components/common/GlassLayer';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

/**
 * - `plain`: single-colour hairline rim (weather card, service tiles)
 * - `feature`: diagonal gold-to-green rim with a soft glow (My Unit card)
 */
export type SurfaceCardRim = 'plain' | 'feature';

interface SurfaceCardProps {
  children?: ReactNode;
  /** Corner radius in design dp. */
  radius: number;
  rim?: SurfaceCardRim;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const PLAIN_BORDER_WIDTH = 0.5;
const FEATURE_BORDER_WIDTH = 0.75;
const RIM_STOPS = [0, 0.35, 0.7, 1] as const;

/**
 * Themed frosted-glass card from the Home screen: the background shows through, blurred,
 * under a green tint (dark theme) or a cream tint with deep-green ink (light theme).
 * Both tints are semi-transparent (mode 1 / mode 2 exports).
 */
export function SurfaceCard({ children, radius, rim = 'plain', style }: SurfaceCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const gradientId = `rim${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const borderRadius = scale(radius);
  const borderWidth = scale(rim === 'feature' ? FEATURE_BORDER_WIDTH : PLAIN_BORDER_WIDTH);

  const handleLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      if (rim !== 'feature') return;
      const { width, height } = nativeEvent.layout;
      // A screen hidden under another in the stack lays out at 0 × 0: keep the last rim.
      if (width <= 0 || height <= 0) return;
      setSize((current) =>
        current?.width === width && current.height === height ? current : { width, height },
      );
    },
    [rim],
  );

  return (
    <View
      onLayout={handleLayout}
      style={[styles.card, rim === 'feature' && styles.featureGlow, { borderRadius }, style]}
    >
      <GlassLayer borderRadius={borderRadius} colors={colors.surfaceGradient} />
      {/* Faint light along the inside of the top edge. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.innerHighlight,
          { borderRadius, margin: borderWidth, borderTopWidth: borderWidth },
        ]}
        pointerEvents="none"
      />
      {rim === 'plain' && (
        <View
          style={[StyleSheet.absoluteFill, styles.plainRim, { borderRadius, borderWidth }]}
          pointerEvents="none"
        />
      )}
      {rim === 'feature' && size && (
        <Svg
          width={size.width}
          height={size.height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              {colors.featureCardBorderGradient.map((color, index) => (
                <Stop key={RIM_STOPS[index]} offset={RIM_STOPS[index]} stopColor={color} />
              ))}
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={size.width - borderWidth}
            height={size.height - borderWidth}
            rx={borderRadius - borderWidth / 2}
            stroke={`url(#${gradientId})`}
            strokeWidth={borderWidth}
            fill="none"
          />
        </Svg>
      )}
      {children}
    </View>
  );
}

const useStyles = makeStyles(({ colors, shadows }, { scale }) => ({
  card: {
    boxShadow: toBoxShadow(shadows.surfaceShadow, scale),
  },
  featureGlow: {
    boxShadow: toBoxShadow(shadows.featureCardGlow, scale),
  },
  plainRim: {
    borderColor: colors.surfaceBorder,
  },
  innerHighlight: {
    borderColor: colors.transparent,
    borderTopColor: colors.surfaceInnerHighlight,
  },
}));
