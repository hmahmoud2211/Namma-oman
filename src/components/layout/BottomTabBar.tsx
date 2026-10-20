import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { GlassLayer } from '@/components/common/GlassLayer';
import { HomeFilledIcon } from '@/components/icons/HomeFilledIcon';
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
  /** The two tabs before the Home disc, and the two after it. */
  leadingItems: readonly BottomTabItem<K>[];
  trailingItems: readonly BottomTabItem<K>[];
  homeLabel: string;
  /** The active tab, or `'home'` while Home itself is showing; null on other screens. */
  activeKey: K | 'home' | null;
  onTabPress: (key: K) => void;
  onHomePress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Design dp. Taller than Home's export (35.9 dp there) so the labels read comfortably and the
 * longer ones ("Video Call", "اتصال مرئي") fit; the disc follows Parklane's bar.
 */
const BORDER_WIDTH = 0.6;
const SIDE_PADDING = 4;
const ICON_SIZE = 16;
const ICON_TOP = 7;
const LABEL_GAP = 2.4;
/** The label's line: Arabic lines are 1.4 × the font size (typography.ts), taller than Latin. */
const LABEL_LINE = 13.3;
const BOTTOM_PADDING = 6.3;
/** Light theme: rounded box around the active tab (mode 2.png). */
const ACTIVE_BOX = { inset: 3.5, width: 56, radius: 10, borderWidth: 0.6 };
/** The raised Home disc: it sits in a dark seat inside a faint halo, just above its label. */
const HOME = { size: 30, seat: 2.6, halo: 3.4, labelGap: 1.8, icon: 15, borderWidth: 0.6 };

const HALO_SIZE = HOME.size + HOME.seat * 2 + HOME.halo * 2;
const LABEL_TOP = ICON_TOP + ICON_SIZE + LABEL_GAP;
export const BOTTOM_TAB_BAR_HEIGHT = LABEL_TOP + LABEL_LINE + BOTTOM_PADDING;
/** Dark theme's underline, just under the label. */
const INDICATOR = { width: 22, height: 1.5, top: LABEL_TOP + LABEL_LINE + 0.6 };
const HALO_TOP = LABEL_TOP - HOME.labelGap - HALO_SIZE;

/** How far the Home halo rises above the bar, in design dp. */
export const BOTTOM_TAB_BAR_OVERHANG = Math.max(0, -HALO_TOP);

/**
 * Floating frosted-glass tab bar after Parklane's navigation: two tabs either side of a
 * raised Home disc. Purely presentational: the caller decides what a press does.
 */
export function BottomTabBar<K extends string>({
  leadingItems,
  trailingItems,
  homeLabel,
  activeKey,
  onTabPress,
  onHomePress,
  style,
}: BottomTabBarProps<K>) {
  const { colors, borderRadius } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const homeActive = activeKey === 'home';

  const renderTab = ({ key, label, Icon, ActiveIcon }: BottomTabItem<K>) => {
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
        <TabLabel label={label} active={isActive} />
      </Pressable>
    );
  };

  return (
    <View style={style}>
      <View style={styles.bar} accessibilityRole="tablist">
        <GlassLayer
          borderRadius={borderRadius.pill}
          colors={colors.tabBarGradient}
          tint={colors.tabBarBlurTint}
        />
        {leadingItems.map(renderTab)}
        {/* The disc floats above this cell; only its label sits in the bar. */}
        <View style={styles.tab} pointerEvents="none">
          <View style={styles.homeSpacer} />
          <TabLabel label={homeLabel} active={homeActive} />
        </View>
        {trailingItems.map(renderTab)}
      </View>

      <LinearGradient
        colors={colors.homeHaloGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.halo}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={onHomePress}
          accessibilityRole="tab"
          accessibilityState={{ selected: homeActive }}
          accessibilityLabel={homeLabel}
          style={({ pressed }) => [styles.seat, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={colors.homeDiscGradient}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.disc}
          >
            <LinearGradient
              colors={colors.homeDiscGloss}
              style={styles.gloss}
              pointerEvents="none"
            />
            <HomeFilledIcon size={scale(HOME.icon)} color={colors.homeDiscGlyph} />
          </LinearGradient>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

/** A tab's label and, while active, the underline beneath it (dark theme). */
function TabLabel({ label, active }: { label: string; active: boolean }) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  return (
    <>
      <AppText
        variant={active ? 'tabLabelActive' : 'tabLabel'}
        color={active ? colors.tabActive : colors.tabInactive}
        numberOfLines={1}
        // Native only: on the narrowest phones a long label shrinks a little rather than clip.
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {label}
      </AppText>
      {active && <View style={styles.indicator} pointerEvents="none" />}
    </>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => {
  const halo = scale(HALO_SIZE);
  const seat = scale(HOME.size + HOME.seat * 2);
  const disc = scale(HOME.size);

  return {
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
    homeSpacer: {
      height: scale(LABEL_TOP),
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
    halo: {
      position: 'absolute',
      top: scale(HALO_TOP),
      start: '50%',
      marginStart: -halo / 2,
      width: halo,
      height: halo,
      borderRadius: borderRadius.pill,
      borderWidth: scale(HOME.borderWidth),
      borderColor: colors.homeHaloBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seat: {
      width: seat,
      height: seat,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.homeSeat,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: toBoxShadow(shadows.homeDiscGlow, scale),
    },
    disc: {
      width: disc,
      height: disc,
      borderRadius: borderRadius.pill,
      borderWidth: scale(HOME.borderWidth),
      borderColor: colors.homeHaloBorder,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    gloss: {
      ...StyleSheet.absoluteFill,
      bottom: '50%',
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.97 }],
    },
  };
});
