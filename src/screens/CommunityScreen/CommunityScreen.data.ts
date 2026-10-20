import type { Glyph } from '@/components/common/AppIcon';
import type { ListOption } from '@/components/ui/OptionList';
import type { StatusTone } from '@/components/ui/StatusChip';
import type { Locale, Localized } from '@/context/LocaleContext';
import { addDays } from '@/utils/date';

/**
 * Community, migrated from the Parklane app: announcements, upcoming events with RSVP,
 * community alerts, a poll with past results, and resident feedback. Sample data shaped like
 * an API response; RSVPs, votes and feedback stay in the screen until a service exists.
 */

type Text = Localized<string>;

export const communityContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  bannerTitle: string;
  bannerBody: string;
  announcementsTitle: string;
  eventsTitle: string;
  alertsTitle: string;
  pollTitle: string;
  pollSubtitle: string;
  pollQuestion: string;
  feedbackTitle: string;
  feedbackBody: string;
  feedbackCta: string;
  viewAll: string;
  showLess: string;
  pastPollsTitle: string;
  pollClosed: (date: string) => string;
  pollVotes: (count: number) => string;
  feedbackFormTitle: string;
  feedbackFormSubtitle: string;
  feedbackTopicLabel: string;
  feedbackTopicPlaceholder: string;
  feedbackMessageLabel: string;
  feedbackMessagePlaceholder: string;
  feedbackSend: string;
  feedbackClose: string;
  feedbackThanks: string;
  goingTo: (event: string) => string;
  registerFor: (event: string) => string;
  withdraw: string;
  showsAnnouncement: string;
  showsEvent: string;
  showsAlert: string;
}> = {
  en: {
    overline: 'NAMA COMMUNITY',
    title: 'Community',
    subtitle: 'More than a residence: a connected community for a better tomorrow.',
    bannerTitle: 'Opal Residence Community',
    bannerBody: 'More than a residence. A connected community for a better tomorrow.',
    announcementsTitle: 'Announcements',
    eventsTitle: 'Upcoming Events',
    alertsTitle: 'Community Alerts',
    pollTitle: 'Help Shape Our Community',
    pollSubtitle: 'Your opinion helps us create a better community.',
    pollQuestion: 'What would you like to see more of?',
    feedbackTitle: 'Resident Feedback',
    feedbackBody:
      'Share your ideas, suggestions or concerns. Together we make our community even better.',
    feedbackCta: 'Share Feedback',
    viewAll: 'View All',
    showLess: 'Show Less',
    pastPollsTitle: 'Past Polls',
    pollClosed: (date) => `Closed ${date}`,
    pollVotes: (count) => `${count} votes`,
    feedbackFormTitle: 'Share Your Feedback',
    feedbackFormSubtitle: 'Management reads every message.',
    feedbackTopicLabel: 'Topic',
    feedbackTopicPlaceholder: 'Select topic',
    feedbackMessageLabel: 'Message',
    feedbackMessagePlaceholder: 'Tell us what you think',
    feedbackSend: 'Send Feedback',
    feedbackClose: 'Close the feedback form',
    feedbackThanks: 'Thanks for your feedback! Management will review it.',
    goingTo: (event) => `Going to ${event}`,
    registerFor: (event) => `Register for ${event}`,
    withdraw: 'Withdraws your RSVP',
    showsAnnouncement: 'Shows the full announcement',
    showsEvent: "Shows the event's details",
    showsAlert: 'Shows the full alert',
  },
  ar: {
    overline: 'مجتمع نماء',
    title: 'المجتمع',
    subtitle: 'أكثر من مجرد سكن: مجتمع مترابط من أجل غدٍ أفضل.',
    bannerTitle: 'مجتمع أوبال ريزيدنس',
    bannerBody: 'أكثر من مجرد سكن. مجتمع مترابط من أجل غدٍ أفضل.',
    announcementsTitle: 'الإعلانات',
    eventsTitle: 'الفعاليات القادمة',
    alertsTitle: 'تنبيهات المجتمع',
    pollTitle: 'ساهم في تشكيل مجتمعنا',
    pollSubtitle: 'رأيك يساعدنا على بناء مجتمع أفضل.',
    pollQuestion: 'ما الذي تودّ رؤية المزيد منه؟',
    feedbackTitle: 'آراء السكان',
    feedbackBody: 'شاركنا أفكارك واقتراحاتك وملاحظاتك. معاً نجعل مجتمعنا أفضل.',
    feedbackCta: 'شارك رأيك',
    viewAll: 'عرض الكل',
    showLess: 'عرض أقل',
    pastPollsTitle: 'استطلاعات سابقة',
    pollClosed: (date) => `أُغلق في ${date}`,
    pollVotes: (count) => `${count} صوت`,
    feedbackFormTitle: 'شارك رأيك',
    feedbackFormSubtitle: 'تقرأ الإدارة كل رسالة.',
    feedbackTopicLabel: 'الموضوع',
    feedbackTopicPlaceholder: 'اختر الموضوع',
    feedbackMessageLabel: 'الرسالة',
    feedbackMessagePlaceholder: 'أخبرنا برأيك',
    feedbackSend: 'إرسال الرأي',
    feedbackClose: 'إغلاق نموذج الرأي',
    feedbackThanks: 'شكراً لرأيك! ستراجعه الإدارة.',
    goingTo: (event) => `ستحضر ${event}`,
    registerFor: (event) => `التسجيل في ${event}`,
    withdraw: 'يلغي تسجيل حضورك',
    showsAnnouncement: 'يعرض الإعلان كاملاً',
    showsEvent: 'يعرض تفاصيل الفعالية',
    showsAlert: 'يعرض التنبيه كاملاً',
  },
};

