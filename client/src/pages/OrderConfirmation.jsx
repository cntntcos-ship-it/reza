import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import { api } from '../lib/api.js';
import { useSettings } from '../lib/useSettings.js';
import { useSeo } from '../lib/useSeo.js';
import OrderDetails from '../components/order/OrderDetails.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { ErrorState, LoadingState } from '../components/ui/States.jsx';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();
  const [state, setState] = useState({
    status: location.state?.order ? 'done' : 'needs-email',
    order: location.state?.order ?? null,
    error: '',
  });

  useSeo({ title: 'جزئیات سفارش', description: 'وضعیت و جزئیات سفارش ثبت‌شده.' });

  useEffect(() => {
    const email = searchParams.get('email');
    if (state.order || !email) return;
    let active = true;
    setState({ status: 'loading', order: null, error: '' });
    api
      .get(`/orders/${orderNumber}`, { email })
      .then((data) => {
        if (active) setState({ status: 'done', order: data.order, error: '' });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', order: null, error: error.message });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, searchParams]);

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'سفارش' }, { label: orderNumber }]} />

      {state.status === 'loading' ? (
        <div className="py-14">
          <LoadingState label="در حال دریافت سفارش…" />
        </div>
      ) : null}

      {state.status === 'needs-email' ? (
        <div className="mx-auto mt-10 max-w-md rounded-soft border border-line bg-white p-6 text-center">
          <p className="text-sm text-ink">برای مشاهده این سفارش، ایمیل ثبت‌شده را وارد کنید.</p>
          <Link to={`/track-order?number=${encodeURIComponent(orderNumber)}`} className="btn btn-primary mt-5 w-full">
            پیگیری سفارش
          </Link>
        </div>
      ) : null}

      {state.status === 'error' ? <ErrorState message={state.error} /> : null}

      {state.status === 'done' && state.order ? (
        <>
          <div className="mt-8 flex items-start gap-3">
            {state.order.paymentStatus === 'paid' ? (
              <CheckCircle2 size={22} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
            ) : (
              <Clock size={22} className="mt-1 shrink-0 text-ink/70" aria-hidden="true" />
            )}
            <div>
              <h1 className="h1">سفارش شما ثبت شد</h1>
              <p className="lede mt-2 max-w-xl">
                شماره سفارش <span className="num text-ink">{state.order.orderNumber}</span> برای شما
                ثبت شد. وضعیت فعلی: «
                {settings?.orderStatusLabels?.[state.order.orderStatus] ?? state.order.orderStatus}».
              </p>
              <p className="mt-2 max-w-xl rounded-soft bg-cream px-3.5 py-2.5 text-[11.5px] leading-6 text-muted">
                پرداخت آنلاین در این نسخه فعال نیست؛ بنابراین مبلغی از حساب شما کسر نشده و سفارش
                در وضعیت انتظار پرداخت قرار دارد.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <OrderDetails
              order={state.order}
              statusLabels={settings?.orderStatusLabels}
              paymentLabels={settings?.paymentStatusLabels}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">
              ادامه خرید
            </Link>
            <Link
              to={`/track-order?number=${encodeURIComponent(state.order.orderNumber)}`}
              className="btn btn-outline"
            >
              پیگیری سفارش
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
