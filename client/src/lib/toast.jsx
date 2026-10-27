import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Check, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message, tone = 'success') => {
      const id = nextId++;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-soft border border-line bg-white px-4 py-3 text-[13px] shadow-card"
          >
            <span
              className={`mt-0.5 shrink-0 ${
                toast.tone === 'error' ? 'text-clay' : 'text-ink'
              }`}
              aria-hidden="true"
            >
              {toast.tone === 'error' ? <Info size={16} /> : <Check size={16} />}
            </span>
            <p className="flex-1 leading-6 text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-muted transition-colors hover:text-ink"
              aria-label="بستن پیام"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
