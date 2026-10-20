import type { Glyph } from '@/components/common/AppIcon';
import type { Locale, Localized } from '@/context/LocaleContext';
import type { AnswerSummary } from '@/services/assistant/assistant.types';
import type { ParamlessRoute } from '@/types/navigation.types';
import { formatTime } from '@/utils/date';

export interface IntentMeta {
  label: string;
  icon: Glyph;
  /** The app screen covering the same topic, offered as a shortcut. */
  route?: Exclude<ParamlessRoute, 'Assistant'>;
}

const ion = (name: string): Glyph => ({ set: 'ionicons', name });

/**
 * `summary.intent` is stable (FRONTEND_INTEGRATION.md §4.3); unknown ones fall back. Topics
 * with a screen in this app link to it, so a spoken or typed answer leads on to the module.
 */
const INTENTS: Record<
  string,
  { label: Localized<string>; icon: Glyph; route?: IntentMeta['route'] }
> = {
  building_overview: { label: { en: 'Building', ar: 'المبنى' }, icon: ion('business-outline') },
  alarms: { label: { en: 'Alarms', ar: 'الإنذارات' }, icon: ion('notifications-outline') },
  device_status: {
    label: { en: 'Systems', ar: 'الأنظمة' },
    icon: ion('hardware-chip-outline'),
    route: 'SmartHome',
  },
  energy: { label: { en: 'Energy', ar: 'الطاقة' }, icon: ion('flash-outline'), route: 'SmartHome' },
  resident_profile: {
    label: { en: 'Profile', ar: 'الملف الشخصي' },
    icon: ion('person-circle-outline'),
  },
  unit_finance: {
    label: { en: 'Payments', ar: 'المدفوعات' },
    icon: ion('wallet-outline'),
    route: 'FinancialOverview',
  },
  parking: { label: { en: 'Parking', ar: 'المواقف' }, icon: ion('car-outline'), route: 'Parking' },
  visitors: {
    label: { en: 'Visitors', ar: 'الزوّار' },
    icon: ion('people-outline'),
    route: 'VisitorAccess',
  },
  maintenance: {
    label: { en: 'Maintenance', ar: 'الصيانة' },
    icon: ion('construct-outline'),
    route: 'Maintenance',
  },
  community: {
    label: { en: 'Community', ar: 'المجتمع' },
    icon: ion('megaphone-outline'),
    route: 'Community',
  },
  weather: { label: { en: 'Weather', ar: 'الطقس' }, icon: ion('partly-sunny-outline') },
  general_knowledge: { label: { en: 'General', ar: 'عام' }, icon: ion('sparkles-outline') },
};

export function intentMeta(intent: unknown, locale: Locale): IntentMeta | null {
  const meta = typeof intent === 'string' ? INTENTS[intent] : undefined;
  return meta ? { label: meta.label[locale], icon: meta.icon, route: meta.route } : null;
}

export type InsightTone = 'info' | 'warning' | 'error';

export interface Insight {
  id: string;
  tone: InsightTone;
  icon: Glyph;
  label: string;
  /** `sign-in` opens the resident picker. */
  action?: 'sign-in';
}

const MONTHS: Localized<readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
};

/** "Sep 20, 04:40 PM", in the reading's own wall-clock time (as the backend wrote it). */
export function formatReadingTime(iso: string | undefined, locale: Locale): string | null {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(iso) : null;
  if (!match) {
    return null;
  }
  const [, , month, day, hour, minute] = match;
  const date =
    locale === 'ar'
      ? `${Number(day)} ${MONTHS.ar[Number(month) - 1] ?? month}`
      : `${MONTHS.en[Number(month) - 1] ?? month} ${Number(day)}`;
  return hour === undefined ? date : `${date}, ${formatTime(`${hour}:${minute}`, locale)}`;
}

const LABELS: Localized<{
  signIn: string;
  updated: (when: string) => string;
  stale: string;
  inexact: (period: string) => string;
  future: string;
  unreachable: string;
}> = {
  en: {
    signIn: 'Choose a resident to see your details',
    updated: (when) => `Last updated ${when}`,
    stale: 'Readings may be out of date',
    inexact: (period) => `Showing ${period} instead`,
    future: "That period hasn't happened yet",
    unreachable: 'Building data is unreachable',
  },
  ar: {
    signIn: 'اختر ساكناً لعرض بياناتك',
    updated: (when) => `آخر تحديث ${when}`,
    stale: 'قد تكون القراءات قديمة',
    inexact: (period) => `يُعرض ${period} بدلاً من ذلك`,
    future: 'هذه الفترة لم تأتِ بعد',
    unreachable: 'تعذّر الوصول إلى بيانات المبنى',
  },
};

/** Badges for the flags a reply carries. The answer already says this; badges make it scannable. */
export function insightsFor(summary: AnswerSummary | undefined, locale: Locale): Insight[] {
  if (!summary) {
    return [];
  }
  const labels = LABELS[locale];
  const insights: Insight[] = [];

  if (summary.resident_required) {
    insights.push({
      id: 'sign-in',
      tone: 'info',
      icon: ion('log-in-outline'),
      label: labels.signIn,
      action: 'sign-in',
    });
  }

  const staleDevice = summary.devices?.find((device) => device.possibly_offline);
  if (summary.possibly_offline || staleDevice) {
    const when = formatReadingTime(
      summary.latest_data_timestamp ?? staleDevice?.latest_data_timestamp,
      locale,
    );
    insights.push({
      id: 'offline',
      tone: 'warning',
      icon: ion('cloud-offline-outline'),
      label: when ? labels.updated(when) : labels.stale,
    });
  }

  if (summary.is_exact === false && summary.data_period) {
    insights.push({
      id: 'inexact',
      tone: 'info',
      icon: ion('calendar-outline'),
      label: labels.inexact(summary.data_period),
    });
  }

  if (summary.is_future) {
    insights.push({ id: 'future', tone: 'info', icon: ion('time-outline'), label: labels.future });
  }

  if (summary.error) {
    insights.push({
      id: 'error',
      tone: 'error',
      icon: ion('warning-outline'),
      label: labels.unreachable,
    });
  }

  return insights;
}
