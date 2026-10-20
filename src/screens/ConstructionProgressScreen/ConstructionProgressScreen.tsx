import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, View, type ScrollViewInstance, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CircleButton } from '@/components/common/CircleButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { BarChartIcon } from '@/components/icons/BarChartIcon';
import { BellIcon } from '@/components/icons/BellIcon';
import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { CraneIcon } from '@/components/icons/CraneIcon';
import { LayersIcon } from '@/components/icons/LayersIcon';
import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { MapPinIcon } from '@/components/icons/MapPinIcon';
import { MainTabBar } from '@/components/layout/MainTabBar';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BarChart } from '@/components/ui/BarChart';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { LatestUpdateCard, type SiteUpdate } from '@/components/ui/LatestUpdateCard';
import { POPOVER_MENU_WIDTH, PopoverMenu, type PopoverAnchor } from '@/components/ui/PopoverMenu';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StageTile, type ConstructionStage } from '@/components/ui/StageTile';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import { appearanceMenu } from '@/constants/appearance';
import type { Locale } from '@/context/LocaleContext';
import { IMAGE_TRANSITION_MS } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useLogout } from '@/hooks/useLogout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemePreference } from '@/hooks/useThemePreference';
import type { ColorScheme } from '@/theme';
import type { RootStackParamList } from '@/types/navigation.types';

import {
  constructionContent,
  demoNotifications,
  demoUnits,
  residentInitials,
  scheduleStatusLabels,
  sheetContent,
  type StageDetail,
  type UnitConstruction,
} from './ConstructionProgressScreen.data';
import {
  CONSTRUCTION_FRAME,
  constructionDesign as d,
  useConstructionStyles,
} from './ConstructionProgressScreen.styles';
import {
  HandoverSheet,
  NotificationsSheet,
  StageDetailSheet,
  UnitPickerSheet,
  UpdateDetailSheet,
  stageName,
} from './ConstructionProgressSheets';

/** Which sheet is open over the page. */
type OpenSheet =
  | { kind: 'unit' }
  | { kind: 'stage'; stage: StageDetail }
  | { kind: 'update'; update: SiteUpdate }
  | { kind: 'handover' }
  | { kind: 'notifications' };

/** Gap between the avatar and the menu under it, in design dp. */
const MENU_GAP = 6;

