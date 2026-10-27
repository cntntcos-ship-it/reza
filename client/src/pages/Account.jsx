import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { api } from '../lib/api.js';
import { useSettings } from '../lib/useSettings.js';
import { useSeo } from '../lib/useSeo.js';
import { formatDate, formatToman } from '../lib/format.js';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { EmptyState, LoadingState } from '../components/ui/States.jsx';

export default function Account() {
  const { user, loading, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [status, setStatus] = useState('loading');

  useSeo({ title: 'حساب کاربری', description: 'اطلاعات حساب و سفارش‌های شما.' });

  useEffect(() => {
    if (!user) return;
    let active = true;
    setStatus('loading');
    api
      .get('/account/orders')
      .then((data) => {
        if (!active) return;
        setOrders(data.orders);
        setStatus('done');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="shell py-16">
        <LoadingState label="در حال بررسی حساب…" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login?next=/account" replace />;

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'حساب کاربری' }]} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h1">{user.fullName}</h1>
          <p className="ltr mt-1 text-[11.5px] text-muted">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate('/');
          }}
          className="btn btn-outline btn-sm"
        >
          <LogOut size={14} />
          خروج از حساب
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link to="/wishlist" className="rounded-soft border border-line bg-white p-5 transition-colors hover:border-beige">
          <p className="text-[12px] font-medium text-ink">علاقه‌مندی‌ها</p>
          <p className="mt-1 text-[11px] text-muted">محصولات ذخیره‌شده در این دستگاه</p>
        </Link>
        <Link to="/track-order" className="rounded-soft border border-line bg-white p-5 transition-colors hover:border-beige">
          <p className="text-[12px] font-medium text-ink">پیگیری سفارش</p>
          <p className="mt-1 text-[11px] text-muted">با شماره سفارش و ایمیل</p>
        </Link>
        <Link to="/cart" className="rounded-soft border border-line bg-white p-5 transition-colors hover:border-beige">
          <p className="text-[12px] font-medium text-ink">سبد خرید</p>
          <p className="mt-1 text-[11px] text-muted">ادامه خرید و نهایی‌سازی</p>
        </Link>
      </div>

      <section className="mt-10" aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="h2">
          سفارش‌های من
        </h2>

        <div className="mt-4">
          {status === 'loading' ? <LoadingState label="در حال دریافت سفارش‌ها…" /> : null}
          {status === 'error' ? (
            <p className="text-[12px] text-clay">دریافت سفارش‌ها انجام نشد. صفحه را دوباره باز کنید.</p>
          ) : null}
          {status === 'done' && orders.length === 0 ? (
            <EmptyState
              title="هنوز سفارشی ثبت نکرده‌اید"
              description="سفارش‌های ثبت‌شده با همین حساب در این بخش نمایش داده می‌شوند."
              action={
                <Link to="/shop" className="btn btn-primary">
                  مشاهده محصولات
                </Link>
              }
            />
          ) : null}

          {status === 'done' && orders.length > 0 ? (
            <ul className="divide-y divide-line rounded-soft border border-line bg-white">
              {orders.map((order) => (
                <li key={order.orderNumber} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="num text-[12.5px] font-medium text-ink">{order.orderNumber}</p>
                    <p className="num mt-0.5 text-[11px] text-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-soft bg-cream px-2.5 py-1 text-[11px] text-ink">
                      {settings?.orderStatusLabels?.[order.orderStatus] ?? order.orderStatus}
                    </span>
                    <p className="num text-[12.5px]">
                      {formatToman(order.total)}
                      <span className="ms-1 text-[10px] text-muted">تومان</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </div>
  );
}