/** Rows each list shows before "View All". */
export const shownCounts = {
  announcements: 2,
  events: 3,
  alerts: 2,
} as const;

export interface Announcement {
  id: string;
  title: Text;
  body: Text;
  /** The rest of the notice, shown when the row is opened. */
  fullText: Text;
  /** Display age. */
  postedAgo: Text;
  icon: Glyph;
}

export const announcements: readonly Announcement[] = [
  {
    id: 'ann-pool-maintenance',
    title: { en: 'Swimming Pool Maintenance', ar: 'صيانة المسبح' },
    body: {
      en: 'The pool will be closed next Tuesday from 8:00 AM – 4:00 PM for scheduled maintenance.',
      ar: 'سيُغلق المسبح يوم الثلاثاء القادم من 8:00 ص حتى 4:00 م للصيانة الدورية.',
    },
    fullText: {
      en: 'The pool deck, changing rooms and showers are closed for the same hours. The kids’ splash pad stays open.',
      ar: 'تُغلق منطقة المسبح وغرف تبديل الملابس والاستحمام خلال الساعات نفسها. تبقى منطقة ألعاب الماء للأطفال مفتوحة.',
    },
    postedAgo: { en: '2h ago', ar: 'قبل ساعتين' },
    icon: { set: 'material', name: 'pool' },
  },
  {
    id: 'ann-cafe-open',
    title: { en: 'The Clubhouse Café is Now Open', ar: 'افتتاح مقهى النادي' },
    body: {
      en: 'Enjoy a new dining experience at the clubhouse. Open daily from 7:00 AM – 10:00 PM.',
      ar: 'استمتع بتجربة طعام جديدة في النادي. مفتوح يومياً من 7:00 ص حتى 10:00 م.',
    },
    fullText: {
      en: 'Breakfast is served until 11:00 AM, and residents get 10% off all week. Find it on the clubhouse ground floor.',
      ar: 'يُقدَّم الإفطار حتى 11:00 ص، ويحصل السكان على خصم 10% طوال الأسبوع. يقع في الطابق الأرضي من النادي.',
    },
    postedAgo: { en: '1d ago', ar: 'قبل يوم' },
    icon: { set: 'material', name: 'coffee-outline' },
  },
  // Behind "View All".
  {
    id: 'ann-recycling',
    title: { en: 'Recycling Program Launch', ar: 'إطلاق برنامج إعادة التدوير' },
    body: {
      en: 'Sorting bins are now on every floor of Towers A to D.',
      ar: 'حاويات الفرز متوفرة الآن في كل طابق من الأبراج A إلى D.',
    },
    fullText: {
      en: 'Blue is for paper, yellow for plastic and metal, green for glass. Collection runs every Tuesday and Saturday.',
      ar: 'الأزرق للورق، والأصفر للبلاستيك والمعادن، والأخضر للزجاج. يتم الجمع كل ثلاثاء وسبت.',
    },
    postedAgo: { en: '3d ago', ar: 'قبل 3 أيام' },
    icon: { set: 'ionicons', name: 'leaf-outline' },
  },
  {
    id: 'ann-gym',
    title: { en: 'Gym Equipment Upgrade', ar: 'تحديث معدات النادي الرياضي' },
    body: {
      en: 'New cardio machines arrive next week.',
      ar: 'تصل أجهزة الكارديو الجديدة الأسبوع القادم.',
    },
    fullText: {
      en: 'The gym stays open during the installation; the cardio area closes from 9:00 AM to 1:00 PM that day.',
      ar: 'يبقى النادي الرياضي مفتوحاً أثناء التركيب؛ وتُغلق منطقة الكارديو من 9:00 ص حتى 1:00 م في ذلك اليوم.',
    },
    postedAgo: { en: '5d ago', ar: 'قبل 5 أيام' },
    icon: { set: 'ionicons', name: 'barbell-outline' },
  },
];

