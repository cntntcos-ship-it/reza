import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import ProductGrid from '../product/ProductGrid.jsx';
import { ProductGridSkeleton, ErrorState } from '../ui/States.jsx';
import { IconArrowLeft } from '../ui/Icons.jsx';

export default function BestSellers() {
  const [state, setState] = useState({ status: 'loading', items: [], error: '' });

  const load = useCallback(async () => {
    setState({ status: 'loading', items: [], error: '' });
    try {
      const data = await api.products({ featured: 1, limit: 8 });
      setState({ status: 'ready', items: data.items ?? [], error: '' });
    } catch (error) {
      setState({ status: 'error', items: [], error: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="section" aria-labelledby="best-sellers-title">
      <div className="container">
        <div className="section-head">
          <div className="section-head__text">
            <p className="eyebrow">انتخاب‌های محبوب</p>
            <h2 className="section-head__title" id="best-sellers-title">
              محصولاتی که دوستشان داریم
            </h2>
          </div>
          <Link to="/shop" className="section-head__link">
            مشاهده همه محصولات
            <IconArrowLeft width={15} height={15} />
          </Link>
        </div>

        {state.status === 'loading' ? <ProductGridSkeleton count={8} /> : null}

        {state.status === 'error' ? (
          <ErrorState
            title="فهرست محصولات بارگذاری نشد"
            text={state.error}
            onRetry={load}
          />
        ) : null}

        {state.status === 'ready' ? <ProductGrid products={state.items} /> : null}
      </div>
    </section>
  );
}
