import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

/**
 * Design dp. No export exists for this screen: it reuses the inner screens' header button and
 * the assistant's call controls, and gives the video as much of the screen as it can.
 */
export const roomDesign = {
  sideInset: 16,
  headerButton: 30.9,
  headerGap: 10,
  gridGap: 8,
  minTileHeight: 150,
  control: 44,
  controlIcon: 18,
  controlGap: 18,
} as const;
const d = roomDesign;

export const useCallRoomStyles = makeStyles(({ colors, borderRadius, spacing }, { scale }) => ({
  content: {
    flex: 1,
    width: '100%',
    maxWidth: scale(DESIGN_FRAME.width),
    alignSelf: 'center',
    paddingHorizontal: scale(d.sideInset),
    paddingTop: scale(spacing.sm),
    paddingBottom: scale(spacing.md),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.headerGap),
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  code: {
    letterSpacing: scale(1),
    writingDirection: 'ltr',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
    marginTop: scale(1),
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.statusWarning,
  },
  statusGood: {
    backgroundColor: colors.statusPositive,
  },
  statusBad: {
    backgroundColor: colors.chipDangerText,
  },
  problem: {
    marginTop: scale(spacing.sm),
    textAlign: 'center',
  },

  stage: {
    flex: 1,
    marginTop: scale(spacing.md),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(d.gridGap),
  },
  waiting: {
    width: '100%',
    marginTop: scale(spacing.xs),
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(spacing.lg),
  },
  message: {
    marginTop: scale(spacing.md),
  },
  messageButton: {
    alignSelf: 'stretch',
    marginTop: scale(spacing.md),
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: scale(d.controlGap),
    marginTop: scale(spacing.md),
  },
  controlCell: {
    alignItems: 'center',
    width: scale(d.control + 14),
  },
  control: {
    width: scale(d.control),
    height: scale(d.control),
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.controlFill,
    borderWidth: scale(0.6),
    borderColor: colors.controlBorder,
  },
  controlActive: {
    backgroundColor: colors.controlActiveFill,
    borderColor: colors.accent,
  },
  controlDanger: {
    backgroundColor: colors.chipDangerFill,
    borderColor: colors.chipDangerBorder,
  },
  controlLabel: {
    marginTop: scale(4),
  },
  endButton: {
    width: scale(d.control),
    height: scale(d.control),
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The handset lies down: the universal "hang up".
  endGlyph: {
    transform: [{ rotate: '135deg' }],
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
}));
