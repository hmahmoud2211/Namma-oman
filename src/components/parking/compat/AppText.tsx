import { useContext, useMemo, type Ref } from 'react';
import {
  Platform,
  Text,
  type StyleProp,
  type TextInstance,
  type TextProps,
  type TextStyle,
} from 'react-native';

import { LayoutDirectionContext } from '@/components/common/DirectionView';
import { useLocale } from '@/hooks/useLocale';

import { useAppTheme, type TypographyVariant } from './theme';

/** Keeps system font scaling from breaking the layout while still allowing some. */
const MAX_FONT_SIZE_MULTIPLIER = 1.3;

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  ref?: Ref<TextInstance>;
}

/**
 * Text for the parking flows, with Parklane's variant names (see compat/theme). Inside a
 * DirectionView the page's language decides the face and direction (an Arabic pass in an
 * English app reads right to left); elsewhere the app's language does.
 */
export function AppText({ variant = 'body', color, align, style, children, ...rest }: AppTextProps) {
  const theme = useAppTheme();
  const { locale } = useLocale();
  const direction = useContext(LayoutDirectionContext);
  const arabic = direction ? direction === 'rtl' : locale === 'ar';

  const composed = useMemo<StyleProp<TextStyle>>(
    () => [
      (arabic ? theme.arabicTypography : theme.typography)[variant],
      { color: color ?? theme.colors.textPrimary, includeFontPadding: false },
      align ? { textAlign: align } : null,
      direction && Platform.OS !== 'web' ? { writingDirection: direction } : null,
      style,
    ],
    [arabic, theme, variant, color, align, direction, style],
  );

  // react-native-web sets each text's direction from its first letter unless told.
  const web = direction && Platform.OS === 'web' ? ({ dir: direction } as TextProps) : null;

  return (
    <Text maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER} {...rest} {...web} style={composed}>
      {children}
    </Text>
  );
}
