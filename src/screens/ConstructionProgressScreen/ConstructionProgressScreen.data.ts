import type { ComponentType } from 'react';
import type { ImageSourcePropType } from 'react-native';

import { BuildingsIcon } from '@/components/icons/BuildingsIcon';
import { GearIcon } from '@/components/icons/GearIcon';
import { KeyIcon } from '@/components/icons/KeyIcon';
import { LeafIcon } from '@/components/icons/LeafIcon';
import { PaintRollerIcon } from '@/components/icons/PaintRollerIcon';
import type { IconProps } from '@/components/icons/types';
import type { BarChartPoint } from '@/components/ui/BarChart';
import type { SiteUpdate } from '@/components/ui/LatestUpdateCard';
import type { ConstructionStage } from '@/components/ui/StageTile';
import type { TimelineStep } from '@/components/ui/StatusTimeline';
import { images } from '@/constants/images';
import type { Locale, Localized } from '@/context/LocaleContext';
import { formatDate, formatMonth, quarterParts } from '@/utils/date';

/** Page copy. The English headings and labels are exactly as shown in the export. */
export const constructionContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  backLabel: string;
  notificationsLabel: string;
  unreadNotificationsLabel: string;
  profileLabel: string;
  overallTitle: string;
  lastUpdatePrefix: string;
  percentLabel: string;
  stagesTitle: string;
  latestUpdateOverline: string;
  updatePageLabel: (position: number) => string;
  handoverTitle: string;
  estimateLabel: string;
  monthlyTitle: string;
  unitCardHint: string;
}> = {
  en: {
    overline: 'CONSTRUCTION',
    title: 'Construction Progress',
    subtitle: 'Track site execution and handover status for your unit.',
    backLabel: 'Back',
    notificationsLabel: 'Notifications',
    unreadNotificationsLabel: 'Notifications, new',
    profileLabel: 'Profile and appearance',
    overallTitle: 'Overall Construction Progress',
    lastUpdatePrefix: 'Last site update:',
    percentLabel: 'Completed',
    stagesTitle: 'Construction Stages',
    latestUpdateOverline: 'Latest Update',
    updatePageLabel: (position) => `Show update ${position}`,
    handoverTitle: 'Handover Status',
    estimateLabel: 'Estimated Handover',
    monthlyTitle: 'Monthly Progress',
    unitCardHint: 'Switch unit',
  },
  ar: {
    overline: 'البناء',
    title: 'تقدّم البناء',
    subtitle: 'تابع سير العمل في الموقع وحالة تسليم وحدتك.',
    backLabel: 'رجوع',
    notificationsLabel: 'الإشعارات',
    unreadNotificationsLabel: 'الإشعارات، جديدة',
    profileLabel: 'الملف الشخصي والمظهر',
    overallTitle: 'إجمالي تقدّم البناء',
    lastUpdatePrefix: 'آخر تحديث للموقع:',
    percentLabel: 'مكتمل',
    stagesTitle: 'مراحل البناء',
    latestUpdateOverline: 'آخر تحديث',
    updatePageLabel: (position) => `عرض التحديث ${position}`,
    handoverTitle: 'حالة التسليم',
    estimateLabel: 'موعد التسليم المتوقع',
    monthlyTitle: 'التقدّم الشهري',
    unitCardHint: 'تبديل الوحدة',
  },
};

/** Copy for the sheets opened from the page (not part of the export). */
export const sheetContent: Localized<{
  unitPickerTitle: string;
  unitPickerHint: string;
  stageStarted: string;
  stageCompleted: string;
  stageExpected: string;
  stageInProgress: string;
  stageNotStarted: string;
  stageNote: string;
  updateTitle: string;
  handoverIntro: string;
  notificationsTitle: string;
  noNotifications: string;
}> = {
  en: {
    unitPickerTitle: 'Your Units',
    unitPickerHint: 'Choose a unit to see its construction progress.',
    stageStarted: 'Started',
    stageCompleted: 'Completed',
    stageExpected: 'Expected completion',
    stageInProgress: 'In Progress',
    stageNotStarted: 'Not Started',
    stageNote: 'Site note',
    updateTitle: 'Site Update',
    handoverIntro: 'Steps before your keys are handed over.',
    notificationsTitle: 'Notifications',
    noNotifications: 'You are all caught up.',
  },
  ar: {
    unitPickerTitle: 'وحداتك',
    unitPickerHint: 'اختر وحدة لعرض تقدّم البناء الخاص بها.',
    stageStarted: 'تاريخ البدء',
    stageCompleted: 'تاريخ الإنجاز',
    stageExpected: 'الإنجاز المتوقع',
    stageInProgress: 'قيد التنفيذ',
    stageNotStarted: 'لم تبدأ بعد',
    stageNote: 'ملاحظة الموقع',
    updateTitle: 'تحديث الموقع',
    handoverIntro: 'الخطوات قبل تسليم مفاتيحك.',
    notificationsTitle: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات جديدة.',
  },
};

