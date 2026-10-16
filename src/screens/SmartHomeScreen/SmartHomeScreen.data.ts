import type { Glyph } from '@/components/common/AppIcon';
import type { Locale, Localized } from '@/context/LocaleContext';
import type { CubeFailure } from '@/hooks/useCubeDevices';

/**
 * Smart Home, migrated from the Parklane app: controls for the unit's lights, AC, curtains
 * and TV, scenes, live energy use, the unit's devices and automations. Devices come from the
 * unit's eWeLink CUBE hub when it answers; everything else is sample data shaped like an API
 * response, so a backend can replace this module rather than the screen.
 */

type Text = Localized<string>;

export const smartHomeContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  viewAll: string;
  showLess: string;
  scenesTitle: string;
  scenesSubtitle: string;
  energyTitle: string;
  energySubtitle: string;
  energyByRoom: string;
  today: string;
  vsYesterday: string;
  trendDown: string;
  trendUp: string;
  devicesTitle: string;
  devicesSubtitle: string;
  automationTitle: string;
  automationSubtitle: string;
  online: string;
  offline: string;
  brightness: string;
  customColour: string;
  lowerTemperature: string;
  raiseTemperature: string;
  degrees: (value: number) => string;
  fanSpeed: (level: number) => string;
  mode: (mode: string) => string;
  switchesTo: (mode: string) => string;
  curtains: (action: string) => string;
}> = {
  en: {
    overline: 'SMART LIVING',
    title: 'Smart Home',
    subtitle: 'Control the lights, climate and devices in your unit.',
    viewAll: 'View All',
    showLess: 'Show Less',
    scenesTitle: 'Scenes',
    scenesSubtitle: 'One tap for the perfect atmosphere.',
    energyTitle: 'Energy Usage',
    energySubtitle: 'Live monitoring for a smarter home.',
    energyByRoom: 'By Room',
    today: 'Today',
    vsYesterday: 'vs. yesterday',
    trendDown: 'down',
    trendUp: 'up',
    devicesTitle: 'Smart Devices',
    devicesSubtitle: 'Manage all your connected devices.',
    automationTitle: 'Device Automation',
    automationSubtitle: 'Make your home work for you.',
    online: 'Online',
    offline: 'Offline',
    brightness: 'Brightness',
    customColour: 'Custom colour',
    lowerTemperature: 'Lower temperature',
    raiseTemperature: 'Raise temperature',
    degrees: (value) => `${value} degrees`,
    fanSpeed: (level) => `Fan speed ${level}`,
    mode: (mode) => `Mode, ${mode}`,
    switchesTo: (mode) => `Switches to ${mode}`,
    curtains: (action) => `${action} curtains`,
  },
  ar: {
    overline: 'الحياة الذكية',
    title: 'المنزل الذكي',
    subtitle: 'تحكّم في الإضاءة والتكييف والأجهزة في وحدتك.',
    viewAll: 'عرض الكل',
    showLess: 'عرض أقل',
    scenesTitle: 'الأجواء',
    scenesSubtitle: 'لمسة واحدة لأجواء مثالية.',
    energyTitle: 'استهلاك الطاقة',
    energySubtitle: 'مراقبة مباشرة لمنزل أذكى.',
    energyByRoom: 'حسب الغرفة',
    today: 'اليوم',
    vsYesterday: 'مقارنة بالأمس',
    trendDown: 'أقل',
    trendUp: 'أكثر',
    devicesTitle: 'الأجهزة الذكية',
    devicesSubtitle: 'أدِر جميع أجهزتك المتصلة.',
    automationTitle: 'أتمتة الأجهزة',
    automationSubtitle: 'اجعل منزلك يعمل من أجلك.',
    online: 'متصل',
    offline: 'غير متصل',
    brightness: 'السطوع',
    customColour: 'لون مخصّص',
    lowerTemperature: 'خفض درجة الحرارة',
    raiseTemperature: 'رفع درجة الحرارة',
    degrees: (value) => `${value} درجة`,
    fanSpeed: (level) => `سرعة المروحة ${level}`,
    mode: (mode) => `الوضع، ${mode}`,
    switchesTo: (mode) => `يتحوّل إلى ${mode}`,
    curtains: (action) => `${action} الستائر`,
  },
};

