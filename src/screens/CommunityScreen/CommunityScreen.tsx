import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, View, type LayoutChangeEvent } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { ListRow } from '@/components/ui/ListRow';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusChip } from '@/components/ui/StatusChip';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { images } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { dayAndMonth, formatDate, formatTimeRange } from '@/utils/date';

import { FeedbackForm, PollOptionRow } from './CommunityParts';
import {
  announcements,
  communityAlerts,
  communityContent,
  currentPoll,
  pastPolls,
  pollShares,
  rsvpDisplay,
  shownCounts,
  upcomingEvents,
  type CommunityEvent,
  type RsvpStatus,
} from './CommunityScreen.data';
import { useCommunityStyles } from './CommunityScreen.styles';

/** The panels whose "View All" opens the full list in place. */
type ExpandablePanel = 'announcements' | 'events' | 'alerts' | 'polls';

/** Parklane's banner indicator: the first of its slides, filled 18 of 30.5 dp. */
const BANNER_INDICATOR = 18 / 30.5;

export function CommunityScreen() {
  const { locale } = useLocale();
  const copy = communityContent[locale];
  return (
    <InnerScreen
      overline={copy.overline}
      title={copy.title}
      subtitle={copy.subtitle}
      keyboardAvoiding
      showPropertyCard={false}
    >
      <CommunityContent />
    </InnerScreen>
  );
}

