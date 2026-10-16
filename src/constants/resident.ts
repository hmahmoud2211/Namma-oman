import type { Localized } from '@/context/LocaleContext';

/**
 * The signed-in resident as the service screens show them (header avatar, documents).
 * Sample values matching Home and Construction Progress until the profile service exists.
 * TODO(auth): read these from the signed-in profile.
 */
export const resident = {
  initials: 'AM',
  name: { en: 'Ahmed Al Mahrouqi', ar: 'أحمد المحروقي' } satisfies Localized<string>,
  unit: { en: 'Unit A-304', ar: 'الوحدة A-304' } satisfies Localized<string>,
  unitCode: 'A-304',
} as const;
