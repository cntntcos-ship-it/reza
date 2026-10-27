import { useState } from 'react';
import { Check } from 'lucide-react';
import { formatToman } from '../../lib/format.js';

function Group({ title, children }) {
  return (
    <div className="border-b border-line pb-5 pt-5 first:pt-0">
      <h3 className="text-[12px] font-medium text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function FilterPanel({
  categories,
  facets,
  values,
  onChange,
  onClear,
  activeCount,
  hideCategories = false,
  hideGender = false,
}) {
  const [minPrice, setMinPrice] = useState(values.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(values.maxPrice ?? '');

  const genderCategories = categories.filter((category) => category.kind === 'gender');
  const productCategories = categories.filter((category) => category.kind === 'product');

  const toggleIn = (key, value) => {
    const current = values[key].includes(value);
    onChange({
      [key]: current ? values[key].filter((item) => item !== value) : [...values[key], value],
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <p className="text-[13px] font-medium text-ink">فیلترها</p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="min-h-9 text-[11px] text-muted underline underline-offset-4 hover:text-ink"
          >
            حذف همه ({activeCount})
          </button>
        ) : null}
      </div>

      {hideGender ? null : (
      <Group title="جنسیت">
        <div className="flex flex-wrap gap-2">
          {genderCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => onChange({ gender: values.gender === category.slug ? '' : category.slug })}
              aria-pressed={values.gender === category.slug}
              className="chip"
            >
              {category.name}
            </button>
          ))}
        </div>
      </Group>
      )}

      {hideCategories ? null : (
      <Group title="دسته‌بندی">
        <ul className="space-y-1">
          {productCategories.map((category) => {
            const checked = values.categories.includes(category.slug);
            return (
              <li key={category.slug}>
                <label className="flex min-h-9 cursor-pointer items-center justify-between gap-2 text-[12.5px] text-muted transition-colors hover:text-ink">
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-[2px] border transition-colors ${
                        checked ? 'border-ink bg-ink text-white' : 'border-line bg-white'
                      }`}
                      aria-hidden="true"
                    >
                      {checked ? <Check size={11} /> : null}
                    </span>
                    {category.name}
                  </span>
                  <span className="num text-[11px] text-muted/70">{category.productCount}</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleIn('categories', category.slug)}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      </Group>
      )}

      <Group title="قیمت (تومان)">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onChange({ minPrice: minPrice || '', maxPrice: maxPrice || '' });
          }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="10000"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="از"
              aria-label="حداقل قیمت"
              className="field num ltr h-10 px-3"
            />
            <span className="text-muted" aria-hidden="true">
              —
            </span>
            <input
              type="number"
              min="0"
              step="10000"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="تا"
              aria-label="حداکثر قیمت"
              className="field num ltr h-10 px-3"
            />
          </div>
          <button type="submit" className="btn btn-light btn-sm w-full">
            اعمال بازه قیمت
          </button>
          {facets.maxPrice ? (
            <p className="num text-[11px] text-muted">
              بازه فعلی: {formatToman(facets.minPrice)} تا {formatToman(facets.maxPrice)} تومان
            </p>
          ) : null}
        </form>
      </Group>

      {facets.sizes?.length ? (
        <Group title="سایز">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleIn('sizes', size)}
                aria-pressed={values.sizes.includes(size)}
                className="chip min-w-10"
              >
                {size === 'ONE' ? 'تک‌سایز' : size}
              </button>
            ))}
          </div>
        </Group>
      ) : null}

      {facets.colors?.length ? (
        <Group title="رنگ">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleIn('colors', color.name)}
                aria-pressed={values.colors.includes(color.name)}
                className="flex min-h-9 items-center gap-1.5 rounded-soft border border-line bg-white px-2.5 text-[12px] transition-colors aria-pressed:border-ink"
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                {color.name}
              </button>
            ))}
          </div>
        </Group>
      ) : null}

      <Group title="فروش ویژه">
        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-[12.5px] text-muted hover:text-ink">
          <input
            type="checkbox"
            checked={values.onSale}
            onChange={(event) => onChange({ onSale: event.target.checked })}
            className="h-4 w-4 accent-ink"
          />
          فقط محصولات دارای تخفیف
        </label>
      </Group>
    </div>
  );
}
