import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, X } from 'lucide-react';
import { Price, Rating } from './Price.jsx';
import { discountPercent, sizeLabel } from '../../lib/format.js';
import { img, srcSet } from '../../lib/img.js';
import { useCart } from '../../lib/cart.jsx';
import { useWishlist } from '../../lib/wishlist.jsx';
import { useToast } from '../../lib/toast.jsx';

export default function ProductCard({ product, priority = false }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '');
  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { notify } = useToast();

  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;
  const saved = has(product.id);
  const [primary, secondary] = product.images ?? [];

  const openPicker = () => {
    if (soldOut) return;
    if (product.sizes.length <= 1 && product.colors.length <= 1) {
      add(product, { size: product.sizes[0] ?? '', color: product.colors[0]?.name ?? '', quantity: 1 });
      return;
    }
    setPickerOpen(true);
  };

  const confirmAdd = () => {
    if (product.sizes.length > 1 && !size) {
      notify('برای افزودن به سبد، سایز را انتخاب کنید.', 'error');
      return;
    }
    add(product, { size, color, quantity: 1 });
    setPickerOpen(false);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-soft bg-cream">
        <Link to={`/product/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
          <div className="relative aspect-[3/4] w-full">
            {primary ? (
              <img
                src={img(primary, 600)}
                srcSet={srcSet(primary, [400, 600, 900])}
                sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 220px"
                alt=""
                width={600}
                height={800}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : null}
            {secondary ? (
              <img
                src={img(secondary, 600)}
                alt=""
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"
              />
            ) : null}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col items-start gap-1.5">
            {discount ? (
              <span className="num rounded-soft bg-onyx px-2 py-1 text-[10px] font-medium text-white">
                {discount}٪ تخفیف
              </span>
            ) : null}
            {product.isNew && !discount ? (
              <span className="rounded-soft bg-white/95 px-2 py-1 text-[10px] font-medium text-ink">
                جدید
              </span>
            ) : null}
            {soldOut ? (
              <span className="rounded-soft bg-white/95 px-2 py-1 text-[10px] font-medium text-muted">
                ناموجود
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => toggle(product)}
            aria-pressed={saved}
            aria-label={saved ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
          >
            <Heart size={15} className={saved ? 'fill-ink' : ''} />
          </button>
        </div>

        {!soldOut ? (
          <button
            type="button"
            onClick={openPicker}
            className="absolute bottom-3 end-3 hidden h-10 w-10 items-center justify-center rounded-full bg-onyx text-white transition-all duration-200 hover:bg-[#2b2a27] group-hover:flex md:flex md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            aria-label={`افزودن سریع ${product.name} به سبد خرید`}
          >
            <Plus size={17} />
          </button>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex md:hidden">
          <Link
            to={`/product/${product.slug}`}
            className="flex h-10 flex-1 items-center justify-center bg-onyx/95 text-xs text-white"
          >
            مشاهده محصول
          </Link>
        </div>

        {pickerOpen ? (
          <div className="absolute inset-0 z-20 flex flex-col justify-end bg-white/95 p-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
              aria-label="بستن انتخاب سایز"
            >
              <X size={16} />
            </button>

            {product.sizes.length > 1 ? (
              <div>
                <p className="text-[11px] font-medium text-ink">سایز</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSize(option)}
                      aria-pressed={size === option}
                      className="chip min-h-8 px-2.5 text-xs"
                    >
                      {sizeLabel(option)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {product.colors.length > 1 ? (
              <div className="mt-3">
                <p className="text-[11px] font-medium text-ink">رنگ</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.colors.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setColor(option.name)}
                      aria-pressed={color === option.name}
                      className="flex min-h-8 items-center gap-1.5 rounded-soft border border-line px-2 py-1 text-[11px] transition-colors aria-pressed:border-ink"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: option.hex }}
                        aria-hidden="true"
                      />
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <button type="button" onClick={confirmAdd} className="btn btn-primary btn-sm mt-4 w-full">
              افزودن به سبد
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-[13px] font-medium leading-6 text-ink">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-muted">
            {product.name}
          </Link>
        </h3>
        <Rating rating={product.rating} className="mt-1.5" />
        <div className="mt-auto pt-2">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          {!soldOut && product.stock <= 4 ? (
            <p className="num mt-1 text-[11px] text-clay">تنها {product.stock} عدد در انبار</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
