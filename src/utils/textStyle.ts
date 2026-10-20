import type { TextStyle } from 'react-native';

/**
 * A text style as rendered: sizes are dp and are not scaled with the screen (as in the
 * Parklane app); Android's extra font padding is dropped so line heights are exact.
 */
export function textStyle(style: TextStyle): TextStyle {
  return { ...style, includeFontPadding: false };
}