export interface Room {
  id: string;
  label: Text;
  icon: Glyph;
}

export const rooms: readonly Room[] = [
  {
    id: 'living',
    label: { en: 'Living Room', ar: 'غرفة المعيشة' },
    icon: { set: 'material', name: 'sofa-outline' },
  },
  {
    id: 'master',
    label: { en: 'Master Bedroom', ar: 'غرفة النوم الرئيسية' },
    icon: { set: 'material', name: 'bed-king-outline' },
  },
  {
    id: 'bedroom-2',
    label: { en: 'Bedroom 2', ar: 'غرفة النوم 2' },
    icon: { set: 'material', name: 'bed-outline' },
  },
  {
    id: 'bedroom-3',
    label: { en: 'Bedroom 3', ar: 'غرفة النوم 3' },
    icon: { set: 'material', name: 'bed-outline' },
  },
  {
    id: 'kitchen',
    label: { en: 'Kitchen', ar: 'المطبخ' },
    icon: { set: 'material', name: 'pot-steam-outline' },
  },
];

/** Which theme colour a card's icon takes: warm for lights, cool for the AC. */
export type IconTone = 'warm' | 'cool' | 'plain';

/** The four control cards share a heading: icon, title, supporting line and switch. */
export interface ControlCardInfo {
  title: Text;
  subtitle: Text;
  icon: Glyph;
  tone: IconTone;
}

export const lightingCard: ControlCardInfo = {
  title: { en: 'Lighting', ar: 'الإضاءة' },
  subtitle: { en: 'Adjust brightness and color', ar: 'اضبط السطوع واللون' },
  icon: { set: 'material', name: 'lightbulb-on-outline' },
  tone: 'warm',
};

export const acCard: ControlCardInfo = {
  title: { en: 'AC', ar: 'التكييف' },
  subtitle: { en: 'Set your comfort temperature', ar: 'اختر درجة الحرارة المريحة' },
  icon: { set: 'material', name: 'snowflake' },
  tone: 'cool',
};

export const curtainsCard: ControlCardInfo = {
  title: { en: 'Curtains', ar: 'الستائر' },
  subtitle: { en: 'Open or close curtains', ar: 'افتح الستائر أو أغلقها' },
  icon: { set: 'material', name: 'curtains' },
  tone: 'warm',
};

export const mediaCard: ControlCardInfo = {
  title: { en: 'TV & Media', ar: 'التلفاز والوسائط' },
  subtitle: { en: 'Control your entertainment', ar: 'تحكّم في وسائل الترفيه' },
  icon: { set: 'material', name: 'monitor' },
  tone: 'plain',
};

export type BulbPreset = 'warm' | 'amber' | 'daylight' | 'blue' | 'violet';

export const lighting = {
  /** 0-1. */
  brightness: 0.7,
  /** Screen-reader swipes move it by this much. */
  brightnessStep: 0.1,
  presets: [
    { id: 'warm', label: { en: 'Warm white', ar: 'أبيض دافئ' } },
    { id: 'amber', label: { en: 'Amber', ar: 'كهرماني' } },
    { id: 'daylight', label: { en: 'Daylight', ar: 'ضوء النهار' } },
    { id: 'blue', label: { en: 'Blue', ar: 'أزرق' } },
    { id: 'violet', label: { en: 'Violet', ar: 'بنفسجي' } },
  ] satisfies readonly { id: BulbPreset; label: Text }[],
} as const;

export type AcMode = 'auto' | 'cool' | 'dry' | 'fan';

export const acModeLabels: Localized<Record<AcMode, string>> = {
  en: { auto: 'Auto', cool: 'Cool', dry: 'Dry', fan: 'Fan' },
  ar: { auto: 'تلقائي', cool: 'تبريد', dry: 'تجفيف', fan: 'مروحة' },
};

