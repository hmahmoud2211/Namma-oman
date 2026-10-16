/**
 * Brand palette sampled from the Figma exports in /Assets (no official palette yet).
 * Components never read the palette directly — they use the semantic tokens below,
 * so a value changed here updates every component that uses it.
 *
 * Two token sets share one shape: `darkColors` (Assets/screens/mode 1.png) and
 * `lightColors` (Assets/screens/mode 2.png, cream cards over the dark-green artwork).
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
  paleGoldCream: '#FCF6C4',
  aqua: '#14E3E1',
  aquaBright: '#05FBF3',
  tealBright: '#03D0BA',
  tealDeep: '#01665A',
  mint: '#2CF978',
  amber: '#F5B54A',
  coral: '#FF8F80',
  brick: '#B3261E',
  ochre: '#A86A12',
  leaf: '#24955A',
  signalGold: '#FDE18E',
  headerRingTeal: '#14A898',
  azure: '#2489AC',
  pineGlow: '#2C7258',
  moonLight: '#F4F5F2',
  moonShade: '#A9AFAE',
  creamEdge: '#FFFBF2',
  forestInk: '#123D2B',
  sage: '#7AA68D',
  charcoal: '#1C1B17',
  umber: '#3B3830',
  /** The light theme's cream artwork (Assets/bg/bg home mode 2.png), sampled from its plain area. */
  parchment: '#F4ECDF',
  white: '#FFFFFF',
  black: '#000000',

  /*
   * Light colours a resident can set their lamps to (Smart Home presets and the custom-colour
   * ring). They describe the bulb, not the brand, so they are the same in both themes.
   */
  bulbWarm: '#FECB74',
  bulbAmber: '#FDA541',
  bulbDaylight: '#E3F0FE',
  bulbBlue: '#0AA7FF',
  bulbViolet: '#A03CFD',
  hueRed: '#FF3B5C',
  hueOrange: '#FF9F2E',
  hueYellow: '#FFE93D',
  hueGreen: '#2EF07A',
  hueBlue: '#2B6BFF',
  hueMagenta: '#C23DFF',
} as const;

