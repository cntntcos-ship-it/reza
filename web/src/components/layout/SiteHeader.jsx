import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { formatNumber } from '../../lib/format.js';
import { IconBag, IconHeart, IconMenu, IconSearch, IconUser } from '../ui/Icons.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import MobileNavigation from './MobileNavigation.jsx';

export default function SiteHeader() {
  const { categories } = useConfig();
  const cart = useCart();
  const wishlist = useWishlist();
  const { openSearch, openCart, openMenu } = useUi();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand" aria-label="لونورا، صفحه اصلی">
          <span className="brand__lat">LUNORA</span>
          <span className="brand__fa">لونورا</span>
        </Link>

        <DesktopNavigation categories={categories} />

        <div className="header__actions">
          <button type="button" className="icon-btn" onClick={(event) => openSearch(event.currentTarget)} aria-label="جست‌وجوی محصولات">
            <IconSearch />
          </button>

          <Link to="/account" className="icon-btn icon-btn--desktop" aria-label="پیگیری سفارش">
            <IconUser />
          </Link>

          <Link
            to="/wishlist"
            className="icon-btn icon-btn--desktop icon-btn--badged"
            aria-label={`علاقه‌مندی‌ها، ${formatNumber(wishlist.count)} کالا`}
          >
            <IconHeart />
            {wishlist.count > 0 ? (
              <span className="icon-btn__badge" aria-hidden="true">
                {formatNumber(wishlist.count)}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="icon-btn icon-btn--badged"
            onClick={(event) => openCart(event.currentTarget)}
            aria-label={`سبد خرید، ${formatNumber(cart.count)} کالا`}
          >
            <IconBag />
            {cart.count > 0 ? (
              <span className="icon-btn__badge" aria-hidden="true">
                {formatNumber(cart.count)}
              </span>
            ) : null}
          </button>

          <button type="button" className="icon-btn icon-btn--mobile" onClick={openMenu} aria-label="باز کردن منو">
            <IconMenu />
          </button>
        </div>
      </div>

      <MobileNavigation categories={categories} />
    </header>
  );
}
