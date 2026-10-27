import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSettings } from '../lib/useSettings.js';
import { useSeo } from '../lib/useSeo.js';
import OrderDetails from '../components/order/OrderDetails.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('number') ?? '');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useSeo({ title: 'پیگیری سفارش', description: 'وضعیت سفارش خود را با شماره سفارش و ایمیل ببینید.' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');
    setOrder(null);
    try {
      const data = await api.get(`/orders/${orderNumber.trim()}`, { email: email.trim() });
      setOrder(data.order);
      setStatus('done');
    } catch (requestError) {
      setError(requestError.message);
      setStatus('error');
    }
  };

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'پیگیری سفارش' }]} />
      <h1 className="h1 mt-5">پیگیری سفارش</h1>
      <p className="lede mt-2 max-w-xl">
        شماره سفارش و ایمیل ثبت‌شده در زمان خرید را وارد کنید تا وضعیت سفارش را ببینید.
      </p>

      <form onSubmit={submit} noValidate className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="track-number" className="label">
            شماره سفارش
          </label>
          <input
            id="track-number"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            placeholder="LN-000000-000000"
            className="field ltr"
            required
          />
        </div>
        <div>
          <label htmlFor="track-email" className="label">
            ایمیل
          </label>
          <input
            id="track-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field ltr"
            required
          />
        </div>
        <button type="submit" disabled={status === 'loading'} className="btn btn-primary">
          {status === 'loading' ? 'در حال بررسی…' : 'مشاهده وضعیت'}
        </button>
      </form>

      {status === 'error' ? (
        <p role="alert" className="mt-5 max-w-md rounded-soft border border-clay/30 bg-clay/5 px-4 py-3 text-[12px] text-clay">
          {error}
        </p>
      ) : null}

      {status === 'done' && order ? (
        <div className="mt-10">
          <OrderDetails
            order={order}
            statusLabels={settings?.orderStatusLabels}
            paymentLabels={settings?.paymentStatusLabels}
          />
        </div>
      ) : null}
    </div>
  );
}
