import { useContext } from 'react';

import { LocaleContext, type LocaleState } from '@/context/LocaleContext';

export function useLocale(): LocaleState {
  const state = useContext(LocaleContext);
  if (!state) {
    throw new Error('useLocale must be used inside <LocaleProvider>.');
  }
  return state;
}
