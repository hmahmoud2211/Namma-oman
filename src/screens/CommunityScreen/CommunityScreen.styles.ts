import { makeStyles } from '@/utils/makeStyles';

/** Design dp. Sections share the inner screens' column (Home's, 296.8 dp). */
const d = { dateColumn: 28, badge: 12, sectionTop: 10, feedbackIcon: 32 } as const;

export const useCommunityStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  pressed: {
    opacity: 0.7,
  },
  dateColumn: {
    width: scale(d.dateColumn),
    alignItems: 'center',
  },
  alertBadge: {
    width: scale(d.badge),
    height: scale(d.badge),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.8),
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertWarning: {
    backgroundColor: colors.chipDangerText,
  },
  alertInfo: {
    backgroundColor: colors.chipAccentText,
  },
  question: {
    marginTop: scale(d.sectionTop),
  },
  pastPolls: {
    marginTop: scale(d.sectionTop),
    rowGap: scale(d.sectionTop),
  },
  pastPoll: {
    rowGap: scale(3),
  },
  pastOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(6),
  },
  pastLabel: {
    flex: 1.4,
  },
  pastBar: {
    flex: 1,
  },
  pastShare: {
    width: scale(24),
    textAlign: 'right',
  },
  feedback: {
    rowGap: scale(d.sectionTop),
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(9),
  },
  feedbackIcon: {
    width: scale(d.feedbackIcon),
    height: scale(d.feedbackIcon),
    borderRadius: scale(8),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    flex: 1,
  },
  feedbackThanks: {
    textAlign: 'center',
  },
  feedbackButton: {
    alignSelf: 'stretch',
  },
}));
