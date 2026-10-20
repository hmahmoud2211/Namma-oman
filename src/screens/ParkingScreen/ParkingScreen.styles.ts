import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp. Parking runs in the parking flows' 320 dp column (ParkingFrame). The banner and
 * photo cards follow Parklane's (assets/Screens/screen7.png there): copy at the start, the
 * photo filling the end under a scrim.
 */
export const BANNER_RADIUS = 11;
const d = {
  banner: { height: 128, copyWidth: 0.56, photoWidth: 0.68 },
  photoCard: { height: 104, photoWidth: 0.6, cutoutWidth: 0.44, padding: 12 },
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

  banner: {
    height: scale(d.banner.height),
    borderRadius: scale(BANNER_RADIUS),
    overflow: 'hidden',
    backgroundColor: colors.cameraFill,
  },
  bannerPhoto: {
    position: 'absolute',
    end: 0,
    top: 0,
    bottom: 0,
    width: `${d.banner.photoWidth * 100}%`,
    height: '100%',
  },
  bannerCopy: {
    flex: 1,
    width: `${d.banner.copyWidth * 100}%`,
    justifyContent: 'center',
    paddingHorizontal: scale(14),
  },
  bannerBody: {
    marginTop: scale(6),
  },

  photoCard: {
    minHeight: scale(d.photoCard.height),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoClip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    borderRadius: scale(BANNER_RADIUS),
    overflow: 'hidden',
    backgroundColor: colors.cameraFill,
  },
  photo: {
    position: 'absolute',
    end: 0,
    top: 0,
    bottom: 0,
    width: `${d.photoCard.photoWidth * 100}%`,
    height: '100%',
  },
  cutout: {
    position: 'absolute',
    end: scale(26),
    width: `${d.photoCard.cutoutWidth * 100}%`,
  },
  photoText: {
    flex: 1,
    padding: scale(d.photoCard.padding),
    rowGap: scale(2),
  },
  photoHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(6),
    marginBottom: scale(4),
  },
  photoChip: {
    flexDirection: 'row',
    marginTop: scale(6),
  },
  chevron: {
    paddingEnd: scale(10),
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
