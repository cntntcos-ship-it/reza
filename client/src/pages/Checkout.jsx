import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';
import { useCart } from '../lib/cart.jsx';
import { useAuth } from '../lib/auth.jsx';
import { useSettings } from '../lib/useSettings.js';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/useSeo.js';
import { formatToman, toFa } from '../lib/format.js';
import { provinces } from '../config/provinces.js';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { EmptyState, LoadingState } from '../components/ui/States.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const initialForm = {
  name: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  addressLine: '',
  postalCode: '',
  note: '',
};

export default function Checkout() {
  const { items, subtotal, count, clear } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ...initialForm,
    name: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useSeo({ title: 'تسویه حساب', description: 'ثبت اطلاعات ارسال و نهایی کردن سفارش.' });

  const shippingCost = useMemo(() => {
    const method = settings?.shippingMethods?.find((option) => option.id === shippingMethod);
    return method?.cost ?? 0;
  }, [settings, shippingMethod]);

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'نام و نام خانوادگی را کامل وارد کنید.';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'ایمیل معتبر وارد کنید.';
    if (!/^0?9\d{9}$/.test(form.phone.replace(/\s/g, ''))) next.phone = 'شماره موبایل معتبر وارد کنید.';
    if (!form.province) next.province = 'استان را انتخاب کنید.';
    if (form.city.trim().length < 2) next.city = 'نام شهر را وارد کنید.';
    if (form.addressLine.trim().length < 10) next.addressLine = 'نشانی را کامل‌تر وارد کنید.';
    if (form.postalCode && !/^\d{10}$/.test(form.postalCode)) next.postalCode = 'کد پستی باید ۱۰ رقم باشد.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const data = await api.post('/orders', {
        customer: { name: form.name, email: form.email, phone: form.phone },
        address: {
          province: form.province,
          city: form.city,
          addressLine: form.addressLine,
          postalCode: form.postalCode,
        },
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        shippingMethod,
        note: form.note,
      });
      clear();
      navigate(`/order/${data.order.orderNumber}`, { state: { order: data.order } });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (count === 0) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="برای تسویه‌حساب، سبد خرید نباید خالی باشد"
          description="محصولی انتخاب کنید و سپس به این صفحه بازگردید."
          action={
            <Link to="/shop" className="btn btn-primary">
              مشاهده محصولات
            </Link>
          }
        />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="shell py-16">
        <LoadingState label="در حال آماده‌سازی تسویه‌حساب…" />
      </div>
    );
  }

  const total = subtotal + shippingCost;

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'سبد خرید', to: '/cart' }, { label: 'تسویه حساب' }]} />
      <h1 className="h1 mt-5">تسویه حساب</h1>

      <div className="mt-4 flex items-start gap-2.5 rounded-soft border border-beige/70 bg-cream/60 p-4 text-[11.5px] leading-6 text-muted">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-ink/70" aria-hidden="true" />
        <p>
          درگاه پرداخت آنلاین در این نسخه پیکربندی نشده است. با ثبت سفارش، مبلغی از حساب شما کسر
          نمی‌شود و سفارش با وضعیت «در انتظار پرداخت» ثبت می‌گردد.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="space-y-8">
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="h2">
              اطلاعات تماس و گیرنده
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-name" className="label">
                  نام و نام خانوادگی
                </label>
                <input
                  id="checkout-name"
                  value={form.name}
                  onChange={setField('name')}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className={`field ${errors.name ? 'field-error' : ''}`}
                />
                {errors.name ? <p className="error-text">{errors.name}</p> : null}
              </div>
              <div>
                <label htmlFor="checkout-phone" className="label">
                  شماره موبایل
                </label>
                <input
                  id="checkout-phone"
                  value={form.phone}
                  onChange={setField('phone')}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09xxxxxxxxx"
                  aria-invalid={Boolean(errors.phone)}
                  className={`field ltr ${errors.phone ? 'field-error' : ''}`}
                />
                {errors.phone ? <p className="error-text">{errors.phone}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-email" className="label">
                  ایمیل (برای پیگیری سفارش)
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={form.email}
                  onChange={setField('email')}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={`field ltr ${errors.email ? 'field-error' : ''}`}
                />
                {errors.email ? <p className="error-text">{errors.email}</p> : null}
              </div>
            </div>
          </section>

          <section aria-labelledby="address-heading">
            <h2 id="address-heading" className="h2">
              نشانی ارسال
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-province" className="label">
                  استان
                </label>
                <select
                  id="checkout-province"
                  value={form.province}
                  onChange={setField('province')}
                  aria-invalid={Boolean(errors.province)}
                  className={`field ${errors.province ? 'field-error' : ''}`}
                >
                  <option value="">انتخاب کنید</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province ? <p className="error-text">{errors.province}</p> : null}
              </div>
              <div>
                <label htmlFor="checkout-city" className="label">
                  شهر
                </label>
                <input
                  id="checkout-city"
                  value={form.city}
                  onChange={setField('city')}
                  autoComplete="address-level2"
                  aria-invalid={Boolean(errors.city)}
                  className={`field ${errors.city ? 'field-error' : ''}`}
                />
                {errors.city ? <p className="error-text">{errors.city}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-address" className="label">
                  نشانی کامل
                </label>
                <textarea
                  id="checkout-address"
                  value={form.addressLine}
                  onChange={setField('addressLine')}
                  rows={3}
                  aria-invalid={Boolean(errors.addressLine)}
                  className={`field resize-none py-3 ${errors.addressLine ? 'field-error' : ''}`}
                />
                {errors.addressLine ? <p className="error-text">{errors.addressLine}</p> : null}
              </div>
              <div>
                <label htmlFor="checkout-postal" className="label">
                  کد پستی (اختیاری)
                </label>
                <input
                  id="checkout-postal"
                  value={form.postalCode}
                  onChange={setField('postalCode')}
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.postalCode)}
                  className={`field ltr ${errors.postalCode ? 'field-error' : ''}`}
                />
                {errors.postalCode ? <p className="error-text">{errors.postalCode}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-note" className="label">
                  یادداشت سفارش (اختیاری)
                </label>
                <input
                  id="checkout-note"
                  value={form.note}
                  onChange={setField('note')}
                  className="field"
                  maxLength={500}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="shipping-heading">
            <h2 id="shipping-heading" className="h2">
              روش ارسال
            </h2>
            <ul className="mt-4 space-y-2">
              {settings.shippingMethods.map((method) => (
                <li key={method.id}>
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-soft border px-4 py-3.5 text-[12.5px] transition-colors ${
                      shippingMethod === method.id ? 'border-ink bg-white' : 'border-line bg-white/60'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={() => setShippingMethod(method.id)}
                        className="h-4 w-4 accent-ink"
                      />
                      <span>
                        <span className="block text-ink">{method.title}</span>
                        <span className="mt-0.5 block text-[11px] text-muted">
                          {method.description}
                        </span>
                      </span>
                    </span>
                    <span className="num shrink-0 text-[12px]">
                      {formatToman(method.cost)} <span className="text-[10px] text-muted">تومان</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-soft border border-line bg-white p-5">
            <h2 className="text-[13px] font-medium text-ink">خلاصه سفارش</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pe-1">
              {items.map((item) => (
                <li key={item.key} className="flex items-start justify-between gap-3 text-[12px]">
                  <span className="text-muted">
                    {item.name}
                    <span className="num ms-1 text-[10.5px]">× {toFa(item.quantity)}</span>
                  </span>
                  <span className="num shrink-0">{formatToman(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-[12.5px]">
              <div className="flex items-center justify-between">
                <dt className="text-muted">جمع کالاها</dt>
                <dd className="num">{formatToman(subtotal)} تومان</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">هزینه ارسال</dt>
                <dd className="num">{formatToman(shippingCost)} تومان</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
                <dt className="text-ink">مبلغ نهایی</dt>
                <dd className="num font-semibold">{formatToman(total)} تومان</dd>
              </div>
            </dl>

            {serverError ? (
              <p role="alert" className="mt-4 rounded-soft border border-clay/30 bg-clay/5 px-3 py-2.5 text-[11.5px] leading-5 text-clay">
                {serverError}
              </p>
            ) : null}

            <button type="submit" disabled={submitting} className="btn btn-primary mt-5 w-full">
              {submitting ? 'در حال ثبت سفارش…' : 'ثبت سفارش'}
            </button>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-5 text-muted">
              <Check size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
              قیمت‌ها و موجودی هنگام ثبت سفارش در سرور بررسی می‌شوند.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
