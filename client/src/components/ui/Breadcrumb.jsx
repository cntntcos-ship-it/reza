import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="مسیر صفحه" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {isLast || !item.to ? (
                <span aria-current="page" className="text-ink">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              )}
              {isLast ? null : <ChevronLeft size={13} aria-hidden="true" className="text-beige" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
