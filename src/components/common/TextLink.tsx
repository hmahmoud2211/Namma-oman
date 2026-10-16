import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useResponsive } from '@/hooks/useResponsive';
import type { TextVariant } from '@/theme/typography';
import { makeStyles } from '@/utils/makeStyles';

/** Underline placement in design dp: the design draws it at the descender line, below the system underline. */
const UNDERLINE_THICKNESS = 0.45;
const UNDERLINE_OFFSET = -1.4;
const HIT_SLOP = 8;

interface TextLinkProps {
  title: string;
  onPress: () => void;
  variant: TextVariant;
  color: string;
  underline?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Pressable inline text, optionally with the design's low, thin underline. */
export function TextLink({
  title,
  onPress,
  variant,
  color,
  underline = false,
  accessibilityLabel,
  style,
}: TextLinkProps) {
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={scale(HIT_SLOP)}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      <AppText variant={variant} color={color}>
        {title}
      </AppText>
      {underline && <View style={[styles.underline, { backgroundColor: color }]} />}
    </Pressable>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  underline: {
    height: scale(UNDERLINE_THICKNESS),
    marginTop: scale(UNDERLINE_OFFSET),
  },
  pressed: {
    opacity: 0.6,
  },
}));
