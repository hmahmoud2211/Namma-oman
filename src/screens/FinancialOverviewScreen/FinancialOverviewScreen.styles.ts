import { StyleSheet } from 'react-native';

import { makeStyles } from '@/utils/makeStyles';
import { designFrameFromExport } from '@/utils/responsive';

/** Assets/screens/financial overview 1.png and 2.png are 774 px wide (2.15 px per dp). */
export const FINANCE_FRAME = designFrameFromExport(774, 1435);

/**
 * Design dp, measured from the exports and set in the inner screens' column (296.8 dp, as on
 * Home) with this app's card frame: glass panels with the fading gold rim.
 */
export const financeDesign = {
  radius: 11,
  gap: 7.3,
  sectionGap: 10,
  padding: 9,
  iconBox: { size: 36, small: 32, radius: 8, icon: 19 },
  smallIcon: 13,
  chevron: 9,
  unit: { height: 80, photoWidth: 0.6 },
  price: { height: 82, boxHeight: 40 },
  ring: { size: 62, stroke: 6.5, dot: 6 },
  amountCard: { height: 56 },
  stat: { height: 50, radius: 9, bar: { width: 0.62, height: 3.5 } },
  divider: 0.6,
  payNow: { height: 25, paddingX: 13 },
  row: { height: 40, radius: 9 },
  tile: 47,
} as const;
const d = financeDesign;

export const useFinanceStyles = makeStyles(
  ({ colors, borderRadius }, { scale }) => ({
    pressed: {
      opacity: 0.8,
    },
    row: {
      flexDirection: 'row',
      columnGap: scale(d.gap),
    },
    half: {
      flex: 1,
    },

    iconBox: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(d.iconBox.radius),
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
    },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(8),
    },
    headingText: {
      flex: 1,
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(4),
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      columnGap: scale(4),
    },
    // The design sets its figures in a lighter weight than the app's bold amounts.
    amount: {
      fontSize: 15,
      lineHeight: 20,
    },
    amountLarge: {
      fontSize: 18,
      lineHeight: 23,
    },

    // My Unit: details at the start, the building photo filling the end under a scrim.
    unitCard: {
      height: scale(d.unit.height),
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    unitGround: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: scale(d.radius),
      backgroundColor: colors.cameraFill,
    },
    unitPhotoClip: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      end: 0,
      width: `${d.unit.photoWidth * 100}%`,
      borderTopEndRadius: scale(d.radius),
      borderBottomEndRadius: scale(d.radius),
      overflow: 'hidden',
    },
    unitPhoto: {
      width: '100%',
      height: '100%',
    },
    unitDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(9),
      paddingHorizontal: scale(d.padding),
    },
    unitName: {
      fontSize: 20,
      lineHeight: 25,
      marginVertical: scale(1),
    },
    unitMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(5),
    },
    unitMetaRule: {
      width: scale(0.8),
      height: scale(10),
      backgroundColor: colors.surfaceText,
    },

    card: {
      padding: scale(d.padding),
    },
    priceCard: {
      minHeight: scale(d.price.height),
      rowGap: scale(7),
    },
    priceBox: {
      height: scale(d.price.boxHeight),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(8),
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
      backgroundColor: colors.fieldFill,
    },
    ringCard: {
      minHeight: scale(d.price.height),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(9),
    },
    ringCentre: {
      alignItems: 'center',
    },
    legend: {
      flex: 1,
      rowGap: scale(6),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: scale(5),
    },
    legendDot: {
      width: scale(d.ring.dot),
      height: scale(d.ring.dot),
      borderRadius: borderRadius.pill,
      marginTop: scale(3),
    },

    amountCard: {
      minHeight: scale(d.amountCard.height),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(8),
    },
    amountCardText: {
      flex: 1,
      rowGap: scale(3),
      // Clear of the corner chevron.
      paddingEnd: scale(d.chevron + 4),
    },
    cornerChevron: {
      position: 'absolute',
      top: scale(d.padding + 2),
      end: scale(d.padding),
    },

    panel: {
      padding: scale(d.padding),
      rowGap: scale(d.sectionGap),
    },
    stats: {
      flexDirection: 'row',
      columnGap: scale(6),
    },
    stat: {
      flex: 1,
      minHeight: scale(d.stat.height),
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: scale(2),
      paddingVertical: scale(6),
      paddingHorizontal: scale(4),
      borderRadius: scale(d.stat.radius),
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
      backgroundColor: colors.fieldFill,
    },
    statFigure: {
      fontSize: 13,
      lineHeight: 16,
    },
    statBar: {
      width: `${d.stat.bar.width * 100}%`,
      marginTop: scale(3),
    },

    next: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    nextHalf: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: scale(7),
    },
    nextText: {
      flex: 1,
      rowGap: scale(5),
    },
    nextDivider: {
      width: scale(d.divider),
      marginHorizontal: scale(8),
      backgroundColor: colors.surfaceDivider,
    },
    dueRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: scale(4),
    },
    payNow: {
      alignSelf: 'flex-start',
      height: scale(d.payNow.height),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(7),
      paddingHorizontal: scale(d.payNow.paddingX),
      borderRadius: borderRadius.pill,
      borderWidth: scale(0.8),
      borderColor: colors.buttonOutlineBorder,
      backgroundColor: colors.chipAccentFill,
    },

    nextDue: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(6),
      paddingHorizontal: scale(4),
    },

    paymentRow: {
      minHeight: scale(d.row.height),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(9),
      paddingEnd: scale(10),
      borderRadius: scale(d.row.radius),
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
      backgroundColor: colors.fieldFill,
      overflow: 'hidden',
    },
    paymentCheck: {
      width: scale(d.iconBox.size),
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      borderEndWidth: scale(0.6),
      borderEndColor: colors.surfaceIconTileBorder,
    },
    paymentText: {
      flex: 1,
      paddingVertical: scale(5),
      rowGap: scale(2),
    },

    tile: {
      flex: 1,
      height: scale(d.tile),
    },
  }),
  { frame: FINANCE_FRAME },
);
