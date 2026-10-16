import type { EdgeInsets } from 'react-native-safe-area-context';

import { INNER_COLUMN } from '@/components/layout/InnerScreen';
import { getMainTabBarInset } from '@/components/layout/MainTabBar';
import { getScreenHeaderTop } from '@/components/layout/screenHeader';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

/** Design dp. The orb shrinks on short screens so the captions keep their room. */
export const VOICE_ORB = 104;
export const VOICE_ORB_COMPACT = 84;
/** Window height (dp) below which the compact orb is used. */
export const COMPACT_HEIGHT = 720;
export const WELCOME_ORB = 40;

/**
 * The page: header, then a fixed-height column (Home's) whose pane fills what is left above
 * the tab bar, so the chat composer and call controls stay docked at the bottom.
 */
export const useAssistantPageStyles = makeStyles(
  (
    { colors, spacing, borderRadius },
    { width, height, scale },
    { insets, keyboardShown }: { insets: EdgeInsets; keyboardShown: boolean },
  ) => ({
    page: {
      flex: 1,
      width: '100%',
      maxWidth: scale(DESIGN_FRAME.width),
      alignSelf: 'center',
      paddingTop: getScreenHeaderTop(width, height, insets) - insets.top,
      // With the keyboard up the tab bar is hidden; the composer sits just above the keys.
      paddingBottom: keyboardShown
        ? scale(spacing.sm)
        : getMainTabBarInset(width, height, insets) - insets.bottom,
    },
    column: {
      flex: 1,
      marginTop: scale(spacing.md),
      marginStart: scale(INNER_COLUMN.left),
      width: scale(INNER_COLUMN.width),
    },
    toolbar: {
      marginTop: scale(spacing.sm),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(spacing.sm),
    },
    residentChip: {
      flexShrink: 1,
    },
    modeSwitch: {
      flex: 1,
      maxWidth: scale(132),
      marginStart: 'auto',
    },
    banner: {
      marginTop: scale(spacing.sm),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(6),
      paddingHorizontal: scale(10),
      paddingVertical: scale(6),
      borderRadius: borderRadius.pill,
      borderWidth: scale(0.6),
      borderColor: colors.chipDangerBorder,
      backgroundColor: colors.cameraFill,
    },
    bannerText: {
      flex: 1,
    },
    pane: {
      flex: 1,
      marginTop: scale(spacing.md),
    },
    pressed: {
      opacity: 0.6,
    },
  }),
);

/** Inside the chat and voice panes. */
export const useAssistantStyles = makeStyles(({ spacing }, { scale }) => ({
  flex: {
    flex: 1,
  },

  thread: {
    paddingBottom: scale(spacing.sm),
  },
  threadEmpty: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  welcome: {
    rowGap: scale(spacing.md),
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(4),
  },
  heroText: {
    flex: 1,
    rowGap: scale(2),
  },
  heroBody: {
    marginTop: scale(2),
  },
  composer: {
    marginTop: scale(spacing.sm),
  },

  voice: {
    flex: 1,
    alignItems: 'center',
  },
  voiceOrb: {
    marginTop: scale(spacing.xs),
  },
  voiceHint: {
    minHeight: scale(18),
    paddingHorizontal: scale(spacing.md),
  },
  voiceNotice: {
    marginTop: scale(spacing.xs),
  },
  voiceTranscript: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: scale(spacing.sm),
  },
  voiceIntroContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  voiceIntro: {
    alignItems: 'center',
    paddingHorizontal: scale(spacing.sm),
  },
  voiceIntroBody: {
    marginTop: scale(spacing.xs),
  },
  voiceTry: {
    marginTop: scale(spacing.md),
  },
  voiceExamples: {
    marginTop: scale(spacing.xs),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(spacing.xs),
  },
  voiceExample: {
    paddingHorizontal: scale(spacing.sm),
    paddingVertical: scale(3),
  },
  voiceNote: {
    marginTop: scale(spacing.sm),
  },
  voiceControls: {
    marginTop: scale(spacing.sm),
  },
  camera: {
    position: 'absolute',
    top: 0,
    end: 0,
  },
}));