export function ConstructionProgressScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const styles = useConstructionStyles(insets);
  const { colors, artwork } = useAppTheme();
  const { scheme, setPreference } = useThemePreference();
  const { locale, isRTL } = useLocale();
  const content = constructionContent[locale];
  const units = demoUnits[locale];
  const { scale } = useResponsive(CONSTRUCTION_FRAME);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const avatarRef = useRef<ViewInstance>(null);

  // Screen-only demo state: nothing here is shared with other screens.
  const [unitId, setUnitId] = useState(demoUnits.en[0].id);
  const [sheet, setSheet] = useState<OpenSheet | null>(null);
  const [hasUnread, setHasUnread] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<PopoverAnchor | null>(null);

  const unit = units.find((item) => item.id === unitId) ?? units[0];
  const { overall, handover } = unit;
  const isDelayed = overall.status === 'slight-delay';

  const handleBack = useCallback(() => {
    // Opened from Home; a dev launch straight onto this screen has nothing to go back to.
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.popTo('Home');
    }
  }, [navigation]);

  const closeSheet = useCallback(() => setSheet(null), []);

  const handleOpenNotifications = useCallback(() => {
    setHasUnread(false);
    setSheet({ kind: 'notifications' });
  }, []);

  const handleOpenProfile = useCallback(() => {
    avatarRef.current?.measureInWindow((x, y, width, height) => {
      setMenuAnchor({
        // The avatar sits at the far edge: the menu lines up with its outer side.
        x: isRTL ? x : x + width - scale(POPOVER_MENU_WIDTH),
        y: y + height + scale(MENU_GAP),
      });
    });
  }, [isRTL, scale]);

  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  const logout = useLogout();
  const handleLogout = useCallback(() => {
    setMenuAnchor(null);
    logout();
  }, [logout]);

  const handleSelectScheme = useCallback(
    (selected: ColorScheme) => {
      setPreference(selected);
      setMenuAnchor(null);
    },
    [setPreference],
  );

  const handleSelectUnit = useCallback((selected: UnitConstruction) => {
    setUnitId(selected.id);
    setSelectedMonth(null);
  }, []);

  const handleOpenStage = useCallback(
    (stage: ConstructionStage) => {
      const detail = unit.stages.find((item) => item.id === stage.id);
      if (detail) setSheet({ kind: 'stage', stage: detail });
    },
    [unit],
  );

  const handleSelectMonth = useCallback(
    (index: number) => setSelectedMonth((current) => (current === index ? null : index)),
    [],
  );

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
          {sheet && renderSheet(sheet, locale, units, unit, handleSelectUnit, closeSheet)}
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
          <CircleButton
            size={d.headerButton.size}
            borderColor={colors.headerButtonBorder}
            accessibilityLabel={content.backLabel}
            onPress={handleBack}
            style={styles.backButton}
          >
            <View style={styles.backChevron}>
              <ChevronIcon
                size={scale(d.back.chevron)}
                color={colors.headerIcon}
                direction="left"
                strokeWidth={2.4}
              />
            </View>
          </CircleButton>
          <BrandLogo width={scale(d.logo.width)} style={styles.logo} />
          <CircleButton
            size={d.headerButton.size}
            borderColor={colors.headerButtonBorder}
            accessibilityLabel={
              hasUnread ? content.unreadNotificationsLabel : content.notificationsLabel
            }
            onPress={handleOpenNotifications}
            style={styles.bellButton}
          >
            <BellIcon size={scale(d.bell.icon)} color={colors.headerIcon} variant="outline" />
            {hasUnread && <View style={styles.notificationDot} pointerEvents="none" />}
          </CircleButton>
          <CircleButton
            ref={avatarRef}
            size={d.headerButton.size}
            borderColor={colors.headerAvatarBorder}
            accessibilityLabel={content.profileLabel}
            onPress={handleOpenProfile}
            style={styles.avatarButton}
          >
            <AppText variant="initials" color={colors.headerIcon}>
              {residentInitials}
            </AppText>
          </CircleButton>
        </View>

        <View style={styles.intro}>
          <AppText variant="pageOverline" color={colors.accent}>
            {content.overline}
          </AppText>
          <AppText variant="pageTitle" accessibilityRole="header" style={styles.title}>
            {content.title}
          </AppText>
          <AppText variant="pageSubtitle" style={styles.subtitle}>
            {content.subtitle}
          </AppText>
        </View>

        <View style={styles.column}>
          <Pressable
            onPress={() => setSheet({ kind: 'unit' })}
            accessibilityRole="button"
            accessibilityLabel={`${unit.projectName}, ${unit.unitName}, ${unit.role}. ${unit.location}`}
            accessibilityHint={content.unitCardHint}
            style={({ pressed }) => [styles.unitCard, pressed && styles.pressed]}
          >
            <SurfaceCard radius={d.unit.radius} rim="feature" style={styles.cardFill}>
              <Image
                source={unit.photo}
                contentFit="cover"
                transition={IMAGE_TRANSITION_MS}
                style={styles.unitPhoto}
              />
              <View style={styles.unitDetails}>
                <AppText variant="panelTitle" color={colors.surfaceText}>
                  {unit.projectName}
                </AppText>
                <View style={styles.unitRow}>
                  <AppText variant="bodyLarge" color={colors.surfaceText}>
                    {unit.unitName}
                  </AppText>
                  <View style={styles.badge}>
                    <AppText variant="labelLarge" color={colors.badgeText}>
                      {unit.role}
                    </AppText>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <View style={styles.locationPin}>
                    <MapPinIcon size={scale(d.unit.location.pin)} color={colors.progressText} />
                  </View>
                  <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
                    {unit.location}
                  </AppText>
                </View>
              </View>
              <View style={styles.unitChevron} pointerEvents="none">
                <ChevronIcon
                  size={scale(d.unit.chevron.size)}
                  color={colors.surfaceText}
                  strokeWidth={3}
                />
              </View>
            </SurfaceCard>
          </Pressable>

          <SurfaceCard radius={d.overall.radius} rim="feature" style={styles.overallCard}>
            {/* Icon, text and figure share a row, so a long title wraps instead of colliding. */}
            <View style={styles.overallRow}>
            <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.overallIconBox}>
              <CraneIcon size={scale(d.overall.iconBox.icon)} color={colors.surfaceIcon} />
            </LinearGradient>
            <View style={styles.overallDetails}>
              <AppText variant="panelHeading" color={colors.surfaceText}>
                {content.overallTitle}
              </AppText>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, isDelayed && styles.statusDotWarning]} />
                <AppText
                  variant="label"
                  color={isDelayed ? colors.statusWarning : colors.badgeText}
                >
                  {scheduleStatusLabels[locale][overall.status]}
                </AppText>
              </View>
              <AppText variant="label" color={colors.surfaceTextMuted} style={styles.lastUpdate}>
                {`${content.lastUpdatePrefix} ${overall.lastUpdate}`}
              </AppText>
            </View>
            <View style={styles.overallStat}>
              <AppText variant="statLarge" color={colors.progressText}>
                {`${overall.percent}%`}
              </AppText>
              <AppText
                variant="bodyLarge"
                color={colors.surfaceText}
                style={styles.overallStatLabel}
              >
                {content.percentLabel}
              </AppText>
            </View>
            </View>
            <ProgressBar
              progress={overall.percent / 100}
              height={d.overall.bar.height}
              style={styles.overallBar}
            />
          </SurfaceCard>

          <View style={styles.stagesHeader}>
            <View style={styles.stagesIcon}>
              <LayersIcon size={scale(d.stagesHeader.icon)} color={colors.accent} />
            </View>
            <AppText variant="sectionTitle" accessibilityRole="header">
              {content.stagesTitle}
            </AppText>
          </View>

          <View style={styles.stages}>
            {unit.stages.map((stage) => (
              <StageTile
                key={stage.id}
                stage={stage}
                onPress={handleOpenStage}
                style={styles.stageTile}
              />
            ))}
          </View>

          {/* Keyed by unit so the pager starts on the newest update after switching. */}
          <LatestUpdateCard
            key={unit.id}
            overline={content.latestUpdateOverline}
            pageLabel={content.updatePageLabel}
            updates={unit.updates}
            onOpen={(update) => setSheet({ kind: 'update', update })}
            style={styles.latestUpdate}
          />

          <View style={styles.bottomRow}>
            <Pressable
              onPress={() => setSheet({ kind: 'handover' })}
              accessibilityRole="button"
              accessibilityLabel={`${content.handoverTitle}: ${content.estimateLabel} ${handover.estimate}`}
              style={({ pressed }) => [styles.handoverCard, pressed && styles.pressed]}
            >
              <SurfaceCard radius={d.bottomRow.radius} rim="feature" style={styles.cardFill}>
                <View style={styles.handoverIcon}>
                  <CalendarIcon size={scale(d.handover.icon.size)} color={colors.surfaceIcon} />
                </View>
                <AppText variant="panelLabel" color={colors.surfaceText} style={styles.panelTitle}>
                  {content.handoverTitle}
                </AppText>
                <View
                  style={[
                    styles.handoverEstimate,
                    handover.estimateParts.lead !== undefined && styles.handoverEstimateStacked,
                  ]}
                >
                  {handover.estimateParts.lead !== undefined && (
                    <AppText variant="labelLarge" color={colors.surfaceAccentText}>
                      {handover.estimateParts.lead}
                    </AppText>
                  )}
                  <AppText variant="displaySerif" color={colors.surfaceText}>
                    {handover.estimateParts.main}
                  </AppText>
                  <AppText
                    variant="label"
                    color={colors.surfaceTextSubtle}
                    style={styles.handoverEstimateLabel}
                  >
                    {content.estimateLabel}
                  </AppText>
                </View>
                <View style={styles.handoverDivider} />
                <StatusTimeline steps={handover.steps} style={styles.handoverTimeline} />
              </SurfaceCard>
            </Pressable>

            <SurfaceCard radius={d.bottomRow.radius} rim="feature" style={styles.monthlyCard}>
              <View style={styles.monthlyIcon}>
                <BarChartIcon size={scale(d.monthly.icon.size)} color={colors.surfaceIcon} />
              </View>
              <AppText variant="panelLabel" color={colors.surfaceText} style={styles.monthlyTitle}>
                {content.monthlyTitle}
              </AppText>
              <BarChart
                points={unit.monthly}
                axisMin={unit.monthlyAxisMin}
                maxBarHeight={d.monthly.chart.maxBarHeight}
                selectedIndex={selectedMonth}
                onSelect={handleSelectMonth}
                style={styles.monthlyChart}
              />
            </SurfaceCard>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

