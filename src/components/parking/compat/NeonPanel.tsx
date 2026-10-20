import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { SurfaceCard } from '@/components/common/SurfaceCard';
import { PANEL_RADIUS } from '@/components/ui/Panel';
import { useResponsive } from '@/hooks/useResponsive';

export interface NeonPanelProps extends PropsWithChildren {
  /** Accepted for Parklane's API; the edge is always this app's fading gold rim. */
  strokeColors?: readonly [string, string];
  glowBottomColors?: readonly [string, string];
  /** Corner radius in dp (already sized); defaults to the app's panel corner. */
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Parklane's neon card, drawn as this app's glass panel with the gold rim and glow. */
export function NeonPanel({ radius, style, children }: NeonPanelProps) {
  const { scale } = useResponsive();
  // SurfaceCard scales its radius; a radius given here is already in dp.
  const designRadius = radius === undefined ? PANEL_RADIUS : radius / scale(1);
  return (
    <SurfaceCard radius={designRadius} rim="feature" style={style}>
      {children}
    </SurfaceCard>
  );
}
