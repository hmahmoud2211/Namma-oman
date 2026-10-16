import type { TextStyle } from 'react-native';

/** Scales a design-dp text style (size, line height, tracking) for the current screen. */
export function scaleTextStyle(style: TextStyle, scale: (size: number) => number): TextStyle {
  return {
    ...style,
    fontSize: style.fontSize === undefined ? undefined : scale(style.fontSize),
    lineHeight: style.lineHeight === undefined ? undefined : scale(style.lineHeight),
    letterSpacing: style.letterSpacing === undefined ? undefined : scale(style.letterSpacing),
    includeFontPadding: false,
  };
}
