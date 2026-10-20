import { StyleSheet } from 'react-native';

import type { AppTheme } from '../../components/parking/compat/theme';

/** The map panel runs edge to edge; the route on it does the guiding. */
export function createStyles(_theme: AppTheme) {
  return StyleSheet.create({
    mapPad: {
      paddingHorizontal: 10,
      paddingBottom: 12,
    },
    note: {
      marginHorizontal: 2,
    },
  });
}
