import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp. Sections share the inner screens' column (Home's, 296.8 dp); spacing follows
 * the theme's scale, with Home's 7.3-dp grid gap between the half-width cards.
 */
export const HEADING_ICON = 13;
export const GAUGE_SIZE = 86;
export const SCENES_PER_ROW = 4;
const d = {
  gridGap: 7.3,
  sectionTop: 10,
  roomGap: 5,
  sceneGap: 5.5,
  energyGap: 10,
  rowGap: 5,
  deviceGap: 6,
  addButton: { size: 20, borderWidth: 0.7 },
} as const;

export const useSmartHomeStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  pressed: {
    opacity: 0.6,
  },

  // The chips scroll sideways within the column.
  rooms: {
    flexGrow: 0,
  },
  roomsContent: {
    columnGap: scale(d.roomGap),
  },

  grid: {
    flexDirection: 'row',
    columnGap: scale(d.gridGap),
  },
  cell: {
    flex: 1,
  },

  sceneGrid: {
    marginTop: scale(d.sectionTop),
    rowGap: scale(d.sceneGap),
  },
  sceneRow: {
    flexDirection: 'row',
    columnGap: scale(d.sceneGap),
  },
  sceneSpacer: {
    flex: 1,
  },

  energyBody: {
    marginTop: scale(d.sectionTop),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.energyGap),
  },
  energyRows: {
    flex: 1,
    rowGap: scale(d.rowGap),
  },
  energyRooms: {
    marginTop: scale(d.sectionTop),
    rowGap: scale(d.rowGap),
  },

  addButton: {
    width: scale(d.addButton.size),
    height: scale(d.addButton.size),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.addButton.borderWidth),
    borderColor: colors.surfaceAccentText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceNote: {
    marginTop: scale(d.sectionTop),
  },
  deviceGrid: {
    marginTop: scale(d.sectionTop),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(d.deviceGap),
  },
  // Two across; each fills its row so the pair matches the taller card.
  deviceCell: {
    width: '48.5%',
    flexGrow: 1,
  },

  automationList: {
    marginTop: scale(d.sectionTop),
    rowGap: scale(d.rowGap),
  },
}));