/**
 * `open` takes registrations, `going` is the resident's RSVP, and `soon` hasn't opened yet.
 * Only `open` and `going` can be toggled.
 */
export type RsvpStatus = 'open' | 'going' | 'soon';

export const rsvpDisplay: Record<RsvpStatus, { label: Text; tone: StatusTone }> = {
  open: { label: { en: 'Register', ar: 'سجّل' }, tone: 'action' },
  going: { label: { en: 'I’m Going', ar: 'سأحضر' }, tone: 'positive' },
  soon: { label: { en: 'Coming Soon', ar: 'قريباً' }, tone: 'neutral' },
};

export interface CommunityEvent {
  id: string;
  title: Text;
  /** Shown when the row is opened. */
  description: Text;
  /** ISO day. */
  date: string;
  /** 24-hour "HH:MM". */
  from: string;
  to: string;
  venue: Text;
  rsvp: RsvpStatus;
  icon: Glyph;
}

/** Upcoming events, dated from today so they stay upcoming. */
export function upcomingEvents(now: Date = new Date()): CommunityEvent[] {
  return [
    {
      id: 'evt-movie-night',
      title: { en: 'Family Movie Night', ar: 'ليلة سينما عائلية' },
      date: addDays(now, 2),
      from: '19:00',
      to: '22:00',
      venue: { en: 'Clubhouse – Grand Lounge', ar: 'النادي – القاعة الكبرى' },
      rsvp: 'going',
      icon: { set: 'material', name: 'movie-open-outline' },
      description: {
        en: 'A family film on the big screen, with popcorn and juice. Bring a blanket; seating is first come, first served.',
        ar: 'فيلم عائلي على الشاشة الكبيرة مع الفشار والعصير. أحضر بطانية؛ المقاعد حسب أسبقية الحضور.',
      },
    },
    {
      id: 'evt-yoga',
      title: { en: 'Morning Yoga Session', ar: 'جلسة يوغا صباحية' },
      date: addDays(now, 6),
      from: '08:00',
      to: '09:00',
      venue: { en: 'Central Garden', ar: 'الحديقة المركزية' },
      rsvp: 'open',
      icon: { set: 'material', name: 'meditation' },
      description: {
        en: 'An all-levels session led by a certified instructor. Mats are provided; arrive ten minutes early.',
        ar: 'جلسة لجميع المستويات يقودها مدرب معتمد. الحصائر متوفرة؛ احضر قبل الموعد بعشر دقائق.',
      },
    },
    {
      id: 'evt-gathering',
      title: { en: 'Community Gathering', ar: 'لقاء المجتمع' },
      date: addDays(now, 12),
      from: '18:00',
      to: '21:00',
      venue: { en: 'Rooftop Terrace', ar: 'تراس السطح' },
      rsvp: 'soon',
      icon: { set: 'ionicons', name: 'people-outline' },
      description: {
        en: 'Meet your neighbours over light bites and live music. Registration opens one week before.',
        ar: 'تعرّف على جيرانك مع وجبات خفيفة وموسيقى حيّة. يفتح التسجيل قبل أسبوع من الموعد.',
      },
    },
    // Behind "View All".
    {
      id: 'evt-kids-art',
      title: { en: 'Kids Art Workshop', ar: 'ورشة فنون للأطفال' },
      date: addDays(now, 18),
      from: '10:00',
      to: '12:00',
      venue: { en: 'Clubhouse – Studio', ar: 'النادي – الاستوديو' },
      rsvp: 'open',
      icon: { set: 'ionicons', name: 'color-palette-outline' },
      description: {
        en: 'Painting and crafts for ages 5 to 12. All materials are provided; a parent stays on site.',
        ar: 'رسم وحرف يدوية للأعمار من 5 إلى 12 عاماً. جميع المواد متوفرة؛ ويبقى أحد الوالدين في المكان.',
      },
    },
    {
      id: 'evt-charity-run',
      title: { en: 'Charity Fun Run', ar: 'سباق خيري' },
      date: addDays(now, 26),
      from: '07:00',
      to: '09:00',
      venue: { en: 'Community Loop', ar: 'مسار المجتمع' },
      rsvp: 'open',
      icon: { set: 'ionicons', name: 'walk-outline' },
      description: {
        en: 'A 5 km run or walk around the community. Every registration supports the children’s hospital.',
        ar: 'جري أو مشي لمسافة 5 كم حول المجتمع. كل تسجيل يدعم مستشفى الأطفال.',
      },
    },
  ];
}

