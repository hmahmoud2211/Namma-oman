import { useLocale } from '@/hooks/useLocale';
import type { Lang } from '@/services/parking/i18n';

/**
 * The parking flows' language for residents and security: the app's own (its EN | AR switch).
 * A visitor's pass keeps the language its link asks for instead.
 */
export function useParkingLang(): Lang {
  return useLocale().locale === 'ar' ? 'ar' : 'en';
}
