import { useEffect, useState, type ComponentType } from 'react';
import { Animated, BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { GlassLayer } from '@/components/common/GlassLayer';
import { CheckIcon } from '@/components/icons/CheckIcon';
import type { IconProps } from '@/components/icons/types';
import { commonStrings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

export interface PopoverMenuOption<K extends string> {
  key: K;
  label: string;
  Icon: ComponentType<IconProps>;
}

export interface PopoverAnchor {
  /** Window coordinates of the panel's top-left corner. */
  x: number;
  y: number;
}

/** A one-off command listed under the options, e.g. "Log out". */
export interface PopoverMenuAction {
  key: string;
  label: string;
  Icon: ComponentType<IconProps>;
  /** Shown in the warning colour (e.g. log out). */
  destructive?: boolean;
  onPress: () => void;
}

interface PopoverMenuProps<K extends string> {
  anchor: PopoverAnchor;
  title: string;
  options: readonly PopoverMenuOption<K>[];
  selectedKey: K;
  onSelect: (key: K) => void;
  onClose: () => void;
  /** Commands under the options, after a divider. */
  actions?: readonly PopoverMenuAction[];
}

/** Panel width in design dp, for screens that align the menu to a button's far edge. */
export const POPOVER_MENU_WIDTH = 128;

const d = {
  width: POPOVER_MENU_WIDTH,
  radius: 9,
  borderWidth: 0.5,
  padding: 5,
  titleInset: { top: 3, bottom: 4, left: 7 },
  row: { height: 28, paddingHorizontal: 7, radius: 6, gap: 7 },
  icon: 12,
  check: 10,
  actionGap: 5,
} as const;
const FADE_MS = 140;

/**
 * Small glass menu anchored under a button, with a single selected option (radio-style).
 * Render it inside a full-screen layer (e.g. ScreenWrapper's `overlay`) so blur works on
 * Android; tapping outside, or the Android back button, closes it.
 */
export function PopoverMenu<K extends string>({
  anchor,
  title,
  options,
  selectedKey,
  onSelect,
  onClose,
  actions,
}: PopoverMenuProps<K>) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  // State, not a ref: one stable value, and react-native-web has no `useAnimatedValue`.
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();
  }, [opacity]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [onClose]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={commonStrings[locale].closeMenu}
      />
      <View
        style={[styles.panel, { top: anchor.y, left: anchor.x }]}
        accessibilityRole="menu"
        accessibilityLabel={title}
      >
        <GlassLayer borderRadius={scale(d.radius)} colors={colors.menuGradient} />
        <AppText variant="overline" color={colors.surfaceTextMuted} style={styles.title}>
          {title}
        </AppText>
        <View style={styles.divider} />
        {options.map(({ key, label, Icon }) => {
          const isSelected = key === selectedKey;
          return (
            <Pressable
              key={key}
              onPress={() => onSelect(key)}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.row,
                isSelected && styles.rowSelected,
                pressed && styles.rowPressed,
              ]}
            >
              <Icon size={scale(d.icon)} color={colors.surfaceIcon} />
              <AppText variant="value" color={colors.surfaceText} style={styles.label}>
                {label}
              </AppText>
              {isSelected && <CheckIcon size={scale(d.check)} color={colors.surfaceIcon} />}
            </Pressable>
          );
        })}
        {actions && actions.length > 0 && <View style={[styles.divider, styles.actionsDivider]} />}
        {actions?.map(({ key, label, Icon, destructive, onPress }) => {
          const color = destructive ? colors.destructiveText : colors.surfaceText;
          return (
            <Pressable
              key={key}
              onPress={onPress}
              accessibilityRole="menuitem"
              accessibilityLabel={label}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Icon size={scale(d.icon)} color={destructive ? color : colors.surfaceIcon} />
              <AppText variant="value" color={color} style={styles.label}>
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors, shadows }, { scale }) => ({
  backdrop: {
    backgroundColor: colors.menuBackdrop,
  },
  panel: {
    position: 'absolute',
    width: scale(d.width),
    padding: scale(d.padding),
    borderRadius: scale(d.radius),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceBorder,
    boxShadow: toBoxShadow(shadows.tabBarShadow, scale),
  },
  title: {
    marginTop: scale(d.titleInset.top),
    marginBottom: scale(d.titleInset.bottom),
    marginStart: scale(d.titleInset.left),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: scale(d.titleInset.left),
    marginBottom: scale(d.padding),
    backgroundColor: colors.menuDivider,
  },
  row: {
    height: scale(d.row.height),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(d.row.gap),
    paddingHorizontal: scale(d.row.paddingHorizontal),
    borderRadius: scale(d.row.radius),
  },
  actionsDivider: {
    marginTop: scale(d.actionGap),
  },
  rowSelected: {
    backgroundColor: colors.menuActiveFill,
  },
  rowPressed: {
    opacity: 0.7,
  },
  label: {
    flex: 1,
  },
}));
