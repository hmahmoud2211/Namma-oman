import { imageAspects } from '@/constants/images';
import { makeStyles } from '@/utils/makeStyles';

/**
 * Design dp, measured in the Medical export (761×1453 px, 2.11 px per dp). Sections share the
 * inner screens' column (296.8 dp), a little wider than the export's 286 dp; widths that
 * divide the column (tiles, files, shortcuts) flex to fill it.
 */
export const medicalDesign = {
  hero: {
    minHeight: 73,
    paddingStart: 16.5,
    paddingTop: 11,
    paddingBottom: 6,
    categoriesGap: 1,
    bodyGap: 5,
    /** The stethoscope strip at the card's end, just inside its rim. */
    art: { height: 69.5, inset: 1.5 },
  },
  upload: {
    paddingTop: 8.5,
    paddingX: 13,
    paddingBottom: 8,
    titleStart: 3.6,
    tileGap: 13,
    tilesTop: 12,
    tile: { height: 64, radius: 8.5, artTop: 3, artHeight: 50 },
    button: { top: 10, height: 20.8, icon: 11, gap: 6 },
  },
  files: {
    paddingTop: 4,
    paddingX: 7.6,
    paddingBottom: 8,
    headingStart: 10,
    headingEnd: 5.4,
    check: 7.5,
    checkGap: 2.5,
    cardsTop: 1,
    cardGap: 7,
    card: {
      height: 51,
      radius: 8.5,
      padding: 3.3,
      thumbWidth: 25.5,
      thumbRadius: 3.8,
      textTop: 7.5,
      check: 8.5,
      menu: 9,
      menuEnd: 4.5,
      menuBottom: 6.5,
    },
  },
  shortcuts: {
    gap: 11,
    card: {
      minHeight: 79.5,
      paddingStart: 13.2,
      paddingTop: 5,
      paddingBottom: 5,
      iconStart: -2.8,
      icon: 31,
      titleGap: 1,
      descriptionGap: 2,
      chevron: 9.5,
      chevronTop: 9.5,
      chevronEnd: 12,
    },
  },
} as const;
const d = medicalDesign;

