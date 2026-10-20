import type { ColorTokens } from './colors';

/**
 * The parking flows (ported from the Parklane app's parking demo) read their colours under
 * Parklane's names. Each maps to this app's token for the same role, so the flows take the
 * green-and-gold look and follow the light and dark themes. The site map is a lit garage plan,
 * drawn dark in both themes (see SiteMap), so its palette is fixed here.
 */

/** Route, target and QR frame: the aqua of Home's "Live • Belong • Thrive". */
const AQUA = '#14E3E1';

const mapPalette = {
  mapGround: 'rgba(0, 22, 18, 0.85)',
  mapAsphalt: 'rgba(6, 38, 34, 0.98)',
  mapRoadEdge: 'rgba(160, 210, 190, 0.4)',
  mapLaneMark: 'rgba(255, 255, 255, 0.45)',
  mapSidewalk: 'rgba(160, 210, 190, 0.12)',
  mapBuilding: 'rgba(31, 110, 104, 0.22)',
  mapBuildingStroke: 'rgba(245, 213, 148, 0.55)',
  mapBasementStroke: 'rgba(245, 213, 148, 0.45)',
  mapBay: 'rgba(255, 255, 255, 0.08)',
  mapBayStroke: 'rgba(255, 255, 255, 0.3)',
  mapBayFree: 'rgba(102, 233, 164, 0.1)',
  mapBayFreeStroke: 'rgba(102, 233, 164, 0.95)',
  mapBayFreeGlow: 'rgba(102, 233, 164, 0.28)',
  mapBayTaken: 'rgba(255, 143, 128, 0.12)',
  mapBayTakenStroke: 'rgba(255, 143, 128, 0.9)',
  mapBayTakenGlow: 'rgba(255, 143, 128, 0.26)',
  mapBayOther: 'rgba(255, 255, 255, 0.04)',
  mapBayOtherStroke: 'rgba(255, 255, 255, 0.16)',
  mapBayReserved: 'rgba(226, 232, 240, 0.06)',
  mapBayReservedStroke: 'rgba(226, 232, 240, 0.75)',
  mapBayHatch: 'rgba(226, 232, 240, 0.45)',
  mapTarget: AQUA,
  mapRoute: AQUA,
  mapRouteGlow: 'rgba(20, 227, 225, 0.22)',
  mapGate: '#F9D274',
  mapBoundary: 'rgba(245, 213, 148, 0.45)',
  mapGreen: 'rgba(102, 233, 164, 0.1)',
  mapGreenStroke: 'rgba(102, 233, 164, 0.4)',
  mapWater: 'rgba(20, 227, 225, 0.18)',
  mapWaterStroke: 'rgba(20, 227, 225, 0.5)',
  mapFloor: 'rgba(4, 52, 48, 0.6)',
  mapColumn: 'rgba(160, 210, 190, 0.4)',
  mapLift: 'rgba(249, 210, 116, 0.25)',
  mapZone: 'rgba(20, 227, 225, 0.06)',
  mapZoneStroke: 'rgba(20, 227, 225, 0.45)',
  mapCarLight: 'rgba(226, 232, 240, 0.95)',
  mapCarMid: 'rgba(148, 163, 184, 0.95)',
  mapCarDark: 'rgba(71, 85, 105, 0.98)',
  mapCarGlass: 'rgba(0, 30, 26, 0.88)',
  mapCarTail: 'rgba(255, 143, 128, 0.95)',
  mapLight: 'rgba(255, 214, 140, 0.95)',
  mapLightGlow: 'rgba(255, 200, 97, 0.22)',
  mapWalk: '#66E9A4',
  mapWalkGlow: 'rgba(102, 233, 164, 0.24)',
} as const;

export function parkingColors(c: ColorTokens) {
  return {
    ...mapPalette,
    textPrimary: c.surfaceText,
    textSecondary: c.surfaceTextMuted,
    textSupport: c.surfaceTextMuted,
    textMuted: c.surfaceTextSubtle,
    accent: c.accent,
    electricCyan: AQUA,
    violet: c.accent,
    white: c.white,
    transparent: c.transparent,
    placeholder: c.fieldPlaceholder,
    dividerSubtle: c.surfaceDivider,
    fieldFill: c.fieldFill,
    surfaceSubtle: c.chipNeutralFill,
    badgeFill: c.badgeFill,
    backgroundDeep: c.background,

    success: c.statusPositive,
    successFill: c.chipPositiveFill,
    successStroke: c.chipPositiveBorder,
    warning: c.statusWarning,
    warningFill: c.chipWarningFill,
    warningStroke: c.chipWarningBorder,
    error: c.destructiveText,
    errorFill: c.chipDangerFill,
    errorStroke: c.chipDangerBorder,
    infoFill: c.chipAccentFill,
    infoStroke: c.chipAccentBorder,

    // Card edges and the chosen chip: the frames' gold.
    cardStrokeFrom: c.frameRim,
    featureStrokeTo: c.frameRim,

    chipVioletText: c.chipAccentText,
    chipSlateFill: c.chipNeutralFill,
    chipSlateStroke: c.chipNeutralBorder,
    chipRedText: c.chipDangerText,

    // Buttons: the emerald primary and the coral hang-up.
    ctaSky: c.buttonEmeraldGradient[0],
    ctaRoyal: c.buttonEmeraldGradient[1],
    ctaViolet: c.buttonEmeraldGradient[2],
    ctaPink: c.buttonEmeraldGradient[3],
    hangUpFrom: c.callEndGradient[0],
    hangUpTo: c.callEndGradient[1],

    cameraFill: c.cameraFill,
    scanLine: c.scanLine[1],
    qrBackground: c.qrBackground,
    qrForeground: c.qrModule,

    // The saved pass card's backdrop (always drawn dark): abyss green into deep teal.
    deepNavy: '#001612',
    midnightBlue: '#022626',
    neonBlue: '#1F6E68',
  };
}

export type ParkingColors = ReturnType<typeof parkingColors>;
