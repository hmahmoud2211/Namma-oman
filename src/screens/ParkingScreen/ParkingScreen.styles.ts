import { makeStyles } from '@/utils/makeStyles';

/** Design dp. Sections share the inner screens' column (Home's, 296.8 dp). */
const d = {
  tile: 46,
  gap: 10,
  statGap: 6,
  statPadding: 7,
  action: { height: 40, gap: 6, radius: 9, paddingX: 7 },
} as const;

export const useParkingStyles = makeStyles(({ colors }, { scale }) => ({
  pressed: {
    opacity: 0.8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTile: {
    width: scale(d.tile),
    height: scale(d.tile),
    borderRadius: scale(8),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    marginHorizontal: scale(d.gap),
  },
  headline: {
    marginVertical: scale(1.5),
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
    marginTop: scale(5),
  },
  statBar: {
    marginTop: scale(3),
  },
  statLabel: {
    marginTop: scale(3),
  },

  actions: {
    flexDirection: 'row',
    columnGap: scale(d.action.gap),
  },
  action: {
    flex: 1,
    minHeight: scale(d.action.height),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
    paddingHorizontal: scale(d.action.paddingX),
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
    flex: 1,
  },
}));