export const useMedicalStyles = makeStyles(({ colors, borderRadius }, { scale }) => {
  const artHeight = scale(d.hero.art.height);
  const thumbWidth = scale(d.files.card.thumbWidth);

  return {
    pressed: {
      opacity: 0.75,
    },

    // Hero banner
    hero: {
      minHeight: scale(d.hero.minHeight),
      overflow: 'hidden',
    },
    heroArt: {
      position: 'absolute',
      top: scale(d.hero.art.inset),
      end: scale(d.hero.art.inset),
      width: artHeight * imageAspects.medicalHero,
      height: artHeight,
    },
    heroText: {
      paddingStart: scale(d.hero.paddingStart),
      paddingTop: scale(d.hero.paddingTop),
      paddingBottom: scale(d.hero.paddingBottom),
      // Clear of the art.
      marginEnd: artHeight * imageAspects.medicalHero,
    },
    heroCategories: {
      marginTop: scale(d.hero.categoriesGap),
    },
    heroBody: {
      marginTop: scale(d.hero.bodyGap),
      // The design runs the line under the art's left edge.
      marginEnd: -scale(16),
    },

    // Upload Medical Documents
    uploadPanel: {
      paddingTop: scale(d.upload.paddingTop),
      paddingHorizontal: scale(d.upload.paddingX),
      paddingBottom: scale(d.upload.paddingBottom),
    },
    uploadTitle: {
      marginStart: scale(d.upload.titleStart),
    },
    tiles: {
      marginTop: scale(d.upload.tilesTop),
      flexDirection: 'row',
      columnGap: scale(d.upload.tileGap),
    },
    tile: {
      flex: 1,
      height: scale(d.upload.tile.height),
      alignItems: 'center',
      borderRadius: scale(d.upload.tile.radius),
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
      overflow: 'hidden',
    },
    tileArt: {
      marginTop: scale(d.upload.tile.artTop),
      height: scale(d.upload.tile.artHeight),
      justifyContent: 'center',
    },
    uploadButton: {
      marginTop: scale(d.upload.button.top),
      height: scale(d.upload.button.height),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: scale(d.upload.button.gap),
      borderRadius: borderRadius.pill,
      borderWidth: scale(0.8),
      borderColor: colors.surfaceAccentText,
      backgroundColor: colors.uploadButtonFill,
    },

    // Your Files
    filesPanel: {
      paddingTop: scale(d.files.paddingTop),
      paddingHorizontal: scale(d.files.paddingX),
      paddingBottom: scale(d.files.paddingBottom),
    },
    filesHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: scale(d.files.headingStart),
      marginEnd: scale(d.files.headingEnd),
    },
    filesTitle: {
      flex: 1,
    },
    filesCount: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(d.files.checkGap),
    },
    // Three to a row; new uploads add rows.
    fileCards: {
      marginTop: scale(d.files.cardsTop),
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(d.files.cardGap),
    },
    // Keeps an emptied row's height, so the panel doesn't jump when the last file goes.
    noFiles: {
      height: scale(d.files.card.height),
      justifyContent: 'center',
      paddingHorizontal: scale(d.files.headingStart),
    },
    fileCard: {
      // A third of the row each, even once a file is deleted.
      width: '31.5%',
      height: scale(d.files.card.height),
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(d.files.card.padding),
      columnGap: scale(d.files.card.padding),
      borderRadius: scale(d.files.card.radius),
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
      overflow: 'hidden',
    },
    fileOpen: {
      flex: 1,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(d.files.card.padding),
    },
    fileThumb: {
      width: thumbWidth,
      height: thumbWidth / imageAspects.medicalFile,
      borderRadius: scale(d.files.card.thumbRadius),
    },
    // A PDF: a document glyph on the tile's ground in place of a photo.
    fileThumbGlyph: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: scale(0.6),
      borderColor: colors.surfaceIconTileBorder,
    },
    fileText: {
      flex: 1,
      alignSelf: 'stretch',
      paddingTop: scale(d.files.card.textTop - d.files.card.padding),
    },
    fileCheck: {
      height: scale(d.files.card.check + 1),
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginTop: 'auto',
      marginBottom: scale(d.files.card.menuBottom - d.files.card.padding),
    },
    fileMenu: {
      position: 'absolute',
      end: scale(d.files.card.menuEnd),
      bottom: scale(d.files.card.menuBottom),
    },
    spinner: {
      transform: [{ scale: 0.5 }],
      marginStart: -scale(5),
    },
    documentText: {
      rowGap: scale(14),
      paddingBottom: scale(6),
    },
    check: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.pill,
      backgroundColor: colors.uploadedCheck,
    },

    // Shortcut cards
    shortcuts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(d.shortcuts.gap),
    },
    shortcut: {
      // Two to a row.
      width: '48%',
      flexGrow: 1,
    },
    shortcutCard: {
      minHeight: scale(d.shortcuts.card.minHeight),
      paddingStart: scale(d.shortcuts.card.paddingStart),
      paddingEnd: scale(d.shortcuts.card.chevronEnd),
      paddingTop: scale(d.shortcuts.card.paddingTop),
      paddingBottom: scale(d.shortcuts.card.paddingBottom),
    },
    shortcutIcon: {
      width: scale(d.shortcuts.card.icon),
      height: scale(d.shortcuts.card.icon),
      marginStart: scale(d.shortcuts.card.iconStart),
    },
    shortcutTitle: {
      marginTop: scale(d.shortcuts.card.titleGap),
    },
    shortcutDescription: {
      marginTop: scale(d.shortcuts.card.descriptionGap),
    },
    shortcutChevron: {
      position: 'absolute',
      top: scale(d.shortcuts.card.chevronTop),
      end: scale(d.shortcuts.card.chevronEnd),
    },
  };
});
