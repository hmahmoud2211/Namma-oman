import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Pressable, View, type ScrollViewInstance, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { BrandLogo } from '@/components/common/BrandLogo';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { BellIcon } from '@/components/icons/BellIcon';
import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { MenuIcon } from '@/components/icons/MenuIcon';
import { MoonIcon } from '@/components/icons/MoonIcon';
import { MainTabBar } from '@/components/layout/MainTabBar';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import {
  FeaturedCommunityCard,
  type FeaturedCommunity,
} from '@/components/ui/FeaturedCommunityCard';
import { POPOVER_MENU_WIDTH, PopoverMenu, type PopoverAnchor } from '@/components/ui/PopoverMenu';
import { ServiceTile } from '@/components/ui/ServiceTile';
import { UnitSummaryCard } from '@/components/ui/UnitSummaryCard';
import { appearanceMenu } from '@/constants/appearance';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useLogout } from '@/hooks/useLogout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import type { ColorScheme } from '@/theme';
import type { ParamlessRoute } from '@/types/navigation.types';

import {
  featuredCommunities,
  homeContent,
  homeServices,
  myUnit,
  type HomeServiceId,
} from './HomeScreen.data';
import { HOME_FRAME, homeDesign, useHomeStyles } from './HomeScreen.styles';

/** The screen each shortcut opens; the rest show the "under development" notice. */
const SERVICE_ROUTES: Partial<Record<HomeServiceId, ParamlessRoute>> = {
  'financial-overview': 'FinancialOverview',
  'construction-progress': 'ConstructionProgress',
  'smart-home': 'SmartHome',
  'visitor-access': 'VisitorAccess',
  parking: 'Parking',
  maintenance: 'Maintenance',
  community: 'Community',
  'amenities-booking': 'AmenitiesBooking',
};

