import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../lib/cart.jsx';
import { img } from '../../lib/img.js';
import { formatToman, sizeLabel, toFa } from '../../lib/format.js';

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, count, updateQuantity, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-[90] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button
        type="button"
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="بستن سبد خرید"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream shadow-drawer transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-beige/60 px-5 py-4">
          <h2 className="text-sm font-bold">
            سبد خرید {count ? <span className="num text-muted">({toFa(count)})</span> : null}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            tabIndex={isOpen ? 0 : -1}
            className="flex h-11 w-11 items-center justify-center text-ink"
            aria-label="بستن سبد خرید"
          >
            <X size={19} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={26} className="text-beige" aria-hidden="true" />
            <p className="mt-4 text-sm text-ink">سبد خرید شما خالی است.</p>
            <p className="mt-1 text-xs text-muted">
              از کالکشن‌های ما شروع کنید و انتخاب‌های خود را اینجا ببینید.
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              tabIndex={isOpen ? 0 : -1}
              className="btn btn-primary mt-6"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-beige/60 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <Link to={`/product/${item.slug}`} onClick={closeCart} tabIndex={isOpen ? 0 : -1}>
                    <img
                      src={img(item.image, 200)}
                      alt={item.name}
                      width={80}
                      height={104}
                      loading="lazy"
                      className="h-[104px] w-20 rounded-soft bg-white object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCart}
                        tabIndex={isOpen ? 0 : -1}
                        className="text-[13px] leading-6 text-ink hover:text-muted"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        tabIndex={isOpen ? 0 : -1}
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-clay"
                        aria-label={`حذف ${item.name} از سبد خرید`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="mt-0.5 text-[11px] text-muted">
                      {item.size ? `سایز ${sizeLabel(item.size)}` : null}
                      {item.size && item.color ? ' • ' : null}
                      {item.color ? `رنگ ${item.color}` : null}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-soft border border-beige/70 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={item.quantity >= Math.min(item.stock, 10)}
                          tabIndex={isOpen ? 0 : -1}
                          className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-30"
                          aria-label={`افزودن یک عدد ${item.name}`}
                        >
                          <Plus size={13} />
                        </button>
                        <span className="num w-6 text-center text-xs">{toFa(item.quantity)}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          tabIndex={isOpen ? 0 : -1}
                          className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-30"
                          aria-label={`کاهش یک عدد ${item.name}`}
                        >
                          <Minus size={13} />
                        </button>
                      </div>
                      <p className="num text-[13px] font-medium">
                        {formatToman(item.price * item.quantity)}
                        <span className="ms-1 text-[10px] font-normal text-muted">تومان</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-beige/60 bg-cream px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">جمع سبد خرید</span>
                <span className="num font-semibold">
                  {formatToman(subtotal)} <span className="text-[11px] font-normal text-muted">تومان</span>
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-5 text-muted">
                هزینه ارسال و مبلغ نهایی در مرحله تسویه‌حساب محاسبه می‌شود.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  tabIndex={isOpen ? 0 : -1}
                  className="btn btn-primary w-full"
                >
                  ادامه فرایند خرید
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  tabIndex={isOpen ? 0 : -1}
                  className="btn btn-light w-full"
                >
                  مشاهده سبد خرید
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
