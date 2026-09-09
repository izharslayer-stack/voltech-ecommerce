'use client';

import { useToastStore } from '@/store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastType } from '@/types';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-[#315C45]" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-l-[#315C45]',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-amber-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-3 bg-white shadow-lg border border-[#E5E3DC] border-l-4 px-4 py-3 min-w-[280px] max-w-sm ${borderColors[toast.type]}`}
            role="alert"
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-[#171717] leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-1 p-0.5 text-[#6F6F68] hover:text-[#171717] transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
