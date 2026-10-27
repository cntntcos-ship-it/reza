import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSeo } from '../lib/useSeo.js';
import ProductBrowser from '../components/shop/ProductBrowser.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const onSale = searchParams.get('onSale') === '1';

  const title = q ? 'نتایج جست‌وجو' : onSale ? 'فروش ویژه' : 'همه محصولات';

  useSeo({
    title: 'فروشگاه',
    description:
      'خرید پوشاک زنانه و مردانه از کالکشن لونورا با فیلتر دسته‌بندی، سایز، رنگ و قیمت.',
  });

  return (
    <>
      <div className="shell pb-6 pt-6">
        <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'فروشگاه' }]} />
        <div className="mt-5 flex flex-col gap-2">
          <span className="eyebrow">کالکشن</span>
          <h1 className="h1">{title}</h1>
        </div>

        {q ? (
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-soft border border-line bg-white px-3 py-1.5 text-xs text-ink">
              جست‌وجو برای «{q}»
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete('q');
                  setSearchParams(next, { replace: true });
                }}
                className="text-muted transition-colors hover:text-ink"
                aria-label="حذف عبارت جست‌وجو"
              >
                <X size={13} />
              </button>
            </span>
          </div>
        ) : null}
      </div>

      <div className="shell pb-16">
        <ProductBrowser />
      </div>
    </>
  );
}
