import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssistantIcon } from '@/components/icons/AssistantIcon';
import { GearIcon } from '@/components/icons/GearIcon';
import { MedicalIcon } from '@/components/icons/MedicalIcon';
import { ServicesIcon } from '@/components/icons/ServicesIcon';
import { TrackerIcon } from '@/components/icons/TrackerIcon';
import { VideoCallIcon } from '@/components/icons/VideoCallIcon';
import type { Localized } from '@/context/LocaleContext';
import { useLocale } from '@/hooks/useLocale';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import type { ParamlessRoute, RootStackParamList } from '@/types/navigation.types';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

import { BottomTabBar, type BottomTabItem } from './BottomTabBar';
import { DOCK, getDockLayout, getMainTabBarInset } from './mainTabBarLayout';

export type MainTabKey =
  | 'assistant'
  | 'videoCall'
  | 'tracker'
  | 'medical'
  | 'services'
  | 'settings';

interface MainTab extends Omit<BottomTabItem<MainTabKey>, 'label'> {
  label: Localized<string>;
  /** Left out while the tab's screen isn't built: it shows the "under development" notice. */
  route?: ParamlessRoute;
}

/** Three tabs either side of the raised Home disc (Parklane's bar had two). */
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
  // TODO: give it `route: 'Tracker'` once the Tracker screen is designed and built.
  {
    key: 'tracker',
    label: { en: 'Tracker', ar: 'المتابعة' },
    Icon: TrackerIcon,
  },
];
const TRAILING_TABS: readonly MainTab[] = [
  {
    key: 'medical',
    label: { en: 'Medical', ar: 'طبي' },
    Icon: MedicalIcon,
    route: 'Medical',
  },
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

// Kept in its own module (the toast reads it too); re-exported for the screens.
export { getMainTabBarInset };

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
  const showUnderDevelopment = useUnderDevelopment();

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
      if (!tab.route) {
        showUnderDevelopment();
        return;
      }
      navigation.navigate(tab.route);
    },
    [activeKey, navigation, onReselect, showUnderDevelopment, tabs],
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
