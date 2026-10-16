import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import type { ColorTokens } from '@/theme/colors';
import { makeStyles } from '@/utils/makeStyles';

/**
 * `positive`: arrived, approved, completed, going. `accent`: scheduled, in progress.
 * `neutral`: entered, submitted, coming soon. `action`: an open invitation, drawn filled.
 * `warning` / `danger`: alerts.
 */
export type StatusTone = 'positive' | 'accent' | 'neutral' | 'action' | 'warning' | 'danger';

interface StatusChipProps {
  label: string;
  tone: StatusTone;
  /** Leading glyph, e.g. the calendar on the active pass. */
  icon?: Glyph;
  style?: StyleProp<ViewStyle>;
}

/** Design dp, sized to sit beside the cards' 8-10 dp text. */
const d = { height: 14, paddingX: 6, borderWidth: 0.6, icon: 8, iconGap: 3 } as const;

export function toneColors(colors: ColorTokens, tone: StatusTone) {
  switch (tone) {
    case 'positive':
      return {
        text: colors.chipPositiveText,
        fill: colors.chipPositiveFill,
        border: colors.chipPositiveBorder,
      };
    case 'accent':
      return {
        text: colors.chipAccentText,
        fill: colors.chipAccentFill,
        border: colors.chipAccentBorder,
      };
    case 'neutral':
      return {
        text: colors.chipNeutralText,
        fill: colors.chipNeutralFill,
        border: colors.chipNeutralBorder,
      };
    case 'action':
      return {
        text: colors.chipActionText,
        fill: colors.chipActionFill,
        border: colors.chipActionFill,
      };
    case 'warning':
      return {
        text: colors.chipWarningText,
        fill: colors.chipWarningFill,
        border: colors.chipWarningBorder,
      };
    case 'danger':
      return {
        text: colors.chipDangerText,
        fill: colors.chipDangerFill,
        border: colors.chipDangerBorder,
      };
  }
}

/** Small rounded status pill, in the style of the Home badges ("Owner"). */
export function StatusChip({ label, tone, icon, style }: StatusChipProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const tint = toneColors(colors, tone);

  return (
    <View
      style={[styles.chip, { backgroundColor: tint.fill, borderColor: tint.border }, style]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {icon && <AppIcon {...icon} size={scale(d.icon)} color={tint.text} style={styles.icon} />}
      <AppText variant="label" color={tint.text} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const useStyles = makeStyles(({ borderRadius }, { scale }) => ({
  chip: {
    height: scale(d.height),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(d.paddingX),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.borderWidth),
  },
  icon: {
    marginEnd: scale(d.iconGap),
  },
}));
