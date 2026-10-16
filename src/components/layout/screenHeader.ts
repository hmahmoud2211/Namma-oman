import type { EdgeInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/spacing';
import { createResponsive, designFrameFromExport } from '@/utils/responsive';

/**
 * Where a screen's header row starts, shared so headers line up from screen to screen.
 * Measured from the Construction Progress export (770×1368 px): 28.05 dp from the top of the
 * frame, scaled with screen height, and never closer than 8 dp below the status bar.
 */
const HEADER_FRAME = designFrameFromExport(770, 1368);
const HEADER_TOP = 28.05;

export function getScreenHeaderTop(width: number, height: number, insets: EdgeInsets) {
  const { verticalScale } = createResponsive(width, height, HEADER_FRAME);
  return Math.max(verticalScale(HEADER_TOP), insets.top + spacing.sm);
}
