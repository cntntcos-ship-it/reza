import { Link } from 'react-router-dom';
import { IconChevronLeft } from '../ui/Icons.jsx';

/** items: [{ name, to }] — the last item renders as the current page. */
export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="مسیر صفحه">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`}>
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <>
                  <Link to={item.to}>{item.name}</Link>
                  <IconChevronLeft width={12} height={12} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
