import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { createResponsive, type DesignFrame, type Responsive } from '@/utils/responsive';

/** Pass a screen's own design frame (a module constant) when its export differs from the reference. */
export function useResponsive(frame?: DesignFrame): Responsive {
  const { width, height } = useWindowDimensions();
  return useMemo(() => createResponsive(width, height, frame), [width, height, frame]);
}
