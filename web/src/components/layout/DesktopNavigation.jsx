import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconChevronDown } from '../ui/Icons.jsx';

const MAIN_LINKS = [
  { to: '/shop?sort=newest', label: 'جدیدترین‌ها' },
  { to: '/category/women', label: 'زنانه' },
  { to: '/category/men', label: 'مردانه' },
  { to: '/category/dresses', label: 'لباس‌ها' },
  { to: '/category/bags-accessories', label: 'کیف و اکسسوری' },
  { to: '/category/sale', label: 'حراج' },
];

const COLUMNS = [
  { parentId: 'c-women', title: 'زنانه', allSlug: 'women' },
  { parentId: 'c-men', title: 'مردانه', allSlug: 'men' },
  { parentId: 'c-bags-accessories', title: 'کیف و اکسسوری', allSlug: 'bags-accessories' },
];

export default function DesktopNavigation({ categories }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMegaOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearTimeout(closeTimer.current);
      setMegaOpen(false);
    }
  };

  return (
    <nav className="nav" aria-label="منوی اصلی">
      <ul className="nav__list">
        <li
          className="nav__item"
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
          onFocus={openMega}
          onBlur={handleBlur}
        >
          <button
            type="button"
            className="nav__link nav__link--toggle"
            aria-expanded={megaOpen}
            aria-controls="mega-menu"
            onClick={() => setMegaOpen((value) => !value)}
          >
            فروشگاه
            <IconChevronDown width={13} height={13} className={megaOpen ? 'is-flipped' : undefined} />
          </button>

          {megaOpen ? (
            <div id="mega-menu" className="mega">
              <div className="container mega__inner">
                {COLUMNS.map((column) => {
                  const children = categories.filter((category) => category.parentId === column.parentId);
                  if (!children.length) return null;
                  return (
                    <div className="mega__col" key={column.parentId}>
                      <p className="mega__title">{column.title}</p>
                      <ul className="mega__links">
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link to={`/category/${child.slug}`}>{child.name}</Link>
                          </li>
                        ))}
                      </ul>
                      <Link to={`/category/${column.allSlug}`} className="mega__all">
                        همه محصولات {column.title}
                      </Link>
                    </div>
                  );
                })}

                <div className="mega__col mega__col--links">
                  <p className="mega__title">دسترسی سریع</p>
                  <ul className="mega__links">
                    <li>
                      <Link to="/shop">همه محصولات</Link>
                    </li>
                    <li>
                      <Link to="/shop?sort=newest">تازه رسیده‌ها</Link>
                    </li>
                    <li>
                      <Link to="/category/sale">حراج</Link>
                    </li>
                    <li>
                      <Link to="/category/shoes">کفش</Link>
                    </li>
                    <li>
                      <Link to="/category/accessories">اکسسوری</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </li>

        {MAIN_LINKS.map((link) => (
          <li className="nav__item" key={link.to}>
            <Link className="nav__link" to={link.to}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
