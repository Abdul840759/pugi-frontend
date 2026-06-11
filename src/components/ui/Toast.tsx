import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={cn(
                'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg sm:w-80',
                styles[toast.type],
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-xs opacity-80">{toast.message}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