function CommunityContent() {
  const styles = useCommunityStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { scrollToColumnY } = useInnerScreen();
  const copy = communityContent[locale];
  const events = useMemo(() => upcomingEvents(), []);

  // Screen-local until there is a backend to send RSVPs, votes and feedback to.
  // TODO(api): persist them once the community service exists.
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>(() =>
    Object.fromEntries(events.map((event) => [event.id, event.rsvp])),
  );
  const [vote, setVote] = useState(currentPoll.myVote);
  const shares = useMemo(() => pollShares(currentPoll, vote), [vote]);
  const [expanded, setExpanded] = useState<Record<ExpandablePanel, boolean>>({
    announcements: false,
    events: false,
    alerts: false,
    polls: false,
  });
  /** The one row opened to its full text, across all lists. */
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const scrollToFeedback = useRef(false);

  // "View All" opens the panel's full list in place; "Show Less" folds it back.
  const viewAll = (panel: ExpandablePanel) => ({
    actionLabel: expanded[panel] ? copy.showLess : copy.viewAll,
    actionExpanded: expanded[panel],
    onActionPress: () => setExpanded((current) => ({ ...current, [panel]: !current[panel] })),
  });
  const shown = <T,>(items: readonly T[], panel: Exclude<ExpandablePanel, 'polls'>) =>
    expanded[panel] ? items : items.slice(0, shownCounts[panel]);

  // A row opens to its full text; tapping it again, or another row, closes it.
  const rowProps = (id: string, text: string, hint: string) => ({
    onPress: () => setOpenRow((current) => (current === id ? null : id)),
    expanded: openRow === id,
    expandedContent: (
      <AppText variant="labelSmall" color={colors.surfaceText}>
        {text}
      </AppText>
    ),
    accessibilityHint: hint,
  });

  // Registering marks the resident as going; tapping "I'm Going" withdraws.
  const toggleRsvp = (eventId: string) =>
    setRsvps((current) => {
      const status = current[eventId];
      if (status === 'soon') return current;
      return { ...current, [eventId]: status === 'going' ? 'open' : 'going' };
    });

  const renderRsvp = (event: CommunityEvent) => {
    const status = rsvps[event.id] ?? event.rsvp;
    const { label, tone } = rsvpDisplay[status];
    const chip = <StatusChip label={label[locale]} tone={tone} />;
    if (status === 'soon') return chip;
    const title = event.title[locale];
    return (
      <Pressable
        onPress={() => toggleRsvp(event.id)}
        hitSlop={scale(10)}
        accessibilityRole="button"
        accessibilityLabel={status === 'going' ? copy.goingTo(title) : copy.registerFor(title)}
        accessibilityHint={status === 'going' ? copy.withdraw : undefined}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {chip}
      </Pressable>
    );
  };

  const renderDate = (iso: string) => {
    const { day, month } = dayAndMonth(iso, locale);
    return (
      <View style={styles.dateColumn}>
        <AppText variant="cardTitle" color={colors.surfaceText}>
          {day}
        </AppText>
        <AppText variant="labelTiny" color={colors.surfaceAccentText}>
          {month}
        </AppText>
      </View>
    );
  };

  const openFeedback = () => {
    setFeedbackSent(false);
    // Scrolled to once the form has laid out (see its onLayout).
    scrollToFeedback.current = true;
    setFeedbackOpen(true);
  };

  // With no service yet, a valid message is only acknowledged here.
  const sendFeedback = () => {
    setFeedbackOpen(false);
    setFeedbackSent(true);
    AccessibilityInfo.announceForAccessibility(copy.feedbackThanks);
  };

  const onFeedbackLayout = (event: LayoutChangeEvent) => {
    if (scrollToFeedback.current) {
      scrollToFeedback.current = false;
      scrollToColumnY(event.nativeEvent.layout.y);
    }
  };

  return (
    <>
      <SummaryCard
        photo={images.featuredCommunityOpal}
        title={copy.bannerTitle}
        meta={copy.bannerBody}
        metaLines={3}
        footer={<ProgressBar progress={BANNER_INDICATOR} height={2.5} style={styles.bannerIndicator} />}
      />
      <Panel>
        <PanelHeading
          title={copy.announcementsTitle}
          icon={{ set: 'ionicons', name: 'megaphone-outline' }}
          {...viewAll('announcements')}
        />
        {shown(announcements, 'announcements').map((item, index) => (
          <ListRow
            key={item.id}
            divided={index > 0}
            icon={item.icon}
            title={item.title[locale]}
            details={[item.body[locale]]}
            time={item.postedAgo[locale]}
            {...rowProps(item.id, item.fullText[locale], copy.showsAnnouncement)}
          />
        ))}
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.eventsTitle}
          icon={{ set: 'material', name: 'calendar-month-outline' }}
          {...viewAll('events')}
        />
        {shown(events, 'events').map((event, index) => (
          <ListRow
            key={event.id}
            divided={index > 0}
            leading={renderDate(event.date)}
            title={event.title[locale]}
            details={[formatTimeRange(event.from, event.to, locale), event.venue[locale]]}
            trailing={renderRsvp(event)}
            {...rowProps(event.id, event.description[locale], copy.showsEvent)}
          />
        ))}
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.alertsTitle}
          icon={{ set: 'ionicons', name: 'notifications-outline' }}
          {...viewAll('alerts')}
        />
        {shown(communityAlerts, 'alerts').map((alert, index) => (
          <ListRow
            key={alert.id}
            divided={index > 0}
            icon={alert.icon}
            iconBadge={
              <View
                style={[
                  styles.alertBadge,
                  alert.level === 'warning' ? styles.alertWarning : styles.alertInfo,
                ]}
              >
                <AppIcon
                  set="ionicons"
                  name={alert.level === 'warning' ? 'warning' : 'information'}
                  size={scale(7)}
                  color={colors.white}
                />
              </View>
            }
            title={alert.title[locale]}
            details={[alert.body[locale]]}
            time={alert.postedAgo[locale]}
            {...rowProps(alert.id, alert.fullText[locale], copy.showsAlert)}
          />
        ))}
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.pollTitle}
          subtitle={copy.pollSubtitle}
          icon={{ set: 'ionicons', name: 'stats-chart-outline' }}
          {...viewAll('polls')}
        />
        <AppText variant="panelLabel" color={colors.surfaceText} style={styles.question}>
          {copy.pollQuestion}
        </AppText>
        <View accessibilityRole="radiogroup">
          {currentPoll.options.map((option) => (
            <PollOptionRow
              key={option.id}
              label={option.label[locale]}
              icon={option.icon}
              share={shares[option.id] ?? 0}
              selected={vote === option.id}
              onSelect={() => setVote(option.id)}
            />
          ))}
        </View>
        {expanded.polls ? (
          <View style={styles.pastPolls}>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.pastPollsTitle}
            </AppText>
            {pastPolls.map((poll) => {
              const total = poll.options.reduce((sum, option) => sum + option.votes, 0);
              return (
                <View key={poll.id} style={styles.pastPoll}>
                  <AppText variant="panelLabel" color={colors.surfaceText}>
                    {poll.question[locale]}
                  </AppText>
                  <AppText variant="labelTiny" color={colors.surfaceTextMuted}>
                    {`${copy.pollClosed(formatDate(poll.closedOn, locale))} · ${copy.pollVotes(total)}`}
                  </AppText>
                  {poll.options.map((option) => {
                    const share = total > 0 ? option.votes / total : 0;
                    const percent = `${Math.round(share * 100)}%`;
                    const label = option.label[locale];
                    return (
                      <View
                        key={option.id}
                        style={styles.pastOption}
                        accessible
                        accessibilityLabel={`${label}, ${percent}`}
                      >
                        <AppText
                          variant="labelSmall"
                          color={colors.surfaceText}
                          numberOfLines={1}
                          style={styles.pastLabel}
                        >
                          {label}
                        </AppText>
                        <ProgressBar progress={share} height={3.5} style={styles.pastBar} />
                        <AppText
                          variant="labelSmall"
                          color={colors.surfaceText}
                          style={styles.pastShare}
                        >
                          {percent}
                        </AppText>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : null}
      </Panel>

      <Panel style={styles.feedback}>
        <View style={styles.feedbackRow}>
          <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.feedbackIcon}>
            <AppIcon
              set="ionicons"
              name="chatbubble-ellipses-outline"
              size={scale(16)}
              color={colors.surfaceIcon}
            />
          </LinearGradient>
          <View style={styles.feedbackText}>
            <AppText variant="panelHeading" color={colors.surfaceText} accessibilityRole="header">
              {copy.feedbackTitle}
            </AppText>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.feedbackBody}
            </AppText>
          </View>
        </View>
        {feedbackSent ? (
          <AppText
            variant="label"
            color={colors.statusPositive}
            style={styles.feedbackThanks}
            accessibilityLiveRegion="polite"
          >
            {copy.feedbackThanks}
          </AppText>
        ) : null}
        <AppButton
          title={copy.feedbackCta}
          variant="surface"
          size="medium"
          onPress={openFeedback}
          style={styles.feedbackButton}
        />
      </Panel>

      {feedbackOpen ? (
        <View onLayout={onFeedbackLayout}>
          <FeedbackForm onSubmit={sendFeedback} onClose={() => setFeedbackOpen(false)} />
        </View>
      ) : null}
    </>
  );
}
