import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../lib/wishlist.jsx';
import { img } from '../lib/img.js';
import { formatToman, toFa } from '../lib/format.js';
import { useSeo } from '../lib/useSeo.js';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { EmptyState } from '../components/ui/States.jsx';

export default function Wishlist() {
  const { items, remove } = useWishlist();
  useSeo({ title: 'علاقه‌مندی‌ها', description: 'محصولات ذخیره‌شده شما در این مرورگر.' });

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'علاقه‌مندی‌ها' }]} />
      <div className="mt-5 flex items-baseline gap-3">
        <h1 className="h1">علاقه‌مندی‌ها</h1>
        {items.length ? <span className="num text-xs text-muted">{toFa(items.length)} مورد</span> : null}
      </div>
      <p className="mt-2 text-[11.5px] text-muted">
        این فهرست روی همین دستگاه ذخیره می‌شود و با پاک کردن داده‌های مرورگر حذف خواهد شد.
      </p>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="هنوز محصولی ذخیره نکرده‌اید"
            description="با زدن آیکون قلب روی هر محصول، آن را به این فهرست اضافه کنید."
            action={
              <Link to="/shop" className="btn btn-primary">
                مشاهده محصولات
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col">
              <div className="relative overflow-hidden rounded-soft bg-cream">
                <Link to={`/product/${item.slug}`}>
                  <div className="aspect-[3/4] w-full">
                    <img
                      src={img(item.image, 600)}
                      alt={item.name}
                      width={600}
                      height={800}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink transition-colors hover:bg-white"
                  aria-label={`حذف ${item.name} از علاقه‌مندی‌ها`}
                >
                  <Heart size={15} className="fill-ink" />
                </button>
              </div>
              <h2 className="mt-4 text-[13px] font-medium leading-6">
                <Link to={`/product/${item.slug}`} className="hover:text-muted">
                  {item.name}
                </Link>
              </h2>
              <p className="num mt-1.5 text-sm font-semibold">
                {formatToman(item.price)} <span className="text-[11px] font-normal text-muted">تومان</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