export const residentInitials = 'AM';

export type ScheduleStatus = 'on-schedule' | 'slight-delay';

export const scheduleStatusLabels: Localized<Record<ScheduleStatus, string>> = {
  en: { 'on-schedule': 'On Schedule', 'slight-delay': 'Slight Delay' },
  ar: { 'on-schedule': 'وفق الجدول', 'slight-delay': 'تأخير طفيف' },
};

type StepState = 'completed' | 'in-progress' | 'pending';

const stepStateLabels: Localized<Record<StepState, string>> = {
  en: { completed: 'Completed', 'in-progress': 'In Progress', pending: 'Pending' },
  ar: { completed: 'مكتمل', 'in-progress': 'قيد التنفيذ', pending: 'قيد الانتظار' },
};

type StepDateKind = 'started' | 'planned' | 'completed';

const stepDatePrefixes: Localized<Record<StepDateKind, string>> = {
  en: { started: 'Started', planned: 'Planned', completed: 'Completed' },
  ar: { started: 'بدأ في', planned: 'مخطط في', completed: 'اكتمل في' },
};

// ---- Resolved, single-language shapes the page and its sheets render. ----

export interface StageDetail extends ConstructionStage {
  /** Date the stage started; omitted until it does. */
  startedOn?: string;
  /** Completion date when finished, otherwise the expected one. */
  finishOn: string;
  note: string;
}

export interface HandoverStep extends TimelineStep {
  date: string;
  detail: string;
}

export interface UnitConstruction {
  id: string;
  projectName: string;
  unitName: string;
  role: string;
  location: string;
  photo: ImageSourcePropType;
  overall: { percent: number; status: ScheduleStatus; lastUpdate: string };
  /** The 3 × 2 stage grid, in reading order. */
  stages: readonly StageDetail[];
  /** Newest first. */
  updates: readonly SiteUpdate[];
  handover: {
    /** Whole estimate, e.g. for accessibility labels. */
    estimate: string;
    /** The same estimate split for the card (see `quarterParts`). */
    estimateParts: { lead?: string; main: string };
    steps: readonly HandoverStep[];
  };
  /** Value at the chart's axis; the design's axis starts above zero. */
  monthlyAxisMin: number;
  monthly: readonly BarChartPoint[];
}

export interface DemoNotification {
  id: string;
  title: string;
  body: string;
  time: string;
}

// ---- Demo data: text in both languages, numbers and dates written once. ----

type Text = Localized<string>;

interface DemoStage {
  id: string;
  /** May contain a line break where the tile should wrap. */
  label: Text;
  percent: number;
  Icon: ComponentType<IconProps>;
  /** ISO dates. */
  startedOn?: string;
  finishOn: string;
  note: Text;
}

interface DemoUpdate {
  id: string;
  date: string;
  title: Text;
  body: Text;
  photo: ImageSourcePropType;
}

interface DemoStep {
  id: 'documentation' | 'final-inspection' | 'handover';
  state: StepState;
  /** ISO day, month (`2027-03`) or quarter (`2027-Q2`). */
  date: { kind: StepDateKind; on: string };
  detail: Text;
}

interface DemoUnit {
  id: string;
  unitCode: string;
  photo: ImageSourcePropType;
  overall: { percent: number; status: ScheduleStatus; lastUpdate: string };
  stages: readonly DemoStage[];
  updates: readonly DemoUpdate[];
  /** Estimated handover quarter, e.g. `{ quarter: 2, year: 2027 }`. */
  handover: { estimate: { quarter: number; year: number }; steps: readonly DemoStep[] };
  monthlyAxisMin: number;
  /** Month number (1–12) and percentage. */
  monthly: readonly { month: number; value: number }[];
}

