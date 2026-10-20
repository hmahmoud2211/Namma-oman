import { StyleSheet } from 'react-native';

import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp, measured in the Medication Schedule export (761×1453 px, 2.11 px per dp). The
 * rows run the panel's full width, as in the design.
 */
export const scheduleDesign = {
  header: { paddingTop: 13.5, paddingStart: 13.7, paddingEnd: 12, subtitleGap: 4, rowsTop: 13 },
  day: { icon: 8.5, chevron: 10, iconGap: 4.7, chevronGap: 12, hitSlop: 8 },
  rowGap: 4.7,
  paddingBottom: 6,
  row: {
    height: 29,
    radius: 5.7,
    time: 37.4,
    dividerInset: 4,
    pill: 24.6,
    pillStart: 7.6,
    textStart: 11.8,
    // Wider than the export's 59 dp so "Mark as taken" fits in Inter (and the Arabic label).
    toggle: { width: 74, height: 17, circle: 12.3, inset: 2.4, gap: 4.3, tick: 8 },
    menu: { width: 21, icon: 9 },
  },
} as const;
const d = scheduleDesign;

export const useScheduleStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  pressed: {
    opacity: 0.7,
  },
  panel: {
    paddingBottom: scale(d.paddingBottom),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scale(d.header.paddingTop),
    paddingStart: scale(d.header.paddingStart),
    paddingEnd: scale(d.header.paddingEnd),
  },
  headerText: {
    flex: 1,
  },
  subtitle: {
    marginTop: scale(d.header.subtitleGap),
  },
  day: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabel: {
    marginStart: scale(d.day.iconGap),
    marginEnd: scale(d.day.chevronGap),
  },
  rows: {
    marginTop: scale(d.header.rowsTop),
    rowGap: scale(d.rowGap),
  },
  row: {
    height: scale(d.row.height),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(d.row.radius),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    overflow: 'hidden',
  },
  time: {
    width: scale(d.row.time),
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: scale(d.row.dividerInset),
    backgroundColor: colors.surfaceDivider,
  },
  pill: {
    width: scale(d.row.pill),
    height: scale(d.row.pill),
    marginStart: scale(d.row.pillStart),
  },
  doseText: {
    flex: 1,
    marginStart: scale(d.row.textStart),
  },
  toggle: {
    width: scale(d.row.toggle.width),
    height: scale(d.row.toggle.height),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.row.toggle.gap),
    paddingHorizontal: scale(d.row.toggle.inset),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.6),
    borderColor: colors.transparent,
  },
  toggleTaken: {
    borderColor: colors.medicationTakenBorder,
    backgroundColor: colors.medicationTakenFill,
  },
  toggleCircle: {
    width: scale(d.row.toggle.circle),
    height: scale(d.row.toggle.circle),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.8),
    borderColor: colors.surfaceTextSubtle,
  },
  toggleCircleTaken: {
    borderColor: colors.medicationTakenText,
  },
  menu: {
    width: scale(d.row.menu.width),
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
