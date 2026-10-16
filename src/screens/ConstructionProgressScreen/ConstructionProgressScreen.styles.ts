import type { EdgeInsets } from 'react-native-safe-area-context';

import { getMainTabBarInset } from '@/components/layout/MainTabBar';
import { getScreenHeaderTop } from '@/components/layout/screenHeader';
import { LATEST_UPDATE_CARD_HEIGHT } from '@/components/ui/LatestUpdateCard';
import { STAGE_TILE_HEIGHT } from '@/components/ui/StageTile';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME, designFrameFromExport } from '@/utils/responsive';

/** The Construction Progress export is 770×1368 px → a 360×639.6 dp design frame. */
export const CONSTRUCTION_FRAME = designFrameFromExport(770, 1368);

/**
 * Layout in design dp (360-wide frame). Card contents are measured from the Construction
 * Progress export; the cards share Home's column (27.4 dp in, 296.8 dp wide) and sections are
 * spaced from the theme's spacing scale. Only the header's position follows the screen height.
 * Margins between text line boxes are set so baselines land where the design draws them.
 */
export const constructionDesign = {
  // Its top is the shared screen-header position (`getScreenHeaderTop`).
  header: { height: 36.6 },
  headerButton: { top: 4.4, size: 30.9 },
  back: { left: 27.4, chevron: 12, shiftX: -1 },
  logo: { left: 66.3, width: 93.5 },
  bell: { left: 251.7, icon: 14.5, dot: { size: 7.5, centreX: 25.2, centreY: 7.9, border: 0.9 } },
  avatar: { left: 293.3 },
  intro: { left: 27.4, titleGap: -1.5, subtitleGap: 1.9 },
  // Home's card column (HomeScreen.styles.ts: unit / services).
  column: { left: 27.4, width: 296.8 },
  unit: {
    height: 68.7,
    radius: 11,
    photo: { top: 6.1, left: 7.5, width: 118.8, height: 57, radius: 7.5, borderWidth: 0.5 },
    details: { top: 10.4, left: 138.9 },
    unitRowGap: 4.5,
    badge: { marginLeft: 9.3, width: 41.6, height: 14.5, borderWidth: 0.6 },
    location: { gap: 1.5, pin: 11.3, pinShiftX: -0.4, textGap: 3.1 },
    chevron: { size: 10.4, top: 31.3, right: 7.9 },
  },
  overall: {
    height: 77.6,
    radius: 11,
    iconBox: {
      top: 11.2,
      left: 11.2,
      width: 39.7,
      height: 37.4,
      radius: 6.5,
      borderWidth: 0.5,
      icon: 37,
    },
    details: { top: 9.96, left: 63.1 },
    pill: { gap: 2.2, height: 11.7, paddingLeft: 2.3, paddingRight: 6.7, dot: 5.6, textGap: 6.6 },
    lastUpdateGap: 3.9,
    stat: { top: 16.5, right: 14, labelGap: -4.5 },
    bar: { top: 58.9, left: 11.2, right: 12.2, height: 9.35 },
  },
  stagesHeader: { height: 14.6, icon: 16, iconShiftX: -0.2, titleGap: 4.7 },
  // Same gaps as Home's service grid.
  stages: { columns: 3, columnGap: 7.3, rowGap: 11 },
  bottomRow: { height: 80.4, handoverWidth: 162, radius: 11 },
  panelHeader: { titleLeft: 27.6, titleTop: 9.8 },
  handover: {
    icon: { size: 13.3, top: 6.9, left: 8.4 },
    /** `stackedTop` when the quarter sits on its own line above the year (Arabic). */
    estimate: { top: 32.2, stackedTop: 23.5, left: 10.8 },
    estimateLabelGap: 2.4,
    divider: { left: 83.5, top: 25.7, height: 43, width: 0.6 },
    timeline: { top: 21.4, left: 90 },
  },
  monthly: {
    icon: { size: 14.6, top: 6.1, left: 8 },
    titleLeft: 30.4,
    chart: { top: 24.6, left: 7.5, right: 7.5, maxBarHeight: 29.2 },
  },
} as const;

const d = constructionDesign;
const stageRows = 2;
const stagesHeight = stageRows * STAGE_TILE_HEIGHT + (stageRows - 1) * d.stages.rowGap;

