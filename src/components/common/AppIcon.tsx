import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, type StyleProp, type TextStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { makeStyles } from '@/utils/makeStyles';

/** The two outline icon families the service screens draw their data-driven glyphs from. */
export type GlyphSet = 'ionicons' | 'material';

/** A ringed plus or minus over the glyph's corner, e.g. "register a vehicle". */
export type GlyphBadge = 'add' | 'remove';

/** A glyph named in screen data, e.g. a device's or a category's icon. */
export interface Glyph {
  set: GlyphSet;
  name: string;
  badge?: GlyphBadge;
}

interface AppIconProps extends Glyph {
  /** Rendered size in dp (already scaled), like the app's SVG icons. */
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

/** Badge proportions: a ring about half the glyph's size, overhanging its corner. */
const BADGE_RATIO = 0.52;
const BADGE_SIGN_RATIO = 0.78;
const BADGE_OVERHANG = 0.12;

/**
 * One outline glyph from either family. The app's own SVG icons (components/icons) stay the
 * choice for fixed chrome such as the tab bar and headers; this draws the glyphs that screen
 * data names (devices, categories, amenities), which no hand-drawn set covers.
 */
export function AppIcon({ set, name, size, color, badge, style }: AppIconProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();

  // The families don't share a name union, so the name is typed per family.
  const glyph =
    set === 'ionicons' ? (
      <Ionicons
        name={name as keyof typeof Ionicons.glyphMap}
        size={size}
        color={color}
        style={style}
      />
    ) : (
      <MaterialCommunityIcons
        name={name as keyof typeof MaterialCommunityIcons.glyphMap}
        size={size}
        color={color}
        style={style}
      />
    );

  if (!badge) return glyph;

  const badgeSize = size * BADGE_RATIO;
  return (
    <View style={{ width: size, height: size }}>
      {glyph}
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            end: -badgeSize * BADGE_OVERHANG,
            bottom: -badgeSize * BADGE_OVERHANG,
            borderColor: color,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Ionicons name={badge} size={badgeSize * BADGE_SIGN_RATIO} color={color} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  badge: {
    position: 'absolute',
    borderWidth: scale(0.6),
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