/** `warning` is drawn in the alert colour, `info` in the accent. */
export type AlertLevel = 'warning' | 'info';

export interface CommunityAlert {
  id: string;
  level: AlertLevel;
  title: Text;
  body: Text;
  fullText: Text;
  postedAgo: Text;
  icon: Glyph;
}

export const communityAlerts: readonly CommunityAlert[] = [
  {
    id: 'alert-gate',
    level: 'warning',
    title: { en: 'Main Gate System Update', ar: 'تحديث نظام البوابة الرئيسية' },
    body: {
      en: 'A new access system goes live next week.',
      ar: 'يبدأ العمل بنظام دخول جديد الأسبوع القادم.',
    },
    fullText: {
      en: 'Residents’ cards keep working. Visitors need a QR pass from Visitor Access from that day on.',
      ar: 'تبقى بطاقات السكان فعّالة. يحتاج الزوّار إلى تصريح QR من خدمة دخول الزوّار اعتباراً من ذلك اليوم.',
    },
    postedAgo: { en: '3h ago', ar: 'قبل 3 ساعات' },
    icon: { set: 'material', name: 'boom-gate-outline' },
  },
  {
    id: 'alert-pool-hours',
    level: 'info',
    title: { en: 'Pool Schedule Adjustment', ar: 'تعديل مواعيد المسبح' },
    body: {
      en: 'Lap swimming hours updated to 6:00 AM – 10:00 AM.',
      ar: 'تم تعديل ساعات السباحة الطولية إلى 6:00 ص – 10:00 ص.',
    },
    fullText: {
      en: 'Two lanes stay reserved for lap swimming during those hours; open swim continues afterwards.',
      ar: 'تبقى حارتان مخصصتين للسباحة الطولية خلال هذه الساعات؛ وتستمر السباحة الحرة بعدها.',
    },
    postedAgo: { en: '1d ago', ar: 'قبل يوم' },
    icon: { set: 'material', name: 'pool' },
  },
  // Behind "View All".
  {
    id: 'alert-water',
    level: 'warning',
    title: { en: 'Water Supply Interruption', ar: 'انقطاع إمدادات المياه' },
    body: {
      en: 'Tower B, Thursday, 10:00 AM – 1:00 PM.',
      ar: 'البرج B، يوم الخميس، 10:00 ص – 1:00 م.',
    },
    fullText: {
      en: 'Tanks are being cleaned. Please store water in advance; supply returns gradually after 1:00 PM.',
      ar: 'يجري تنظيف الخزانات. يرجى تخزين المياه مسبقاً؛ وتعود الإمدادات تدريجياً بعد 1:00 م.',
    },
    postedAgo: { en: '2d ago', ar: 'قبل يومين' },
    icon: { set: 'ionicons', name: 'water-outline' },
  },
  {
    id: 'alert-garage',
    level: 'info',
    title: { en: 'Parking Garage Cleaning', ar: 'تنظيف موقف السيارات' },
    body: {
      en: 'Level P1 is cleaned on Saturday, 7:00 – 11:00 AM.',
      ar: 'يُنظَّف المستوى P1 يوم السبت، 7:00 – 11:00 ص.',
    },
    fullText: {
      en: 'Please move cars from P1 before 7:00 AM; level P2 is open to residents for those hours.',
      ar: 'يرجى نقل السيارات من P1 قبل 7:00 ص؛ والمستوى P2 متاح للسكان خلال هذه الساعات.',
    },
    postedAgo: { en: '4d ago', ar: 'قبل 4 أيام' },
    icon: { set: 'ionicons', name: 'car-outline' },
  },
];

export interface PollOption {
  id: string;
  label: Text;
  icon: Glyph;
  /** Votes so far, including the resident's own if `poll.myVote` names this option. */
  votes: number;
}

export interface Poll {
  id: string;
  options: readonly PollOption[];
  /** The option the resident voted for when the screen loaded, if any. */
  myVote?: string;
}