const project: Localized<{ name: string; role: string; location: string; unit: string }> = {
  en: { name: 'Opal Residence', role: 'Owner', location: 'Dubai, UAE', unit: 'Unit' },
  ar: { name: 'أوبال ريزيدنس', role: 'مالك', location: 'دبي، الإمارات', unit: 'الوحدة' },
};

const stageLabels = {
  structure: { en: 'Structure', ar: 'الهيكل الإنشائي' },
  facade: { en: 'Facade', ar: 'الواجهات' },
  mep: { en: 'MEP Works', ar: 'الكهروميكانيك' },
  interior: { en: 'Interior Finishing', ar: 'التشطيبات الداخلية' },
  landscape: { en: 'Landscape', ar: 'تنسيق المواقع' },
  handoverPrep: { en: 'Handover\nPreparation', ar: 'التجهيز\nللتسليم' },
} satisfies Record<string, Text>;

const stepTitles: Localized<Record<DemoStep['id'], string>> = {
  en: {
    documentation: 'Documentation',
    'final-inspection': 'Final Inspection',
    handover: 'Handover',
  },
  ar: { documentation: 'المستندات', 'final-inspection': 'الفحص النهائي', handover: 'التسليم' },
};

const keyHandoverDetail: Text = {
  en: 'Unit walkthrough, snag sign-off and key collection.',
  ar: 'جولة في الوحدة واعتماد الملاحظات واستلام المفاتيح.',
};
const inspectionDetail: Text = {
  en: 'Authority inspection and the building completion certificate.',
  ar: 'فحص الجهات المختصة وشهادة إنجاز المبنى.',
};

/**
 * DEMO DATA, so the page can be tried end to end without a backend. Unit A-304 is the
 * design's sample; B-112 and C-905 are invented to show the other states. Replace this list
 * with the resident's units from the construction service once it exists.
 * Only two site photos were supplied, so the updates reuse them.
 */
