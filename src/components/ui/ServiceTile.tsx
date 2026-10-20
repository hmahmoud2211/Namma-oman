import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp. Laid out as Parklane's Home tiles are, two to a row: the icon box beside a
 * title that may take two lines at Parklane's type size, then a chevron.
 */
export const SERVICE_TILE_HEIGHT = 42;
const RADIUS = 7;
const ICON_BOX = { width: 22, height: 24, radius: 5, borderWidth: 0.5 };
const PADDING = 7;
const GAP = 7;
const CHEVRON_SIZE = 7.2;

interface ServiceTileProps {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Shortcut tile: icon in a small inset box, then the label and a chevron. */
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
        <View style={styles.row}>
          <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.iconBox}>
            {icon}
          </LinearGradient>
          <AppText
            variant="tileLabel"
            color={colors.surfaceText}
            numberOfLines={2}
            style={styles.label}
          >
            {label}
          </AppText>
          {/* Wrapped: a bare SVG would paint under the card's glass on web. */}
          <View>
            <ChevronIcon size={scale(CHEVRON_SIZE)} color={colors.surfaceText} strokeWidth={2.2} />
          </View>
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
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(GAP),
    paddingHorizontal: scale(PADDING),
  },
  iconBox: {
    width: scale(ICON_BOX.width),
    height: scale(ICON_BOX.height),
    borderRadius: scale(ICON_BOX.radius),
    borderWidth: scale(ICON_BOX.borderWidth),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
}));
