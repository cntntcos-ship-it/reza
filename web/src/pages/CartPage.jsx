import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useSiteConfig } from '../context/ConfigContext.jsx';
import { useSeo } from '../lib/seo.js';
import { formatNumber, formatToman } from '../lib/format.js';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';
import { EmptyState, QuantityStepper } from '../components/ui/States.jsx';
import { IconTrash } from '../components/ui/Icons.jsx';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const config = useSiteConfig();

  useSeo({ title: 'سبد خرید', description: 'سبد خرید لونورا؛ بررسی کالاها پیش از تسویه حساب.' });

  const threshold = config.freeShippingThreshold || 0;
  const remaining = Math.max(threshold - subtotal, 0);

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'سبد خرید', to: '/cart' },
          ]}
        />

        <header className="page__head">
          <p className="eyebrow">پیش از تسویه</p>
          <h1 className="page__title">سبد خرید</h1>
        </header>

        {items.length === 0 ? (
          <EmptyState
            title="سبد خریدتان خالی است"
            text="از میان کالکشن‌های لونورا انتخاب کن؛ کالاها اینجا ذخیره می‌شوند."
            action={
              <Link to="/shop" className="btn btn--dark">
                مشاهده محصولات
              </Link>
            }
          />
        ) : (
          <div className="cart-layout">
            <section aria-label="کالاهای سبد خرید" className="cart-list">
              <ul>
                {items.map((item) => (
                  <li className="cart-row" key={item.key}>
                    <Link to={`/product/${item.slug}`} className="cart-row__media">
                      <img src={item.image} alt={item.name} width={100} height={125} loading="lazy" />
                    </Link>

                    <div className="cart-row__body">
                      <Link to={`/product/${item.slug}`} className="cart-row__name">
                        {item.name}
                      </Link>
                      <p className="cart-row__meta">
                        سایز {item.size === 'ONE' ? 'تک‌سایز' : item.size} · رنگ {item.color}
                      </p>
                      <p className="cart-row__unit">قیمت واحد: {formatToman(item.price)}</p>

                      <div className="cart-row__controls">
                        <QuantityStepper
                          value={item.quantity}
                          max={Math.min(item.maxStock || 10, 10)}
                          onChange={(value) => updateQuantity(item.key, value)}
                          label={`تعداد ${item.name}`}
                        />
                        <button
                          type="button"
                          className="cart-row__remove"
                          onClick={() => removeItem(item.key)}
                          aria-label={`حذف ${item.name} از سبد`}
                        >
                          <IconTrash width={16} height={16} />
                          حذف
                        </button>
                      </div>
                    </div>

                    <p className="cart-row__total">{formatToman(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>

              <div className="cart-list__foot">
                <Link to="/shop" className="link-arrow">
                  ادامه‌ی خرید
                </Link>
              </div>
            </section>

            <aside className="cart-summary" aria-label="خلاصه سفارش">
              <h2 className="cart-summary__title">خلاصه سفارش</h2>

              <dl className="cart-summary__rows">
                <div>
                  <dt>جمع کالاها ({formatNumber(items.length)} قلم)</dt>
                  <dd>{formatToman(subtotal)}</dd>
                </div>
                <div>
                  <dt>هزینه ارسال</dt>
                  <dd>{remaining === 0 ? 'رایگان' : 'در مرحله بعد'}</dd>
                </div>
              </dl>

              <p className="cart-summary__note">
                {remaining > 0
                  ? `${formatToman(remaining)} تا ارسال رایگان باقی مانده است.`
                  : 'این سفارش مشمول ارسال رایگان است.'}{' '}
                هزینه‌ی نهایی پس از انتخاب روش ارسال در مرحله‌ی تسویه حساب محاسبه می‌شود.
              </p>

              <div className="cart-summary__total">
                <span>مبلغ کالاها</span>
                <strong>{formatToman(subtotal)}</strong>
              </div>

              <Link to="/checkout" className="btn btn--dark btn--block">
                ادامه به تسویه حساب
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