export const climate = {
  temperature: 24,
  minTemperature: 16,
  maxTemperature: 30,
  /** Fan speed, 1 to `fanLevels`. */
  fanSpeed: 4,
  fanLevels: 7,
  modes: ['auto', 'cool', 'dry', 'fan'] satisfies readonly AcMode[],
} as const;

export type CurtainAction = 'open' | 'pause' | 'close';

export const curtainActions: readonly { id: CurtainAction; label: Text; icon: Glyph }[] = [
  { id: 'open', label: { en: 'Open', ar: 'فتح' }, icon: { set: 'material', name: 'curtains' } },
  { id: 'pause', label: { en: 'Pause', ar: 'إيقاف' }, icon: { set: 'ionicons', name: 'pause' } },
  {
    id: 'close',
    label: { en: 'Close', ar: 'إغلاق' },
    icon: { set: 'material', name: 'curtains-closed' },
  },
];

/** Streaming apps and the app drawer, drawn as glyphs (the brands' own marks aren't bundled). */
export const mediaSources: readonly { id: string; label: Text; icon: Glyph }[] = [
  {
    id: 'netflix',
    label: { en: 'Netflix', ar: 'نتفليكس' },
    icon: { set: 'material', name: 'netflix' },
  },
  {
    id: 'youtube',
    label: { en: 'YouTube', ar: 'يوتيوب' },
    icon: { set: 'material', name: 'youtube' },
  },
  {
    id: 'disney',
    label: { en: 'Disney+', ar: 'ديزني+' },
    icon: { set: 'material', name: 'movie-star-outline' },
  },
  {
    id: 'apps',
    label: { en: 'Apps', ar: 'التطبيقات' },
    icon: { set: 'ionicons', name: 'grid-outline' },
  },
];

/** How many items each panel shows before "View All" opens the rest in place. */
export const previewCounts = {
  scenes: 4,
  devices: 4,
  automations: 3,
} as const;

export interface Scene {
  id: string;
  label: Text;
  icon: Glyph;
}

export const scenes: readonly Scene[] = [
  {
    id: 'welcome',
    label: { en: 'Welcome Home', ar: 'أهلاً بالعودة' },
    icon: { set: 'ionicons', name: 'home-outline' },
  },
  {
    id: 'relax',
    label: { en: 'Relax', ar: 'استرخاء' },
    icon: { set: 'ionicons', name: 'leaf-outline' },
  },
  {
    id: 'movie',
    label: { en: 'Movie Night', ar: 'ليلة سينما' },
    icon: { set: 'material', name: 'movie-open-play-outline' },
  },
  {
    id: 'night',
    label: { en: 'Good Night', ar: 'تصبح على خير' },
    icon: { set: 'ionicons', name: 'moon-outline' },
  },
  // Behind "View All".
  {
    id: 'morning',
    label: { en: 'Good Morning', ar: 'صباح الخير' },
    icon: { set: 'ionicons', name: 'sunny-outline' },
  },
  {
    id: 'dinner',
    label: { en: 'Dinner', ar: 'العشاء' },
    icon: { set: 'ionicons', name: 'restaurant-outline' },
  },
  {
    id: 'reading',
    label: { en: 'Reading', ar: 'القراءة' },
    icon: { set: 'ionicons', name: 'book-outline' },
  },
  {
    id: 'away',
    label: { en: 'Away', ar: 'خارج المنزل' },
    icon: { set: 'ionicons', name: 'airplane-outline' },
  },
];

/** The scene running when the screen opens. */
export const activeSceneId = 'welcome';

export interface EnergyRow {
  id: string;
  label: Text;
  kwh: number;
  icon: Glyph;
  tone: IconTone;
}

