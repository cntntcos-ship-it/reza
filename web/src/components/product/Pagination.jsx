import { formatNumber } from '../../lib/format.js';
import { IconChevronLeft } from '../ui/Icons.jsx';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="صفحه‌بندی محصولات">
      <button
        type="button"
        className="pagination__step"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="صفحه‌ی قبل"
      >
        <IconChevronLeft width={16} height={16} className="pagination__icon-next" />
        قبلی
      </button>

      <ul className="pagination__pages">
        {pages.map((item) => (
          <li key={item}>
            <button
              type="button"
              className={`pagination__page ${item === page ? 'is-active' : ''}`}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
            >
              {formatNumber(item)}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__step"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="صفحه‌ی بعد"
      >
        بعدی
        <IconChevronLeft width={16} height={16} className="pagination__icon-prev" />
      </button>
    </nav>
  );
}
