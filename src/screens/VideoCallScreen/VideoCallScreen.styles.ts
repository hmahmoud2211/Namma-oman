import { makeStyles } from '@/utils/makeStyles';

/** Design dp. Sections share the inner screens' column (Home's, 296.8 dp). */
const d = {
  sectionGap: 10,
  codeBox: { paddingY: 9, radius: 9, letterSpacing: 1.5 },
  share: { height: 30, gap: 6, radius: 8, paddingX: 6 },
} as const;

export const useVideoCallStyles = makeStyles(({ colors }, { scale }) => ({
  pressed: {
    opacity: 0.8,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: scale(8),
  },
  noticeText: {
    flex: 1,
  },
  error: {
    marginTop: scale(d.sectionGap),
  },
  field: {
    marginTop: scale(d.sectionGap),
  },
  primaryButton: {
    marginTop: scale(d.sectionGap),
  },

  codeBox: {
    marginTop: scale(d.sectionGap),
    alignItems: 'center',
    paddingVertical: scale(d.codeBox.paddingY),
    borderRadius: scale(d.codeBox.radius),
    borderWidth: scale(0.6),
    borderColor: colors.fieldBorder,
    backgroundColor: colors.fieldFill,
  },
  code: {
    marginTop: scale(2),
    letterSpacing: scale(d.codeBox.letterSpacing),
    // The code is Latin in both languages.
    writingDirection: 'ltr',
  },
  shareRow: {
    flexDirection: 'row',
    columnGap: scale(d.share.gap),
    marginTop: scale(d.sectionGap),
  },
  shareAction: {
    flex: 1,
    height: scale(d.share.height),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: scale(5),
    paddingHorizontal: scale(d.share.paddingX),
    borderRadius: scale(d.share.radius),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.fieldFill,
  },
  buttonRow: {
    flexDirection: 'row',
    columnGap: scale(d.share.gap),
    marginTop: scale(d.sectionGap),
  },
  flexButton: {
    flex: 1,
  },
}));
