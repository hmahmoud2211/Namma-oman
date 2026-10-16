import type { EdgeInsets } from 'react-native-safe-area-context';

import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

/**
 * Layout measured from Assets/screens/start 1.png, in design dp (360×714 frame).
 * `top` / `bottom` values are screen positions and scale with screen height so the
 * content keeps its place over the background artwork; everything else scales with width.
 */
export const welcomeDesign = {
  logo: { top: 69.5, left: 126, width: 97, height: 38 },
  headline: { top: 185.7, left: 31 },
  title: { left: 27 },
  accentRule: { width: 28, height: 1.5, marginTop: 4 },
  tagline: { marginTop: 5.5 },
  arrowIcon: { size: 10.8 },
  cta: { width: 292, bottom: 76 },
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
        marginLeft: scale(d.logo.left),
      },
      headline: {
        marginTop: headlineTop - logoBottom,
        paddingLeft: scale(d.headline.left),
      },
      title: {
        marginLeft: scale(d.title.left - d.headline.left),
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
);
