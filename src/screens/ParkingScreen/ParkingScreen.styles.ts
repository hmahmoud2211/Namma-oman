import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp. Parking runs in the parking flows' 320 dp column (ParkingFrame). The banner,
 * bay and car are SummaryCards, as the property card above them is.
 */
export const BANNER_RADIUS = 11;
const d = {
  statGap: 6,
  statPadding: 8,
  action: { height: 64, gap: 6, radius: 10, paddingX: 9, paddingY: 8 },
} as const;

export const useParkingStyles = makeStyles(({ colors }, { scale }) => ({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },

  stats: {
    flexDirection: 'row',
    columnGap: scale(d.statGap),
  },
  stat: {
    flex: 1,
    padding: scale(d.statPadding),
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: scale(4),
  },
  statFigure: {
    fontSize: 19,
    lineHeight: 24,
  },
  statBar: {
    marginTop: scale(3),
  },
  statLabel: {
    marginTop: scale(3),
    fontSize: 10,
    lineHeight: 13,
  },

  actions: {
    flexDirection: 'row',
    columnGap: scale(d.action.gap),
  },
  // Icon above a two-line label, so "Guest Parking" fits a third of the row.
  action: {
    flex: 1,
    minHeight: scale(d.action.height),
    justifyContent: 'center',
    rowGap: scale(4),
    paddingHorizontal: scale(d.action.paddingX),
    paddingVertical: scale(d.action.paddingY),
    borderRadius: scale(d.action.radius),
  },
  actionFill: {
    borderRadius: scale(d.action.radius),
  },
  actionPrimary: {
    borderWidth: scale(0.6),
    borderColor: colors.buttonEmeraldBorder,
  },
  actionAccent: {
    borderWidth: scale(0.6),
    borderColor: colors.buttonPrimaryHighlightTop,
  },
  actionPlain: {
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.fieldFill,
  },
  actionLabel: {
    fontSize: 11.5,
    lineHeight: 14.5,
  },

  demoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(8),
    padding: scale(10),
    borderRadius: scale(10),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.surfaceDivider,
  },
}));
