import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

import { assistantConfig } from '@/constants/assistantConfig';

/**
 * App-wide UI state shared across screens. Kept in memory only for now;
 * persistence (e.g. so returning users skip the welcome screen) comes with later screens.
 */
export interface AppState {
  hasSeenWelcome: boolean;
  markWelcomeSeen: () => void;
  /**
   * The resident the assistant answers for, or `null` for a guest. Until the app has real
   * sign-in this is a demo resident (see assistantConfig).
   * TODO(auth): set from the signed-in profile once the auth service exists.
   */
  residentId: number | null;
  setResidentId: (residentId: number | null) => void;
}

export const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [residentId, setResidentId] = useState<number | null>(assistantConfig.defaultResidentId);
  const markWelcomeSeen = useCallback(() => setHasSeenWelcome(true), []);

  const value = useMemo(
    () => ({ hasSeenWelcome, markWelcomeSeen, residentId, setResidentId }),
    [hasSeenWelcome, markWelcomeSeen, residentId],
  );

  return <AppContext value={value}>{children}</AppContext>;
}
