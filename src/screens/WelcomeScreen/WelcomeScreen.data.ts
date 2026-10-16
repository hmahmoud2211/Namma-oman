import type { Localized } from '@/context/LocaleContext';

export interface WelcomeContent {
  title: string;
  taglineLines: readonly string[];
  ctaLabel: string;
  ctaAccessibilityLabel: string;
  /** Tells screen-reader users what the slide does (they activate it directly). */
  ctaHint: string;
}

/** English copy exactly as shown in Assets/screens/start 1.png. */
export const welcomeContent: Localized<WelcomeContent> = {
  en: {
    title: 'opal residence',
    taglineLines: ['MODERN COMMUNITIES', 'SMARTER LIVING'],
    ctaLabel: 'GET STARTED',
    ctaAccessibilityLabel: 'Get started',
    ctaHint: 'Slide to the right to get started',
  },
  ar: {
    title: 'أوبال ريزيدنس',
    taglineLines: ['مجتمعات عصرية', 'حياة أذكى'],
    ctaLabel: 'ابدأ الآن',
    ctaAccessibilityLabel: 'ابدأ الآن',
    ctaHint: 'اسحب إلى اليسار للبدء',
  },
};
