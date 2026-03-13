import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../../types';
import { useToast } from '../../context/ToastContext';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'border-green-500 bg-green-500/10 text-green-400',
  error: 'border-red-500 bg-red-500/10 text-red-400',
  warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
  info: 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan',
};

interface ToastItemProps {
  toast: ToastType;
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();
  const Icon = icons[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md animate-slide-up ${colors[toast.type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
