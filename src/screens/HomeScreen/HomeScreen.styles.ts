import type { EdgeInsets } from 'react-native-safe-area-context';

import { getMainTabBarInset } from '@/components/layout/MainTabBar';
import { getScreenHeaderTop } from '@/components/layout/screenHeader';
import { SERVICE_TILE_HEIGHT } from '@/components/ui/ServiceTile';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME, designFrameFromExport } from '@/utils/responsive';

/** Assets/screens/home 1.png is 774×1385 px → a 360×644.2 dp design frame. */
export const HOME_FRAME = designFrameFromExport(774, 1385);

/**
 * Layout measured from Assets/screens/home 1.png, in design dp (360-wide frame).
 * `top` values are screen positions and scale with screen height so the content keeps
 * its place over the background; everything inside a section scales with width.
 * Icon boxes are placed so their glyphs land where the design draws them.
 */
export const homeDesign = {
  header: { top: 62.3, height: 35.3 },
  logo: { left: 129.3, width: 90.2 },
  menu: { left: 38.75, top: 15.85, size: 21.5 },
  /** Drop-down under the menu button: left edge just left of the icon, small gap below. */
  menuPopover: { offsetX: -4, gap: 6 },
  bell: { left: 295.4, top: 7.45, size: 19 },
  /** EN | AR switch between the logo and the bell, centred on the bell glyph. */
  languageToggle: { left: 243, top: 6.95 },
  // `height` is the greeting text block, which ends below the weather card.
  greeting: { top: 127.4, height: 53, left: 27.9, textTop: 8.5, taglineGap: 1.5 },
  weather: {
    width: 81.9,
    height: 47.9,
    right: 35.3,
    radius: 9,
    moon: { left: 11.4, top: 11.7, size: 21.5 },
    text: { top: 13.85, left: 30.2, right: 1.9, conditionGap: 0.95 },
  },
  unit: { top: 200.5, left: 27.4, width: 296.8 },
  services: { top: 307.4, left: 27.4, width: 296.8, columns: 4, columnGap: 7.3, rowGap: 11 },
  featured: { top: 432.6, left: 25.6, width: 295.3, height: 123.3 },
  hitSlop: 12,
} as const;

const d = homeDesign;
const serviceRows = 2;
const servicesHeight = serviceRows * SERVICE_TILE_HEIGHT + (serviceRows - 1) * d.services.rowGap;
const unitCardHeight = 83.7;

export const useHomeStyles = makeStyles(
  ({ spacing }, { width, height, scale, verticalScale }, insets: EdgeInsets) => {
    // The header sits where every screen's header does (as on Construction Progress), which
    // is higher than home 1.png draws it; the sections below move up with it, so the
    // design's spacing under the header is kept.
    const headerTop = getScreenHeaderTop(width, height, insets);
    const lift = Math.max(verticalScale(d.header.top) - headerTop, 0);
    const designTop = (top: number) => verticalScale(top) - lift;

    // Design positions, each pushed clear of the section above.
    const headerBottom = headerTop + scale(d.header.height);
    const greetingTop = Math.max(designTop(d.greeting.top), headerBottom + spacing.lg);
    const greetingBottom = greetingTop + scale(d.greeting.height);
    const unitTop = Math.max(designTop(d.unit.top), greetingBottom + spacing.lg);
    const unitBottom = unitTop + scale(unitCardHeight);
    const servicesTop = Math.max(designTop(d.services.top), unitBottom + spacing.lg);
    const servicesBottom = servicesTop + scale(servicesHeight);
    const featuredTop = Math.max(designTop(d.featured.top), servicesBottom + spacing.lg);

    // The tab bar floats over the scroll view; the content ends above it.
    const contentBottom = getMainTabBarInset(width, height, insets);

    const tileWidth =
      (d.services.width - (d.services.columns - 1) * d.services.columnGap) / d.services.columns;

    return {
      // ScreenWrapper already pads by the insets; offsets here are relative to that.
      content: {
        flexGrow: 1,
        width: '100%',
        maxWidth: scale(DESIGN_FRAME.width),
        alignSelf: 'center',
        paddingTop: headerTop - insets.top,
        paddingBottom: contentBottom - insets.bottom,
      },

      header: {
        height: scale(d.header.height),
      },
      logo: {
        position: 'absolute',
        start: scale(d.logo.left),
        top: 0,
      },
      menuButton: {
        position: 'absolute',
        start: scale(d.menu.left),
        top: scale(d.menu.top),
      },
      bellButton: {
        position: 'absolute',
        start: scale(d.bell.left),
        top: scale(d.bell.top),
      },
      languageToggle: {
        position: 'absolute',
        start: scale(d.languageToggle.left),
        top: scale(d.languageToggle.top),
      },

      greetingRow: {
        marginTop: greetingTop - headerBottom,
        minHeight: scale(d.greeting.height),
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingStart: scale(d.greeting.left),
        paddingEnd: scale(d.weather.right),
      },
      greeting: {
        flex: 1,
        marginTop: scale(d.greeting.textTop),
        marginEnd: spacing.sm,
      },
      tagline: {
        marginTop: scale(d.greeting.taglineGap),
      },
      weatherCard: {
        width: scale(d.weather.width),
        height: scale(d.weather.height),
      },
      moon: {
        position: 'absolute',
        start: scale(d.weather.moon.left),
        top: scale(d.weather.moon.top),
      },
      weatherText: {
        position: 'absolute',
        top: scale(d.weather.text.top),
        start: scale(d.weather.text.left),
        end: scale(d.weather.text.right),
        alignItems: 'center',
      },
      weatherCondition: {
        marginTop: scale(d.weather.text.conditionGap),
      },

      unitCard: {
        marginTop: unitTop - greetingBottom,
        marginStart: scale(d.unit.left),
        width: scale(d.unit.width),
      },

      services: {
        marginTop: servicesTop - unitBottom,
        marginStart: scale(d.services.left),
        width: scale(d.services.width),
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: scale(d.services.columnGap),
        rowGap: scale(d.services.rowGap),
      },
      serviceTile: {
        width: scale(tileWidth),
      },

      featured: {
        marginTop: featuredTop - servicesBottom,
        marginStart: scale(d.featured.left),
        width: scale(d.featured.width),
      },
    };
  },
  { frame: HOME_FRAME },
);
