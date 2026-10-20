import { images } from '@/constants/images';
import type { Localized } from '@/context/LocaleContext';

/**
 * Copy and doses as shown in the Medication Schedule Figma export: the design's sample
 * prescription. Replace with the doses read from the resident's uploads once that service exists.
 */
export const scheduleContent: Localized<{
  title: string;
  subtitle: string;
  chooseDay: string;
  taken: string;
  markAsTaken: string;
  markNotTaken: string;
  details: string;
  doseOptions: string;
}> = {
  en: {
    title: 'Medication Schedule',
    subtitle: 'Based on your Uploaded Files.',
    chooseDay: 'Show schedule for',
    taken: 'Taken',
    markAsTaken: 'Mark as taken',
    markNotTaken: 'Mark as not taken',
    details: 'Medication details',
    doseOptions: 'Dose options',
  },
  ar: {
    title: 'جدول الأدوية',
    subtitle: 'بناءً على الملفات التي رفعتها.',
    chooseDay: 'عرض الجدول لـ',
    taken: 'تم التناول',
    markAsTaken: 'تحديد كمتناوَل',
    markNotTaken: 'إلغاء التناول',
    details: 'تفاصيل الدواء',
    doseOptions: 'خيارات الجرعة',
  },
};

export type ScheduleDay = 'today' | 'tomorrow';

export const scheduleDays: readonly { id: ScheduleDay; label: Localized<string> }[] = [
  { id: 'today', label: { en: 'Today', ar: 'اليوم' } },
  { id: 'tomorrow', label: { en: 'Tomorrow', ar: 'غداً' } },
];

export interface MedicationDose {
  id: string;
  name: Localized<string>;
  strength: Localized<string>;
  instructions: Localized<string>;
  /** 24-hour "HH:MM". */
  time: string;
  image: number;
}

/** One day's doses, in time order; the same every day of the course. */
export const dailyDoses: readonly MedicationDose[] = [
  {
    id: 'paracetamol',
    name: { en: 'Paracetamol', ar: 'باراسيتامول' },
    strength: { en: '500 mg', ar: '500 ملغ' },
    instructions: { en: '1 tablet after breakfast', ar: 'قرص واحد بعد الإفطار' },
    time: '08:00',
    image: images.medicalPillParacetamol,
  },
  {
    id: 'amoxicillin',
    name: { en: 'Amoxicillin', ar: 'أموكسيسيلين' },
    strength: { en: '500 mg', ar: '500 ملغ' },
    instructions: { en: '1 capsule after lunch', ar: 'كبسولة واحدة بعد الغداء' },
    time: '13:00',
    image: images.medicalPillAmoxicillin,
  },
  {
    id: 'ibuprofen',
    name: { en: 'Ibuprofen', ar: 'إيبوبروفين' },
    strength: { en: '400 mg', ar: '400 ملغ' },
    instructions: { en: '1 tablet after dinner', ar: 'قرص واحد بعد العشاء' },
    time: '19:00',
    image: images.medicalPillIbuprofen,
  },
  {
    id: 'vitamin-d3',
    name: { en: 'Vitamin D3', ar: 'فيتامين د3' },
    strength: { en: '1000 IU', ar: '1000 وحدة دولية' },
    instructions: { en: '1 capsule at night', ar: 'كبسولة واحدة ليلاً' },
    time: '22:00',
    image: images.medicalPillVitaminD3,
  },
];

/** The design's state: this morning's dose already taken. */
export const initialTaken: Readonly<Record<ScheduleDay, readonly string[]>> = {
  today: ['paracetamol'],
  tomorrow: [],
};
