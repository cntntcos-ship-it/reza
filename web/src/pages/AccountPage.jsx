import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/seo.js';
import { formatDate, formatToman, orderStatusLabel, paymentStatusLabel } from '../lib/format.js';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';

export default function AccountPage() {
  const [form, setForm] = useState({ code: '', phone: '' });
  const [state, setState] = useState({ status: 'idle', order: null, error: '' });

  useSeo({
    title: 'پیگیری سفارش',
    description: 'با کد سفارش و شماره موبایل، وضعیت سفارش لونورا را پیگیری کنید.',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ status: 'loading', order: null, error: '' });

    try {
      const data = await api.lookupOrder(form.code.trim(), form.phone.trim());
      setState({ status: 'ready', order: data.order, error: '' });
    } catch (error) {
      setState({ status: 'error', order: null, error: error.message });
    }
  };

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'پیگیری سفارش', to: '/account' },
          ]}
        />

        <header className="page__head">
          <p className="eyebrow">حساب کاربری</p>
          <h1 className="page__title">پیگیری سفارش</h1>
          <p className="page__lead">
            ورود با رمز عبور در این نسخه فعال نیست؛ برای دیدن وضعیت سفارش، کد پیگیری و شماره‌ی موبایل ثبت‌شده را
            وارد کنید.
          </p>
        </header>

        <div className="account-layout">
          <form className="account-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field__label" htmlFor="order-code">
                کد پیگیری سفارش
              </label>
              <input
                id="order-code"
                className="input"
                value={form.code}
                onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
                placeholder="LN-123456"
                dir="ltr"
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="order-phone">
                شماره موبایل
              </label>
              <input
                id="order-phone"
                className="input"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="09xxxxxxxxx"
                inputMode="tel"
                dir="ltr"
                required
              />
            </div>

            {state.error ? (
              <p className="checkout-error" role="alert">
                {state.error}
              </p>
            ) : null}

            <button type="submit" className="btn btn--dark btn--block" disabled={state.status === 'loading'}>
              {state.status === 'loading' ? 'در حال بررسی…' : 'دیدن وضعیت سفارش'}
            </button>

            <p className="account-form__hint">
              کد پیگیری را هنگام ثبت سفارش دریافت کرده‌اید. اگر آن را ندارید، از{' '}
              <Link to="/contact">فرم تماس</Link> با ما در ارتباط باشید.
            </p>
          </form>

          {state.order ? (
            <section className="order-card" aria-label="جزئیات سفارش">
              <div className="order-card__head">
                <div>
                  <p className="eyebrow">کد سفارش</p>
                  <p className="order-card__code latin" dir="ltr">
                    {state.order.code}
                  </p>
                </div>
                <span className="badge badge--soft">{orderStatusLabel(state.order.orderStatus)}</span>
              </div>

              <dl className="order-card__meta">
                <div>
                  <dt>تاریخ ثبت</dt>
                  <dd>{formatDate(state.order.createdAt)}</dd>
                </div>
                <div>
                  <dt>وضعیت پرداخت</dt>
                  <dd>{paymentStatusLabel(state.order.payment.status)}</dd>
                </div>
                <div>
                  <dt>روش ارسال</dt>
                  <dd>{state.order.shipping.methodTitle}</dd>
                </div>
                <div>
                  <dt>نشانی</dt>
                  <dd>
                    {state.order.shipping.province}، {state.order.shipping.city}، {state.order.shipping.address}
                  </dd>
                </div>
              </dl>

              <ul className="order-card__items">
                {state.order.items.map((item) => (
                  <li key={`${item.productId}-${item.size}-${item.color}`}>
                    <img src={item.image} alt="" width={52} height={65} loading="lazy" />
                    <span>
                      <span className="order-card__item-name">{item.name}</span>
                      <span className="order-card__item-meta">
                        {item.size === 'ONE' ? 'تک‌سایز' : `سایز ${item.size}`} · {item.color} · {item.quantity} عدد
                      </span>
                    </span>
                    <span className="order-card__item-price">{formatToman(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="order-card__total">
                <span>مبلغ کل</span>
                <strong>{formatToman(state.order.total)}</strong>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
