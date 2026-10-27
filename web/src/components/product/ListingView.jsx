import Breadcrumbs from '../layout/Breadcrumbs.jsx';
import ProductFilters from './ProductFilters.jsx';
import ProductGrid from './ProductGrid.jsx';
import Pagination from './Pagination.jsx';
import { SORT_OPTIONS, useProductQuery } from '../../hooks/useProductQuery.js';
import { formatNumber } from '../../lib/format.js';

/**
 * Shared listing surface for the shop, category and search pages: breadcrumbs,
 * page header, filter sidebar, sort bar, product grid and pagination.
 */
export default function ListingView({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  extraHeader = null,
  fixedCategory = '',
  filterCategories,
  hideCategory = false,
  emptyTitle,
  emptyText,
}) {
  const { filters, state, totalPages, activeCount, update, reset, toggleListValue, refetch } = useProductQuery({
    fixedCategory,
  });

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="page__head">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="page__title">{title}</h1>
          {lead ? <p className="page__lead">{lead}</p> : null}
        </header>

        {extraHeader}

        <div className="shop-layout">
          <ProductFilters
            facets={state.facets}
            filters={filters}
            update={update}
            reset={reset}
            toggleListValue={toggleListValue}
            activeCount={activeCount}
            categories={filterCategories}
            hideCategory={hideCategory}
          />

          <div className="shop-main">
            <div className="sortbar">
              <p className="sortbar__count" aria-live="polite">
                {state.loading ? 'در حال بارگذاری…' : `${formatNumber(state.total)} محصول`}
              </p>

              <label className="sortbar__sort">
                <span>مرتب‌سازی</span>
                <select
                  className="select sortbar__select"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value })}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ProductGrid
              products={state.items}
              loading={state.loading}
              error={state.error}
              onRetry={refetch}
              skeletonCount={6}
              emptyTitle={emptyTitle}
              emptyText={emptyText}
            />

            <Pagination
              page={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => update({ page: String(page) }, { resetPage: false })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
