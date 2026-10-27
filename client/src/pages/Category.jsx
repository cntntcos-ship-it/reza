import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/useSeo.js';
import { img } from '../lib/img.js';
import ProductBrowser from '../components/shop/ProductBrowser.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { ErrorState, LoadingState } from '../components/ui/States.jsx';

export default function Category() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', category: null });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', category: null });
    api
      .get(`/categories/${slug}`)
      .then((data) => {
        if (active) setState({ status: 'done', category: data.category });
      })
      .catch(() => {
        if (active) setState({ status: 'error', category: null });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const category = state.category;

  useSeo({
    title: category?.name,
    description: category?.description,
  });

  if (state.status === 'loading') {
    return (
      <div className="shell py-16">
        <LoadingState label="در حال بارگذاری دسته‌بندی…" />
      </div>
    );
  }

  if (state.status === 'error' || !category) {
    return (
      <div className="shell py-16">
        <ErrorState message="این دسته‌بندی پیدا نشد." />
      </div>
    );
  }

  return (
    <>
      <div className="shell pt-6">
        <Breadcrumb
          items={[
            { label: 'صفحه اصلی', to: '/' },
            { label: 'فروشگاه', to: '/shop' },
            { label: category.name },
          ]}
        />
      </div>

      <section className="shell mt-5">
        <div className="relative overflow-hidden rounded-soft bg-cream">
          <div className="relative h-[190px] w-full md:h-[260px]">
            {category.bannerUrl || category.imageUrl ? (
              <img
                src={img(category.bannerUrl || category.imageUrl, 1600)}
                alt={`کالکشن ${category.name}`}
                width={1600}
                height={800}
                fetchpriority="high"
                className="h-full w-full object-cover object-[50%_35%]"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-l from-ink/65 via-ink/25 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-9">
              <span className="text-[10.5px] text-white/75">کالکشن</span>
              <h1 className="mt-1 text-[22px] font-bold text-white md:text-[30px]">{category.name}</h1>
              {category.description ? (
                <p className="mt-2 max-w-lg text-[12px] leading-6 text-white/80">
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="shell pb-16 pt-8">
        <ProductBrowser
          locked={
            category.kind === 'gender'
              ? { gender: category.slug }
              : { category: category.slug }
          }
        />
      </div>
    </>
  );
}
