import { useMemo } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { TextVariant } from '@/theme/typography';
import { scaleTextStyle } from '@/utils/textStyle';

/** Keeps system font scaling from breaking the design layout while still allowing some. */
const MAX_FONT_SIZE_MULTIPLIER = 1.3;

export interface AppTextProps extends TextProps {
  variant: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function AppText({ variant, color, align, style, ...rest }: AppTextProps) {
  const { colors, typography } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();

  const variantStyle = useMemo(
    () =>
      scaleTextStyle(
        (locale === 'ar' ? typography.arabicVariants : typography.variants)[variant],
        scale,
      ),
    [typography, locale, variant, scale],
  );

  return (
    <Text
      maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER}
      {...rest}
      style={[
        variantStyle,
        { color: color ?? colors.textPrimary },
        align && { textAlign: align },
        style,
      ]}
    />
  );
}