export const energy = {
  todayKwh: 12.4,
  /** The gauge fills against this daily figure. */
  dailyBudgetKwh: 28,
  /** Change on yesterday, in percent; negative is a saving. */
  changePercent: -12,
  breakdown: [
    {
      id: 'lighting',
      label: { en: 'Lighting', ar: 'الإضاءة' },
      kwh: 4.1,
      icon: { set: 'material', name: 'lightbulb-on-outline' },
      tone: 'warm',
    },
    {
      id: 'ac',
      label: { en: 'AC', ar: 'التكييف' },
      kwh: 5.6,
      icon: { set: 'material', name: 'snowflake' },
      tone: 'cool',
    },
    {
      id: 'media',
      label: { en: 'TV & Media', ar: 'التلفاز والوسائط' },
      kwh: 1.8,
      icon: { set: 'material', name: 'monitor' },
      tone: 'plain',
    },
    {
      id: 'other',
      label: { en: 'Other', ar: 'أخرى' },
      kwh: 0.9,
      icon: { set: 'material', name: 'power-socket-eu' },
      tone: 'plain',
    },
  ] satisfies readonly EnergyRow[],
  /** Today's use per room, behind "View All". Sums to `todayKwh`, as the breakdown does. */
  byRoom: [
    { roomId: 'living', kwh: 4.2 },
    { roomId: 'master', kwh: 3.1 },
    { roomId: 'bedroom-2', kwh: 1.6 },
    { roomId: 'bedroom-3', kwh: 1.3 },
    { roomId: 'kitchen', kwh: 2.2 },
  ] satisfies readonly { roomId: Room['id']; kwh: number }[],
} as const;

const KWH: Localized<string> = { en: 'kWh', ar: 'ك.و.س' };

/** "12.4 kWh" / "12.4 ك.و.س". */
export function formatKwh(kwh: number, locale: Locale): string {
  return `${kwh.toFixed(1)} ${KWH[locale]}`;
}

export interface SmartDevice {
  id: string;
  name: Text;
  location: Text;
  online: boolean;
  enabled: boolean;
  icon: Glyph;
}

/** Shown while the unit's hub can't be reached. */
export const sampleDevices: readonly SmartDevice[] = [
  {
    id: 'lock',
    name: { en: 'Smart Lock', ar: 'القفل الذكي' },
    location: { en: 'Front Door', ar: 'الباب الأمامي' },
    online: true,
    enabled: true,
    icon: { set: 'ionicons', name: 'lock-closed-outline' },
  },
  {
    id: 'camera',
    name: { en: 'Security Camera', ar: 'كاميرا المراقبة' },
    location: { en: 'Living Room', ar: 'غرفة المعيشة' },
    online: true,
    enabled: true,
    icon: { set: 'material', name: 'cctv' },
  },
  {
    id: 'speaker',
    name: { en: 'Smart Speaker', ar: 'السماعة الذكية' },
    location: { en: 'Living Room', ar: 'غرفة المعيشة' },
    online: true,
    enabled: true,
    icon: { set: 'material', name: 'speaker' },
  },
  {
    id: 'motion',
    name: { en: 'Motion Sensor', ar: 'حسّاس الحركة' },
    location: { en: 'Corridor', ar: 'الممر' },
    online: true,
    enabled: true,
    icon: { set: 'material', name: 'access-point' },
  },
  // Behind "View All".
  {
    id: 'doorbell',
    name: { en: 'Video Doorbell', ar: 'جرس الباب المرئي' },
    location: { en: 'Front Door', ar: 'الباب الأمامي' },
    online: true,
    enabled: true,
    icon: { set: 'material', name: 'doorbell-video' },
  },
  {
    id: 'thermostat',
    name: { en: 'Thermostat', ar: 'منظّم الحرارة' },
    location: { en: 'Master Bedroom', ar: 'غرفة النوم الرئيسية' },
    online: true,
    enabled: true,
    icon: { set: 'material', name: 'thermostat' },
  },
  {
    id: 'smoke',
    name: { en: 'Smoke Detector', ar: 'كاشف الدخان' },
    location: { en: 'Kitchen', ar: 'المطبخ' },
    online: true,
    enabled: true,
    icon: { set: 'material', name: 'smoke-detector-variant' },
  },
  {
    id: 'window',
    name: { en: 'Window Sensor', ar: 'حسّاس النافذة' },
    location: { en: 'Bedroom 2', ar: 'غرفة النوم 2' },
    online: false,
    enabled: false,
    icon: { set: 'material', name: 'window-closed-variant' },
  },
];