const demoUnitData: readonly DemoUnit[] = [
  {
    id: 'opal-a-304',
    unitCode: 'A-304',
    photo: images.myUnitPhoto,
    overall: { percent: 68, status: 'on-schedule', lastUpdate: '2026-10-12' },
    stages: [
      {
        id: 'structure',
        label: stageLabels.structure,
        percent: 100,
        Icon: BuildingsIcon,
        startedOn: '2025-01-10',
        finishOn: '2026-08-28',
        note: {
          en: 'Concrete frame and roof slab are complete and signed off by the structural engineer.',
          ar: 'اكتمل الهيكل الخرساني وبلاطة السطح واعتمدهما المهندس الإنشائي.',
        },
      },
      {
        id: 'facade',
        label: stageLabels.facade,
        percent: 86,
        Icon: BuildingsIcon,
        startedOn: '2026-06-02',
        finishOn: '2026-11-30',
        note: {
          en: 'Stone cladding is installed on the north and east elevations; glazing continues on the west side.',
          ar: 'تم تركيب الكسوة الحجرية على الواجهتين الشمالية والشرقية، ويستمر تركيب الزجاج على الجهة الغربية.',
        },
      },
      {
        id: 'mep',
        label: stageLabels.mep,
        percent: 68,
        Icon: GearIcon,
        startedOn: '2026-04-15',
        finishOn: '2027-01-20',
        note: {
          en: 'Ducting and electrical containment are in up to level 6. Riser testing starts next week.',
          ar: 'اكتمل تركيب مجاري التكييف والتمديدات الكهربائية حتى الطابق السادس. يبدأ اختبار الصواعد الأسبوع المقبل.',
        },
      },
      {
        id: 'interior',
        label: stageLabels.interior,
        percent: 54,
        Icon: PaintRollerIcon,
        startedOn: '2026-07-01',
        finishOn: '2027-02-15',
        note: {
          en: 'Plastering is complete on levels 1–3; kitchen joinery for your floor arrives in November.',
          ar: 'اكتملت أعمال اللياسة في الطوابق 1–3، وتصل خزائن المطبخ لطابقك في نوفمبر.',
        },
      },
      {
        id: 'landscape',
        label: stageLabels.landscape,
        percent: 32,
        Icon: LeafIcon,
        startedOn: '2026-09-01',
        finishOn: '2027-03-10',
        note: {
          en: 'Podium garden mock-up is approved. Planting starts once the facade scaffolding comes down.',
          ar: 'اعتُمد النموذج التجريبي لحديقة المنصة. تبدأ الزراعة بعد إزالة سقالات الواجهة.',
        },
      },
      {
        id: 'handover-prep',
        label: stageLabels.handoverPrep,
        percent: 18,
        Icon: KeyIcon,
        startedOn: '2026-10-01',
        finishOn: '2027-04-15',
        note: {
          en: 'Snagging checklists are being prepared. You will be invited to a walkthrough before handover.',
          ar: 'يجري إعداد قوائم الملاحظات، وستتم دعوتك إلى جولة في وحدتك قبل التسليم.',
        },
      },
    ],
    updates: [
      {
        id: 'a304-facade',
        date: '2026-10-12',
        title: { en: 'Facade Works Progressing Well', ar: 'أعمال الواجهات تسير بشكل جيد' },
        body: {
          en: 'Exterior façade installation is 86% complete. MEP works and interior finishing are proceeding as planned.',
          ar: 'اكتمل تركيب الواجهات الخارجية بنسبة 86%. وتسير أعمال الكهروميكانيك والتشطيبات الداخلية وفق الخطة.',
        },
        photo: images.constructionUpdateFacade,
      },
      {
        id: 'a304-mep',
        date: '2026-09-28',
        title: { en: 'MEP Rough-In Reaches Level 6', ar: 'التمديدات تصل إلى الطابق السادس' },
        body: {
          en: 'Ducting and electrical containment are installed up to level 6. Testing of the risers starts next week.',
          ar: 'تم تركيب مجاري التكييف والتمديدات الكهربائية حتى الطابق السادس. يبدأ اختبار الصواعد الأسبوع المقبل.',
        },
        photo: images.constructionUpdateFacade,
      },
      {
        id: 'a304-landscape',
        date: '2026-09-14',
        title: { en: 'Landscape Mock-Up Approved', ar: 'اعتماد النموذج التجريبي للحدائق' },
        body: {
          en: 'The podium garden mock-up was approved. Planting begins once the facade scaffolding is removed.',
          ar: 'تم اعتماد النموذج التجريبي لحديقة المنصة، وتبدأ الزراعة بعد إزالة سقالات الواجهة.',
        },
        photo: images.featuredCommunityOpal,
      },
    ],
    handover: {
      estimate: { quarter: 2, year: 2027 },
      steps: [
        {
          id: 'documentation',
          state: 'in-progress',
          date: { kind: 'started', on: '2026-10-01' },
          detail: {
            en: 'Sale agreement and service charge forms are being prepared for your signature.',
            ar: 'يجري إعداد عقد البيع ونماذج رسوم الخدمات لتوقيعك.',
          },
        },
        {
          id: 'final-inspection',
          state: 'pending',
          date: { kind: 'planned', on: '2027-03' },
          detail: inspectionDetail,
        },
        {
          id: 'handover',
          state: 'pending',
          date: { kind: 'planned', on: '2027-Q2' },
          detail: keyHandoverDetail,
        },
      ],
    },
    monthlyAxisMin: 30,
    monthly: [
      { month: 4, value: 42 },
      { month: 5, value: 50 },
      { month: 6, value: 58 },
      { month: 7, value: 64 },
      { month: 10, value: 68 },
    ],
  },
  {
    id: 'opal-b-112',
    unitCode: 'B-112',
    photo: images.featuredCommunityOpal,
    overall: { percent: 41, status: 'slight-delay', lastUpdate: '2026-10-09' },
    stages: [
      {
        id: 'structure',
        label: stageLabels.structure,
        percent: 100,
        Icon: BuildingsIcon,
        startedOn: '2025-03-05',
        finishOn: '2026-09-30',
        note: {
          en: 'Tower B frame is complete; the roof slab was poured on 26 September.',
          ar: 'اكتمل هيكل البرج B، وتم صب بلاطة السطح في 26 سبتمبر.',
        },
      },
      {
        id: 'facade',
        label: stageLabels.facade,
        percent: 62,
        Icon: BuildingsIcon,
        startedOn: '2026-07-20',
        finishOn: '2027-02-28',
        note: {
          en: 'Cladding is two weeks behind plan after a late stone delivery; extra crews are on site.',
          ar: 'تتأخر الكسوة أسبوعين عن الخطة بسبب تأخر توريد الحجر، وتعمل فرق إضافية في الموقع.',
        },
      },
      {
        id: 'mep',
        label: stageLabels.mep,
        percent: 38,
        Icon: GearIcon,
        startedOn: '2026-06-01',
        finishOn: '2027-04-30',
        note: {
          en: 'First-fix plumbing and electrical are complete up to level 2.',
          ar: 'اكتملت المرحلة الأولى من التمديدات الصحية والكهربائية حتى الطابق الثاني.',
        },
      },
      {
        id: 'interior',
        label: stageLabels.interior,
        percent: 15,
        Icon: PaintRollerIcon,
        startedOn: '2026-09-15',
        finishOn: '2027-06-30',
        note: {
          en: 'Blockwork partitions are underway on the lower floors.',
          ar: 'تجري أعمال الجدران الداخلية في الطوابق السفلية.',
        },
      },
      {
        id: 'landscape',
        label: stageLabels.landscape,
        percent: 10,
        Icon: LeafIcon,
        startedOn: '2026-10-01',
        finishOn: '2027-07-31',
        note: {
          en: 'Irrigation sleeves are being laid around the tower B entrance.',
          ar: 'يجري تمديد أنابيب الري حول مدخل البرج B.',
        },
      },
      {
        id: 'handover-prep',
        label: stageLabels.handoverPrep,
        percent: 0,
        Icon: KeyIcon,
        finishOn: '2027-09-30',
        note: {
          en: 'Starts once interior finishing on your floor is complete.',
          ar: 'تبدأ بعد اكتمال التشطيبات الداخلية في طابقك.',
        },
      },
    ],
    updates: [
      {
        id: 'b112-facade',
        date: '2026-10-09',
        title: { en: 'Extra Crews Join Facade Works', ar: 'فرق إضافية لأعمال الواجهات' },
        body: {
          en: 'Two more cladding crews joined tower B this week to recover the delay from a late stone delivery.',
          ar: 'انضم فريقان إضافيان لأعمال الكسوة في البرج B هذا الأسبوع لتعويض التأخير الناتج عن تأخر توريد الحجر.',
        },
        photo: images.constructionUpdateFacade,
      },
      {
        id: 'b112-roof',
        date: '2026-09-26',
        title: { en: 'Tower B Roof Slab Poured', ar: 'صب بلاطة سطح البرج B' },
        body: {
          en: 'The final roof slab was poured, completing the structure of tower B ahead of the facade works.',
          ar: 'تم صب بلاطة السطح الأخيرة، ليكتمل هيكل البرج B قبل بدء أعمال الواجهات.',
        },
        photo: images.constructionUpdateFacade,
      },
      {
        id: 'b112-mep',
        date: '2026-09-02',
        title: { en: 'First-Fix MEP Begins', ar: 'بدء المرحلة الأولى من التمديدات' },
        body: {
          en: 'Plumbing and electrical first-fix started on the lower floors of tower B.',
          ar: 'بدأت المرحلة الأولى من التمديدات الصحية والكهربائية في الطوابق السفلية للبرج B.',
        },
        photo: images.featuredCommunityOpal,
      },
    ],
    handover: {
      estimate: { quarter: 4, year: 2027 },
      steps: [
        {
          id: 'documentation',
          state: 'pending',
          date: { kind: 'planned', on: '2027-04' },
          detail: {
            en: 'Sale agreement and service charge forms will be shared for signature.',
            ar: 'ستتم مشاركة عقد البيع ونماذج رسوم الخدمات معك للتوقيع.',
          },
        },
        {
          id: 'final-inspection',
          state: 'pending',
          date: { kind: 'planned', on: '2027-08' },
          detail: inspectionDetail,
        },
        {
          id: 'handover',
          state: 'pending',
          date: { kind: 'planned', on: '2027-Q4' },
          detail: keyHandoverDetail,
        },
      ],
    },
    monthlyAxisMin: 10,
    monthly: [
      { month: 4, value: 22 },
      { month: 5, value: 27 },
      { month: 6, value: 31 },
      { month: 7, value: 36 },
      { month: 10, value: 41 },
    ],
  },
  {
    id: 'opal-c-905',
    unitCode: 'C-905',
    photo: images.myUnitPhoto,
    overall: { percent: 94, status: 'on-schedule', lastUpdate: '2026-10-14' },
    stages: [
      {
        id: 'structure',
        label: stageLabels.structure,
        percent: 100,
        Icon: BuildingsIcon,
        startedOn: '2024-11-12',
        finishOn: '2026-04-30',
        note: { en: 'Structure complete and certified.', ar: 'اكتمل الهيكل وتم اعتماده.' },
      },
      {
        id: 'facade',
        label: stageLabels.facade,
        percent: 100,
        Icon: BuildingsIcon,
        startedOn: '2026-02-01',
        finishOn: '2026-09-15',
        note: {
          en: 'Facade complete; scaffolding has been removed from tower C.',
          ar: 'اكتملت الواجهات، وأُزيلت السقالات من البرج C.',
        },
      },
      {
        id: 'mep',
        label: stageLabels.mep,
        percent: 96,
        Icon: GearIcon,
        startedOn: '2026-01-01',
        finishOn: '2026-10-31',
        note: {
          en: 'Testing and commissioning of the chillers is underway.',
          ar: 'يجري اختبار وتشغيل وحدات التبريد.',
        },
      },
      {
        id: 'interior',
        label: stageLabels.interior,
        percent: 92,
        Icon: PaintRollerIcon,
        startedOn: '2026-03-01',
        finishOn: '2026-11-15',
        note: {
          en: 'Final paint and fixtures are being installed on your floor.',
          ar: 'يجري تنفيذ الدهان النهائي وتركيب التجهيزات في طابقك.',
        },
      },
      {
        id: 'landscape',
        label: stageLabels.landscape,
        percent: 85,
        Icon: LeafIcon,
        startedOn: '2026-05-01',
        finishOn: '2026-11-30',
        note: {
          en: 'Planting is complete; the pool deck is being finished.',
          ar: 'اكتملت الزراعة، ويجري إنهاء سطح المسبح.',
        },
      },
      {
        id: 'handover-prep',
        label: stageLabels.handoverPrep,
        percent: 70,
        Icon: KeyIcon,
        startedOn: '2026-08-01',
        finishOn: '2027-01-15',
        note: {
          en: 'Snagging is complete on 7 of 10 floors, including yours.',
          ar: 'اكتمل حصر الملاحظات في 7 من 10 طوابق، ومنها طابقك.',
        },
      },
    ],
    updates: [
      {
        id: 'c905-snagging',
        date: '2026-10-14',
        title: { en: 'Snagging Complete on Your Floor', ar: 'اكتمال حصر الملاحظات في طابقك' },
        body: {
          en: 'The snagging inspection on level 9 is complete. Fixes are scheduled before your walkthrough.',
          ar: 'اكتمل فحص الملاحظات في الطابق التاسع، وتمت جدولة الإصلاحات قبل جولتك في الوحدة.',
        },
        photo: images.myUnitPhoto,
      },
      {
        id: 'c905-landscape',
        date: '2026-10-01',
        title: { en: 'Tower C Gardens Planted', ar: 'زراعة حدائق البرج C' },
        body: {
          en: 'Planting around tower C is complete and the irrigation system is now running.',
          ar: 'اكتملت الزراعة حول البرج C، ونظام الري يعمل الآن.',
        },
        photo: images.featuredCommunityOpal,
      },
      {
        id: 'c905-facade',
        date: '2026-09-15',
        title: { en: 'Scaffolding Removed', ar: 'إزالة السقالات' },
        body: {
          en: 'Facade works are complete and the scaffolding has been removed from tower C.',
          ar: 'اكتملت أعمال الواجهات وأُزيلت السقالات من البرج C.',
        },
        photo: images.constructionUpdateFacade,
      },
    ],
    handover: {
      estimate: { quarter: 1, year: 2027 },
      steps: [
        {
          id: 'documentation',
          state: 'completed',
          date: { kind: 'completed', on: '2026-09-30' },
          detail: {
            en: 'All documents are signed and filed.',
            ar: 'تم توقيع جميع المستندات وحفظها.',
          },
        },
        {
          id: 'final-inspection',
          state: 'in-progress',
          date: { kind: 'started', on: '2026-10-10' },
          detail: {
            en: 'Authority inspection is underway for tower C.',
            ar: 'يجري فحص الجهات المختصة للبرج C.',
          },
        },
        {
          id: 'handover',
          state: 'pending',
          date: { kind: 'planned', on: '2027-01' },
          detail: keyHandoverDetail,
        },
      ],
    },
    monthlyAxisMin: 60,
    monthly: [
      { month: 4, value: 72 },
      { month: 5, value: 79 },
      { month: 6, value: 85 },
      { month: 7, value: 90 },
      { month: 10, value: 94 },
    ],
  },
];

