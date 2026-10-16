import { useContext } from 'react';

import { ToastContext, type ToastState } from '@/context/ToastContext';

export function useToast(): ToastState {
  const state = useContext(ToastContext);
  if (!state) {
    throw new Error('useToast must be used inside <ToastProvider>.');
  }
  return state;
}
