import type { ReactNode, Ref } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { DirectionView } from '@/components/common/DirectionView';
import { useAccountMenu } from '@/components/layout/AccountMenu';
import { getMainTabBarInset, MainTabBar } from '@/components/layout/MainTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { getScreenHeaderTop } from '@/components/layout/screenHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { resident } from '@/constants/resident';
import { useAppTheme } from '@/hooks/useAppTheme';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

export interface ParkingFrameProps {
  title: string;
  children: ReactNode;
  /** Resident screens keep the main tab bar; visitor and security pages do not. */
  bottomBar?: boolean;
  /** False on a visitor's pass: there is nowhere to go back to. */
  showBack?: boolean;
  /** In place of the language switch and avatar, e.g. the pass's own language switch. */
  headerTrailing?: ReactNode;
  scrollRef?: Ref<ScrollViewInstance>;
  /** Lays the page out right to left, for Arabic. The header keeps its place. */
  rtl?: boolean;
  /** A quieter line under the title, e.g. "Step 2 of 2". */
  subtitle?: string;
  /** Replaces the back button's default, e.g. to go back a step. */
  onBack?: () => void;
  /** Pinned under the scrolling content, e.g. a flow's main button. Use with `bottomBar={false}`. */
  footer?: ReactNode;
}

/**
 * Design dp. The parking pages are denser than the other service screens (a site map, a
 * two-step booking form), so their column runs as wide as the tab bar (320 dp) rather than
 * the cards' 296.8 dp.
 */
const d = { gutter: 20, introGap: 16, sectionGap: 14, endGap: 28, footerTop: 8, footerBottom: 12 } as const;

/**
 * The page shell for the parking flows (ported from Parklane): this app's background, header
 * and page title, a keyboard-aware column, and room at the end for the tab bar and the home
 * indicator. The content's own direction is always set, so the English resident pages read
 * left to right even in the Arabic app, and a visitor's Arabic pass reads right to left.
 */
export function ParkingFrame({
  title,
  children,
  bottomBar = true,
  showBack = true,
  headerTrailing,
  scrollRef,
  rtl = false,
  subtitle,
  onBack,
  footer,
}: ParkingFrameProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { colors, artwork } = useAppTheme();
  const account = useAccountMenu();
  const direction = rtl ? 'rtl' : 'ltr';

  return (
    <ScreenWrapper
      background={artwork.homeBackground}
      backgroundTint={colors.backgroundTint}
      overlay={
        <>
          {bottomBar ? <MainTabBar /> : null}
          {account.menu}
        </>
      }
    >
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[styles.content, bottomBar ? styles.clearTabBar : styles.clearEnd]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageHeader
            initials={resident.initials}
            onProfilePress={account.open}
            avatarRef={account.avatarRef}
            onBackPress={onBack}
            showBack={showBack}
            trailing={headerTrailing}
          />
          <DirectionView direction={direction} style={styles.intro}>
            <AppText variant="pageTitle" accessibilityRole="header">
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="pageSubtitle" style={styles.subtitle}>
                {subtitle}
              </AppText>
            ) : null}
          </DirectionView>
          <DirectionView direction={direction} style={styles.body}>
            {children}
          </DirectionView>
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const useStyles = makeStyles(({ spacing }, { width, height, scale }, insets: EdgeInsets) => {
  const column = {
    width: '100%',
    maxWidth: scale(DESIGN_FRAME.width),
    alignSelf: 'center',
  } as const;
  return {
    flex: {
      flex: 1,
    },
    // ScreenWrapper already pads by the insets; offsets here are relative to that.
    content: {
      ...column,
      paddingTop: getScreenHeaderTop(width, height, insets) - insets.top,
    },
    clearTabBar: {
      paddingBottom: getMainTabBarInset(width, height, insets) - insets.bottom + scale(d.endGap),
    },
    clearEnd: {
      paddingBottom: scale(d.endGap),
    },
    intro: {
      marginTop: scale(spacing.lg),
      marginHorizontal: scale(d.gutter),
    },
    subtitle: {
      marginTop: scale(2),
    },
    body: {
      marginTop: scale(d.introGap),
      paddingHorizontal: scale(d.gutter),
      rowGap: scale(d.sectionGap),
    },
    footer: {
      ...column,
      paddingHorizontal: scale(d.gutter),
      paddingTop: scale(d.footerTop),
      paddingBottom: scale(d.footerBottom),
    },
  };
});