export function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = useHomeStyles(insets);
  const { colors, artwork } = useAppTheme();
  const { scheme, setPreference } = useThemePreference();
  const { locale, isRTL } = useLocale();
  const content = homeContent[locale];
  const { scale } = useResponsive(HOME_FRAME);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const menuButtonRef = useRef<ViewInstance>(null);
  const [menuAnchor, setMenuAnchor] = useState<PopoverAnchor | null>(null);
  // Shown by everything here whose screen isn't built yet.
  const showUnderDevelopment = useUnderDevelopment();
  const logout = useLogout();

  const hitSlop = scale(homeDesign.hitSlop);
  const { weather } = content;

  // The menu opens just under the button, wherever the page is scrolled to.
  // TODO(navigation): replace with the side menu once it is designed.
  const handleOpenMenu = useCallback(() => {
    menuButtonRef.current?.measureInWindow((x, y, width, height) => {
      const offset = scale(homeDesign.menuPopover.offsetX);
      setMenuAnchor({
        // In Arabic the button is on the right, so the menu's right edge lines up with it.
        x: isRTL ? x + width - scale(POPOVER_MENU_WIDTH) - offset : x + offset,
        y: y + height + scale(homeDesign.menuPopover.gap),
      });
    });
  }, [isRTL, scale]);

  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  const handleSelectScheme = useCallback(
    (selected: ColorScheme) => {
      // Overrides the device setting for this session.
      setPreference(selected);
      setMenuAnchor(null);
    },
    [setPreference],
  );

  const handleLogout = useCallback(() => {
    setMenuAnchor(null);
    logout();
  }, [logout]);

  // TODO(navigation): the notifications and unit details screens aren't designed yet.
  const handleOpenNotifications = showUnderDevelopment;
  const handleOpenUnit = showUnderDevelopment;

  const handleOpenService = useCallback(
    (service: HomeServiceId) => {
      const route = SERVICE_ROUTES[service];
      if (route) {
        navigation.navigate(route);
        return;
      }
      // A shortcut whose screen isn't built yet.
      showUnderDevelopment();
    },
    [navigation, showUnderDevelopment],
  );

  const handleExploreCommunity = useCallback(
    (_community: FeaturedCommunity) => navigation.navigate('Community'),
    [navigation],
  );

  // Already here: tapping Home again returns to the top, as in native tab bars.
  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  return (
    <ScreenWrapper
      background={artwork.homeBackground}
      backgroundTint={colors.backgroundTint}
      scrollable
      scrollRef={scrollRef}
      overlay={
        <>
          <MainTabBar onReselect={scrollToTop} />
          {menuAnchor && (
            <PopoverMenu
              anchor={menuAnchor}
              title={appearanceMenu[locale].title}
              options={appearanceMenu[locale].options}
              selectedKey={scheme}
              onSelect={handleSelectScheme}
              onClose={handleCloseMenu}
              actions={[
                {
                  key: 'logout',
                  label: appearanceMenu[locale].logoutLabel,
                  Icon: LogoutIcon,
                  destructive: true,
                  onPress: handleLogout,
                },
              ]}
            />
          )}
        </>
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            ref={menuButtonRef}
            onPress={handleOpenMenu}
            hitSlop={hitSlop}
            accessibilityRole="button"
            accessibilityLabel={content.menuLabel}
            accessibilityState={{ expanded: menuAnchor !== null }}
            style={styles.menuButton}
          >
            <MenuIcon size={scale(homeDesign.menu.size)} color={colors.headerIcon} />
          </Pressable>
          <BrandLogo width={scale(homeDesign.logo.width)} style={styles.logo} />
          <LanguageToggle style={styles.languageToggle} />
          <Pressable
            onPress={handleOpenNotifications}
            hitSlop={hitSlop}
            accessibilityRole="button"
            accessibilityLabel={content.notificationsLabel}
            style={styles.bellButton}
          >
            <BellIcon size={scale(homeDesign.bell.size)} color={colors.headerIcon} />
          </Pressable>
        </View>

        <View style={styles.greetingRow}>
          <View style={styles.greeting}>
            <AppText variant="greeting">{content.greeting}</AppText>
            <AppText variant="greetingName" color={colors.accent}>
              {content.residentName}
            </AppText>
            <AppText variant="greeting" style={styles.tagline}>
              {content.tagline}
            </AppText>
          </View>

          <SurfaceCard radius={homeDesign.weather.radius} style={styles.weatherCard}>
            <View
              style={styles.moon}
              accessible
              accessibilityLabel={`${weather.temperature}, ${weather.condition}`}
            >
              <MoonIcon
                size={scale(homeDesign.weather.moon.size)}
                color={colors.moonLight}
                shadeColor={colors.moonShade}
              />
            </View>
            <View style={styles.weatherText} importantForAccessibility="no-hide-descendants">
              <AppText variant="value" color={colors.surfaceText}>
                {weather.temperature}
              </AppText>
              <AppText
                variant="cardLabel"
                color={colors.surfaceText}
                style={styles.weatherCondition}
              >
                {weather.condition}
              </AppText>
            </View>
          </SurfaceCard>
        </View>

        <UnitSummaryCard unit={myUnit[locale]} onPress={handleOpenUnit} style={styles.unitCard} />

        <View style={styles.services}>
          {homeServices.map(({ id, label, Icon, iconSize }) => (
            <ServiceTile
              key={id}
              label={label[locale]}
              icon={<Icon size={scale(iconSize)} color={colors.surfaceIcon} />}
              onPress={() => handleOpenService(id)}
              style={styles.serviceTile}
            />
          ))}
        </View>

        <FeaturedCommunityCard
          overline={content.featured.overline}
          ctaLabel={content.featured.ctaLabel}
          previousLabel={content.featured.previousLabel}
          nextLabel={content.featured.nextLabel}
          communities={featuredCommunities[locale]}
          onExplore={handleExploreCommunity}
          style={styles.featured}
        />
      </View>
    </ScreenWrapper>
  );
}
