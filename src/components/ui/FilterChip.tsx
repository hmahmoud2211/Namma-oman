import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface FilterChipProps {
  label: string;
  icon: Glyph;
  selected: boolean;
  onPress: () => void;
  /** `tab` for a view switcher (Smart Home's rooms), `radio` for a filter. */
  role?: 'tab' | 'radio';
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = { height: 22, paddingX: 9, icon: 11, gap: 5, borderWidth: 0.6 } as const;

/** Icon-and-label pill for picking a room or a category; the chosen one is lit in the accent. */
export function FilterChip({
  label,
  icon,
  selected,
  onPress,
  role = 'tab',
  style,
}: FilterChipProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const tint = selected ? colors.chipAccentText : colors.surfaceText;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppIcon {...icon} size={scale(d.icon)} color={tint} />
      <AppText variant={selected ? 'panelLabel' : 'labelLarge'} color={tint} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  chip: {
    height: scale(d.height),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: scale(d.gap),
    paddingHorizontal: scale(d.paddingX),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.fieldFill,
  },
  selected: {
    borderColor: colors.chipAccentBorder,
    backgroundColor: colors.chipAccentFill,
  },
  pressed: {
    opacity: 0.7,
  },
}));