type Gradient2 = readonly [string, string];
type Gradient3 = readonly [string, string, string];
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
  /** Thin pale-gold outline pill (Home "Explore Community"). */
  buttonOutlineBorder: string;
  buttonOutlineText: string;

  /** Home (home 1.png): glyphs drawn straight on the background (menu, bell). */
  headerIcon: string;
  /** Wash over the background artwork; transparent when the artwork is used as is. */
  backgroundTint: string;

  /** Frosted glass behind every Home panel: blur tint and a soft top-left sheen. */
  glassBlurTint: 'light' | 'dark' | 'default';
  glassSheenGradient: Gradient2;

  /** Themed glass cards (weather, My Unit, service tiles): cream glass in light, green glass in dark. */
  surfaceGradient: Gradient3;
  surfaceBorder: string;
  surfaceInnerHighlight: string;
  surfaceShadow: string;
  surfaceText: string;
  surfaceTextMuted: string;
  surfaceIcon: string;
  surfaceIconTileGradient: Gradient2;
  surfaceIconTileBorder: string;
  /** My Unit card: diagonal rim (top-left → bottom-right) and the photo's thin frame. */
  featureCardBorderGradient: Gradient4;
  featureCardGlow: string;
  photoBorder: string;
  badgeFill: string;
  badgeBorder: string;
  badgeText: string;
  moonLight: string;
  moonShade: string;

  /** Featured-community hero: a photo card, dark in both themes (like mode 2's hero). */
  /** Glass behind the hero photo (shows where the photo doesn't reach). */
  heroGlassGradient: Gradient2;
  /** Left-to-right fade that keeps the copy readable, and a light bottom shade. */
  heroScrimGradient: Gradient4;
  heroScrimBottomGradient: Gradient2;
  heroBorder: string;
  heroText: string;
  heroOverline: string;
  heroAccent: string;
  carouselActive: string;
  carouselInactive: string;

  /** Drop-down menu (Home header): denser glass, since it floats over busy content. */
  menuGradient: Gradient2;
  menuBackdrop: string;
  menuActiveFill: string;
  menuDivider: string;

  /** Floating bottom tab bar. */
  tabBarGradient: Gradient2;
  /** The bar stays dark-green glass in both themes (mode 2's bar is green, not cream). */
  tabBarBlurTint: 'light' | 'dark' | 'default';
  tabBarBorder: string;
  tabBarShadow: string;
  tabActive: string;
  tabInactive: string;
  /** Underline under the active tab (dark) or the box around it (light); transparent when unused. */
  tabIndicator: string;
  tabActiveFill: string;
  tabActiveBorder: string;

  /** Round header buttons over the background (Construction Progress: bell and avatar). */
  headerButtonBorder: string;
  headerAvatarBorder: string;
  notificationDot: string;

  /** Construction Progress (construction.png): percentages, rings, bars and the chart. */
  progressText: string;
  progressFillGradient: Gradient2;
  progressTrack: string;
  progressGlow: string;
  chartBarGradient: Gradient2;
  chartAxis: string;
  /** "On Schedule" dot. */
  statusPositive: string;
  /** "Slight Delay" dot and label. */
  statusWarning: string;
  /** Timeline: reached steps are filled with `surfaceIcon` and carry this tick. */
  timelineTick: string;
  timelinePending: string;
  /** Gold text on the themed cards ("Latest Update"); deeper in light mode for contrast. */
  surfaceAccentText: string;
  /** Destructive commands on menus and cards ("Log out"). */
  destructiveText: string;
  /** Faintest text on the themed cards ("Pending", "In Progress"). */
  surfaceTextSubtle: string;
  surfaceDivider: string;
  pagerActive: string;
  pagerInactive: string;

  /**
   * Bottom navigation (after Parklane's bar): the raised Home disc in the middle, its seat,
   * and the faint halo around it. The bar is dark-green glass in both themes.
   */
  homeDiscGradient: Gradient2;
  homeDiscGlyph: string;
  homeDiscGloss: Gradient2;
  homeSeat: string;
  homeHaloGradient: Gradient2;
  homeHaloBorder: string;
  homeDiscGlow: string;

  /** Text fields and pickers laid on the themed cards (forms on the service screens). */
  fieldFill: string;
  fieldBorder: string;
  fieldText: string;
  fieldPlaceholder: string;

  /** On/off switches: the lit track runs along this gradient. */
  toggleOnGradient: Gradient2;
  toggleOffTrack: string;
  toggleTrackBorder: string;
  toggleKnob: string;
  toggleKnobOff: string;

  /**
   * Status pills. `positive`: arrived, approved, completed, going. `accent`: scheduled,
   * in progress. `neutral`: entered, submitted, coming soon. `action`: an open invitation
   * ("Register"), drawn filled. `warning` / `danger`: alerts and emergencies.
   */
  chipPositiveText: string;
  chipPositiveFill: string;
  chipPositiveBorder: string;
  chipAccentText: string;
  chipAccentFill: string;
  chipAccentBorder: string;
  chipNeutralText: string;
  chipNeutralFill: string;
  chipNeutralBorder: string;
  chipActionText: string;
  chipActionFill: string;
  chipWarningText: string;
  chipWarningFill: string;
  chipWarningBorder: string;
  chipDangerText: string;
  chipDangerFill: string;
  chipDangerBorder: string;

  /** Initials discs (visitors, the resident chip). */
  avatarFill: string;
  avatarBorder: string;
  avatarText: string;

  /** Lit fixtures (lights, scenes) and cooling (AC); a selected scene is rimmed in `sceneActive`. */
  iconWarm: string;
  iconCool: string;
  sceneActive: string;
  sceneTileGradient: Gradient3;
  sceneScrim: Gradient3;
  /** Brightness slider fill and the well behind the colour presets. */
  sliderGradient: Gradient2;
  sliderTrack: string;
  sliderThumb: string;
  wellFill: string;
  bulbPresets: Readonly<Record<'warm' | 'amber' | 'daylight' | 'blue' | 'violet', string>>;
  hueRing: readonly string[];

  /** Visitor pass QR code: dark modules on white, framed in the accent. */
  qrModule: string;
  qrBackground: string;
  qrFrame: string;

  /**
   * Assistant. The orb is the brand's emerald and gold with an aqua glow: aqua while it
   * listens, gold while it speaks, a coral wash on failure.
   */
  orbCoreGradient: Gradient3;
  orbBlobListen: string;
  orbBlobSpeak: string;
  orbHaloListen: string;
  orbHaloSpeak: string;
  orbHaloEdge: string;
  orbGloss: string;
  orbGlossEdge: string;
  orbRing: string;
  orbRingSpeak: string;
  orbRim: string;
  orbAccent: string;
  orbErrorGradient: Gradient2;
  /** The resident's chat bubbles; the assistant's sit on a themed card. */
  userBubbleGradient: Gradient2;
  userBubbleBorder: string;
  userBubbleText: string;
  /** Voice call button: gold to start, coral to hang up. */
  callStartGradient: Gradient2;
  callEndGradient: Gradient2;
  callGlyph: string;
  /** Round controls laid straight on the background (camera, mute). */
  controlFill: string;
  controlBorder: string;
  controlActiveFill: string;
  cameraFill: string;
  scanLine: Gradient2;
  /** Text drawn straight on the background artwork, below `textPrimary`. */
  textOnBackgroundMuted: string;
  textOnBackgroundSubtle: string;

  white: string;
  black: string;
  transparent: string;
}

