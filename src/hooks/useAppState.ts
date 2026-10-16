import { useContext } from 'react';

import { AppContext, type AppState } from '@/context/AppContext';

export function useAppState(): AppState {
  const state = useContext(AppContext);
  if (!state) {
    throw new Error('useAppState must be used inside <AppProvider>.');
  }
  return state;
}
