import type { Localized } from '@/context/LocaleContext';
import type { CallProblem, CallStatus } from '@/services/meet/MeetCall';

export const callRoomContent: Localized<{
  back: string;
  invite: string;
  people: (count: number, max: number) => string;
  status: Record<CallStatus, string>;
  joining: string;
  you: string;
  guest: string;
  screenOf: (name: string) => string;
  mute: string;
  unmute: string;
  cameraOff: string;
  cameraOn: string;
  flip: string;
  frontCamera: string;
  rearCamera: string;
  noOtherCamera: string;
  inviteCopied: string;
  leave: string;
  waiting: string;
  inviteSubject: string;
  inviteMessage: (formattedCode: string, link: string) => string;
  problems: Record<CallProblem, string>;
  unavailable: string;
  mediaDenied: string;
  openInBrowser: string;
  openSettings: string;
  backToLobby: string;
}> = {
  en: {
    back: 'Leave call',
    invite: 'Invite people',
    people: (count, max) => `${count} of ${max}`,
    status: {
      connecting: 'Connecting…',
      connected: 'Connected',
      reconnecting: 'Reconnecting…',
      failed: 'Connection failed',
      ended: 'Call ended',
    },
    joining: 'Joining the call…',
    you: 'You',
    guest: 'Guest',
    screenOf: (name) => `${name} — screen`,
    mute: 'Mute',
    unmute: 'Unmute',
    cameraOff: 'Camera off',
    cameraOn: 'Camera on',
    flip: 'Flip',
    frontCamera: 'Front camera',
    rearCamera: 'Rear camera',
    noOtherCamera: 'No other camera on this device',
    inviteCopied: 'Invite copied',
    leave: 'Leave',
    waiting: 'Waiting for others to join. Share the code to invite them.',
    inviteSubject: 'Join my video call',
    inviteMessage: (code, link) => `Join my Nama video call.\n\nCode: ${code}\n${link}`,
    problems: {
      takenOver: 'You joined this call on another device.',
      mediaFailed:
        'The media connection failed. A firewall may be blocking it; try another network.',
      connectFailed: 'Could not connect the call. Please try again.',
    },
    unavailable:
      'Video calls need the full Nama app build. You can join this call in your browser instead.',
    mediaDenied:
      'Nama needs the camera and microphone for video calls. Allow them in Settings, then try again.',
    openInBrowser: 'Open in browser',
    openSettings: 'Open Settings',
    backToLobby: 'Back',
  },
  ar: {
    back: 'مغادرة المكالمة',
    invite: 'دعوة أشخاص',
    people: (count, max) => `${count} من ${max}`,
    status: {
      connecting: 'جارٍ الاتصال…',
      connected: 'متصل',
      reconnecting: 'جارٍ إعادة الاتصال…',
      failed: 'فشل الاتصال',
      ended: 'انتهت المكالمة',
    },
    joining: 'جارٍ الانضمام إلى المكالمة…',
    you: 'أنت',
    guest: 'ضيف',
    screenOf: (name) => `شاشة ${name}`,
    mute: 'كتم',
    unmute: 'إلغاء الكتم',
    cameraOff: 'إيقاف الكاميرا',
    cameraOn: 'تشغيل الكاميرا',
    flip: 'تبديل',
    frontCamera: 'الكاميرا الأمامية',
    rearCamera: 'الكاميرا الخلفية',
    noOtherCamera: 'لا توجد كاميرا أخرى على هذا الجهاز',
    inviteCopied: 'تم نسخ الدعوة',
    leave: 'مغادرة',
    waiting: 'بانتظار انضمام الآخرين. شارك الرمز لدعوتهم.',
    inviteSubject: 'انضم إلى مكالمة الفيديو',
    inviteMessage: (code, link) => `انضم إلى مكالمة الفيديو على نماء.\n\nالرمز: ${code}\n${link}`,
    problems: {
      takenOver: 'انضممت إلى هذه المكالمة من جهاز آخر.',
      mediaFailed: 'فشل اتصال الوسائط. قد يكون جدار حماية يحجبه؛ جرّب شبكة أخرى.',
      connectFailed: 'تعذّر الاتصال بالمكالمة. حاول مرة أخرى.',
    },
    unavailable:
      'تحتاج مكالمات الفيديو إلى النسخة الكاملة من تطبيق نماء. يمكنك الانضمام إلى هذه المكالمة من المتصفح.',
    mediaDenied:
      'يحتاج نماء إلى الكاميرا والميكروفون لمكالمات الفيديو. اسمح بهما من الإعدادات ثم حاول مجدداً.',
    openInBrowser: 'فتح في المتصفح',
    openSettings: 'فتح الإعدادات',
    backToLobby: 'رجوع',
  },
};