export const darkColors: ColorTokens = {
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
  buttonOutlineBorder: palette.paleGoldCream,
  buttonOutlineText: palette.paleGoldCream,

  headerIcon: palette.white,
  backgroundTint: 'transparent',

  glassBlurTint: 'dark',
  glassSheenGradient: ['rgba(190, 255, 230, 0.1)', 'rgba(190, 255, 230, 0)'],

  surfaceGradient: ['rgba(26, 92, 78, 0.22)', 'rgba(6, 46, 40, 0.18)', 'rgba(0, 26, 22, 0.28)'],
  surfaceBorder: 'rgba(80, 170, 140, 0.45)',
  surfaceInnerHighlight: 'rgba(160, 235, 205, 0.2)',
  surfaceShadow: 'rgba(0, 0, 0, 0.35)',
  surfaceText: palette.white,
  surfaceTextMuted: 'rgba(255, 255, 255, 0.86)',
  surfaceIcon: palette.gold,
  surfaceIconTileGradient: ['rgba(30, 100, 84, 0.26)', 'rgba(4, 42, 36, 0.26)'],
  surfaceIconTileBorder: 'rgba(110, 190, 160, 0.3)',
  featureCardBorderGradient: [palette.paleGold, palette.rimGold, palette.pineGlow, palette.rimGold],
  featureCardGlow: 'rgba(245, 213, 148, 0.28)',
  photoBorder: 'rgba(245, 213, 148, 0.85)',
  badgeFill: 'rgba(0, 72, 62, 0.75)',
  badgeBorder: 'rgba(20, 227, 225, 0.55)',
  badgeText: palette.aqua,
  moonLight: palette.moonLight,
  moonShade: palette.moonShade,

  // Translucent over the glass on the left, opaque where the photo's left edge sits
  // (27% across) so that edge never shows, then fading out over the photo.
  heroScrimGradient: [
    'rgba(1, 12, 9, 0.28)',
    'rgba(1, 12, 9, 0.9)',
    'rgba(1, 12, 9, 0.55)',
    'rgba(1, 12, 9, 0)',
  ],
  heroScrimBottomGradient: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.45)'],
  heroGlassGradient: ['rgba(10, 46, 40, 0.18)', 'rgba(0, 16, 14, 0.3)'],
  heroBorder: 'rgba(245, 213, 148, 0.8)',
  heroText: palette.white,
  heroOverline: palette.paleGold,
  heroAccent: palette.aqua,
  carouselActive: palette.paleGoldCream,
  carouselInactive: palette.azure,

  menuGradient: ['rgba(14, 62, 52, 0.86)', 'rgba(2, 28, 24, 0.9)'],
  menuBackdrop: 'rgba(0, 0, 0, 0.3)',
  menuActiveFill: 'rgba(249, 210, 116, 0.12)',
  menuDivider: 'rgba(255, 255, 255, 0.12)',

  tabBarGradient: ['rgba(14, 76, 62, 0.26)', 'rgba(0, 28, 24, 0.38)'],
  tabBarBlurTint: 'dark',
  tabBarBorder: 'rgba(60, 170, 140, 0.5)',
  tabBarShadow: 'rgba(0, 0, 0, 0.5)',
  tabActive: palette.gold,
  tabInactive: palette.white,
  tabIndicator: palette.gold,
  tabActiveFill: 'transparent',
  tabActiveBorder: 'transparent',

  headerButtonBorder: palette.headerRingTeal,
  headerAvatarBorder: palette.gold,
  notificationDot: palette.signalGold,

  progressText: palette.aqua,
  progressFillGradient: [palette.aqua, palette.aquaBright],
  progressTrack: 'rgba(20, 227, 225, 0.13)',
  progressGlow: 'rgba(20, 227, 225, 0.35)',
  chartBarGradient: [palette.tealBright, palette.tealDeep],
  chartAxis: 'rgba(80, 170, 140, 0.4)',
  statusPositive: palette.mint,
  statusWarning: palette.amber,
  timelineTick: palette.ink,
  timelinePending: 'rgba(255, 255, 255, 0.62)',
  surfaceAccentText: palette.gold,
  destructiveText: palette.coral,
  surfaceTextSubtle: 'rgba(255, 255, 255, 0.48)',
  surfaceDivider: 'rgba(255, 255, 255, 0.14)',
  pagerActive: palette.aqua,
  pagerInactive: 'rgba(110, 140, 132, 0.55)',

  homeDiscGradient: [palette.richGold, palette.bronze],
  homeDiscGlyph: palette.abyssGreen,
  homeDiscGloss: ['rgba(255, 255, 255, 0.42)', 'rgba(255, 255, 255, 0)'],
  homeSeat: palette.deepTeal,
  homeHaloGradient: ['rgba(249, 210, 116, 0.3)', 'rgba(20, 168, 152, 0.24)'],
  homeHaloBorder: 'rgba(245, 213, 148, 0.45)',
  homeDiscGlow: 'rgba(249, 210, 116, 0.45)',

  fieldFill: 'rgba(0, 26, 22, 0.32)',
  fieldBorder: 'rgba(110, 190, 160, 0.38)',
  fieldText: palette.white,
  fieldPlaceholder: 'rgba(255, 255, 255, 0.48)',

  toggleOnGradient: [palette.goldLight, palette.gold],
  toggleOffTrack: 'rgba(255, 255, 255, 0.1)',
  toggleTrackBorder: 'rgba(255, 255, 255, 0.2)',
  toggleKnob: palette.white,
  toggleKnobOff: 'rgba(255, 255, 255, 0.72)',

  chipPositiveText: palette.aqua,
  chipPositiveFill: 'rgba(0, 72, 62, 0.75)',
  chipPositiveBorder: 'rgba(20, 227, 225, 0.55)',
  chipAccentText: palette.gold,
  chipAccentFill: 'rgba(249, 210, 116, 0.1)',
  chipAccentBorder: 'rgba(249, 210, 116, 0.55)',
  chipNeutralText: 'rgba(255, 255, 255, 0.82)',
  chipNeutralFill: 'rgba(255, 255, 255, 0.06)',
  chipNeutralBorder: 'rgba(255, 255, 255, 0.26)',
  chipActionText: palette.abyssGreen,
  chipActionFill: palette.gold,
  chipWarningText: palette.amber,
  chipWarningFill: 'rgba(245, 181, 74, 0.1)',
  chipWarningBorder: 'rgba(245, 181, 74, 0.5)',
  chipDangerText: palette.coral,
  chipDangerFill: 'rgba(255, 143, 128, 0.1)',
  chipDangerBorder: 'rgba(255, 143, 128, 0.5)',

  avatarFill: 'rgba(249, 210, 116, 0.12)',
  avatarBorder: 'rgba(249, 210, 116, 0.5)',
  avatarText: palette.gold,

  iconWarm: palette.signalGold,
  iconCool: palette.aqua,
  sceneActive: palette.gold,
  sceneTileGradient: [palette.emeraldLight, palette.emeraldDark, palette.abyssGreen],
  sceneScrim: ['rgba(0, 16, 14, 0)', 'rgba(0, 16, 14, 0.35)', 'rgba(0, 16, 14, 0.8)'],
  sliderGradient: [palette.goldLight, palette.paleGoldCream],
  sliderTrack: 'rgba(255, 255, 255, 0.14)',
  sliderThumb: palette.white,
  wellFill: 'rgba(0, 26, 22, 0.4)',
  bulbPresets: {
    warm: palette.bulbWarm,
    amber: palette.bulbAmber,
    daylight: palette.bulbDaylight,
    blue: palette.bulbBlue,
    violet: palette.bulbViolet,
  },
  hueRing: [
    palette.hueRed,
    palette.hueOrange,
    palette.hueYellow,
    palette.hueGreen,
    palette.hueBlue,
    palette.hueMagenta,
  ],

  qrModule: palette.ink,
  qrBackground: palette.white,
  qrFrame: palette.gold,

  orbCoreGradient: [palette.emeraldLight, palette.emerald, palette.emeraldDeep],
  orbBlobListen: 'rgba(20, 227, 225, 0.9)',
  orbBlobSpeak: 'rgba(249, 210, 116, 0.88)',
  orbHaloListen: 'rgba(20, 227, 225, 0.36)',
  orbHaloSpeak: 'rgba(249, 210, 116, 0.38)',
  orbHaloEdge: 'rgba(20, 227, 225, 0)',
  orbGloss: 'rgba(255, 255, 255, 0.5)',
  orbGlossEdge: 'rgba(255, 255, 255, 0)',
  orbRing: 'rgba(20, 227, 225, 0.55)',
  orbRingSpeak: 'rgba(249, 210, 116, 0.6)',
  orbRim: 'rgba(245, 213, 148, 0.65)',
  orbAccent: palette.aqua,
  orbErrorGradient: [palette.coral, palette.brick],
  userBubbleGradient: [palette.emeraldLight, palette.emeraldDeep],
  userBubbleBorder: 'rgba(250, 239, 182, 0.7)',
  userBubbleText: palette.white,
  callStartGradient: [palette.richGold, palette.bronze],
  callEndGradient: [palette.coral, palette.brick],
  callGlyph: palette.abyssGreen,
  controlFill: 'rgba(0, 26, 22, 0.45)',
  controlBorder: 'rgba(110, 190, 160, 0.45)',
  controlActiveFill: 'rgba(249, 210, 116, 0.16)',
  cameraFill: 'rgba(0, 22, 18, 0.85)',
  scanLine: ['rgba(20, 227, 225, 0)', 'rgba(20, 227, 225, 0.85)'],
  textOnBackgroundMuted: 'rgba(255, 255, 255, 0.78)',
  textOnBackgroundSubtle: 'rgba(255, 255, 255, 0.55)',

  white: palette.white,
  black: palette.black,
  transparent: 'transparent',
};

