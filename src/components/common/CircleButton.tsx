import type { ReactNode, Ref } from 'react';
import { Pressable, type StyleProp, type ViewInstance, type ViewStyle } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface CircleButtonProps {
  /** Diameter in design dp. */
  size: number;
  borderColor: string;
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** E.g. to measure the button and anchor a menu under it. */
  ref?: Ref<ViewInstance>;
}

/** Design dp, from the Construction Progress header buttons. */
const BORDER_WIDTH = 0.9;
const HIT_SLOP = 8;

/** Round outlined button over the background (header back, notifications, profile). */
export function CircleButton({
  size,
  borderColor,
  accessibilityLabel,
  onPress,
  children,
  style,
  ref,
}: CircleButtonProps) {
  const { scale } = useResponsive();
  const styles = useStyles();
  const diameter = scale(size);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      hitSlop={scale(HIT_SLOP)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        { width: diameter, height: diameter, borderColor },
        pressed && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const useStyles = makeStyles(({ borderRadius }, { scale }) => ({
  button: {
    borderRadius: borderRadius.pill,
    borderWidth: scale(BORDER_WIDTH),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
}));
