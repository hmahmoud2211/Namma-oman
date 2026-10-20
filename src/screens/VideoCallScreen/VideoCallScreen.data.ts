import type { Locale, Localized } from '@/context/LocaleContext';
import { MeetApiError } from '@/services/meet/meetApi';

export const videoCallContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  startTitle: string;
  startBody: string;
  startCta: string;
  inviteTitle: string;
  inviteBody: (maxParticipants: number) => string;
  codeLabel: string;
  share: string;
  whatsapp: string;
  email: string;
  enterCall: string;
  newCode: string;
  joinTitle: string;
  joinBody: string;
  codeField: string;
  codePlaceholder: string;
  joinCta: string;
  nameField: string;
  namePlaceholder: string;
  codeIncomplete: string;
  inviteSubject: string;
  inviteMessage: (formattedCode: string, link: string) => string;
  nativeUnavailable: string;
  browserUnsupported: string;
  inviteCopied: string;
  openInBrowser: string;
  roomStatus: (count: number) => string;
}> = {
  en: {
    overline: 'VIDEO CONFERENCE',
    title: 'Video Calls',
    subtitle: 'Start a call and share its code, or join one with a code.',
    startTitle: 'Start a call',
    startBody: 'Get a code to send by WhatsApp or email. Anyone with it can join.',
    startCta: 'Start a new call',
    inviteTitle: 'Your call is ready',
    inviteBody: (max) => `Share the code, then join. Up to ${max} people.`,
    codeLabel: 'Meeting code',
    share: 'Share',
    whatsapp: 'WhatsApp',
    email: 'Email',
    enterCall: 'Join now',
    newCode: 'New code',
    joinTitle: 'Join with a code',
    joinBody: 'Enter the 12-character code you were sent, or paste the invite link.',
    codeField: 'Meeting code',
    codePlaceholder: 'ABCD-EFGH-JKLM',
    joinCta: 'Join call',
    nameField: 'Your name in calls',
    namePlaceholder: 'Your name',
    codeIncomplete: 'A meeting code is 12 characters, like ABCD-EFGH-JKLM.',
    inviteSubject: 'Join my video call',
    inviteMessage: (code, link) => `Join my Nama video call.\n\nCode: ${code}\n${link}`,
    nativeUnavailable:
      'Video calls need the full Nama app build. Until then, calls open in your browser.',
    browserUnsupported:
      'This browser can’t make video calls. Open Nama over https in a current Chrome, Safari or Edge.',
    inviteCopied: 'Invite copied. Paste it anywhere to share.',
    openInBrowser: 'Open in browser',
    roomStatus: (count) =>
      count === 0 ? 'Call is ready to join' : `${count} already in this call`,
  },
  ar: {
    overline: 'مؤتمرات الفيديو',
    title: 'مكالمات الفيديو',
    subtitle: 'ابدأ مكالمة وشارك رمزها، أو انضم إلى مكالمة برمز.',
    startTitle: 'بدء مكالمة',
    startBody: 'احصل على رمز لإرساله عبر واتساب أو البريد. يمكن لأي شخص يملكه الانضمام.',
    startCta: 'بدء مكالمة جديدة',
    inviteTitle: 'مكالمتك جاهزة',
    inviteBody: (max) => `شارك الرمز ثم انضم. حتى ${max} أشخاص.`,
    codeLabel: 'رمز الاجتماع',
    share: 'مشاركة',
    whatsapp: 'واتساب',
    email: 'البريد',
    enterCall: 'انضم الآن',
    newCode: 'رمز جديد',
    joinTitle: 'الانضمام برمز',
    joinBody: 'أدخل الرمز المكوّن من 12 حرفاً الذي وصلك، أو الصق رابط الدعوة.',
    codeField: 'رمز الاجتماع',
    codePlaceholder: 'ABCD-EFGH-JKLM',
    joinCta: 'انضمام',
    nameField: 'اسمك في المكالمات',
    namePlaceholder: 'اسمك',
    codeIncomplete: 'رمز الاجتماع 12 حرفاً، مثل ABCD-EFGH-JKLM.',
    inviteSubject: 'انضم إلى مكالمة الفيديو',
    inviteMessage: (code, link) => `انضم إلى مكالمة الفيديو على نماء.\n\nالرمز: ${code}\n${link}`,
    nativeUnavailable:
      'تحتاج مكالمات الفيديو إلى النسخة الكاملة من تطبيق نماء. حتى ذلك الحين تُفتح المكالمات في المتصفح.',
    browserUnsupported:
      'لا يدعم هذا المتصفح مكالمات الفيديو. افتح نماء عبر https في إصدار حديث من Chrome أو Safari أو Edge.',
    inviteCopied: 'تم نسخ الدعوة. الصقها في أي مكان لمشاركتها.',
    openInBrowser: 'فتح في المتصفح',
    roomStatus: (count) =>
      count === 0 ? 'المكالمة جاهزة للانضمام' : `${count} في هذه المكالمة الآن`,
  },
};

const ERRORS: Localized<{
  offline: string;
  notFound: string;
  full: string;
  rateLimited: string;
  seatGone: string;
  generic: string;
}> = {
  en: {
    offline: 'Cannot reach the video call server. Check your connection.',
    notFound: 'No call with that code. It may have expired or already ended.',
    full: 'This call is full.',
    rateLimited: 'Too many attempts. Wait a minute and try again.',
    seatGone: 'Your place in the call was lost. Join again with the code.',
    generic: 'Something went wrong. Please try again.',
  },
  ar: {
    offline: 'تعذّر الوصول إلى خادم المكالمات. تحقّق من اتصالك.',
    notFound: 'لا توجد مكالمة بهذا الرمز. ربما انتهت صلاحيته أو انتهت المكالمة.',
    full: 'هذه المكالمة ممتلئة.',
    rateLimited: 'محاولات كثيرة. انتظر دقيقة ثم حاول مجدداً.',
    seatGone: 'فقدت مكانك في المكالمة. انضم مجدداً بالرمز.',
    generic: 'حدث خطأ ما. حاول مرة أخرى.',
  },
};

/** The server's errors (docs/API.md §5) in the resident's language. */
export function meetErrorMessage(error: unknown, locale: Locale) {
  const copy = ERRORS[locale];
  if (!(error instanceof MeetApiError)) return copy.generic;
  switch (error.status) {
    case 0:
      return copy.offline;
    case 404:
      return copy.notFound;
    case 409:
      return copy.full;
    case 410:
      return copy.seatGone;
    case 429:
      return copy.rateLimited;
    default:
      return copy.generic;
  }
}
