import type { EdgeInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/spacing';
import { createResponsive, designFrameFromExport } from '@/utils/responsive';

import { BOTTOM_TAB_BAR_HEIGHT, BOTTOM_TAB_BAR_OVERHANG } from './BottomTabBar';

/**
 * The main tab bar's placement, apart from the bar itself so that what sits above it (e.g. the
 * toast) can clear it without importing the bar and its navigation.
 *
 * Measured once from Home (home 1.png, 774×1385 px) and shared, so the bar sits in exactly the
 * same place on every screen whatever that screen's own export.
 */
const DOCK_FRAME = designFrameFromExport(774, 1385);
// Centred, and wider than home 1.png's 297.2 dp so seven labels ("Video Call") have room.
export const DOCK = { width: 348, bottom: 31.6, gapAbove: 20.9 } as const;

export function getDockLayout(width: number, height: number, insets: EdgeInsets) {
  const { scale, verticalScale } = createResponsive(width, height, DOCK_FRAME);
  const bottom = Math.max(verticalScale(DOCK.bottom), insets.bottom + spacing.sm);
  // Content ends clear of the bar and of the Home disc rising out of it.
  const gapAbove = Math.max(
    verticalScale(DOCK.gapAbove),
    scale(BOTTOM_TAB_BAR_OVERHANG) + spacing.sm,
    spacing.lg,
  );
  const contentInset = bottom + scale(BOTTOM_TAB_BAR_HEIGHT) + gapAbove;
  return { bottom, contentInset };
}

/**
 * Distance from the bottom of the screen that scrolling content must end above, so its
 * last section clears the floating bar. Use it as the content's bottom padding.
 */
export function getMainTabBarInset(width: number, height: number, insets: EdgeInsets) {
  return getDockLayout(width, height, insets).contentInset;
}
