import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { SurfaceCard, type SurfaceCardRim } from '@/components/common/SurfaceCard';
import { makeStyles } from '@/utils/makeStyles';

interface PanelProps {
  children?: ReactNode;
  rim?: SurfaceCardRim;
  /** Drops the inner padding, e.g. for a list whose rows run to the edge. */
  flush?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Design dp: the Construction Progress cards' corner and inner margin. */
export const PANEL_RADIUS = 11;
export const PANEL_PADDING = 10;

/** A themed glass card with the app's standard inner margin, for the service screens' sections. */
export function Panel({ children, rim = 'feature', flush = false, style }: PanelProps) {
  const styles = useStyles();
  return (
    <SurfaceCard radius={PANEL_RADIUS} rim={rim} style={[!flush && styles.padded, style]}>
      {children}
    </SurfaceCard>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  padded: {
    padding: scale(PANEL_PADDING),
  },
}));
