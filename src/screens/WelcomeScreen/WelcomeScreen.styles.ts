import type { EdgeInsets } from 'react-native-safe-area-context';

import { DESIGN_FRAME, designFrameFromExport } from '@/utils/responsive';
import { makeStyles } from '@/utils/makeStyles';

/**
 * Assets/screens/start 4.png is 791×1367 px, a 22 px phone bezel on its left and the 769 px
 * screen beside it (the width of its background, Assets/bg/start bg 4.png): a 360×640 dp frame.
 */
export const WELCOME_FRAME = designFrameFromExport(769, 1367);

/**
 * Layout measured from Assets/screens/start 4.png, in design dp (360×640 frame). The headline
 * sits low, under the building; the logo and the button are centred.
 * `top` / `bottom` values are screen positions and scale with screen height so the
 * content keeps its place over the background artwork; everything else scales with width.
 */
export const welcomeDesign = {
  logo: { top: 77.2, width: 117, height: 45.7 },
  headline: { top: 449.9, left: 18.7 },
  title: { left: 16 },
  accentRule: { width: 25.7, height: 1.4, marginTop: 8.3 },
  tagline: { marginTop: 6.1 },
  arrowIcon: { size: 10.8 },
  cta: { width: 273.4, bottom: 52.4 },
} as const;

const d = welcomeDesign;

export const useWelcomeStyles = makeStyles(
  ({ colors, spacing }, { scale, verticalScale }, insets: EdgeInsets) => {
    // Design positions, pushed clear of the status bar / home indicator when needed.
    const logoTop = Math.max(verticalScale(d.logo.top), insets.top + spacing.sm);
    const logoBottom = logoTop + scale(d.logo.height);
    const headlineTop = Math.max(verticalScale(d.headline.top), logoBottom + spacing.lg);
    const ctaBottom = Math.max(verticalScale(d.cta.bottom), insets.bottom + spacing.lg);

    return {
      // ScreenWrapper already pads by the insets; offsets here are relative to that.
      content: {
        flex: 1,
        width: '100%',
        maxWidth: scale(DESIGN_FRAME.width),
        alignSelf: 'center',
        paddingTop: logoTop - insets.top,
        paddingBottom: ctaBottom - insets.bottom,
      },
      logo: {
        alignSelf: 'center',
      },
      headline: {
        marginTop: headlineTop - logoBottom,
        paddingStart: scale(d.headline.left),
      },
      title: {
        marginStart: scale(d.title.left - d.headline.left),
      },
      accentRule: {
        width: scale(d.accentRule.width),
        height: scale(d.accentRule.height),
        marginTop: scale(d.accentRule.marginTop),
        backgroundColor: colors.accent,
      },
      tagline: {
        marginTop: scale(d.tagline.marginTop),
      },
      cta: {
        width: scale(d.cta.width),
        alignSelf: 'center',
        marginTop: 'auto',
      },
    };
  },
  { frame: WELCOME_FRAME },
);
