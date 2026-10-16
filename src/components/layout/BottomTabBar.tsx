import type { ComponentType } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { GlassLayer } from '@/components/common/GlassLayer';
import type { IconProps } from '@/components/icons/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

export interface BottomTabItem<K extends string> {
  key: K;
  label: string;
  Icon: ComponentType<IconProps>;
  /** Shown while the tab is active (e.g. a filled glyph); defaults to `Icon`. */
  ActiveIcon?: ComponentType<IconProps>;
}

interface BottomTabBarProps<K extends string> {
  items: readonly BottomTabItem<K>[];
  activeKey: K;
  onTabPress: (key: K) => void;
  style?: StyleProp<ViewStyle>;
}

/** Design dp, measured from the Home tab bar (home 1.png). */
export const BOTTOM_TAB_BAR_HEIGHT = 35.9;
const BORDER_WIDTH = 0.6;
const SIDE_PADDING = 2.9;
const ICON_SIZE = 14.4;
const ICON_TOP = 5.6;
const LABEL_GAP = 1.8;
const INDICATOR = { width: 19.1, height: 1.4, top: 31.7 };
/** Light theme: rounded box around the active tab (mode 2.png). */
const ACTIVE_BOX = { inset: 3, width: 46, radius: 9, borderWidth: 0.6 };

/**
 * Floating frosted-glass, pill-shaped tab bar. Purely presentational: the screen decides what a press does,
 * so it can later be passed as a bottom-tabs navigator's `tabBar`.
 */
export function BottomTabBar<K extends string>({
  items,
  activeKey,
  onTabPress,
  style,
}: BottomTabBarProps<K>) {
  const { colors, borderRadius } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={[styles.bar, style]} accessibilityRole="tablist">
      <GlassLayer
        borderRadius={borderRadius.pill}
        colors={colors.tabBarGradient}
        tint={colors.tabBarBlurTint}
      />
      {items.map(({ key, label, Icon, ActiveIcon }) => {
        const isActive = key === activeKey;
        const TabIcon = isActive && ActiveIcon ? ActiveIcon : Icon;
        const color = isActive ? colors.tabActive : colors.tabInactive;

        return (
          <Pressable
            key={key}
            onPress={() => onTabPress(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            {isActive && <View style={styles.activeBox} pointerEvents="none" />}
            <View style={styles.icon}>
              <TabIcon size={scale(ICON_SIZE)} color={color} />
            </View>
            <AppText
              variant={isActive ? 'tabLabelActive' : 'tabLabel'}
              color={color}
              numberOfLines={1}
            >
              {label}
            </AppText>
            {isActive && <View style={styles.indicator} pointerEvents="none" />}
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => ({
  bar: {
    height: scale(BOTTOM_TAB_BAR_HEIGHT),
    flexDirection: 'row',
    paddingHorizontal: scale(SIDE_PADDING),
    borderRadius: borderRadius.pill,
    borderWidth: scale(BORDER_WIDTH),
    borderColor: colors.tabBarBorder,
    boxShadow: toBoxShadow(shadows.tabBarShadow, scale),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    marginTop: scale(ICON_TOP),
    marginBottom: scale(LABEL_GAP),
  },
  indicator: {
    position: 'absolute',
    top: scale(INDICATOR.top),
    width: scale(INDICATOR.width),
    height: scale(INDICATOR.height),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tabIndicator,
  },
  activeBox: {
    position: 'absolute',
    top: scale(ACTIVE_BOX.inset),
    bottom: scale(ACTIVE_BOX.inset),
    width: scale(ACTIVE_BOX.width),
    borderRadius: scale(ACTIVE_BOX.radius),
    borderWidth: scale(ACTIVE_BOX.borderWidth),
    borderColor: colors.tabActiveBorder,
    backgroundColor: colors.tabActiveFill,
  },
  pressed: {
    opacity: 0.7,
  },
}));
