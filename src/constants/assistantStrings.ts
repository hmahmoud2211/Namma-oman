import type { Glyph } from '@/components/common/AppIcon';
import type { Localized } from '@/context/LocaleContext';
import type { VoiceError, VoicePhase } from '@/hooks/useVoiceSession';
import type { AssistantErrorKind } from '@/services/assistant/assistantApi';

/**
 * Copy for the assistant (screen and components). Suggestions ask one thing each: the
 * assistant answers a single topic per question (FRONTEND_INTEGRATION.md §7).
 */
export const assistantStrings: Localized<{
  overline: string;
  title: string;
  assistantName: string;
  greeting: (name: string | null) => string;
  headline: string;
  intro: string;
  talkToAssistant: string;
  chatMode: string;
  voiceMode: string;
  modeLabel: (mode: string) => string;
  composerPlaceholder: string;
  composerLabel: string;
  send: string;
  talkInstead: string;
  retry: string;
  emptyAnswer: string;
  typing: readonly string[];
  typingLabel: string;
  you: string;
  interrupted: string;
  yourRecords: string;
  buildingData: string;
  records: (count: number) => string;
  nothingFound: string;
  voiceIdleTitle: string;
  voiceIdleBody: string;
  voiceLanguageNote: string;
  voiceTryLabel: string;
  hintIdle: string;
  hintConnecting: string;
  hintListening: string;
  interruptHalfDuplex: string;
  interruptDuplex: string;
  startVoice: string;
  endVoice: string;
  interruptAssistant: string;
  start: string;
  end: string;
  camera: string;
  cameraOn: string;
  mute: string;
  unmute: string;
  cameraDenied: string;
  cameraStarting: string;
  switchCamera: string;
  offline: string;
  residentMenuTitle: string;
  newConversation: string;
  guest: string;
  guestName: string;
  notSignedIn: string;
  resident: (id: number) => string;
  answeringFor: (name: string) => string;
}> = {
  en: {
    overline: 'NAMA ASSISTANT',
    title: 'Assistant',
    assistantName: 'Nama Assistant',
    greeting: (name) => (name ? `Hi ${name},` : 'Hi there,'),
    headline: 'How can I help you today?',
    intro:
      'Ask about your unit, visitors, parking, the building or the weather, in Arabic or English.',
    talkToAssistant: 'Talk to the assistant',
    chatMode: 'Chat',
    voiceMode: 'Voice',
    modeLabel: (mode) => `${mode} mode`,
    composerPlaceholder: 'Ask about your unit, visitors, the building…',
    composerLabel: 'Message the assistant',
    send: 'Send',
    talkInstead: 'Talk instead',
    retry: 'Try again',
    emptyAnswer: 'I could not find an answer to that.',
    typing: ['Thinking', 'Checking the records', 'Putting it together', 'Almost there'],
    typingLabel: 'The assistant is answering',
    you: 'You',
    interrupted: 'interrupted',
    yourRecords: 'Your records',
    buildingData: 'Building data',
    records: (count) => `${count} ${count === 1 ? 'record' : 'records'}`,
    nothingFound: 'Nothing found',
    voiceIdleTitle: 'Talk to Nama',
    voiceIdleBody:
      'Tap start, then just speak. Turn the camera on and ask "what is this?" to show me something.',
    voiceLanguageNote: 'Replies are spoken in Arabic.',
    voiceTryLabel: 'Try saying',
    hintIdle: 'Tap the orb or Start to begin',
    hintConnecting: 'Setting up a secure line…',
    hintListening: "Go ahead, I'm listening",
    interruptHalfDuplex: 'Tap the orb to interrupt',
    interruptDuplex: 'Just start talking to interrupt',
    startVoice: 'Start voice chat',
    endVoice: 'End voice chat',
    interruptAssistant: 'Interrupt the assistant',
    start: 'Start',
    end: 'End',
    camera: 'Camera',
    cameraOn: 'Camera on',
    mute: 'Mute',
    unmute: 'Unmute',
    cameraDenied: 'Camera access is off. You can allow it in Settings.',
    cameraStarting: 'Starting…',
    switchCamera: 'Switch camera',
    offline: "Can't reach the assistant right now.",
    residentMenuTitle: 'Answer For',
    newConversation: 'New conversation',
    guest: 'Guest (not signed in)',
    guestName: 'Guest',
    notSignedIn: 'Not signed in',
    resident: (id) => `Resident ${id}`,
    answeringFor: (name) => `Answering for ${name}. Change resident`,
  },
  ar: {
    overline: 'مساعد نماء',
    title: 'المساعد',
    assistantName: 'مساعد نماء',
    greeting: (name) => (name ? `مرحباً ${name}،` : 'مرحباً،'),
    headline: 'كيف يمكنني مساعدتك اليوم؟',
    intro: 'اسأل عن وحدتك أو الزوّار أو المواقف أو المبنى أو الطقس، بالعربية أو الإنجليزية.',
    talkToAssistant: 'تحدّث مع المساعد',
    chatMode: 'دردشة',
    voiceMode: 'صوت',
    modeLabel: (mode) => `وضع ${mode}`,
    composerPlaceholder: 'اسأل عن وحدتك أو الزوّار أو المبنى…',
    composerLabel: 'راسل المساعد',
    send: 'إرسال',
    talkInstead: 'تحدّث بدلاً من ذلك',
    retry: 'حاول مجدداً',
    emptyAnswer: 'لم أجد إجابة عن ذلك.',
    typing: ['أفكّر', 'أراجع السجلات', 'أجمع الإجابة', 'اقتربت'],
    typingLabel: 'المساعد يجيب',
    you: 'أنت',
    interrupted: 'تمت المقاطعة',
    yourRecords: 'سجلاتك',
    buildingData: 'بيانات المبنى',
    records: (count) => `${count} ${count === 1 ? 'سجل' : 'سجلات'}`,
    nothingFound: 'لم يُعثر على شيء',
    voiceIdleTitle: 'تحدّث مع نماء',
    voiceIdleBody: 'اضغط ابدأ ثم تحدّث. شغّل الكاميرا واسأل "ما هذا؟" لتريني شيئاً.',
    voiceLanguageNote: 'تُنطق الردود باللغة العربية.',
    voiceTryLabel: 'جرّب أن تقول',
    hintIdle: 'اضغط على الكرة أو ابدأ للبدء',
    hintConnecting: 'جارٍ إعداد اتصال آمن…',
    hintListening: 'تفضّل، أنا أستمع',
    interruptHalfDuplex: 'اضغط على الكرة للمقاطعة',
    interruptDuplex: 'ابدأ بالكلام للمقاطعة',
    startVoice: 'بدء المحادثة الصوتية',
    endVoice: 'إنهاء المحادثة الصوتية',
    interruptAssistant: 'مقاطعة المساعد',
    start: 'ابدأ',
    end: 'إنهاء',
    camera: 'الكاميرا',
    cameraOn: 'الكاميرا تعمل',
    mute: 'كتم',
    unmute: 'إلغاء الكتم',
    cameraDenied: 'الوصول إلى الكاميرا متوقف. يمكنك السماح به من الإعدادات.',
    cameraStarting: 'جارٍ التشغيل…',
    switchCamera: 'تبديل الكاميرا',
    offline: 'تعذّر الوصول إلى المساعد حالياً.',
    residentMenuTitle: 'الإجابة لـ',
    newConversation: 'محادثة جديدة',
    guest: 'ضيف (غير مسجّل)',
    guestName: 'ضيف',
    notSignedIn: 'غير مسجّل',
    resident: (id) => `الساكن ${id}`,
    answeringFor: (name) => `يجيب لـ ${name}. تغيير الساكن`,
  },
};