/** 340 / 110 / 50 of 500 votes: 68%, 22% and 10%. */
export const currentPoll: Poll = {
  id: 'poll-2026-q4',
  myVote: 'more-events',
  options: [
    {
      id: 'more-events',
      label: { en: 'More Community Events', ar: 'فعاليات مجتمعية أكثر' },
      icon: { set: 'ionicons', name: 'calendar-outline' },
      votes: 340,
    },
    {
      id: 'fitness',
      label: { en: 'Additional Fitness Classes', ar: 'حصص لياقة إضافية' },
      icon: { set: 'ionicons', name: 'barbell-outline' },
      votes: 110,
    },
    {
      id: 'kids',
      label: { en: 'Kids & Family Activities', ar: 'أنشطة للأطفال والعائلة' },
      icon: { set: 'material', name: 'human-male-female-child' },
      votes: 50,
    },
  ],
};

/** Each option's share of the vote, 0-1, with the resident's vote moved to `vote`. */
export function pollShares(poll: Poll, vote: string | undefined): Record<string, number> {
  const counts = poll.options.map((option) => {
    let votes = option.votes;
    if (option.id === poll.myVote) votes -= 1;
    if (option.id === vote) votes += 1;
    return { id: option.id, votes: Math.max(0, votes) };
  });
  const total = counts.reduce((sum, { votes }) => sum + votes, 0);
  return Object.fromEntries(counts.map(({ id, votes }) => [id, total > 0 ? votes / total : 0]));
}

export interface PastPoll {
  id: string;
  question: Text;
  /** ISO day the poll closed. */
  closedOn: string;
  options: readonly { id: string; label: Text; votes: number }[];
}

/** Closed polls and their results, behind the poll's "View All". */
export const pastPolls: readonly PastPoll[] = [
  {
    id: 'poll-2026-q3',
    question: {
      en: 'Which new amenity should we add first?',
      ar: 'ما المرفق الجديد الذي يجب إضافته أولاً؟',
    },
    closedOn: '2026-09-30',
    options: [
      { id: 'bbq', label: { en: 'BBQ Area', ar: 'منطقة الشواء' }, votes: 212 },
      { id: 'cowork', label: { en: 'Co-working Lounge', ar: 'صالة عمل مشتركة' }, votes: 168 },
      { id: 'pets', label: { en: 'Pet Park', ar: 'حديقة الحيوانات الأليفة' }, votes: 120 },
    ],
  },
  {
    id: 'poll-2026-q2',
    question: {
      en: 'When suits you best for community events?',
      ar: 'ما الوقت الأنسب لك لفعاليات المجتمع؟',
    },
    closedOn: '2026-06-30',
    options: [
      {
        id: 'weekend-evenings',
        label: { en: 'Weekend evenings', ar: 'أمسيات نهاية الأسبوع' },
        votes: 276,
      },
      {
        id: 'weekday-evenings',
        label: { en: 'Weekday evenings', ar: 'أمسيات أيام الأسبوع' },
        votes: 134,
      },
      {
        id: 'weekend-mornings',
        label: { en: 'Weekend mornings', ar: 'صباحات نهاية الأسبوع' },
        votes: 90,
      },
    ],
  },
];

const FEEDBACK_TOPICS: Localized<
  Record<'suggestion' | 'concern' | 'compliment' | 'other', string>
> = {
  en: { suggestion: 'Suggestion', concern: 'Concern', compliment: 'Compliment', other: 'Other' },
  ar: { suggestion: 'اقتراح', concern: 'ملاحظة', compliment: 'إشادة', other: 'أخرى' },
};

export function feedbackTopicOptions(locale: Locale): ListOption[] {
  return Object.entries(FEEDBACK_TOPICS[locale]).map(([id, label]) => ({ id, label }));
}

export function feedbackTopicLabel(id: string, locale: Locale): string {
  return (FEEDBACK_TOPICS[locale] as Record<string, string>)[id] ?? '';
}

/** A message needs at least this much to be worth sending. */
const MIN_FEEDBACK_LENGTH = 10;

export interface FeedbackForm {
  topic: string;
  message: string;
}

export type FeedbackErrors = Partial<Record<keyof FeedbackForm, string>>;

const FEEDBACK_ERRORS: Localized<Record<keyof FeedbackForm, string>> = {
  en: { topic: 'Choose a topic', message: 'Write a little more so we can act on it' },
  ar: { topic: 'اختر الموضوع', message: 'اكتب المزيد قليلاً حتى نتمكّن من التصرّف' },
};

/** Frontend checks only; the backend will validate again. */
export function validateFeedback(form: FeedbackForm, locale: Locale): FeedbackErrors {
  const errors: FeedbackErrors = {};
  if (!form.topic) errors.topic = FEEDBACK_ERRORS[locale].topic;
  if (form.message.trim().length < MIN_FEEDBACK_LENGTH)
    errors.message = FEEDBACK_ERRORS[locale].message;
  return errors;
}