/**
 * The badge for a device on the eWeLink CUBE hub, by its `display_category` (Open API
 * "Supported Device Type"). Anything else falls back to `chip`.
 */
export const cubeCategoryGlyphs: Record<string, Glyph> = {
  plug: { set: 'material', name: 'power-plug-outline' },
  switch: { set: 'material', name: 'toggle-switch-outline' },
  light: { set: 'material', name: 'lightbulb-on-outline' },
  curtain: { set: 'material', name: 'curtains' },
  contactSensor: { set: 'material', name: 'window-closed-variant' },
  motionSensor: { set: 'material', name: 'motion-sensor' },
  temperatureSensor: { set: 'material', name: 'thermometer' },
  humiditySensor: { set: 'material', name: 'water-percent' },
  temperatureAndHumiditySensor: { set: 'material', name: 'thermometer-water' },
  waterLeakDetector: { set: 'material', name: 'water-alert-outline' },
  smokeDetector: { set: 'material', name: 'smoke-detector-variant' },
  button: { set: 'material', name: 'gesture-tap-button' },
  camera: { set: 'material', name: 'cctv' },
  fanLight: { set: 'material', name: 'ceiling-fan-light' },
  airConditioner: { set: 'material', name: 'snowflake' },
  fan: { set: 'material', name: 'fan' },
  thermostat: { set: 'material', name: 'thermostat' },
  chip: { set: 'material', name: 'chip' },
};

