import { img } from '../../lib/img.js';
import { formatDate, formatToman, sizeLabel, toFa, toFaDigits } from '../../lib/format.js';

export default function OrderDetails({ order, statusLabels, paymentLabels }) {
  const shippingTitle =
    {
      standard: 'ارسال عادی',
      express: 'ارسال سریع',
    }[order.shippingMethod] ?? order.shippingMethod;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="rounded-soft border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <p className="text-[11px] text-muted">شماره سفارش</p>
              <p className="num mt-0.5 text-sm font-medium text-ink">{order.orderNumber}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-soft bg-cream px-2.5 py-1 text-[11px] text-ink">
                {statusLabels?.[order.orderStatus] ?? order.orderStatus}
              </span>
              <span className="rounded-soft bg-cream px-2.5 py-1 text-[11px] text-muted">
                {paymentLabels?.[order.paymentStatus] ?? order.paymentStatus}
              </span>
            </div>
          </div>

          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 px-5 py-4">
                {item.image ? (
                  <img
                    src={img(item.image, 200)}
                    alt=""
                    width={56}
                    height={72}
                    loading="lazy"
                    className="h-[72px] w-14 rounded-soft bg-cream object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-ink">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {item.size ? `سایز ${sizeLabel(item.size)}` : null}
                    {item.size && item.color ? ' • ' : null}
                    {item.color ? `رنگ ${item.color}` : null}
                    <span className="num ms-2">× {toFa(item.quantity)}</span>
                  </p>
                </div>
                <p className="num shrink-0 text-[12px]">
                  {formatToman(item.lineTotal)}
                  <span className="ms-1 text-[10px] text-muted">تومان</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-soft border border-line bg-white p-4">
            <p className="text-[11px] text-muted">گیرنده</p>
            <p className="mt-1.5 text-[12.5px] text-ink">{order.customerName}</p>
            <p className="num mt-1 text-[12px] text-muted">{order.customerPhone}</p>
            <p className="ltr mt-1 text-[11.5px] text-muted">{order.customerEmail}</p>
          </div>
          <div className="rounded-soft border border-line bg-white p-4">
            <p className="text-[11px] text-muted">نشانی ارسال</p>
            <p className="mt-1.5 text-[12.5px] leading-6 text-ink">
              {order.address.province}، {order.address.city}
              <br />
              {order.address.addressLine}
              {order.address.postalCode ? (
                <>
                  <br />
                  <span className="num text-[11px] text-muted">
                    کد پستی {toFaDigits(order.address.postalCode)}
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <aside>
        <div className="rounded-soft border border-line bg-white p-5">
          <dl className="space-y-2.5 text-[12.5px]">
            <div className="flex items-center justify-between">
              <dt className="text-muted">جمع کالاها</dt>
              <dd className="num">{formatToman(order.subtotal)} تومان</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">ارسال ({shippingTitle})</dt>
              <dd className="num">{formatToman(order.shippingCost)} تومان</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
              <dt className="text-ink">مبلغ کل</dt>
              <dd className="num font-semibold">{formatToman(order.total)} تومان</dd>
            </div>
          </dl>
          <p className="num mt-4 text-[11px] text-muted">
            تاریخ ثبت: {formatDate(order.createdAt)}
          </p>
          {order.note ? (
            <p className="mt-3 border-t border-line pt-3 text-[11px] leading-5 text-muted">
              یادداشت شما: {order.note}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
