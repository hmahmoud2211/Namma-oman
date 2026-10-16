/**
 * Brand palette sampled from the Figma exports in /Assets (no official palette yet).
 * Components never read the palette directly — they use the semantic tokens below,
 * so a value changed here updates every component that uses it.
 */
const palette = {
  gold: '#F9D274',
  richGold: '#FCD268',
  paleGold: '#FAEFB6',
  rimGold: '#F5D594',
  bronze: '#8A682F',
  khaki: '#BFBB8B',
  cream: '#FFF5D6',
  abyssGreen: '#001612',
  deepTeal: '#022626',
  emeraldLight: '#1F6E68',
  emerald: '#0A4746',
  emeraldDark: '#033535',
  emeraldDeep: '#023233',
  ink: '#0B191C',
  slate: '#3B4547',
  dividerSlate: '#4F6461',
  frostEdge: '#C0C3BC',
  frostLight: '#CDD0CA',
  frost: '#BFC1B9',
  frostShade: '#B2B5AC',
  frostLow: '#C2C4BB',
  frostBottom: '#B8BAB1',
  frostShadow: '#7D877F',
  frostHighlight: '#EEF2EE',
  frostBottomLight: '#E6E6DA',
  warmLight: '#F2D9AE',
  goldLight: '#E6BE72',
  white: '#FFFFFF',
  black: '#000000',
} as const;

type Gradient2 = readonly [string, string];
type Gradient4 = readonly [string, string, string, string];

export interface ColorTokens {
  /** Base behind full-bleed artwork; matches the edges of the background images. */
  background: string;
  textPrimary: string;
  accent: string;
  /** Gold text on the light glass ("BACK"), a touch richer than `accent` for contrast. */
  accentOnGlass: string;

  /** Text and icons placed on the light frosted-glass surfaces (Sign In card). */
  textOnGlass: string;
  textOnGlassStrong: string;
  textOnGlassMuted: string;
  dividerOnGlass: string;

  /** Top-to-bottom frosted fill (the card's base tone). */
  glassCardBaseGradient: readonly string[];
  /** Soft lights painted over the base (positions live in GlassCard). */
  glassCardHighlight: string;
  glassCardBottomLight: string;
  glassCardWarmLight: string;
  glassCardGoldLight: string;
  glassCardShade: string;
  glassCardBorder: string;
  glassCardInnerBorder: string;
  glassCardGlow: string;
  glassFieldFill: string;
  glassFieldBorder: string;
  glassTileFill: string;
  glassTileBorder: string;
  glassTileGlow: string;

  buttonPrimaryGradient: Gradient2;
  buttonPrimaryText: string;
  buttonPrimaryHighlightTop: string;
  buttonPrimaryHighlightBottom: string;
  buttonPrimaryGlow: string;
  buttonIconRing: string;
  buttonEmeraldGradient: Gradient4;
  buttonEmeraldBorder: string;
  buttonEmeraldInnerHighlight: string;
  buttonEmeraldShadow: string;
  buttonEmeraldText: string;
  buttonSecondaryBorder: string;
  buttonSecondaryText: string;

  white: string;
  black: string;
  transparent: string;
}

export const colors: ColorTokens = {
  background: palette.abyssGreen,
  textPrimary: palette.white,
  accent: palette.gold,
  accentOnGlass: palette.richGold,

  textOnGlass: palette.ink,
  textOnGlassStrong: palette.deepTeal,
  textOnGlassMuted: palette.slate,
  dividerOnGlass: palette.dividerSlate,

  glassCardBaseGradient: [
    palette.frostEdge,
    palette.frostLight,
    palette.frost,
    palette.frostShade,
    palette.frostShade,
    palette.frostLow,
    palette.frostBottom,
  ],
  glassCardHighlight: palette.frostHighlight,
  glassCardBottomLight: palette.frostBottomLight,
  glassCardWarmLight: palette.warmLight,
  glassCardGoldLight: palette.goldLight,
  glassCardShade: palette.frostShadow,
  glassCardBorder: palette.rimGold,
  glassCardInnerBorder: 'rgba(255, 255, 255, 0.85)',
  glassCardGlow: 'rgba(250, 210, 130, 0.35)',
  glassFieldFill: 'rgba(255, 255, 255, 0.12)',
  glassFieldBorder: 'rgba(255, 255, 255, 0.85)',
  glassTileFill: 'rgba(255, 248, 230, 0.4)',
  glassTileBorder: 'rgba(255, 252, 242, 0.95)',
  glassTileGlow: 'rgba(255, 244, 220, 0.7)',

  buttonPrimaryGradient: [palette.bronze, palette.khaki],
  buttonPrimaryText: palette.white,
  buttonPrimaryHighlightTop: 'rgba(255, 245, 200, 0.56)',
  buttonPrimaryHighlightBottom: 'rgba(255, 245, 200, 0.22)',
  buttonPrimaryGlow: 'rgba(255, 240, 215, 0.22)',
  buttonIconRing: palette.cream,
  buttonEmeraldGradient: [palette.emeraldLight, palette.emerald, palette.emeraldDark, palette.emeraldDeep],
  buttonEmeraldBorder: palette.paleGold,
  buttonEmeraldInnerHighlight: 'rgba(140, 220, 180, 0.45)',
  buttonEmeraldShadow: 'rgba(10, 40, 38, 0.35)',
  buttonEmeraldText: palette.white,
  buttonSecondaryBorder: palette.gold,
  buttonSecondaryText: palette.white,

  white: palette.white,
  black: palette.black,
  transparent: 'transparent',
};
