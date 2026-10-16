import { Platform, type ViewProps, type ViewStyle } from 'react-native';

export type LayoutDirection = 'ltr' | 'rtl';

/**
 * Lays a View's subtree out in `direction`, flipping every start/end style below it.
 * Native Yoga reads the `direction` style; react-native-web ignores it and resolves
 * start/end from the `dir` attribute instead. Spread the props and add the style.
 */
export function directionStyle(direction: LayoutDirection): ViewStyle | undefined {
  return Platform.OS === 'web' ? undefined : { direction };
}

export function directionProps(direction: LayoutDirection): ViewProps {
  // `dir` is a react-native-web View prop, absent from React Native's types.
  return Platform.OS === 'web' ? ({ dir: direction } as ViewProps) : {};
}
