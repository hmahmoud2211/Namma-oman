import * as Font from 'expo-font';
import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

import { arabicFontAssets, fontFamilies } from '@/theme/typography';

export type Locale = 'en' | 'ar';

/** A value written once per language, e.g. a label: `{ en: 'Home', ar: 'الرئيسية' }`. */
export type Localized<T> = Readonly<Record<Locale, T>>;

export interface LocaleState {
  locale: Locale;
  /** Arabic lays screens out right to left. */
  isRTL: boolean;
  /** Switches once the language's fonts are ready (Arabic's load on first use). */
  setLocale: (locale: Locale) => void;
  /** The language being switched to while its fonts load, e.g. to show the choice at once. */
  pendingLocale: Locale | null;
}

export const LocaleContext = createContext<LocaleState | null>(null);

/** Loads the Arabic faces; resolves at once when they already are. */
export function loadArabicFonts(): Promise<void> {
  return Font.isLoaded(fontFamilies.arabicRegular)
    ? Promise.resolve()
    : Font.loadAsync(arabicFontAssets);
}

interface LocaleProviderProps {
  /** Starting language; Arabic by default. App.tsx loads its fonts before the first screen. */
  initialLocale?: Locale;
  children: ReactNode;
}

/**
 * App language. Kept in memory (like the theme preference) until settings persistence exists.
 * Switching mirrors the screens through the `direction` style instead of I18nManager, which
 * would need an app restart. Arabic waits for its fonts so text never shows in a fallback face.
 */
export function LocaleProvider({ initialLocale = 'ar', children }: LocaleProviderProps) {
  const [locale, setActiveLocale] = useState<Locale>(initialLocale);
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  const setLocale = useCallback((next: Locale) => {
    if (next === 'en') {
      setPendingLocale(null);
      setActiveLocale('en');
      return;
    }
    setPendingLocale('ar');
    loadArabicFonts()
      // If the fonts can't load (e.g. offline on web), switch anyway: the system Arabic face
      // is a better fallback than refusing the language.
      .catch(() => undefined)
      .then(() => {
        // Ignore if the user picked English again while the fonts were loading.
        setPendingLocale((pending) => {
          if (pending === 'ar') setActiveLocale('ar');
          return null;
        });
      });
  }, []);

  const value = useMemo(
    () => ({ locale, isRTL: locale === 'ar', setLocale, pendingLocale }),
    [locale, setLocale, pendingLocale],
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}
