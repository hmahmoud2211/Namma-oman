import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface PanelHeadingProps {
  title: string;
  subtitle?: string;
  /** A glyph from screen data, or a ready-made icon element. */
  icon?: Glyph | ReactNode;
  iconColor?: string;
  /** "View All" / "Show Less": opens or folds the panel's full list in place. */
  actionLabel?: string;
  actionExpanded?: boolean;
  onActionPress?: () => void;
  /** At the end of the row, after the action (e.g. a switch or an add button). */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = { icon: 13, iconGap: 6, subtitleGap: 1, actionGap: 8, hitSlop: 10 } as const;

function isGlyph(icon: Glyph | ReactNode): icon is Glyph {
  return typeof icon === 'object' && icon !== null && 'set' in icon && 'name' in icon;
}

/** A panel's heading row: icon, title and supporting line, then its link and controls. */
export function PanelHeading({
  title,
  subtitle,
  icon,
  iconColor,
  actionLabel,
  actionExpanded,
  onActionPress,
  trailing,
  style,
}: PanelHeadingProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={[styles.row, style]}>
      {icon != null && (
        <View style={styles.icon}>
          {isGlyph(icon) ? (
            <AppIcon {...icon} size={scale(d.icon)} color={iconColor ?? colors.surfaceIcon} />
          ) : (
            icon
          )}
        </View>
      )}
      <View style={styles.text}>
        <AppText variant="panelHeading" color={colors.surfaceText} accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="label" color={colors.surfaceTextMuted} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={scale(d.hitSlop)}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}: ${title}`}
          accessibilityState={
            actionExpanded === undefined ? undefined : { expanded: actionExpanded }
          }
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <AppText variant="labelLarge" color={colors.surfaceAccentText}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginEnd: scale(d.iconGap),
  },
  text: {
    flex: 1,
  },
  subtitle: {
    marginTop: scale(d.subtitleGap),
  },
  action: {
    marginStart: scale(d.actionGap),
  },
  trailing: {
    marginStart: scale(d.actionGap),
  },
  pressed: {
    opacity: 0.6,
  },
}));
