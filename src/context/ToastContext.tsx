import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Toast } from '@/types';

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  showToast: (toast: Omit<Toast, 'id'> | string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const showToast = useCallback((toast: Omit<Toast, 'id'> | string, type: Toast['type'] = 'info') => {
    addToast(typeof toast === 'string' ? { title: toast, type } : toast);
  }, [addToast]);

  const value = useMemo(() => ({ toasts, addToast, showToast, removeToast }), [toasts, addToast, showToast, removeToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
