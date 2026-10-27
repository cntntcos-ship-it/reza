import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/seo.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { EmptyState } from '../components/ui/States.jsx';

export default function WishlistPage() {
  const { ids, count } = useWishlist();
  const [state, setState] = useState({ status: 'loading', items: [], error: '' });
  const key = useMemo(() => ids.join(','), [ids]);

  useSeo({ title: 'علاقه‌مندی‌ها', description: 'کالاهایی که در لونورا ذخیره کرده‌اید.' });

  useEffect(() => {
    if (!key) {
      setState({ status: 'ready', items: [], error: '' });
      return undefined;
    }

    let active = true;
    setState({ status: 'loading', items: [], error: '' });

    (async () => {
      try {
        const data = await api.products({ ids: key.split(','), limit: 48 });
        if (active) setState({ status: 'ready', items: data.items ?? [], error: '' });
      } catch (error) {
        if (active) setState({ status: 'error', items: [], error: error.message });
      }
    })();

    return () => {
      active = false;
    };
  }, [key]);

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'علاقه‌مندی‌ها', to: '/wishlist' },
          ]}
        />

        <header className="page__head">
          <p className="eyebrow">ذخیره‌شده‌ها</p>
          <h1 className="page__title">علاقه‌مندی‌ها</h1>
          <p className="page__lead">
            کالاهایی که علامت زده‌اید، در همین مرورگر نگه داشته می‌شوند
            {count > 0 ? ` — ${new Intl.NumberFormat('fa-IR').format(count)} کالا.` : '.'}
          </p>
        </header>

        {count === 0 ? (
          <EmptyState
            title="هنوز کالایی ذخیره نکرده‌اید"
            text="روی آیکون قلب هر محصول بزنید تا اینجا ذخیره شود."
            action={
              <Link to="/shop" className="btn btn--dark">
                مشاهده محصولات
              </Link>
            }
          />
        ) : (
          <ProductGrid
            products={state.items}
            loading={state.status === 'loading'}
            error={state.status === 'error' ? state.error : ''}
            onRetry={() => window.location.reload()}
            emptyTitle="کالاهای ذخیره‌شده در دسترس نیستند"
            emptyText="ممکن است از فروشگاه حذف شده باشند."
          />
        )}
      </div>
    </div>
  );
}
