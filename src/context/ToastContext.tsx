import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Toast, type ToastMessage } from '@/components/ui/Toast';

export interface ToastState {
  /** Shows a short notice above the tab bar, replacing any notice already showing. */
  showToast: (message: Omit<ToastMessage, 'id'>) => void;
}

export const ToastContext = createContext<ToastState | null>(null);

/** App-wide notices. Render inside the theme and locale providers, around the navigator. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (next: Omit<ToastMessage, 'id'>) => setMessage({ ...next, id: Date.now() }),
    [],
  );
  const handleHidden = useCallback(() => setMessage(null), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext value={value}>
      <View style={styles.fill}>
        {children}
        {message && <Toast key={message.id} message={message} onHidden={handleHidden} />}
      </View>
    </ToastContext>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
