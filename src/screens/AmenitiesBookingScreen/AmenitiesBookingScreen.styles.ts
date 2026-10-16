import { makeStyles } from '@/utils/makeStyles';

/** Design dp. Sections share the inner screens' column (Home's, 296.8 dp). */
const d = { chipGap: 5, listGap: 9, tile: 64, gap: 10, detailGap: 3 } as const;

export const useAmenitiesStyles = makeStyles(({ colors }, { scale }) => ({
  pressed: {
    opacity: 0.7,
  },
  chips: {
    flexDirection: 'row',
    columnGap: scale(d.chipGap),
  },
  // The four chips share the row.
  chip: {
    flex: 1,
    paddingHorizontal: scale(4),
  },
  list: {
    rowGap: scale(d.listGap),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    columnGap: scale(d.gap),
  },
  cardTile: {
    width: scale(d.tile),
    minHeight: scale(d.tile),
    borderRadius: scale(8),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardFooter: {
    marginTop: scale(8),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: scale(6),
  },
  cardDetails: {
    rowGap: scale(d.detailGap),
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.detailGap),
  },
}));
