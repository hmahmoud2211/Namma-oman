import type { EdgeInsets } from 'react-native-safe-area-context';

import { ICON_TILE_WIDTH } from '@/components/ui/IconTile';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME, designFrameFromExport } from '@/utils/responsive';

/** Assets/screens/sign in.png is 767×1398 px → a 360×656.2 dp design frame. */
export const SIGN_IN_FRAME = designFrameFromExport(767, 1398);

/**
 * Layout measured from Assets/screens/sign in.png, in design dp (360-wide frame).
 * `top` values are screen positions and scale with screen height so the content keeps
 * its place over the background; everything inside the card scales with width.
 * Text margins are between line boxes, placed so baselines land where the design has them.
 */
export const signInDesign = {
  logo: { top: 56.3, left: 150.2, width: 92, height: 36 },
  card: {
    top: 196,
    left: 53.7,
    width: 243.9,
    paddingTop: 38,
    paddingHorizontal: 14.6,
    paddingBottom: 14.9,
  },
  subtitle: { marginTop: 0.85 },
  emailField: { marginTop: 12.05 },
  passwordField: { marginTop: 5.9 },
  forgotPassword: { marginTop: 5.1 },
  submit: { marginTop: 5.2 },
  divider: { marginTop: 9.05 },
  tiles: { marginTop: 7.45, spacing: 70 },
  footer: { marginTop: 11.4, gap: 6.1 },
  icons: { mail: 15.24, lock: 17.4, eye: 14.6, arrow: 10.1 },
  bottomGap: 24,
} as const;

const d = signInDesign;

export const useSignInStyles = makeStyles(
  ({ colors, spacing }, { scale, verticalScale }, insets: EdgeInsets) => {
    // Design positions, pushed clear of the status bar when needed.
    const logoTop = Math.max(verticalScale(d.logo.top), insets.top + spacing.sm);
    const logoBottom = logoTop + scale(d.logo.height);
    const cardTop = Math.max(verticalScale(d.card.top), logoBottom + spacing.lg);

    return {
      // ScreenWrapper already pads by the insets; offsets here are relative to that.
      content: {
        flexGrow: 1,
        width: '100%',
        maxWidth: scale(DESIGN_FRAME.width),
        alignSelf: 'center',
        paddingTop: logoTop - insets.top,
        paddingBottom: scale(d.bottomGap),
      },
      logo: {
        marginStart: scale(d.logo.left),
      },
      card: {
        width: scale(d.card.width),
        marginStart: scale(d.card.left),
        marginTop: cardTop - logoBottom,
        paddingTop: scale(d.card.paddingTop),
        paddingHorizontal: scale(d.card.paddingHorizontal),
        paddingBottom: scale(d.card.paddingBottom),
      },
      title: {
        textAlign: 'center',
      },
      titleAccent: {
        color: colors.accentOnGlass,
      },
      subtitle: {
        marginTop: scale(d.subtitle.marginTop),
        textAlign: 'center',
      },
      emailField: {
        marginTop: scale(d.emailField.marginTop),
      },
      passwordField: {
        marginTop: scale(d.passwordField.marginTop),
      },
      forgotPassword: {
        marginTop: scale(d.forgotPassword.marginTop),
        alignSelf: 'flex-end',
      },
      submit: {
        marginTop: scale(d.submit.marginTop),
      },
      divider: {
        marginTop: scale(d.divider.marginTop),
      },
      tiles: {
        marginTop: scale(d.tiles.marginTop),
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(d.tiles.spacing - ICON_TILE_WIDTH),
      },
      footer: {
        marginTop: scale(d.footer.marginTop),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
      },
      signUpLink: {
        marginStart: scale(d.footer.gap),
      },
    };
  },
  { frame: SIGN_IN_FRAME },
);