export const useConstructionStyles = makeStyles(
  ({ colors, spacing, borderRadius }, { width, height, scale }, insets: EdgeInsets) => {
    const headerTop = getScreenHeaderTop(width, height, insets);
    // The tab bar floats over the scroll view; the content ends above it.
    const contentBottom = getMainTabBarInset(width, height, insets);

    const stageWidth =
      (d.column.width - (d.stages.columns - 1) * d.stages.columnGap) / d.stages.columns;
    const headerButton = {
      position: 'absolute',
      top: scale(d.headerButton.top),
    } as const;

    return {
      // ScreenWrapper already pads by the insets; offsets here are relative to that.
      content: {
        flexGrow: 1,
        width: '100%',
        maxWidth: scale(DESIGN_FRAME.width),
        alignSelf: 'center',
        paddingTop: headerTop - insets.top,
        paddingBottom: contentBottom - insets.bottom,
      },

      header: {
        height: scale(d.header.height),
      },
      backButton: {
        ...headerButton,
        start: scale(d.back.left),
      },
      backChevron: {
        marginStart: scale(d.back.shiftX),
      },
      logo: {
        position: 'absolute',
        start: scale(d.logo.left),
        top: 0,
      },
      bellButton: {
        ...headerButton,
        start: scale(d.bell.left),
      },
      notificationDot: {
        position: 'absolute',
        start: scale(d.bell.dot.centreX - d.bell.dot.size / 2),
        top: scale(d.bell.dot.centreY - d.bell.dot.size / 2),
        width: scale(d.bell.dot.size),
        height: scale(d.bell.dot.size),
        borderRadius: borderRadius.pill,
        borderWidth: scale(d.bell.dot.border),
        borderColor: colors.background,
        backgroundColor: colors.notificationDot,
      },
      avatarButton: {
        ...headerButton,
        start: scale(d.avatar.left),
      },

      intro: {
        marginTop: scale(spacing.lg),
        marginStart: scale(d.intro.left),
        marginEnd: scale(d.intro.left),
      },
      title: {
        marginTop: scale(d.intro.titleGap),
      },
      subtitle: {
        marginTop: scale(d.intro.subtitleGap),
      },

      column: {
        marginStart: scale(d.column.left),
        width: scale(d.column.width),
      },

      unitCard: {
        marginTop: scale(spacing.xl),
        height: scale(d.unit.height),
      },
      cardFill: {
        flex: 1,
      },
      unitPhoto: {
        position: 'absolute',
        top: scale(d.unit.photo.top),
        start: scale(d.unit.photo.left),
        width: scale(d.unit.photo.width),
        height: scale(d.unit.photo.height),
        borderRadius: scale(d.unit.photo.radius),
        borderWidth: scale(d.unit.photo.borderWidth),
        borderColor: colors.photoBorder,
      },
      unitDetails: {
        position: 'absolute',
        top: scale(d.unit.details.top),
        start: scale(d.unit.details.left),
      },
      unitRow: {
        marginTop: scale(d.unit.unitRowGap),
        flexDirection: 'row',
        alignItems: 'center',
      },
      badge: {
        marginStart: scale(d.unit.badge.marginLeft),
        width: scale(d.unit.badge.width),
        height: scale(d.unit.badge.height),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.pill,
        borderWidth: scale(d.unit.badge.borderWidth),
        borderColor: colors.badgeBorder,
        backgroundColor: colors.badgeFill,
      },
      locationRow: {
        marginTop: scale(d.unit.location.gap),
        flexDirection: 'row',
        alignItems: 'center',
      },
      locationPin: {
        marginStart: scale(d.unit.location.pinShiftX),
        marginEnd: scale(d.unit.location.textGap),
      },
      unitChevron: {
        position: 'absolute',
        top: scale(d.unit.chevron.top),
        end: scale(d.unit.chevron.right),
      },

      overallCard: {
        marginTop: scale(spacing.lg),
        height: scale(d.overall.height),
      },
      overallIconBox: {
        position: 'absolute',
        top: scale(d.overall.iconBox.top),
        start: scale(d.overall.iconBox.left),
        width: scale(d.overall.iconBox.width),
        height: scale(d.overall.iconBox.height),
        borderRadius: scale(d.overall.iconBox.radius),
        borderWidth: scale(d.overall.iconBox.borderWidth),
        borderColor: colors.surfaceIconTileBorder,
        alignItems: 'center',
        justifyContent: 'center',
      },
      overallDetails: {
        position: 'absolute',
        top: scale(d.overall.details.top),
        start: scale(d.overall.details.left),
      },
      statusPill: {
        marginTop: scale(d.overall.pill.gap),
        height: scale(d.overall.pill.height),
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: scale(d.overall.pill.paddingLeft),
        paddingEnd: scale(d.overall.pill.paddingRight),
        borderRadius: borderRadius.pill,
        borderWidth: scale(d.unit.badge.borderWidth),
        borderColor: colors.badgeBorder,
        backgroundColor: colors.badgeFill,
      },
      statusDot: {
        width: scale(d.overall.pill.dot),
        height: scale(d.overall.pill.dot),
        marginEnd: scale(d.overall.pill.textGap),
        borderRadius: borderRadius.pill,
        backgroundColor: colors.statusPositive,
      },
      statusDotWarning: {
        backgroundColor: colors.statusWarning,
      },
      lastUpdate: {
        marginTop: scale(d.overall.lastUpdateGap),
      },
      overallStat: {
        position: 'absolute',
        top: scale(d.overall.stat.top),
        end: scale(d.overall.stat.right),
        alignItems: 'center',
      },
      overallStatLabel: {
        marginTop: scale(d.overall.stat.labelGap),
      },
      overallBar: {
        position: 'absolute',
        top: scale(d.overall.bar.top),
        start: scale(d.overall.bar.left),
        end: scale(d.overall.bar.right),
      },

      stagesHeader: {
        marginTop: scale(spacing.xl),
        height: scale(d.stagesHeader.height),
        flexDirection: 'row',
        alignItems: 'center',
      },
      stagesIcon: {
        marginStart: scale(d.stagesHeader.iconShiftX),
        marginEnd: scale(d.stagesHeader.titleGap),
      },
      stages: {
        marginTop: scale(spacing.md),
        height: scale(stagesHeight),
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: scale(d.stages.columnGap),
        rowGap: scale(d.stages.rowGap),
      },
      stageTile: {
        width: scale(stageWidth),
      },

      latestUpdate: {
        marginTop: scale(spacing.xl),
        height: scale(LATEST_UPDATE_CARD_HEIGHT),
      },

      bottomRow: {
        marginTop: scale(spacing.lg),
        height: scale(d.bottomRow.height),
        flexDirection: 'row',
        columnGap: scale(d.stages.columnGap),
      },
      handoverCard: {
        width: scale(d.bottomRow.handoverWidth),
      },
      monthlyCard: {
        flex: 1,
      },
      handoverIcon: {
        position: 'absolute',
        top: scale(d.handover.icon.top),
        start: scale(d.handover.icon.left),
      },
      panelTitle: {
        position: 'absolute',
        top: scale(d.panelHeader.titleTop),
        start: scale(d.panelHeader.titleLeft),
      },
      handoverEstimate: {
        position: 'absolute',
        top: scale(d.handover.estimate.top),
        start: scale(d.handover.estimate.left),
      },
      handoverEstimateStacked: {
        top: scale(d.handover.estimate.stackedTop),
      },
      handoverEstimateLabel: {
        marginTop: scale(d.handover.estimateLabelGap),
      },
      handoverDivider: {
        position: 'absolute',
        top: scale(d.handover.divider.top),
        start: scale(d.handover.divider.left),
        width: scale(d.handover.divider.width),
        height: scale(d.handover.divider.height),
        backgroundColor: colors.surfaceDivider,
      },
      handoverTimeline: {
        position: 'absolute',
        top: scale(d.handover.timeline.top),
        start: scale(d.handover.timeline.left),
      },
      monthlyIcon: {
        position: 'absolute',
        top: scale(d.monthly.icon.top),
        start: scale(d.monthly.icon.left),
      },
      monthlyTitle: {
        position: 'absolute',
        top: scale(d.panelHeader.titleTop),
        start: scale(d.monthly.titleLeft),
      },
      monthlyChart: {
        position: 'absolute',
        top: scale(d.monthly.chart.top),
        start: scale(d.monthly.chart.left),
        end: scale(d.monthly.chart.right),
      },

      pressed: {
        opacity: 0.85,
      },
    };
  },
  { frame: CONSTRUCTION_FRAME },
);
