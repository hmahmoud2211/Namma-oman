import { makeStyles } from '@/utils/makeStyles';

/** Design dp. Sections share the inner screens' column (Home's, 296.8 dp). */
const d = { listTop: 6, badge: 30, gap: 9, emptyY: 10, indicatorWidth: 30.5 } as const;

export const useVisitorStyles = makeStyles(({ colors }, { scale }) => ({
  bannerIndicator: {
    width: scale(d.indicatorWidth),
  },
  // Fields share their form row equally.
  field: {
    flex: 1,
  },
  list: {
    marginTop: scale(d.listTop),
  },
  empty: {
    paddingVertical: scale(d.emptyY),
    textAlign: 'center',
  },
  parking: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parkingBadge: {
    width: scale(d.badge),
    height: scale(d.badge),
    borderRadius: scale(7),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkingText: {
    flex: 1,
    marginHorizontal: scale(d.gap),
  },
  pressed: {
    opacity: 0.85,
  },
}));
