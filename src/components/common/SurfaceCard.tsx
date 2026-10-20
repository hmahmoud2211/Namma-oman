import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassLayer } from '@/components/common/GlassLayer';
import { GoldRim } from '@/components/common/GoldRim';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

/**
 * Both rims are the gold edge that fades out towards the frame's centre (GoldRim).
 * - `plain`: a hairline (weather card, service tiles)
 * - `feature`: a slightly heavier line with a soft glow (My Unit card, panels)
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
const PLAIN_BORDER_WIDTH = 0.7;
const FEATURE_BORDER_WIDTH = 0.9;

/**
 * Themed frosted-glass card from the Home screen: the background shows through, blurred,
 * under a green tint (dark theme) or a cream tint with deep-green ink (light theme).
 * Both tints are semi-transparent (mode 1 / mode 2 exports).
 */
export function SurfaceCard({ children, radius, rim = 'plain', style }: SurfaceCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  const borderRadius = scale(radius);
  const borderWidth = scale(rim === 'feature' ? FEATURE_BORDER_WIDTH : PLAIN_BORDER_WIDTH);

  return (
    <View style={[styles.card, rim === 'feature' && styles.featureGlow, { borderRadius }, style]}>
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
      <GoldRim radius={borderRadius} width={borderWidth} />
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
  innerHighlight: {
    borderColor: colors.transparent,
    borderTopColor: colors.surfaceInnerHighlight,
  },
}));