/** A demo unit with its text and dates in one language. */
function localizeUnit(unit: DemoUnit, locale: Locale): UnitConstruction {
  const copy = project[locale];
  const date = (iso: string) => formatDate(iso, locale);

  return {
    id: unit.id,
    projectName: copy.name,
    unitName: `${copy.unit} ${unit.unitCode}`,
    role: copy.role,
    location: copy.location,
    photo: unit.photo,
    overall: { ...unit.overall, lastUpdate: date(unit.overall.lastUpdate) },
    stages: unit.stages.map((stage) => ({
      ...stage,
      label: stage.label[locale],
      startedOn: stage.startedOn && date(stage.startedOn),
      finishOn: date(stage.finishOn),
      note: stage.note[locale],
    })),
    updates: unit.updates.map((update) => ({
      ...update,
      date: date(update.date),
      title: update.title[locale],
      body: update.body[locale],
    })),
    handover: {
      estimate: date(`${unit.handover.estimate.year}-Q${unit.handover.estimate.quarter}`),
      estimateParts: quarterParts(
        unit.handover.estimate.quarter,
        unit.handover.estimate.year,
        locale,
      ),
      steps: unit.handover.steps.map((step) => ({
        id: step.id,
        title: stepTitles[locale][step.id],
        statusLabel: stepStateLabels[locale][step.state],
        reached: step.state !== 'pending',
        date: `${stepDatePrefixes[locale][step.date.kind]} ${date(step.date.on)}`,
        detail: step.detail[locale],
      })),
    },
    monthlyAxisMin: unit.monthlyAxisMin,
    monthly: unit.monthly.map(({ month, value }) => ({
      label: formatMonth(month, locale),
      value,
    })),
  };
}

