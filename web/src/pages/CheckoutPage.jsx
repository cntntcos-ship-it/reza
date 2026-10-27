import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useSiteConfig } from '../context/ConfigContext.jsx';
import { useSeo } from '../lib/seo.js';
import { formatDate, formatNumber, formatToman } from '../lib/format.js';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { IconCheck } from '../components/ui/Icons.jsx';

const PROVINCES = [
  'تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'خراسان شمالی', 'خراسان جنوبی', 'آذربایجان شرقی',
  'آذربایجان غربی', 'اردبیل', 'زنجان', 'قزوین', 'قزوین', 'مرکزی', 'همدان', 'کردستان', 'کرمانشاه',
  'ایلام', 'لرستان', 'خوزستان', 'بوشهر', 'هرمزگان', 'سیستان و بلوچستان', 'کرمان', 'یزد', 'سمنان',
  'گلستان', 'مازندران', 'گیلان', 'قم', 'کهگیلویه و بویراحمد', 'چهارمحال و بختیاری',
];

const uniqueProvinces = [...new Set(PROVINCES)];

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  note: '',
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const config = useSiteConfig();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [shippingMethodId, setShippingMethodId] = useState(config.shippingMethods[0]?.id ?? 'standard');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  useSeo({ title: 'تسویه حساب', description: 'ثبت سفارش در لونورا.' });

  const shippingMethod =
    config.shippingMethods.find((method) => method.id === shippingMethodId) ?? config.shippingMethods[0];

  const shippingCost = useMemo(() => {
    if (!shippingMethod) return 0;
    return subtotal >= (config.freeShippingThreshold || 0) ? 0 : shippingMethod.price;
  }, [shippingMethod, subtotal, config.freeShippingThreshold]);

  const total = subtotal + shippingCost;

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const next = {};
    const phone = form.phone.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[\s-]/g, '');

    if (form.fullName.trim().length < 3) next.fullName = 'نام و نام خانوادگی را کامل وارد کنید.';
    if (!/^09\d{9}$/.test(phone)) next.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
      next.email = 'آدرس ایمیل معتبر نیست.';
    }
    if (!form.province) next.province = 'استان را انتخاب کنید.';
    if (form.city.trim().length < 2) next.city = 'شهر را وارد کنید.';
    if (form.address.trim().length < 10) next.address = 'نشانی را کامل‌تر وارد کنید.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await api.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        customer: { fullName: form.fullName.trim(), phone: form.phone.trim(), email: form.email.trim() },
        shipping: {
          method: shippingMethod?.id,
          province: form.province,
          city: form.city.trim(),
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
          note: form.note.trim(),
        },
        paymentMethod: 'cash_on_delivery',
      });
      setOrder(data.order);
      clearCart();
      window.scrollTo(0, 0);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: 'خانه', to: '/' },
              { name: 'تسویه حساب', to: '/checkout' },
              { name: 'سفارش ثبت‌شده', to: '/checkout' },
            ]}
          />

          <div className="order-success">
            <span className="order-success__icon" aria-hidden="true">
              <IconCheck width={26} height={26} />
            </span>
            <h1 className="order-success__title">سفارش شما ثبت شد</h1>
            <p className="order-success__text">
              کد پیگیری سفارش: <strong className="latin order-success__code" dir="ltr">{order.code}</strong>
            </p>
            <p className="order-success__text">
              مبلغ سفارش {formatToman(order.total)} است و هنگام تحویل پرداخت می‌شود. برای پیگیری، کد سفارش و
              شماره موبایل را در صفحه‌ی «پیگیری سفارش» وارد کنید.
            </p>

            <dl className="order-success__summary">
              <div>
                <dt>روش ارسال</dt>
                <dd>{order.shipping.methodTitle}</dd>
              </div>
              <div>
                <dt>هزینه ارسال</dt>
                <dd>{order.shippingCost === 0 ? 'رایگان' : formatToman(order.shippingCost)}</dd>
              </div>
              <div>
                <dt>تاریخ ثبت</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
              <div>
                <dt>وضعیت پرداخت</dt>
                <dd>پرداخت در محل (پرداخت‌نشده)</dd>
              </div>
            </dl>

            <div className="order-success__actions">
              <Link to="/account" className="btn btn--dark">
                پیگیری سفارش
              </Link>
              <Link to="/shop" className="btn btn--outline">
                ادامه‌ی خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: 'خانه', to: '/' },
              { name: 'تسویه حساب', to: '/checkout' },
            ]}
          />
          <EmptyState
            title="برای تسویه حساب، سبد خرید نباید خالی باشد"
            text="محصولی انتخاب کنید و دوباره به این صفحه برگردید."
            action={
              <Link to="/shop" className="btn btn--dark">
                مشاهده محصولات
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'سبد خرید', to: '/cart' },
            { name: 'تسویه حساب', to: '/checkout' },
          ]}
        />

        <header className="page__head">
          <p className="eyebrow">مرحله نهایی</p>
          <h1 className="page__title">تسویه حساب</h1>
          <p className="page__lead">اطلاعات تحویل را کامل کنید تا سفارش ثبت شود.</p>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="checkout-group">
              <legend>اطلاعات مشتری</legend>
              <div className="form-grid">
                <div className="field">
                  <label className="field__label" htmlFor="fullName">
                    نام و نام خانوادگی <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="fullName"
                    className="input"
                    value={form.fullName}
                    onChange={(event) => setField('fullName', event.target.value)}
                    aria-invalid={!!errors.fullName}
                    autoComplete="name"
                  />
                  {errors.fullName ? <p className="field__error">{errors.fullName}</p> : null}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="phone">
                    شماره موبایل <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    className="input"
                    value={form.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    placeholder="09xxxxxxxxx"
                    inputMode="tel"
                    dir="ltr"
                    aria-invalid={!!errors.phone}
                    autoComplete="tel"
                  />
                  {errors.phone ? <p className="field__error">{errors.phone}</p> : null}
                </div>

                <div className="field form-grid__full">
                  <label className="field__label" htmlFor="email">
                    ایمیل (اختیاری)
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value)}
                    dir="ltr"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email ? <p className="field__error">{errors.email}</p> : null}
                </div>
              </div>
            </fieldset>

            <fieldset className="checkout-group">
              <legend>نشانی تحویل</legend>
              <div className="form-grid">
                <div className="field">
                  <label className="field__label" htmlFor="province">
                    استان <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="province"
                    className="select"
                    value={form.province}
                    onChange={(event) => setField('province', event.target.value)}
                    aria-invalid={!!errors.province}
                  >
                    <option value="">انتخاب استان</option>
                    {uniqueProvinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province ? <p className="field__error">{errors.province}</p> : null}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="city">
                    شهر <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="city"
                    className="input"
                    value={form.city}
                    onChange={(event) => setField('city', event.target.value)}
                    aria-invalid={!!errors.city}
                    autoComplete="address-level2"
                  />
                  {errors.city ? <p className="field__error">{errors.city}</p> : null}
                </div>

                <div className="field form-grid__full">
                  <label className="field__label" htmlFor="address">
                    نشانی کامل پستی <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="address"
                    className="textarea"
                    value={form.address}
                    onChange={(event) => setField('address', event.target.value)}
                    aria-invalid={!!errors.address}
                    autoComplete="street-address"
                  />
                  {errors.address ? <p className="field__error">{errors.address}</p> : null}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="postalCode">
                    کد پستی (اختیاری)
                  </label>
                  <input
                    id="postalCode"
                    className="input"
                    value={form.postalCode}
                    onChange={(event) => setField('postalCode', event.target.value)}
                    inputMode="numeric"
                    dir="ltr"
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="note">
                    یادداشت برای سفارش (اختیاری)
                  </label>
                  <input
                    id="note"
                    className="input"
                    value={form.note}
                    onChange={(event) => setField('note', event.target.value)}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="checkout-group">
              <legend>روش ارسال</legend>
              <ul className="option-list">
                {config.shippingMethods.map((method) => (
                  <li key={method.id}>
                    <label className="option-card">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingMethodId === method.id}
                        onChange={() => setShippingMethodId(method.id)}
                      />
                      <span className="option-card__body">
                        <span className="option-card__title">{method.title}</span>
                        <span className="option-card__meta">{method.eta}</span>
                      </span>
                      <span className="option-card__price">
                        {subtotal >= (config.freeShippingThreshold || 0) ? 'رایگان' : formatToman(method.price)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset className="checkout-group">
              <legend>روش پرداخت</legend>
              <ul className="option-list">
                <li>
                  <label className="option-card">
                    <input type="radio" name="payment" value="cash_on_delivery" checked readOnly />
                    <span className="option-card__body">
                      <span className="option-card__title">پرداخت در محل</span>
                      <span className="option-card__meta">هنگام تحویل سفارش پرداخت می‌کنید.</span>
                    </span>
                  </label>
                </li>
                <li>
                  <label className="option-card option-card--disabled">
                    <input type="radio" name="payment" value="online_gateway" disabled />
                    <span className="option-card__body">
                      <span className="option-card__title">پرداخت آنلاین</span>
                      <span className="option-card__meta">{config.payments.note}</span>
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            {submitError ? (
              <p className="checkout-error" role="alert">
                {submitError}
              </p>
            ) : null}

            <button type="submit" className="btn btn--dark btn--block" disabled={submitting}>
              {submitting ? 'در حال ثبت سفارش…' : 'ثبت سفارش'}
            </button>
          </form>

          <aside className="checkout-summary" aria-label="خلاصه سفارش">
            <h2 className="checkout-summary__title">خلاصه سفارش</h2>

            <ul className="checkout-summary__items">
              {items.map((item) => (
                <li key={item.key}>
                  <img src={item.image} alt="" width={56} height={70} loading="lazy" />
                  <span className="checkout-summary__item-body">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    <span className="checkout-summary__item-meta">
                      {item.size === 'ONE' ? 'تک‌سایز' : `سایز ${item.size}`} · {item.color} ·{' '}
                      {formatNumber(item.quantity)} عدد
                    </span>
                  </span>
                  <span className="checkout-summary__item-price">{formatToman(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="cart-summary__rows">
              <div>
                <dt>جمع کالاها</dt>
                <dd>{formatToman(subtotal)}</dd>
              </div>
              <div>
                <dt>ارسال ({shippingMethod?.title ?? '—'})</dt>
                <dd>{shippingCost === 0 ? 'رایگان' : formatToman(shippingCost)}</dd>
              </div>
            </dl>

            <div className="cart-summary__total">
              <span>مبلغ قابل پرداخت</span>
              <strong>{formatToman(total)}</strong>
            </div>

            <p className="cart-summary__note">{config.payments.note}</p>
            <p className="cart-summary__note">
              مبلغ نهایی روی سرور محاسبه می‌شود؛ اگر قیمت یا موجودی محصولی تغییر کرده باشد، سفارش ثبت نمی‌شود و
              پیام خطا نمایش داده می‌شود.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
