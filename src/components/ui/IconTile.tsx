import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

/** Design dp, from the Sign In quick-access tiles (Face ID / Touch ID / More). */
export const ICON_TILE_WIDTH = 43;
const TILE_HEIGHT = 39.4;
const BORDER_WIDTH = 0.5;
const LABEL_GAP = 1.5;

interface IconTileProps {
  label: string;
  labelColor: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Frosted square-ish tile with an icon, labelled underneath. */
export function IconTile({
  label,
  labelColor,
  icon,
  onPress,
  accessibilityLabel,
  style,
}: IconTileProps) {
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.wrapper, style]}
    >
      {({ pressed }) => (
        <>
          <View style={[styles.tile, pressed && styles.pressed]}>{icon}</View>
          <AppText variant="caption" color={labelColor} numberOfLines={1} style={styles.label}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => ({
  wrapper: {
    width: scale(ICON_TILE_WIDTH),
    alignItems: 'center',
  },
  tile: {
    width: scale(ICON_TILE_WIDTH),
    height: scale(TILE_HEIGHT),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(borderRadius.control),
    borderWidth: scale(BORDER_WIDTH),
    borderColor: colors.glassTileBorder,
    backgroundColor: colors.glassTileFill,
    boxShadow: toBoxShadow(shadows.glassTileGlow, scale),
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    marginTop: scale(LABEL_GAP),
    // Labels like "Touch ID" are wider than the tile; let them overflow it, centred.
    width: scale(ICON_TILE_WIDTH * 2),
    textAlign: 'center',
  },
}));
