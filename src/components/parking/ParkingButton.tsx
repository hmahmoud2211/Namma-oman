import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme as useOmmanTheme } from '@/hooks/useAppTheme';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

import { AppText } from './compat/AppText';

export type ParkingButtonTone = 'primary' | 'secondary' | 'danger';

export interface ParkingButtonProps {
  label: string;
  onPress: () => void;
  tone?: ParkingButtonTone;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  /** 36 dp instead of 44 dp, for buttons inside rows and notices. */
  compact?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/** Heights in dp, as Parklane's parking flows size their buttons. */
const HEIGHT = 44;
const COMPACT_HEIGHT = 36;
const EMERALD_LOCATIONS = [0, 0.35, 0.75, 1] as const;

/**
 * The parking flows' buttons in this app's style: `primary` is the emerald pill with its
 * pale-gold rim (as Sign In's), `secondary` the outlined surface pill, `danger` the coral of
 * a hang-up.
 */
export function ParkingButton({
  label,
  onPress,
  tone = 'secondary',
  icon,
  loading = false,
  disabled = false,
  compact = false,
  accessibilityHint,
  style,
}: ParkingButtonProps) {
  const { colors } = useOmmanTheme();
  const styles = useStyles();
  const inactive = disabled || loading;
  const text =
    tone === 'primary' ? colors.buttonEmeraldText : tone === 'danger' ? colors.white : colors.surfaceAccentText;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { height: compact ? COMPACT_HEIGHT : HEIGHT },
        tone === 'primary' && styles.primary,
        tone === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {tone === 'primary' ? (
        <LinearGradient
          colors={colors.buttonEmeraldGradient}
          locations={EMERALD_LOCATIONS}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.fill]}
        />
      ) : tone === 'danger' ? (
        <LinearGradient
          colors={colors.callEndGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.fill]}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator size="small" color={text} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={compact ? 15 : 17} color={text} /> : null}
          <AppText variant={compact ? 'label' : 'bodyStrong'} color={text} numberOfLines={1} style={styles.label}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, shadows, borderRadius }, { scale }) => ({
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: borderRadius.pill,
  },
  primary: {
    borderWidth: scale(0.6),
    borderColor: colors.buttonEmeraldBorder,
    boxShadow: toBoxShadow(shadows.emeraldButtonShadow, scale),
  },
  secondary: {
    borderWidth: scale(0.8),
    borderColor: colors.surfaceAccentText,
    backgroundColor: colors.fieldFill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 7,
  },
  label: {
    flexShrink: 1,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
}));
