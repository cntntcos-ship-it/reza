import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUi } from '../../context/UiContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatNumber } from '../../lib/format.js';
import { IconChevronDown, IconClose, IconHeart, IconUser } from '../ui/Icons.jsx';

export default function MobileNavigation({ categories }) {
  const { menuOpen, closeMenu } = useUi();
  const wishlist = useWishlist();
  const [expanded, setExpanded] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();
  }, [menuOpen]);

  if (!menuOpen) return null;

  const groups = [
    { id: 'c-women', title: 'زنانه', allSlug: 'women' },
    { id: 'c-men', title: 'مردانه', allSlug: 'men' },
    { id: 'c-bags-accessories', title: 'کیف و اکسسوری', allSlug: 'bags-accessories' },
  ];

  return (
    <>
      <div className="backdrop" onClick={closeMenu} aria-hidden="true" />
      <div className="drawer drawer--menu" role="dialog" aria-modal="true" aria-label="منوی فروشگاه">
        <div className="drawer__head">
          <span className="brand brand--small">
            <span className="brand__lat">LUNORA</span>
          </span>
          <button type="button" className="icon-btn" onClick={closeMenu} ref={closeRef} aria-label="بستن منو">
            <IconClose />
          </button>
        </div>

        <div className="drawer__body">
          <nav aria-label="منوی موبایل">
            <ul className="mobile-nav">
              <li>
                <Link className="mobile-nav__link" to="/shop" onClick={closeMenu}>
                  همه محصولات
                </Link>
              </li>

              {groups.map((group) => {
                const children = categories.filter((category) => category.parentId === group.id);
                const isOpen = expanded === group.id;
                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      className="mobile-nav__link mobile-nav__link--toggle"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : group.id)}
                    >
                      {group.title}
                      <IconChevronDown width={16} height={16} className={isOpen ? 'is-flipped' : undefined} />
                    </button>
                    {isOpen ? (
                      <ul className="mobile-nav__sub">
                        <li>
                          <Link to={`/category/${group.allSlug}`} onClick={closeMenu}>
                            همه‌ی {group.title}
                          </Link>
                        </li>
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link to={`/category/${child.slug}`} onClick={closeMenu}>
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}

              <li>
                <Link className="mobile-nav__link" to="/shop?sort=newest" onClick={closeMenu}>
                  جدیدترین‌ها
                </Link>
              </li>
              <li>
                <Link className="mobile-nav__link" to="/category/sale" onClick={closeMenu}>
                  حراج
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mobile-nav__footer">
            <Link to="/wishlist" className="mobile-nav__utility" onClick={closeMenu}>
              <IconHeart width={18} height={18} />
              علاقه‌مندی‌ها
              <span className="mobile-nav__count">{formatNumber(wishlist.count)}</span>
            </Link>
            <Link to="/account" className="mobile-nav__utility" onClick={closeMenu}>
              <IconUser width={18} height={18} />
              پیگیری سفارش
            </Link>
            <Link to="/contact" className="mobile-nav__utility" onClick={closeMenu}>
              تماس با ما
            </Link>
            <Link to="/faq" className="mobile-nav__utility" onClick={closeMenu}>
              سؤالات متداول
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