/** The "+" in the Smart Devices heading, the sheet it opens, and the hub's status lines. */
export const addDeviceContent: Localized<{
  buttonLabel: string;
  title: string;
  subtitle: string;
  hubConnecting: string;
  hubUnreachable: string;
  noDevices: string;
  zigbeeTitle: string;
  zigbeeBody: string;
  zigbeeStart: string;
  zigbeeStop: (countdown: string) => string;
  zigbeeSearching: string;
  zigbeeFound: (count: number) => string;
  cameraTitle: string;
  cameraBody: string;
  cameraName: string;
  cameraNamePlaceholder: string;
  cameraUrl: string;
  cameraUrlPlaceholder: string;
  cameraAdd: string;
  cameraAdded: string;
  cameraNameMissing: string;
  cameraUrlInvalid: string;
  wifiTitle: string;
  wifiBody: string;
  wifiOpen: string;
}> = {
  en: {
    buttonLabel: 'Add a device',
    title: 'Add Device',
    subtitle: 'Connect a device to your home hub.',
    hubConnecting: 'Connecting to your home hub…',
    hubUnreachable: 'Home hub not reachable. Showing sample devices.',
    noDevices: 'No devices on your hub yet. Tap + to add one.',
    zigbeeTitle: 'Zigbee device',
    zigbeeBody: 'Sensors, switches, plugs and bulbs that pair with the hub.',
    zigbeeStart: 'Start Pairing',
    zigbeeStop: (countdown) => `Stop Pairing (${countdown})`,
    zigbeeSearching: 'Searching… put the device in pairing mode now.',
    zigbeeFound: (count) => `${count} new device${count === 1 ? '' : 's'} added.`,
    cameraTitle: 'Camera',
    cameraBody: 'An RTSP or ESP32 camera on your network.',
    cameraName: 'Name',
    cameraNamePlaceholder: 'e.g. Balcony Camera',
    cameraUrl: 'Stream address',
    cameraUrlPlaceholder: 'rtsp://user:pass@192.168.1.50:554/stream1',
    cameraAdd: 'Add Camera',
    cameraAdded: 'Camera added.',
    cameraNameMissing: 'Give the camera a name.',
    cameraUrlInvalid: 'Use an address starting rtsp:// or http://',
    wifiTitle: 'eWeLink Wi-Fi device',
    wifiBody: 'Wi-Fi devices are linked from your eWeLink account in the hub console.',
    wifiOpen: 'Open Hub Console',
  },
  ar: {
    buttonLabel: 'إضافة جهاز',
    title: 'إضافة جهاز',
    subtitle: 'اربط جهازاً بمحور منزلك.',
    hubConnecting: 'جارٍ الاتصال بمحور منزلك…',
    hubUnreachable: 'تعذّر الوصول إلى محور المنزل. تُعرض أجهزة تجريبية.',
    noDevices: 'لا توجد أجهزة على المحور بعد. اضغط + لإضافة جهاز.',
    zigbeeTitle: 'جهاز Zigbee',
    zigbeeBody: 'حسّاسات ومفاتيح ومقابس ومصابيح تقترن بالمحور.',
    zigbeeStart: 'بدء الاقتران',
    zigbeeStop: (countdown) => `إيقاف الاقتران (${countdown})`,
    zigbeeSearching: 'جارٍ البحث… ضع الجهاز في وضع الاقتران الآن.',
    zigbeeFound: (count) => `تمت إضافة ${count} ${count === 1 ? 'جهاز جديد' : 'أجهزة جديدة'}.`,
    cameraTitle: 'كاميرا',
    cameraBody: 'كاميرا RTSP أو ESP32 على شبكتك.',
    cameraName: 'الاسم',
    cameraNamePlaceholder: 'مثال: كاميرا الشرفة',
    cameraUrl: 'عنوان البث',
    cameraUrlPlaceholder: 'rtsp://user:pass@192.168.1.50:554/stream1',
    cameraAdd: 'إضافة الكاميرا',
    cameraAdded: 'تمت إضافة الكاميرا.',
    cameraNameMissing: 'أدخل اسماً للكاميرا.',
    cameraUrlInvalid: 'استخدم عنواناً يبدأ بـ rtsp:// أو http://',
    wifiTitle: 'جهاز eWeLink يعمل بشبكة Wi-Fi',
    wifiBody: 'تُربط أجهزة Wi-Fi من حساب eWeLink الخاص بك في لوحة تحكم المحور.',
    wifiOpen: 'فتح لوحة تحكم المحور',
  },
};

/** The hub's error codes worth a sentence of their own. */
const HUB_ERRORS: Localized<Record<number, string>> = {
  en: {
    110001: 'The hub is already searching for Zigbee devices.',
    110009: 'The hub could not reach the camera at that address.',
    110010: 'The camera rejected the username or password.',
    110011: 'The camera stream address is not valid.',
    110012: 'The hub does not support this camera’s video format.',
    110013: 'That device is already added.',
    110015: 'The username and password do not match the ones in the stream address.',
    110017: 'The hub already has the most cameras it can take.',
    110018: 'The ESP32 camera path is not valid.',
    210000: 'Zigbee pairing is not available: the hub has no Zigbee dongle attached.',
  },
  ar: {
    110001: 'المحور يبحث بالفعل عن أجهزة Zigbee.',
    110009: 'تعذّر على المحور الوصول إلى الكاميرا على هذا العنوان.',
    110010: 'رفضت الكاميرا اسم المستخدم أو كلمة المرور.',
    110011: 'عنوان بث الكاميرا غير صالح.',
    110012: 'المحور لا يدعم صيغة الفيديو لهذه الكاميرا.',
    110013: 'هذا الجهاز مضاف بالفعل.',
    110015: 'اسم المستخدم وكلمة المرور لا يطابقان ما في عنوان البث.',
    110017: 'وصل المحور إلى الحد الأقصى من الكاميرات.',
    110018: 'مسار كاميرا ESP32 غير صالح.',
    210000: 'اقتران Zigbee غير متاح: لا توجد وحدة Zigbee موصولة بالمحور.',
  },
};

