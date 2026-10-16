import type { Localized } from '@/context/LocaleContext';

export interface WelcomeContent {
  title: string;
  taglineLines: readonly string[];
  ctaLabel: string;
  ctaAccessibilityLabel: string;
}

/** English copy exactly as shown in Assets/screens/start 1.png. */
export const welcomeContent: Localized<WelcomeContent> = {
  en: {
    title: 'opal residence',
    taglineLines: ['MODERN COMMUNITIES', 'SMARTER LIVING'],
    ctaLabel: 'GET STARTED',
    ctaAccessibilityLabel: 'Get started',
  },
  ar: {
    title: 'أوبال ريزيدنس',
    taglineLines: ['مجتمعات عصرية', 'حياة أذكى'],
    ctaLabel: 'ابدأ الآن',
    ctaAccessibilityLabel: 'ابدأ الآن',
  },
};
