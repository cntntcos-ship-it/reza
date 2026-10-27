import { IconMinus, IconPlus } from './Icons.jsx';

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {text ? <p className="empty-state__text">{text}</p> : null}
      {action ?? null}
    </div>
  );
}

export function ErrorState({ title = 'مشکلی پیش آمد', text, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__text">{text || 'اطلاعات از سرور دریافت نشد. لطفاً دوباره تلاش کنید.'}</p>
      {onRetry ? (
        <button type="button" className="btn btn--dark" onClick={onRetry}>
          تلاش دوباره
        </button>
      ) : null}
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="product-card product-card--skeleton" key={index}>
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--line" style={{ width: '70%', marginTop: '1rem' }} />
          <div className="skeleton skeleton--line" style={{ width: '40%', marginTop: '.6rem' }} />
        </div>
      ))}
    </div>
  );
}

export function LoadingState({ label = 'در حال بارگذاری…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function QuantityStepper({ value, min = 1, max = 10, onChange, label = 'تعداد' }) {
  const decreaseDisabled = value <= min;
  const increaseDisabled = value >= max;

  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={decreaseDisabled}
        aria-label="کاهش تعداد"
      >
        <IconMinus width={16} height={16} />
      </button>
      <span className="qty__value" aria-live="polite">
        {new Intl.NumberFormat('fa-IR').format(value)}
      </span>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={increaseDisabled}
        aria-label="افزایش تعداد"
      >
        <IconPlus width={16} height={16} />
      </button>
    </div>
  );
}


