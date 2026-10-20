import type { Glyph } from '@/components/common/AppIcon';
import type { Localized } from '@/context/LocaleContext';
import type { ParamlessRoute } from '@/types/navigation.types';

/** Services: the main tab listing everything a resident can do (after Parklane's Services). */

export const servicesContent: Localized<{
  overline: string;
  title: string;
  subtitle: string;
  everydayTitle: string;
}> = {
  en: {
    overline: 'SERVICES',
    title: 'Services',
    subtitle: 'Everyday services, made easier.',
    everydayTitle: 'Everyday Services',
  },
  ar: {
    overline: 'الخدمات',
    title: 'الخدمات',
    subtitle: 'خدمات يومية بسهولة أكبر.',
    everydayTitle: 'خدمات يومية',
  },
};

export interface ServiceLink {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  icon: Glyph;
  /** Screen the row opens; rows without one show the "under development" notice. */
  route?: ParamlessRoute;
}

/** Parklane's everyday services; none has a screen yet (in Parklane either). */
export const everydayServices: readonly ServiceLink[] = [
  {
    id: 'housekeeping',
    title: { en: 'Housekeeping', ar: 'التنظيف المنزلي' },
    description: {
      en: 'Book cleaning services for your unit, choose date and time.',
      ar: 'احجز خدمات تنظيف لوحدتك واختر التاريخ والوقت.',
    },
    icon: { set: 'material', name: 'spray-bottle' },
  },
  {
    id: 'bills',
    title: { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
    description: {
      en: 'View and pay your electricity, water and gas bills.',
      ar: 'اعرض فواتير الكهرباء والمياه والغاز وادفعها.',
    },
    icon: { set: 'material', name: 'file-document-outline' },
  },
  {
    id: 'deliveries',
    title: { en: 'Deliveries', ar: 'التوصيلات' },
    description: {
      en: 'Track your deliveries and manage incoming packages.',
      ar: 'تابع توصيلاتك وأدِر الطرود الواردة.',
    },
    icon: { set: 'material', name: 'package-variant-closed' },
  },
  {
    id: 'moving',
    title: { en: 'Moving Request', ar: 'طلب انتقال' },
    description: {
      en: 'Schedule a move-in or move-out request with management.',
      ar: 'حدّد موعد طلب انتقال إلى الوحدة أو منها مع الإدارة.',
    },
    icon: { set: 'material', name: 'dolly' },
  },
  {
    id: 'support',
    title: { en: 'Help & Support', ar: 'المساعدة والدعم' },
    description: {
      en: 'Get assistance, contact management or explore FAQs.',
      ar: 'احصل على المساعدة أو تواصل مع الإدارة أو تصفّح الأسئلة الشائعة.',
    },
    icon: { set: 'material', name: 'headset' },
  },
];
