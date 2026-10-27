import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { site } from '../../config/site.js';
import { useCart } from '../../lib/cart.jsx';
import { useWishlist } from '../../lib/wishlist.jsx';
import { useAuth } from '../../lib/auth.jsx';
import { toFa } from '../../lib/format.js';
import SearchPanel from './SearchPanel.jsx';
import MobileMenu from './MobileMenu.jsx';

function Badge({ value }) {
  if (!value) return null;
  return (
    <span className="num absolute -end-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium leading-none text-white">
      {toFa(value)}
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { count, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;

  return (
    <>
      <div className="bg-cream">
        <div className="shell flex min-h-9 items-center justify-center py-2 text-center">
          <p className="text-[10.5px] leading-5 text-muted md:text-[11px]">{site.announcement}</p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[60] transition-colors duration-300 ${
          solid ? 'border-b border-line bg-canvas/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="shell flex h-[68px] items-center gap-4 md:h-[76px]">
          <Link to="/" className="flex shrink-0 flex-col" aria-label={`${site.brand.nameFa} — صفحه اصلی`}>
            <span className="text-[19px] font-extrabold tracking-[0.32em] text-ink md:text-[21px]">
              {site.brand.name}
            </span>
            <span className="mt-0.5 text-[9.5px] text-muted">{site.brand.tagline}</span>
          </Link>

          <nav aria-label="ناوبری اصلی" className="mx-auto hidden xl:block">
            <ul className="flex items-center gap-6">
              {site.nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative flex h-11 items-center text-[12.5px] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-center after:bg-ink after:transition-transform after:duration-200 ${
                        isActive
                          ? 'text-ink after:scale-x-100'
                          : 'text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-0.5 xl:ms-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-muted"
              aria-label="جست‌وجو"
            >
              <Search size={18} />
            </button>
            <Link
              to={user ? '/account' : '/login'}
              className="hidden h-11 w-11 items-center justify-center text-ink transition-colors hover:text-muted sm:flex"
              aria-label={user ? 'حساب کاربری' : 'ورود به حساب'}
            >
              <User size={18} />
            </Link>
            <Link
              to="/wishlist"
              className="relative hidden h-11 w-11 items-center justify-center text-ink transition-colors hover:text-muted sm:flex"
              aria-label={`علاقه‌مندی‌ها${wishlistCount ? ` (${toFa(wishlistCount)} مورد)` : ''}`}
            >
              <Heart size={18} />
              <Badge value={wishlistCount} />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-muted"
              aria-label={`سبد خرید${count ? ` (${toFa(count)} قلم)` : ''}`}
            >
              <ShoppingBag size={18} />
              <Badge value={count} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-muted xl:hidden"
              aria-label="باز کردن منو"
              aria-expanded={menuOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
