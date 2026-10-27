import { useEffect, useState } from 'react';
import { formatNumber } from '../../lib/format.js';
import { IconChevronDown } from '../ui/Icons.jsx';

export default function ProductFilters({ facets, filters, update, reset, toggleListValue, activeCount, categories, hideCategory = false }) {
  const [open, setOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState({ min: filters.min, max: filters.max });

  useEffect(() => {
    setPriceDraft({ min: filters.min, max: filters.max });
  }, [filters.min, filters.max]);

  const applyPrice = (event) => {
    event.preventDefault();
    update({ min: priceDraft.min, max: priceDraft.max });
  };

  return (
    <aside className={`filters ${open ? 'is-open' : ''}`} aria-label="فیلتر محصولات">
      <button
        type="button"
        className="filters__toggle"
        aria-expanded={open}
        aria-controls="filters-body"
        onClick={() => setOpen((value) => !value)}
      >
        فیلترها
        {activeCount > 0 ? <span className="filters__badge">{formatNumber(activeCount)}</span> : null}
        <IconChevronDown width={16} height={16} className={open ? 'is-flipped' : undefined} />
      </button>

      <div className="filters__body" id="filters-body">
        {!hideCategory && categories?.length ? (
          <section className="filters__group">
            <h2 className="filters__title">دسته‌بندی</h2>
            <ul className="filters__list filters__list--radio">
              <li>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={!filters.category}
                    onChange={() => update({ category: '' })}
                  />
                  <span>همه محصولات</span>
                </label>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category.slug}
                      onChange={() => update({ category: category.slug })}
                    />
                    <span>{category.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {facets?.sizes?.length ? (
          <section className="filters__group">
            <h2 className="filters__title">سایز</h2>
            <div className="filters__chips">
              {facets.sizes.map((size) => {
                const active = filters.sizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    className={`chip chip--square ${active ? 'is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleListValue('sizes', size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {facets?.colors?.length ? (
          <section className="filters__group">
            <h2 className="filters__title">رنگ</h2>
            <ul className="filters__colors">
              {facets.colors.map((color) => {
                const active = filters.colors.includes(color.name);
                return (
                  <li key={color.name}>
                    <button
                      type="button"
                      className={`filters__color ${active ? 'is-active' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleListValue('colors', color.name)}
                    >
                      <span className="filters__color-dot" style={{ background: color.hex }} aria-hidden="true" />
                      {color.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className="filters__group">
          <h2 className="filters__title">محدوده قیمت</h2>
          <form className="filters__price" onSubmit={applyPrice}>
            <label className="filters__price-field">
              <span>از (تومان)</span>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                step="10000"
                value={priceDraft.min}
                onChange={(event) => setPriceDraft((draft) => ({ ...draft, min: event.target.value }))}
              />
            </label>
            <label className="filters__price-field">
              <span>تا (تومان)</span>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                step="10000"
                value={priceDraft.max}
                onChange={(event) => setPriceDraft((draft) => ({ ...draft, max: event.target.value }))}
              />
            </label>
            <button type="submit" className="btn btn--outline btn--block">
              اعمال قیمت
            </button>
          </form>
        </section>

        {activeCount > 0 ? (
          <button type="button" className="filters__reset" onClick={reset}>
            حذف همه‌ی فیلترها
          </button>
        ) : null}
      </div>
    </aside>
  );
}