/**
 * Light mode: cream cards with deep-green ink (mode 2.png) over the cream home artwork
 * (Assets/bg/bg home mode 2.png). Everything drawn straight on that artwork (titles, header
 * glyphs, the tab bar) takes the deep-green ink and the bronze accent instead of white and gold.
 * Welcome and Sign In keep their dark artwork and render with the dark theme in both modes.
 */
export const lightColors: ColorTokens = {
  ...darkColors,

  // On the cream artwork: matches its edges, and needs no wash.
  background: palette.parchment,
  backgroundTint: 'transparent',
  textPrimary: palette.forestInk,
  accent: palette.bronze,
  headerIcon: palette.forestInk,
  headerButtonBorder: palette.pineGlow,
  headerAvatarBorder: palette.bronze,
  notificationDot: palette.ochre,
  textOnBackgroundMuted: 'rgba(18, 61, 43, 0.78)',
  textOnBackgroundSubtle: 'rgba(18, 61, 43, 0.55)',
  // Round controls on the artwork (the assistant's toolbar and call controls).
  controlFill: 'rgba(255, 255, 255, 0.55)',
  controlBorder: 'rgba(18, 61, 43, 0.22)',
  controlActiveFill: 'rgba(138, 104, 47, 0.12)',

  // `default` (no white wash) keeps the cream warm instead of grey.
  glassBlurTint: 'default',
  // A brighter sheen across the top-left: the cards read as glass, not paper.
  glassSheenGradient: ['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0)'],

  // Cards sit on cream artwork, so their glass can't be cream too or they vanish: white at the
  // top, clearer through the middle (the blurred artwork shows), framed in gold, and lifted by
  // a warm shadow rather than a glow.
  surfaceGradient: [
    'rgba(255, 255, 255, 0.62)',
    'rgba(255, 252, 246, 0.34)',
    'rgba(255, 248, 236, 0.46)',
  ],
  surfaceBorder: 'rgba(176, 138, 62, 0.55)',
  surfaceInnerHighlight: 'rgba(255, 255, 255, 0.95)',
  surfaceShadow: 'rgba(110, 82, 36, 0.24)',
  surfaceText: palette.charcoal,
  // Darker than mode 2's grey so it stays readable on the thinner glass.
  surfaceTextMuted: palette.umber,
  surfaceIcon: palette.forestInk,
  surfaceIconTileGradient: ['rgba(255, 255, 255, 0.24)', 'rgba(233, 223, 200, 0.32)'],
  surfaceIconTileBorder: 'rgba(176, 138, 62, 0.4)',
  // Feature cards (My Unit, stages): a white catch-light at the top-left running into gold.
  featureCardBorderGradient: [palette.white, palette.goldLight, palette.bronze, palette.goldLight],
  featureCardGlow: 'rgba(110, 82, 36, 0.26)',
  photoBorder: 'rgba(196, 160, 90, 0.9)',
  badgeFill: 'rgba(18, 61, 43, 0.08)',
  badgeBorder: 'rgba(18, 61, 43, 0.55)',
  badgeText: palette.forestInk,
  moonLight: palette.forestInk,
  moonShade: palette.sage,

  menuGradient: ['rgba(255, 248, 232, 0.93)', 'rgba(246, 236, 214, 0.9)'],
  menuBackdrop: 'rgba(0, 0, 0, 0.2)',
  menuActiveFill: 'rgba(18, 61, 43, 0.08)',
  menuDivider: 'rgba(18, 61, 43, 0.14)',

  // Cream glass on the cream artwork, ink labels, the active tab boxed in gold.
  tabBarGradient: ['rgba(255, 250, 238, 0.74)', 'rgba(244, 234, 214, 0.86)'],
  tabBarBlurTint: 'light',
  tabBarBorder: 'rgba(196, 160, 90, 0.55)',
  tabBarShadow: 'rgba(120, 90, 40, 0.22)',
  tabActive: palette.bronze,
  tabInactive: palette.umber,
  homeSeat: palette.creamEdge,
  homeHaloBorder: 'rgba(138, 104, 47, 0.45)',
  tabIndicator: 'transparent',
  tabActiveFill: 'rgba(249, 210, 116, 0.14)',
  tabActiveBorder: 'rgba(235, 212, 128, 0.75)',

  // Deep green on cream, like mode 2's "54% Paid" bar; the header buttons stay as in dark.
  progressText: palette.forestInk,
  progressFillGradient: [palette.forestInk, palette.pineGlow],
  progressTrack: 'rgba(18, 61, 43, 0.12)',
  progressGlow: 'rgba(18, 61, 43, 0)',
  chartBarGradient: [palette.pineGlow, palette.forestInk],
  chartAxis: 'rgba(18, 61, 43, 0.22)',
  statusPositive: palette.leaf,
  statusWarning: palette.ochre,
  timelineTick: palette.cream,
  timelinePending: 'rgba(28, 27, 23, 0.5)',
  surfaceAccentText: palette.bronze,
  destructiveText: palette.brick,
  surfaceTextSubtle: 'rgba(59, 56, 48, 0.68)',
  surfaceDivider: 'rgba(18, 61, 43, 0.16)',
  pagerActive: palette.forestInk,
  pagerInactive: 'rgba(18, 61, 43, 0.22)',

  // Forms and controls on the cream cards take the deep-green ink.
  fieldFill: 'rgba(255, 255, 255, 0.5)',
  fieldBorder: 'rgba(18, 61, 43, 0.24)',
  fieldText: palette.charcoal,
  fieldPlaceholder: 'rgba(59, 56, 48, 0.55)',

  toggleOnGradient: [palette.pineGlow, palette.forestInk],
  toggleOffTrack: 'rgba(18, 61, 43, 0.1)',
  toggleTrackBorder: 'rgba(18, 61, 43, 0.22)',
  toggleKnobOff: palette.white,

  chipPositiveText: palette.forestInk,
  chipPositiveFill: 'rgba(18, 61, 43, 0.08)',
  chipPositiveBorder: 'rgba(18, 61, 43, 0.55)',
  chipAccentText: palette.bronze,
  chipAccentFill: 'rgba(138, 104, 47, 0.08)',
  chipAccentBorder: 'rgba(138, 104, 47, 0.5)',
  chipNeutralText: palette.umber,
  chipNeutralFill: 'rgba(59, 56, 48, 0.05)',
  chipNeutralBorder: 'rgba(59, 56, 48, 0.28)',
  chipActionText: palette.cream,
  chipActionFill: palette.forestInk,
  chipWarningText: palette.ochre,
  chipWarningFill: 'rgba(168, 106, 18, 0.08)',
  chipWarningBorder: 'rgba(168, 106, 18, 0.5)',
  chipDangerText: palette.brick,
  chipDangerFill: 'rgba(179, 38, 30, 0.07)',
  chipDangerBorder: 'rgba(179, 38, 30, 0.45)',

  avatarFill: 'rgba(18, 61, 43, 0.08)',
  avatarBorder: 'rgba(18, 61, 43, 0.35)',
  avatarText: palette.forestInk,

  iconWarm: palette.ochre,
  iconCool: palette.azure,
  sceneActive: palette.bronze,
  sliderGradient: [palette.ochre, palette.gold],
  sliderTrack: 'rgba(18, 61, 43, 0.12)',
  sliderThumb: palette.forestInk,
  wellFill: 'rgba(18, 61, 43, 0.07)',

  qrFrame: palette.bronze,
};
