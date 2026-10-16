import { useMemo } from 'react';
import { View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityIcon } from '@/components/icons/CommunityIcon';
import { CompassIcon } from '@/components/icons/CompassIcon';
import { HomeFilledIcon } from '@/components/icons/HomeFilledIcon';
import { HouseIcon } from '@/components/icons/HouseIcon';
import { MoreHorizontalIcon } from '@/components/icons/MoreHorizontalIcon';
import { ServicesIcon } from '@/components/icons/ServicesIcon';
import type { Localized } from '@/context/LocaleContext';
import { useLocale } from '@/hooks/useLocale';
import { spacing } from '@/theme/spacing';
import { makeStyles } from '@/utils/makeStyles';
import { createResponsive, DESIGN_FRAME, designFrameFromExport } from '@/utils/responsive';

import { BOTTOM_TAB_BAR_HEIGHT, BottomTabBar, type BottomTabItem } from './BottomTabBar';

export type MainTabKey = 'home' | 'community' | 'services' | 'discover' | 'more';

interface MainTab extends Omit<BottomTabItem<MainTabKey>, 'label'> {
  label: Localized<string>;
}

/** The app's main tabs, shown on every tab screen. */
export const mainTabs: readonly MainTab[] = [
  {
    key: 'home',
    label: { en: 'Home', ar: 'الرئيسية' },
    Icon: HouseIcon,
    ActiveIcon: HomeFilledIcon,
  },
  { key: 'community', label: { en: 'Community', ar: 'المجتمع' }, Icon: CommunityIcon },
  { key: 'services', label: { en: 'Services', ar: 'الخدمات' }, Icon: ServicesIcon },
  { key: 'discover', label: { en: 'Discover', ar: 'اكتشف' }, Icon: CompassIcon },
  { key: 'more', label: { en: 'More', ar: 'المزيد' }, Icon: MoreHorizontalIcon },
];

/**
 * The bar's placement, measured once from Home (home 1.png, 774×1385 px) and shared, so the
 * bar sits in exactly the same place on every screen whatever that screen's own export.
 */
const DOCK_FRAME = designFrameFromExport(774, 1385);
const DOCK = { left: 25.1, width: 297.2, bottom: 31.6, gapAbove: 20.9 } as const;

function getDockLayout(width: number, height: number, insets: EdgeInsets) {
  const { scale, verticalScale } = createResponsive(width, height, DOCK_FRAME);
  const bottom = Math.max(verticalScale(DOCK.bottom), insets.bottom + spacing.sm);
  const contentInset =
    bottom + scale(BOTTOM_TAB_BAR_HEIGHT) + Math.max(verticalScale(DOCK.gapAbove), spacing.lg);
  return { bottom, contentInset };
}

/**
 * Distance from the bottom of the screen that scrolling content must end above, so its
 * last section clears the floating bar. Use it as the content's bottom padding.
 */
export function getMainTabBarInset(width: number, height: number, insets: EdgeInsets) {
  return getDockLayout(width, height, insets).contentInset;
}

interface MainTabBarProps {
  activeKey: MainTabKey;
  onTabPress: (key: MainTabKey) => void;
}

/** The floating main tab bar, docked over the bottom of the screen (pass as ScreenWrapper's `overlay`). */
export function MainTabBar({ activeKey, onTabPress }: MainTabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { locale } = useLocale();
  const items = useMemo(
    () => mainTabs.map((tab) => ({ ...tab, label: tab.label[locale] })),
    [locale],
  );

  return (
    <View style={styles.dock} pointerEvents="box-none">
      <View style={styles.column} pointerEvents="box-none">
        <BottomTabBar
          items={items}
          activeKey={activeKey}
          onTabPress={onTabPress}
          style={styles.bar}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((_theme, { width, height, scale }, insets: EdgeInsets) => ({
  // Full-width strip so the bar can be placed within the 360-dp design column.
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: getDockLayout(width, height, insets).bottom,
  },
  column: {
    width: '100%',
    maxWidth: scale(DESIGN_FRAME.width),
    alignSelf: 'center',
  },
  bar: {
    width: scale(DOCK.width),
    marginStart: scale(DOCK.left),
  },
}));
