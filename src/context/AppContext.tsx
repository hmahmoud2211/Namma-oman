import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

/**
 * App-wide UI state shared across screens. Kept in memory only for now;
 * persistence (e.g. so returning users skip the welcome screen) comes with later screens.
 */
export interface AppState {
  hasSeenWelcome: boolean;
  markWelcomeSeen: () => void;
}

export const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const markWelcomeSeen = useCallback(() => setHasSeenWelcome(true), []);

  const value = useMemo(
    () => ({ hasSeenWelcome, markWelcomeSeen }),
    [hasSeenWelcome, markWelcomeSeen],
  );

  return <AppContext value={value}>{children}</AppContext>;
}
