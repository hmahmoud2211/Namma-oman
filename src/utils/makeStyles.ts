import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import type { AppTheme } from '@/theme';
import type { DesignFrame, Responsive } from '@/utils/responsive';

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

interface MakeStylesOptions {
  /** The screen's design frame, when its Figma export differs from the reference frame. */
  frame?: DesignFrame;
}

/**
 * Creates a hook returning a StyleSheet built from the active theme and screen size.
 * The sheet is rebuilt only when the theme, window size, or `params` change.
 * Pass stable `params` (e.g. safe-area insets) — not a new object each render.
 */
export function makeStyles<S extends NamedStyles, P = void>(
  factory: (theme: AppTheme, responsive: Responsive, params: P) => S,
  options: MakeStylesOptions = {},
) {
  const { frame } = options;

  return function useStyles(params: P): Readonly<S> {
    const theme = useAppTheme();
    const responsive = useResponsive(frame);
    return useMemo(
      () => StyleSheet.create(factory(theme, responsive, params)),
      [theme, responsive, params],
    );
  };
}