const HUB_ERROR_KINDS: Localized<Record<CubeFailure['kind'], string>> = {
  en: {
    unconfigured: 'The home hub isn’t set up for this app yet.',
    network: 'Could not reach the smart home hub.',
    timeout: 'The smart home hub took too long to answer.',
    auth: 'The smart home hub did not accept the app’s access.',
    unavailable: 'The smart home hub isn’t answering properly.',
    rejected: 'The smart home hub refused the request.',
    unknown: 'Something went wrong with the smart home hub.',
  },
  ar: {
    unconfigured: 'لم يُضبط محور المنزل لهذا التطبيق بعد.',
    network: 'تعذّر الوصول إلى محور المنزل الذكي.',
    timeout: 'استغرق محور المنزل الذكي وقتاً طويلاً للرد.',
    auth: 'لم يقبل محور المنزل الذكي صلاحية التطبيق.',
    unavailable: 'محور المنزل الذكي لا يستجيب بشكل صحيح.',
    rejected: 'رفض محور المنزل الذكي الطلب.',
    unknown: 'حدث خطأ في محور المنزل الذكي.',
  },
};

/** A hub failure in the resident's language: the hub's own code if known, else its kind. */
export function hubErrorText(failure: CubeFailure, locale: Locale): string {
  return (
    (failure.code !== undefined ? HUB_ERRORS[locale][failure.code] : undefined) ??
    HUB_ERROR_KINDS[locale][failure.kind]
  );
}

export interface Automation {
  id: string;
  title: Text;
  summary: Text;
  enabled: boolean;
  icon: Glyph;
}

export const automations: readonly Automation[] = [
  {
    id: 'arrive',
    title: { en: 'Arrive Home', ar: 'الوصول إلى المنزل' },
    summary: {
      en: 'Turn on lights, open curtains, set AC to 24°C',
      ar: 'تشغيل الإضاءة، فتح الستائر، ضبط التكييف على 24°م',
    },
    enabled: true,
    icon: { set: 'ionicons', name: 'home-outline' },
  },
  {
    id: 'leave',
    title: { en: 'Leave Home', ar: 'مغادرة المنزل' },
    summary: {
      en: 'Turn off lights, close curtains, activate security',
      ar: 'إطفاء الإضاءة، إغلاق الستائر، تفعيل الحماية',
    },
    enabled: true,
    icon: { set: 'material', name: 'briefcase-outline' },
  },
  {
    id: 'night',
    title: { en: 'Good Night', ar: 'تصبح على خير' },
    summary: {
      en: 'Turn off TV, dim lights, set AC to 26°C',
      ar: 'إطفاء التلفاز، تخفيف الإضاءة، ضبط التكييف على 26°م',
    },
    enabled: true,
    icon: { set: 'ionicons', name: 'moon-outline' },
  },
  // Behind "View All".
  {
    id: 'wake',
    title: { en: 'Wake Up', ar: 'الاستيقاظ' },
    summary: {
      en: 'Open curtains, lights to 60%, set AC to 23°C',
      ar: 'فتح الستائر، الإضاءة على 60%، ضبط التكييف على 23°م',
    },
    enabled: false,
    icon: { set: 'ionicons', name: 'alarm-outline' },
  },
  {
    id: 'movie',
    title: { en: 'Movie Time', ar: 'وقت الفيلم' },
    summary: {
      en: 'Dim lights, close curtains, turn on TV',
      ar: 'تخفيف الإضاءة، إغلاق الستائر، تشغيل التلفاز',
    },
    enabled: true,
    icon: { set: 'ionicons', name: 'film-outline' },
  },
  {
    id: 'saver',
    title: { en: 'Energy Saver', ar: 'توفير الطاقة' },
    summary: {
      en: 'Turn off idle devices after 30 minutes',
      ar: 'إطفاء الأجهزة غير المستخدمة بعد 30 دقيقة',
    },
    enabled: false,
    icon: { set: 'ionicons', name: 'flash-off-outline' },
  },
];
