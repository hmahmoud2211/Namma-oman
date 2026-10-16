import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { Panel } from '@/components/ui/Panel';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface FormPanelProps {
  icon: Glyph;
  title: string;
  subtitle: string;
  submitLabel: string;
  onSubmit: () => void;
  /** Shows a close button that folds the form away. */
  onClose?: () => void;
  closeLabel?: string;
  /** The fields; lay them out with `FormRow`. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = {
  badge: 26,
  badgeIcon: 14,
  gap: 8,
  fieldsTop: 12,
  fieldGap: 9,
  submitTop: 14,
  close: 11,
  arrow: 7,
} as const;

/**
 * The service screens' forms (visitor pass, maintenance request, booking, feedback): a card
 * with an icon heading, the fields, and the deep-green submit pill used by Sign In.
 */
export function FormPanel({
  icon,
  title,
  subtitle,
  submitLabel,
  onSubmit,
  onClose,
  closeLabel,
  children,
  style,
}: FormPanelProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Panel style={style}>
      <View style={styles.header}>
        <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.badge}>
          <AppIcon {...icon} size={scale(d.badgeIcon)} color={colors.surfaceIcon} />
        </LinearGradient>
        <View style={styles.title}>
          <AppText variant="panelHeading" color={colors.surfaceText} accessibilityRole="header">
            {title}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {subtitle}
          </AppText>
        </View>
        {onClose ? (
          <Pressable
            onPress={onClose}
            hitSlop={scale(10)}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <CloseIcon size={scale(d.close)} color={colors.surfaceTextMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.fields}>{children}</View>

      <AppButton
        title={submitLabel}
        variant="emerald"
        size="medium"
        icon={<ArrowRightIcon size={scale(d.arrow)} color={colors.buttonEmeraldText} />}
        iconPosition="trailing"
        onPress={onSubmit}
        style={styles.submit}
      />
    </Panel>
  );
}

/** One row of a form: its fields share the width equally. */
export function FormRow({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.row}>{children}</View>;
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: scale(d.badge),
    height: scale(d.badge),
    borderRadius: scale(7),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    marginHorizontal: scale(d.gap),
  },
  fields: {
    marginTop: scale(d.fieldsTop),
    rowGap: scale(d.fieldGap),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: scale(d.fieldGap),
  },
  submit: {
    marginTop: scale(d.submitTop),
  },
  pressed: {
    opacity: 0.6,
  },
}));
