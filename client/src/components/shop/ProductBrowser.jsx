import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useCategories } from '../../lib/useCategories.js';
import { toFa } from '../../lib/format.js';
import ProductGrid from '../product/ProductGrid.jsx';
import FilterPanel from '../shop/FilterPanel.jsx';
import Pagination from '../shop/Pagination.jsx';
import { EmptyState, ErrorState, LoadingState } from '../ui/States.jsx';

const SORT_OPTIONS = [
  { value: 'featured', label: 'منتخب فروشگاه' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
];

/**
 * Product listing with URL-driven filters, used by both the shop and the
 * category page. `locked` pins the gender/category the page is dedicated to.
 */
export default function ProductBrowser({ locked = {} }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [reloadToken, setReloadToken] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const split = (key) => (searchParams.get(key) ?? '').split(',').filter(Boolean);

  const values = useMemo(
    () => ({
      gender: locked.gender ?? searchParams.get('gender') ?? '',
      categories: locked.category
        ? [locked.category]
        : [...new Set([...split('category'), ...split('categories')])],
      sizes: split('sizes'),
      colors: split('colors'),
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      onSale: searchParams.get('onSale') === '1',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, locked.gender, locked.category],
  );

  const q = searchParams.get('q') ?? '';
  const sort = searchParams.get('sort') ?? 'featured';
  const page = Number(searchParams.get('page') ?? 1) || 1;

  const activeCount =
    (locked.category ? 0 : values.categories.length) +
    values.sizes.length +
    values.colors.length +
    (values.gender && !locked.gender ? 1 : 0) +
    (values.minPrice ? 1 : 0) +
    (values.maxPrice ? 1 : 0) +
    (values.onSale ? 1 : 0) +
    (q ? 1 : 0);

  const queryKey = JSON.stringify({ q, sort, page, values, reloadToken });

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get('/products', {
        q,
        sort,
        page,
        perPage: 12,
        gender: values.gender || undefined,
        category: values.categories.join(',') || undefined,
        sizes: values.sizes.join(',') || undefined,
        colors: values.colors.join(',') || undefined,
        minPrice: values.minPrice || undefined,
        maxPrice: values.maxPrice || undefined,
        onSale: values.onSale ? 1 : undefined,
      })
      .then((result) => {
        if (!active) return;
        setData(result);
        setStatus('done');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const update = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (key === 'categories') {
        next.delete('category');
        if (value.length) next.set('categories', value.join(','));
        else next.delete('categories');
        return;
      }
      if (key === 'onSale') {
        if (value) next.set('onSale', '1');
        else next.delete('onSale');
        return;
      }
      if (Array.isArray(value)) {
        if (value.length) next.set(key, value.join(','));
        else next.delete(key);
        return;
      }
      if (value === '' || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    // Changing a filter resets to the first page; changing the page keeps it.
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setFiltersOpen(false);
  };

  const filterPanel = (
    <FilterPanel
      categories={categories}
      facets={data?.facets ?? {}}
      values={values}
      onChange={update}
      onClear={clearAll}
      activeCount={activeCount}
      hideCategories={Boolean(locked.category)}
      hideGender={Boolean(locked.gender)}
    />
  );

  return (
    <>
      <div className="flex gap-8 lg:gap-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="btn btn-light btn-sm lg:hidden"
            >
              <SlidersHorizontal size={15} />
              فیلترها
              {activeCount ? <span className="num text-muted">({toFa(activeCount)})</span> : null}
            </button>

            <p className="num hidden text-[11px] text-muted sm:block">
              {status === 'done' ? `${toFa(data.total)} محصول` : ' '}
            </p>

            <label className="ms-auto flex items-center gap-2 text-[11px] text-muted">
              <span className="hidden sm:inline">مرتب‌سازی:</span>
              <select
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
                aria-label="مرتب‌سازی محصولات"
                className="field h-10 min-h-10 w-auto py-0 text-[12px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {status === 'loading' ? <LoadingState rows={9} label="در حال بارگذاری محصولات…" /> : null}

          {status === 'error' ? (
            <ErrorState
              message="بارگذاری محصولات انجام نشد. اتصال خود را بررسی کنید."
              onRetry={() => setReloadToken((token) => token + 1)}
            />
          ) : null}

          {status === 'done' && data.items.length === 0 ? (
            <EmptyState
              title="محصولی با این فیلترها پیدا نشد"
              description="می‌توانید فیلترها را تغییر دهید یا همه محصولات را ببینید."
              action={
                <button type="button" onClick={clearAll} className="btn btn-primary">
                  حذف فیلترها
                </button>
              }
            />
          ) : null}

          {status === 'done' && data.items.length > 0 ? (
            <>
              <ProductGrid products={data.items} columns={4} priorityCount={4} />
              <Pagination page={data.page} pages={data.pages} onChange={(next) => update({ page: next })} />
            </>
          ) : null}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[88] lg:hidden" role="dialog" aria-modal="true" aria-label="فیلترها">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/35"
            aria-label="بستن فیلترها"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-lg bg-canvas p-5 pb-8">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">فیلترها</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-ink"
                aria-label="بستن فیلترها"
              >
                <X size={19} />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="btn btn-primary mt-6 w-full"
            >
              نمایش نتایج
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
