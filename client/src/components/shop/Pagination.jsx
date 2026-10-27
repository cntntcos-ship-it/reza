import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toFa } from '../../lib/format.js';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const candidates = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === pages || Math.abs(item - page) <= 1,
  );

  return (
    <nav aria-label="صفحه‌بندی" className="mt-12 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex h-11 w-11 items-center justify-center rounded-soft border border-line bg-white text-ink transition-colors hover:border-beige disabled:opacity-40"
        aria-label="صفحه قبلی"
      >
        <ChevronRight size={16} />
      </button>

      {candidates.map((item, index) => {
        const previous = candidates[index - 1];
        const gap = previous && item - previous > 1;
        return (
          <span key={item} className="flex items-center gap-1.5">
            {gap ? <span className="px-1 text-muted">…</span> : null}
            <button
              type="button"
              onClick={() => onChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`num h-11 min-w-11 rounded-soft border px-3 text-[13px] transition-colors ${
                item === page
                  ? 'border-ink bg-ink text-white'
                  : 'border-line bg-white text-ink hover:border-beige'
              }`}
            >
              {toFa(item)}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="flex h-11 w-11 items-center justify-center rounded-soft border border-line bg-white text-ink transition-colors hover:border-beige disabled:opacity-40"
        aria-label="صفحه بعدی"
      >
        <ChevronLeft size={16} />
      </button>
    </nav>
  );
}
