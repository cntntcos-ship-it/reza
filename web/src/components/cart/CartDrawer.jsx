import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { useSiteConfig } from '../../context/ConfigContext.jsx';
import { formatNumber, formatToman } from '../../lib/format.js';
import { IconClose, IconTrash } from '../ui/Icons.jsx';
import { EmptyState, QuantityStepper } from '../ui/States.jsx';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUi();
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();
  const config = useSiteConfig();

  if (!cartOpen) return null;

  const threshold = config.freeShippingThreshold || 0;
  const remaining = Math.max(threshold - subtotal, 0);

  return (
    <>
      <div className="backdrop" onClick={closeCart} aria-hidden="true" />
      <aside className="drawer drawer--cart" role="dialog" aria-modal="true" aria-label="سبد خرید">
        <div className="drawer__head">
          <h2 className="drawer__title">
            سبد خرید {count > 0 ? <span className="drawer__count">({formatNumber(count)} کالا)</span> : null}
          </h2>
          <button type="button" className="icon-btn" onClick={closeCart} aria-label="بستن سبد خرید" autoFocus>
            <IconClose />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__body drawer__body--empty">
            <EmptyState
              title="سبد خرید خالی است"
              text="از میان کالکشن‌های لونورا انتخاب کن و اینجا ببین."
              action={
                <Link to="/shop" className="btn btn--dark" onClick={closeCart}>
                  مشاهده محصولات
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <ul className="drawer-items">
                {items.map((item) => (
                  <li className="drawer-item" key={item.key}>
                    <Link to={`/product/${item.slug}`} onClick={closeCart} className="drawer-item__media">
                      <img src={item.image} alt={item.name} width={80} height={100} loading="lazy" />
                    </Link>
                    <div className="drawer-item__body">
                      <Link to={`/product/${item.slug}`} onClick={closeCart} className="drawer-item__name">
                        {item.name}
                      </Link>
                      <p className="drawer-item__meta">
                        <span>سایز {item.size === 'ONE' ? 'تک‌سایز' : item.size}</span>
                        <span>·</span>
                        <span>{item.color}</span>
                      </p>
                      <div className="drawer-item__row">
                        <QuantityStepper
                          value={item.quantity}
                          max={Math.min(item.maxStock || 10, 10)}
                          onChange={(value) => updateQuantity(item.key, value)}
                          label={`تعداد ${item.name}`}
                        />
                        <span className="drawer-item__price">{formatToman(item.price * item.quantity)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="drawer-item__remove"
                      onClick={() => removeItem(item.key)}
                      aria-label={`حذف ${item.name} از سبد`}
                    >
                      <IconTrash width={16} height={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="drawer__foot">
              <div className="drawer-total">
                <span>جمع کالاها</span>
                <strong>{formatToman(subtotal)}</strong>
              </div>
              <p className="drawer__note">
                {remaining > 0
                  ? `${formatToman(remaining)} تا ارسال رایگان باقی مانده است.`
                  : 'سفارش شما مشمول ارسال رایگان است.'}
              </p>
              <div className="drawer__actions">
                <Link to="/cart" className="btn btn--outline btn--block" onClick={closeCart}>
                  مشاهده سبد خرید
                </Link>
                <Link to="/checkout" className="btn btn--dark btn--block" onClick={closeCart}>
                  ادامه به تسویه حساب
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
