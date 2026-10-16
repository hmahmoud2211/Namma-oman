import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface ListRowProps {
  /** A glyph in a tile at the start; or pass `leading` for anything else (a date column). */
  icon?: Glyph;
  iconColor?: string;
  leading?: ReactNode;
  /** A small badge over the tile's corner (e.g. an alert's warning sign). */
  iconBadge?: ReactNode;
  title: string;
  details?: readonly string[];
  /** e.g. "2h ago", "Today, 09:14 AM". */
  time?: string;
  /** At the end of the row (a status pill, an RSVP button); kept out of the row's button. */
  trailing?: ReactNode;
  /** Hairline along the top, separating the row from the one above. */
  divided?: boolean;
  /** Tapping the row opens it to `expandedContent`; tapping again folds it. */
  onPress?: () => void;
  expanded?: boolean;
  expandedContent?: ReactNode;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = { tile: 28, tileIcon: 13, radius: 7, gap: 9, paddingY: 8, detailGap: 1.5 } as const;

/** A row in a panel's list (announcements, events, alerts, parking activity, bookings). */
export function ListRow({
  icon,
  iconColor,
  leading,
  iconBadge,
  title,
  details = [],
  time,
  trailing,
  divided = false,
  onPress,
  expanded,
  expandedContent,
  accessibilityHint,
  style,
}: ListRowProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  const body = (
    <>
      {leading}
      {icon && (
        <View>
          <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.tile}>
            <AppIcon {...icon} size={scale(d.tileIcon)} color={iconColor ?? colors.surfaceIcon} />
          </LinearGradient>
          {iconBadge ? <View style={styles.badge}>{iconBadge}</View> : null}
        </View>
      )}
      <View style={styles.text}>
        <AppText
          variant="panelLabel"
          color={colors.surfaceText}
          numberOfLines={expanded ? undefined : 2}
        >
          {title}
        </AppText>
        {details.map((line, index) => (
          <AppText
            key={`${index}-${line}`}
            variant="labelSmall"
            color={colors.surfaceTextMuted}
            numberOfLines={expanded ? undefined : 2}
            style={styles.detail}
          >
            {line}
          </AppText>
        ))}
        {time ? (
          <AppText variant="labelTiny" color={colors.surfaceTextSubtle} style={styles.detail}>
            {time}
          </AppText>
        ) : null}
        {expanded && expandedContent ? <View style={styles.more}>{expandedContent}</View> : null}
      </View>
    </>
  );

  return (
    <View style={[styles.row, divided && styles.divided, style]}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={[title, ...details, time].filter(Boolean).join(', ')}
          accessibilityHint={accessibilityHint}
          accessibilityState={expandedContent ? { expanded: !!expanded } : undefined}
          style={({ pressed }) => [styles.body, pressed && styles.pressed]}
        >
          {body}
        </Pressable>
      ) : (
        <View
          style={styles.body}
          accessible
          accessibilityLabel={[title, ...details, time].filter(Boolean).join(', ')}
        >
          {body}
        </View>
      )}
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(d.paddingY),
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceDivider,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: scale(d.gap),
  },
  tile: {
    width: scale(d.tile),
    height: scale(d.tile),
    borderRadius: scale(d.radius),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    end: -scale(4),
    bottom: -scale(4),
    borderRadius: borderRadius.pill,
  },
  text: {
    flex: 1,
  },
  detail: {
    marginTop: scale(d.detailGap),
  },
  more: {
    marginTop: scale(5),
  },
  trailing: {
    marginStart: scale(d.gap),
  },
  pressed: {
    opacity: 0.7,
  },
}));
