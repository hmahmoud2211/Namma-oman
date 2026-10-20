import { StyleSheet } from 'react-native';

import { makeStyles } from '@/utils/makeStyles';

/** Design dp. Sections share the inner screens' column (Home's, 296.8 dp). */
const d = {
  sectionTop: 10,
  tile: { gap: 6, paddingY: 8, icon: 26 },
  request: { badge: 26, gap: 7, paddingY: 6 },
  detailsGap: 6,
  actionGap: 7,
  indicatorWidth: 30.5,
} as const;

export const useMaintenanceStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  bannerIndicator: {
    width: scale(d.indicatorWidth),
  },
  pressed: {
    opacity: 0.7,
  },

  grid: {
    marginTop: scale(d.sectionTop),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(d.tile.gap),
  },
  // Three across.
  tile: {
    width: '31.6%',
    flexGrow: 1,
    alignItems: 'center',
    rowGap: scale(2),
    paddingVertical: scale(d.tile.paddingY),
    paddingHorizontal: scale(3),
    borderRadius: scale(8),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceDivider,
    backgroundColor: colors.fieldFill,
  },
  tileIcon: {
    width: scale(d.tile.icon),
    height: scale(d.tile.icon),
    marginBottom: scale(3),
    borderRadius: scale(7),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  request: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.request.gap),
    paddingVertical: scale(d.request.paddingY),
  },
  requestBadge: {
    width: scale(d.request.badge),
    height: scale(d.request.badge),
    borderRadius: scale(7),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestText: {
    flex: 1,
  },
  stepper: {
    marginTop: scale(d.sectionTop),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: scale(d.sectionTop),
    backgroundColor: colors.surfaceDivider,
  },
  details: {
    marginTop: scale(d.sectionTop),
    flexDirection: 'row',
    columnGap: scale(d.detailsGap),
  },
  detailCell: {
    flex: 1,
  },
  detailRule: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceDivider,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(3),
    marginBottom: scale(2),
  },
  history: {
    marginTop: scale(2),
  },
  historyTitle: {
    marginTop: scale(d.sectionTop),
  },

  actions: {
    flexDirection: 'row',
    columnGap: scale(d.actionGap),
  },
  actionButton: {
    flex: 1,
  },

  emergency: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(9),
    overflow: 'hidden',
  },
  emergencyWash: {
    ...StyleSheet.absoluteFill,
    borderRadius: scale(11),
  },
  emergencyText: {
    flex: 1,
  },
  callNow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(4),
    height: scale(20),
    paddingHorizontal: scale(8),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.6),
    borderColor: colors.chipDangerBorder,
    backgroundColor: colors.chipDangerFill,
  },
}));
