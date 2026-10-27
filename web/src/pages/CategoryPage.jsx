import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/seo.js';
import ListingView from '../components/product/ListingView.jsx';
import { ErrorState, LoadingState } from '../components/ui/States.jsx';

export default function CategoryPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null, error: '' });

    (async () => {
      try {
        const data = await api.category(slug);
        if (active) setState({ status: 'ready', data, error: '' });
      } catch (error) {
        if (active) setState({ status: 'error', data: null, error: error.message });
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  const category = state.data?.category;

  useSeo({
    title: category ? category.name : 'دسته‌بندی',
    description: category?.description,
  });

  if (state.status === 'loading') {
    return (
      <div className="page">
        <div className="container">
          <LoadingState label="در حال بارگذاری دسته‌بندی…" />
        </div>
      </div>
    );
  }

  if (state.status === 'error' || !category) {
    return (
      <div className="page">
        <div className="container">
          <ErrorState
            title="این دسته‌بندی پیدا نشد"
            text="ممکن است نشانی تغییر کرده باشد. از فروشگاه شروع کنید."
            onRetry={() => window.location.reload()}
          />
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/shop" className="btn btn--dark">
              رفتن به فروشگاه
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const children = state.data.children ?? [];

  return (
    <ListingView
      breadcrumbs={[
        { name: 'خانه', to: '/' },
        { name: 'فروشگاه', to: '/shop' },
        ...(state.data.breadcrumb ?? []).map((item) => ({ name: item.name, to: `/category/${item.slug}` })),
      ]}
      eyebrow="دسته‌بندی"
      title={category.name}
      lead={category.description}
      fixedCategory={category.slug}
      hideCategory
      filterCategories={[]}
      emptyTitle="در این دسته فعلاً محصولی موجود نیست"
      emptyText="به‌زودی محصولات تازه اضافه می‌شود. در این فاصله همه‌ی محصولات را ببینید."
      extraHeader={
        <div className="category-banner">
          <div className="category-banner__media">
            <img
              src={category.image}
              alt={`تصویر دسته‌بندی ${category.name}`}
              width={480}
              height={600}
              loading="eager"
            />
          </div>
          <div className="category-banner__body">
            <p className="eyebrow">در این دسته</p>
            <p className="category-banner__meta">
              {new Intl.NumberFormat('fa-IR').format(category.productCount)} محصول
            </p>
            {category.description ? <p className="category-banner__text">{category.description}</p> : null}
            {children.length ? (
              <ul className="category-banner__children">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link to={`/category/${child.slug}`} className="chip">
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      }
    />
  );
}