function renderSheet(
  sheet: OpenSheet,
  locale: Locale,
  units: readonly UnitConstruction[],
  unit: UnitConstruction,
  onSelectUnit: (unit: UnitConstruction) => void,
  onClose: () => void,
) {
  switch (sheet.kind) {
    case 'unit':
      return (
        <BottomSheet title={sheetContent[locale].unitPickerTitle} onClose={onClose}>
          {(close) => (
            <UnitPickerSheet
              units={units}
              selectedId={unit.id}
              onSelect={(selected) => {
                onSelectUnit(selected);
                close();
              }}
            />
          )}
        </BottomSheet>
      );
    case 'stage':
      return (
        <BottomSheet title={stageName(sheet.stage)} onClose={onClose}>
          <StageDetailSheet stage={sheet.stage} />
        </BottomSheet>
      );
    case 'update':
      return (
        <BottomSheet title={sheetContent[locale].updateTitle} onClose={onClose}>
          <UpdateDetailSheet update={sheet.update} />
        </BottomSheet>
      );
    case 'handover':
      return (
        <BottomSheet title={constructionContent[locale].handoverTitle} onClose={onClose}>
          <HandoverSheet handover={unit.handover} />
        </BottomSheet>
      );
    case 'notifications':
      return (
        <BottomSheet title={sheetContent[locale].notificationsTitle} onClose={onClose}>
          <NotificationsSheet notifications={demoNotifications[locale]} />
        </BottomSheet>
      );
  }
}