/** Why a chat reply failed, in the resident's language. */
export const chatFailureText: Localized<Record<AssistantErrorKind | 'unknown', string>> = {
  en: {
    network: "I couldn't reach the assistant. Check your connection and try again.",
    timeout: 'That took longer than expected. Please try again.',
    not_found: "Your resident profile wasn't found. Try choosing a resident again.",
    validation: "That request couldn't be processed. Please rephrase and try again.",
    server: 'The assistant ran into a problem. Please try again in a moment.',
    aborted: 'Request cancelled.',
    unknown: 'Something went wrong. Please try again.',
  },
  ar: {
    network: 'تعذّر الوصول إلى المساعد. تحقّق من اتصالك وحاول مجدداً.',
    timeout: 'استغرق الأمر وقتاً أطول من المتوقع. يرجى المحاولة مجدداً.',
    not_found: 'لم يُعثر على ملف الساكن. جرّب اختيار الساكن مجدداً.',
    validation: 'تعذّرت معالجة الطلب. يرجى إعادة الصياغة والمحاولة مجدداً.',
    server: 'واجه المساعد مشكلة. يرجى المحاولة بعد قليل.',
    aborted: 'تم إلغاء الطلب.',
    unknown: 'حدث خطأ. يرجى المحاولة مجدداً.',
  },
};