export const demoUnits: Localized<readonly UnitConstruction[]> = {
  en: demoUnitData.map((unit) => localizeUnit(unit, 'en')),
  ar: demoUnitData.map((unit) => localizeUnit(unit, 'ar')),
};

/** DEMO DATA: the resident's notifications until the notifications service exists. */
export const demoNotifications: Localized<readonly DemoNotification[]> = {
  en: [
    {
      id: 'site-update',
      title: 'New site update',
      body: 'Facade Works Progressing Well — Unit A-304.',
      time: '2h ago',
    },
    {
      id: 'documents',
      title: 'Handover documents',
      body: 'Your sale agreement is ready to review and sign.',
      time: 'Yesterday',
    },
    {
      id: 'inspection',
      title: 'Inspection booked',
      body: 'Tower C final inspection started on 10 Oct.',
      time: '10 Oct',
    },
  ],
  ar: [
    {
      id: 'site-update',
      title: 'تحديث جديد للموقع',
      body: 'أعمال الواجهات تسير بشكل جيد — الوحدة A-304.',
      time: 'قبل ساعتين',
    },
    {
      id: 'documents',
      title: 'مستندات التسليم',
      body: 'عقد البيع جاهز للمراجعة والتوقيع.',
      time: 'أمس',
    },
    {
      id: 'inspection',
      title: 'تم حجز الفحص',
      body: 'بدأ الفحص النهائي للبرج C في 10 أكتوبر.',
      time: '10 أكتوبر',
    },
  ],
};
