import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

/** Design dp, measured from the Home service grid (home 1.png). */
export const SERVICE_TILE_HEIGHT = 43;
const RADIUS = 7;
const ICON_BOX = { top: 5.1, left: 5.6, width: 18, height: 20, radius: 5, borderWidth: 0.5 };
// `right` leaves the chevron glyph 4.2 dp from the edge (its box has side bearing).
const FOOTER = { top: 29.3, left: 6.6, right: 2.1 };
const CHEVRON_SIZE = 7.2;

interface ServiceTileProps {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Shortcut tile: icon in a small inset box, label and chevron along the bottom. */
export function ServiceTile({ label, icon, onPress, style }: ServiceTileProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed, style]}
    >
      <SurfaceCard radius={RADIUS} style={styles.tile}>
        <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.iconBox}>
          {icon}
        </LinearGradient>
        <View style={styles.footer}>
          <AppText
            variant="tileLabel"
            color={colors.surfaceText}
            numberOfLines={1}
            style={styles.label}
          >
            {label}
          </AppText>
          <ChevronIcon size={scale(CHEVRON_SIZE)} color={colors.surfaceText} strokeWidth={2.2} />
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  wrapper: {
    height: scale(SERVICE_TILE_HEIGHT),
  },
  tile: {
    flex: 1,
  },
  iconBox: {
    position: 'absolute',
    top: scale(ICON_BOX.top),
    start: scale(ICON_BOX.left),
    width: scale(ICON_BOX.width),
    height: scale(ICON_BOX.height),
    borderRadius: scale(ICON_BOX.radius),
    borderWidth: scale(ICON_BOX.borderWidth),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    top: scale(FOOTER.top),
    start: scale(FOOTER.left),
    end: scale(FOOTER.right),
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
}));