/** Why a voice call failed, in the resident's language. */
export function voiceErrorText(error: VoiceError | null, locale: 'en' | 'ar'): string {
  const text: Record<VoiceError['code'] | 'generic', string> =
    locale === 'ar'
      ? {
          'mic-denied': 'اسمح بالوصول إلى الميكروفون للتحدث مع المساعد.',
          'mic-failed': 'تعذّر تشغيل الميكروفون. أغلق التطبيقات الأخرى التي تستخدمه وحاول مجدداً.',
          auth: 'تعذّر التحقق من هذا الحساب للمحادثة الصوتية.',
          unavailable: 'المحادثة الصوتية غير متاحة على الخادم حالياً.',
          dropped: 'انقطع الاتصال. تحقّق من الإنترنت وحاول مجدداً.',
          closed: 'أُغلق الاتصال الصوتي بشكل غير متوقع.',
          generic: 'حدث خطأ. اضغط ابدأ للمحاولة مجدداً.',
        }
      : {
          'mic-denied': 'Allow microphone access to talk to the assistant.',
          'mic-failed':
            'The microphone could not be started. Close other apps using it and try again.',
          auth: 'This account could not be verified for voice.',
          unavailable: 'Voice is unavailable on the server right now.',
          dropped: 'The connection dropped. Check your internet and try again.',
          closed: 'The voice connection closed unexpectedly.',
          generic: 'Something went wrong. Tap start to try again.',
        };
  if (!error) return text.generic;
  // The server's own reason is the most precise one for a refused account.
  if (error.code === 'auth' && error.detail) return error.detail;
  return text[error.code];
}

/** What the voice session is doing, for the status pill. */
export function voiceStatusLabel(
  phase: VoicePhase,
  queryFn: string | null,
  muted: boolean,
  locale: 'en' | 'ar',
): string {
  const ar = locale === 'ar';
  switch (phase) {
    case 'idle':
      return ar ? 'جاهز' : 'Ready';
    case 'connecting':
      return ar ? 'جارٍ الاتصال' : 'Connecting';
    case 'listening':
      return muted ? (ar ? 'مكتوم' : 'Muted') : ar ? 'يستمع' : 'Listening';
    case 'hearing':
      return ar ? 'يسمعك' : 'Hearing you';
    case 'thinking':
      return ar ? 'يفكّر' : 'Thinking';
    case 'searching':
      return queryFn === 'query_resident_services'
        ? ar
          ? 'يراجع سجلاتك'
          : 'Checking your records'
        : ar
          ? 'يراجع بيانات المبنى'
          : 'Checking building data';
    case 'looking':
      return ar ? 'ينظر' : 'Looking';
    case 'speaking':
      return ar ? 'يتحدث' : 'Speaking';
    case 'error':
      return ar ? 'غير متصل' : 'Disconnected';
  }
}

export interface Suggestion {
  id: string;
  /** Asks one thing: the assistant answers one topic per question. */
  text: Localized<string>;
  icon: Glyph;
}

export const chatSuggestions: readonly Suggestion[] = [
  {
    id: 'installment',
    text: { en: 'When is my next installment?', ar: 'متى القسط القادم؟' },
    icon: { set: 'ionicons', name: 'wallet-outline' },
  },
  {
    id: 'visitors',
    text: { en: 'Do I have visitors today?', ar: 'هل لدي زوّار اليوم؟' },
    icon: { set: 'ionicons', name: 'people-outline' },
  },
  {
    id: 'parking',
    text: { en: 'Where is my parking slot?', ar: 'أين موقف سيارتي؟' },
    icon: { set: 'ionicons', name: 'car-outline' },
  },
  {
    id: 'alarms',
    text: { en: 'Any active alarms in the building?', ar: 'هل توجد إنذارات نشطة في المبنى؟' },
    icon: { set: 'ionicons', name: 'notifications-outline' },
  },
];

/** Spoken examples on the idle voice screen (as in Parklane: either language works). */
export const voiceExamples: readonly string[] = [
  'ما حالة المولّد؟',
  'Any alarms right now?',
  'متى القسط القادم؟',
];
