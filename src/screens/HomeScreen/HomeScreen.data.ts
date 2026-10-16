import type { ComponentType } from 'react';

import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { CommunityIcon } from '@/components/icons/CommunityIcon';
import { HardHatIcon } from '@/components/icons/HardHatIcon';
import { ParkingIcon } from '@/components/icons/ParkingIcon';
import { SmartHomeIcon } from '@/components/icons/SmartHomeIcon';
import type { IconProps } from '@/components/icons/types';
import { VisitorAccessIcon } from '@/components/icons/VisitorAccessIcon';
import { WalletIcon } from '@/components/icons/WalletIcon';
import { WrenchIcon } from '@/components/icons/WrenchIcon';
import type { FeaturedCommunity } from '@/components/ui/FeaturedCommunityCard';
import type { UnitSummary } from '@/components/ui/UnitSummaryCard';
import { images } from '@/constants/images';
import type { Localized } from '@/context/LocaleContext';

/**
 * English copy exactly as shown in Assets/screens/home 1.png.
 * The resident, unit, balance and weather values are the design's sample data:
 * replace them with real values once the profile and weather services exist.
 */
export const homeContent: Localized<{
  greeting: string;
  residentName: string;
  tagline: string;
  menuLabel: string;
  notificationsLabel: string;
  weather: { temperature: string; condition: string };
  featured: { overline: string; ctaLabel: string; previousLabel: string; nextLabel: string };
}> = {
  en: {
    greeting: 'Good evening,',
    residentName: 'Ahmed',
    tagline: 'Home Feels Better Together.',
    menuLabel: 'Open menu',
    notificationsLabel: 'Notifications',
    weather: { temperature: '24 C', condition: 'Clear Night' },
    featured: {
      overline: 'FEATURED COMMUNITY',
      ctaLabel: 'Explore Community',
      previousLabel: 'Previous community',
      nextLabel: 'Next community',
    },
  },
  ar: {
    greeting: 'مساء الخير،',
    residentName: 'أحمد',
    tagline: 'المنزل أجمل معاً.',
    menuLabel: 'فتح القائمة',
    notificationsLabel: 'الإشعارات',
    weather: { temperature: '24°م', condition: 'ليلة صافية' },
    featured: {
      overline: 'مجتمع مميّز',
      ctaLabel: 'استكشف المجتمع',
      previousLabel: 'المجتمع السابق',
      nextLabel: 'المجتمع التالي',
    },
  },
};

export const myUnit: Localized<UnitSummary> = {
  en: {
    heading: 'My Unit',
    unitName: 'Unit A-304',
    role: 'Owner',
    balanceLabel: 'Outstanding',
    currency: 'OMR',
    amount: '36,000',
    photo: images.myUnitPhoto,
  },
  ar: {
    heading: 'وحدتي',
    unitName: 'الوحدة A-304',
    role: 'مالك',
    balanceLabel: 'المبلغ المستحق',
    currency: 'ر.ع.',
    amount: '36,000',
    photo: images.myUnitPhoto,
  },
};

export type HomeServiceId =
  | 'financial-overview'
  | 'construction-progress'
  | 'smart-home'
  | 'visitor-access'
  | 'parking'
  | 'maintenance'
  | 'community'
  | 'amenities-booking';

export interface HomeService {
  id: HomeServiceId;
  label: Localized<string>;
  Icon: ComponentType<IconProps>;
  /** Icon box in design dp, sized to the glyph in the export. */
  iconSize: number;
}

/** The 4 × 2 shortcut grid, in reading order. */
export const homeServices: readonly HomeService[] = [
  {
    id: 'financial-overview',
    label: { en: 'Financial Overview', ar: 'النظرة المالية' },
    Icon: WalletIcon,
    iconSize: 13.5,
  },
  {
    id: 'construction-progress',
    label: { en: 'Construction Progress', ar: 'تقدّم البناء' },
    Icon: HardHatIcon,
    iconSize: 14,
  },
  {
    id: 'smart-home',
    label: { en: 'Smart Home', ar: 'المنزل الذكي' },
    Icon: SmartHomeIcon,
    iconSize: 15.5,
  },
  {
    id: 'visitor-access',
    label: { en: 'Visitor Access', ar: 'دخول الزوّار' },
    Icon: VisitorAccessIcon,
    iconSize: 13.5,
  },
  { id: 'parking', label: { en: 'Parking', ar: 'المواقف' }, Icon: ParkingIcon, iconSize: 14 },
  {
    id: 'maintenance',
    label: { en: 'Maintenance', ar: 'الصيانة' },
    Icon: WrenchIcon,
    iconSize: 15,
  },
  {
    id: 'community',
    label: { en: 'Community', ar: 'المجتمع' },
    Icon: CommunityIcon,
    iconSize: 14,
  },
  {
    id: 'amenities-booking',
    label: { en: 'Amenities Booking', ar: 'حجز المرافق' },
    Icon: CalendarIcon,
    iconSize: 12.5,
  },
];

/**
 * The design's pager reads "1 / 4", but only Opal Residence was supplied.
 * Add the other communities here; the counter and arrows follow this list.
 */
export const featuredCommunities: Localized<readonly FeaturedCommunity[]> = {
  en: [
    {
      id: 'opal-residence',
      name: 'Opal Residence',
      pillars: ['Live', 'Belong', 'Thrive'],
      descriptionLines: [
        'A modern community designed',
        'for a more connected,',
        'fulfilling lifestyle.',
      ],
      photo: images.featuredCommunityOpal,
    },
  ],
  ar: [
    {
      id: 'opal-residence',
      name: 'أوبال ريزيدنس',
      pillars: ['عِش', 'انتمِ', 'ازدهر'],
      descriptionLines: ['مجتمع عصري صُمّم', 'لأسلوب حياة أكثر', 'تواصلاً وإشباعاً.'],
      photo: images.featuredCommunityOpal,
    },
  ],
};
