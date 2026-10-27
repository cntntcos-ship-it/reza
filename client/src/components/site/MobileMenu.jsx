import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { site } from '../../config/site.js';
import { useCategories } from '../../lib/useCategories.js';
import { useAuth } from '../../lib/auth.jsx';

export default function MobileMenu({ open, onClose }) {
  const { categories } = useCategories();
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[85] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="بستن منو"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-canvas shadow-drawer transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link to="/" onClick={onClose} className="flex flex-col">
            <span className="text-lg font-extrabold tracking-[0.3em] text-ink">
              {site.brand.name}
            </span>
            <span className="mt-1 text-[10px] text-muted">{site.brand.tagline}</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="flex h-11 w-11 items-center justify-center text-ink"
            aria-label="بستن منو"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-5" aria-label="ناوبری موبایل">
          <ul className="space-y-1">
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center text-[15px] transition-colors ${
                      isActive ? 'font-medium text-ink' : 'text-muted hover:text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {categories.length ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[11px] text-muted">دسته‌بندی‌ها</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      onClick={onClose}
                      tabIndex={open ? 0 : -1}
                      className="flex min-h-10 items-center justify-between text-[13px] text-ink"
                    >
                      {category.name}
                      <span className="num text-[11px] text-muted">{category.productCount}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 border-t border-line pt-5">
            <Link
              to={user ? '/account' : '/login'}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="flex min-h-11 items-center text-[13px] text-ink"
            >
              {user ? 'حساب کاربری من' : 'ورود و ثبت‌نام'}
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="flex min-h-11 items-center text-[13px] text-ink"
            >
              علاقه‌مندی‌ها
            </Link>
            <Link
              to="/track-order"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="flex min-h-11 items-center text-[13px] text-ink"
            >
              پیگیری سفارش
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
