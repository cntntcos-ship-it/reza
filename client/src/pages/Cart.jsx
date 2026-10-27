import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../lib/cart.jsx';
import { img } from '../lib/img.js';
import { formatToman, sizeLabel, toFa } from '../lib/format.js';
import { useSeo } from '../lib/useSeo.js';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { EmptyState } from '../components/ui/States.jsx';

export default function Cart() {
  const { items, subtotal, count, updateQuantity, remove } = useCart();
  useSeo({ title: 'سبد خرید', description: 'اقلام سبد خرید خود را بررسی و ویرایش کنید.' });

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'سبد خرید' }]} />

      <div className="mt-5 flex items-baseline gap-3">
        <h1 className="h1">سبد خرید</h1>
        {count ? <span className="num text-xs text-muted">{toFa(count)} قلم</span> : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="سبد خرید شما خالی است"
            description="از کالکشن‌های زنانه و مردانه ما شروع کنید."
            action={
              <Link to="/shop" className="btn btn-primary">
                مشاهده محصولات
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-5">
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={img(item.image, 300)}
                    alt={item.name}
                    width={96}
                    height={124}
                    loading="lazy"
                    className="h-[124px] w-24 rounded-soft bg-cream object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-[13px] font-medium leading-6 text-ink hover:text-muted"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[11px] text-muted">
                        {item.size ? `سایز ${sizeLabel(item.size)}` : null}
                        {item.size && item.color ? ' • ' : null}
                        {item.color ? `رنگ ${item.color}` : null}
                      </p>
                      {item.stock <= 4 ? (
                        <p className="num mt-1 text-[11px] text-clay">
                          تنها {toFa(item.stock)} عدد در انبار
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-clay"
                      aria-label={`حذف ${item.name} از سبد خرید`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="flex items-center rounded-soft border border-line bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        disabled={item.quantity >= Math.min(item.stock, 10)}
                        className="flex h-10 w-10 items-center justify-center text-ink disabled:opacity-30"
                        aria-label="افزودن یک عدد"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="num w-7 text-center text-[13px]">{toFa(item.quantity)}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-10 w-10 items-center justify-center text-ink disabled:opacity-30"
                        aria-label="کاهش یک عدد"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                    <p className="num text-sm font-medium">
                      {formatToman(item.price * item.quantity)}
                      <span className="ms-1 text-[11px] font-normal text-muted">تومان</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-soft border border-line bg-white p-5">
              <h2 className="text-[13px] font-medium text-ink">خلاصه سفارش</h2>
              <dl className="mt-4 space-y-2.5 text-[12.5px]">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">جمع کالاها</dt>
                  <dd className="num">{formatToman(subtotal)} تومان</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">هزینه ارسال</dt>
                  <dd className="text-muted">در مرحله بعد</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
                <span className="text-ink">مبلغ قابل پرداخت</span>
                <span className="num font-semibold">
                  {formatToman(subtotal)}{' '}
                  <span className="text-[11px] font-normal text-muted">تومان</span>
                </span>
              </div>
              <Link to="/checkout" className="btn btn-primary mt-5 w-full">
                ادامه فرایند خرید
              </Link>
              <Link to="/shop" className="btn btn-light mt-2 w-full">
                <ShoppingBag size={15} />
                ادامه خرید
              </Link>
              <p className="mt-4 text-[11px] leading-5 text-muted">
                مبلغ نهایی و هزینه ارسال در مرحله تسویه‌حساب و بر اساس قیمت‌های ثبت‌شده در فروشگاه
                محاسبه می‌شود.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
