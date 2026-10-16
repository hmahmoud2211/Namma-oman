export interface WelcomeContent {
  title: string;
  taglineLines: readonly string[];
  ctaLabel: string;
  ctaAccessibilityLabel: string;
}

/** Copy exactly as shown in Assets/screens/start 1.png. */
export const welcomeContent: WelcomeContent = {
  title: 'opal residence',
  taglineLines: ['MODERN COMMUNITIES', 'SMARTER LIVING'],
  ctaLabel: 'GET STARTED',
  ctaAccessibilityLabel: 'Get started',
};
