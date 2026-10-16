import { createContext, useMemo, useState, type ReactNode } from 'react';

export type Locale = 'en' | 'ar';

/** A value written once per language, e.g. a label: `{ en: 'Home', ar: 'الرئيسية' }`. */
export type Localized<T> = Readonly<Record<Locale, T>>;

export interface LocaleState {
  locale: Locale;
  /** Arabic lays screens out right to left. */
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleState | null>(null);

interface LocaleProviderProps {
  /** Starting language; English, as in the designs. */
  initialLocale?: Locale;
  children: ReactNode;
}

/**
 * App language. Kept in memory (like the theme preference) until settings persistence exists.
 * Switching is instant: screens mirror through the `direction` style instead of
 * I18nManager, which would need an app restart.
 */
export function LocaleProvider({ initialLocale = 'en', children }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo(() => ({ locale, isRTL: locale === 'ar', setLocale }), [locale]);

  return <LocaleContext value={value}>{children}</LocaleContext>;
}
