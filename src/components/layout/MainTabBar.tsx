import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssistantIcon } from '@/components/icons/AssistantIcon';
import { GearIcon } from '@/components/icons/GearIcon';
import { ServicesIcon } from '@/components/icons/ServicesIcon';
import { VideoCallIcon } from '@/components/icons/VideoCallIcon';
import type { Localized } from '@/context/LocaleContext';
import { useLocale } from '@/hooks/useLocale';
import { spacing } from '@/theme/spacing';
import type { ParamlessRoute, RootStackParamList } from '@/types/navigation.types';
import { makeStyles } from '@/utils/makeStyles';
import { createResponsive, DESIGN_FRAME, designFrameFromExport } from '@/utils/responsive';

import {
  BOTTOM_TAB_BAR_HEIGHT,
  BOTTOM_TAB_BAR_OVERHANG,
  BottomTabBar,
  type BottomTabItem,
} from './BottomTabBar';

export type MainTabKey = 'assistant' | 'videoCall' | 'services' | 'settings';

interface MainTab extends Omit<BottomTabItem<MainTabKey>, 'label'> {
  label: Localized<string>;
  route: ParamlessRoute;
}

/** Two tabs either side of the raised Home disc, as in Parklane's bar. */
const LEADING_TABS: readonly MainTab[] = [
  {
    key: 'assistant',
    label: { en: 'Assistant', ar: 'المساعد' },
    Icon: AssistantIcon,
    route: 'Assistant',
  },
  // Community is still one tap away on Home's shortcuts.
  {
    key: 'videoCall',
    label: { en: 'Video Call', ar: 'اتصال مرئي' },
    Icon: VideoCallIcon,
    route: 'VideoCall',
  },
];
const TRAILING_TABS: readonly MainTab[] = [
  {
    key: 'services',
    label: { en: 'Services', ar: 'الخدمات' },
    Icon: ServicesIcon,
    route: 'Services',
  },
  {
    key: 'settings',
    label: { en: 'Settings', ar: 'الإعدادات' },
    Icon: GearIcon,
    route: 'Settings',
  },
];
const HOME_LABEL: Localized<string> = { en: 'Home', ar: 'الرئيسية' };

/**
 * The bar's placement, measured once from Home (home 1.png, 774×1385 px) and shared, so the
 * bar sits in exactly the same place on every screen whatever that screen's own export.
 */
const DOCK_FRAME = designFrameFromExport(774, 1385);
// Centred in the column (home 1.png draws it ~6 dp left of centre).
const DOCK = { width: 297.2, bottom: 31.6, gapAbove: 20.9 } as const;

function getDockLayout(width: number, height: number, insets: EdgeInsets) {
  const { scale, verticalScale } = createResponsive(width, height, DOCK_FRAME);
  const bottom = Math.max(verticalScale(DOCK.bottom), insets.bottom + spacing.sm);
  // Content ends clear of the bar and of the Home disc rising out of it.
  const gapAbove = Math.max(
    verticalScale(DOCK.gapAbove),
    scale(BOTTOM_TAB_BAR_OVERHANG) + spacing.sm,
    spacing.lg,
  );
  const contentInset = bottom + scale(BOTTOM_TAB_BAR_HEIGHT) + gapAbove;
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
  /** Tapping the tab of the screen already showing, e.g. to scroll back to the top. */
  onReselect?: () => void;
}

/**
 * The floating main navigation, docked over the bottom of the screen (pass as ScreenWrapper's
 * `overlay`). It reads the current route to light its tab, opens tabs with `navigate` (so Back
 * returns where the resident came from) and returns Home with `popTo`.
 */
export function MainTabBar({ onReselect }: MainTabBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { locale } = useLocale();

  const tabs = useMemo(() => [...LEADING_TABS, ...TRAILING_TABS], []);
  const activeTab = tabs.find((tab) => tab.route === route.name);
  const activeKey = route.name === 'Home' ? 'home' : (activeTab?.key ?? null);

  const localize = useCallback(
    (items: readonly MainTab[]) => items.map((tab) => ({ ...tab, label: tab.label[locale] })),
    [locale],
  );
  const leading = useMemo(() => localize(LEADING_TABS), [localize]);
  const trailing = useMemo(() => localize(TRAILING_TABS), [localize]);

  const handleTabPress = useCallback(
    (key: MainTabKey) => {
      const tab = tabs.find((item) => item.key === key);
      if (!tab) return;
      if (tab.key === activeKey) {
        onReselect?.();
        return;
      }
      navigation.navigate(tab.route);
    },
    [activeKey, navigation, onReselect, tabs],
  );

  const handleHomePress = useCallback(() => {
    if (activeKey === 'home') {
      onReselect?.();
      return;
    }
    navigation.popTo('Home');
  }, [activeKey, navigation, onReselect]);

  return (
    <View style={styles.dock} pointerEvents="box-none">
      <View style={styles.column} pointerEvents="box-none">
        <BottomTabBar
          leadingItems={leading}
          trailingItems={trailing}
          homeLabel={HOME_LABEL[locale]}
          activeKey={activeKey}
          onTabPress={handleTabPress}
          onHomePress={handleHomePress}
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
    alignSelf: 'center',
  },
}));
