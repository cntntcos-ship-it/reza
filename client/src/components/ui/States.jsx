import { AlertCircle } from 'lucide-react';

export function LoadingState({ label = 'در حال بارگذاری…', rows = 0 }) {
  if (rows > 0) {
    return (
      <div aria-busy="true" aria-label={label} className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] w-full rounded-soft bg-cream" />
            <div className="mt-4 h-3 w-3/4 rounded bg-cream" />
            <div className="mt-2 h-3 w-1/3 rounded bg-cream" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      className="flex min-h-[180px] items-center justify-center gap-3 text-sm text-muted"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-beige border-t-transparent" />
      {label}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-soft border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <h3 className="h2">{title}</h3>
      {description ? <p className="lede mt-3 max-w-md">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-soft border border-clay/25 bg-white px-6 py-14 text-center"
    >
      <AlertCircle size={22} className="text-clay" aria-hidden="true" />
      <p className="mt-4 text-sm text-ink">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn btn-outline btn-sm mt-5">
          تلاش دوباره
        </button>
      ) : null}
    </div>
  );
}
