import { images } from '@/constants/images';
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
  /** The property card that opens every inner screen (ResidentPropertyCard). */
  property: {
    en: { projectName: 'Opal Residence', unitName: 'Unit A-304', role: 'Owner', location: 'Dubai, UAE' },
    ar: { projectName: 'أوبال ريزيدنس', unitName: 'الوحدة A-304', role: 'مالك', location: 'دبي، الإمارات' },
  } satisfies Localized<{ projectName: string; unitName: string; role: string; location: string }>,
  propertyPhoto: images.myUnitPhoto,
} as const;
