import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface AvatarProps {
  initials: string;
  /** Diameter in design dp. */
  size: number;
  style?: StyleProp<ViewStyle>;
}

/** First letter of the first and last names, e.g. "Omar Khaled" → "OK". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

/** Initials in a rimmed disc (visitor list, resident chip). */
export function Avatar({ initials, size, style }: AvatarProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const diameter = scale(size);

  return (
    <View
      style={[styles.disc, { width: diameter, height: diameter }, style]}
      importantForAccessibility="no-hide-descendants"
    >
      <AppText variant="labelLarge" color={colors.avatarText} allowFontScaling={false}>
        {initials}
      </AppText>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  disc: {
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.6),
    borderColor: colors.avatarBorder,
    backgroundColor: colors.avatarFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
