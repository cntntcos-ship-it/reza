import { useToast } from '../../context/ToastContext.jsx';
import { IconClose } from './Icons.jsx';

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-viewport" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="بستن پیام">
            <IconClose width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
