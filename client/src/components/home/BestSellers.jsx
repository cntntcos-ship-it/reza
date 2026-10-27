import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import SectionHeader from '../ui/SectionHeader.jsx';
import ProductGrid from '../product/ProductGrid.jsx';
import { ErrorState, LoadingState } from '../ui/States.jsx';

export default function BestSellers() {
  const [status, setStatus] = useState('loading');
  const [products, setProducts] = useState([]);

  const load = () => {
    setStatus('loading');
    api
      .get('/products', { featured: 1, perPage: 6, sort: 'featured' })
      .then((data) => {
        setProducts(data.items);
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  return (
    <section className="pb-12 md:pb-16" aria-labelledby="best-sellers-title">
      <div className="shell">
        <SectionHeader
          eyebrow="منتخب مشتریان"
          title="محصولات محبوب"
          action={{ label: 'مشاهده همه محصولات', to: '/shop' }}
        />
        <h2 id="best-sellers-title" className="sr-only">
          محصولات محبوب
        </h2>

        <div className="mt-8 md:mt-10">
          {status === 'loading' ? <LoadingState rows={6} /> : null}
          {status === 'error' ? (
            <ErrorState message="فهرست محصولات بارگذاری نشد." onRetry={load} />
          ) : null}
          {status === 'done' && products.length === 0 ? (
            <p className="text-sm text-muted">در حال حاضر محصول منتخبی برای نمایش وجود ندارد.</p>
          ) : null}
          {status === 'done' && products.length > 0 ? (
            <ProductGrid products={products} priorityCount={3} />
          ) : null}
        </div>

        {status === 'done' && products.length > 0 ? (
          <div className="mt-10 flex justify-center md:hidden">
            <Link to="/shop" className="btn btn-outline w-full sm:w-auto">
              مشاهده همه محصولات
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
