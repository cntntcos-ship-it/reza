import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Heart, Heart as HeartFilled, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { api } from '../lib/api.js';
import { useSeo, useJsonLd } from '../lib/useSeo.js';
import { img } from '../lib/img.js';
import { formatToman, sizeLabel, toFa } from '../lib/format.js';
import { useCart } from '../lib/cart.jsx';
import { useWishlist } from '../lib/wishlist.jsx';
import { useToast } from '../lib/toast.jsx';
import { Price, Rating } from '../components/product/Price.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { ErrorState, LoadingState } from '../components/ui/States.jsx';

export default function Product() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', product: null, related: [] });
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { notify } = useToast();

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', product: null, related: [] });
    setActiveImage(0);
    setQuantity(1);
    api
      .get(`/products/${slug}`)
      .then((data) => {
        if (!active) return;
        setState({ status: 'done', product: data.product, related: data.related });
        setSize(data.product.sizes.length === 1 ? data.product.sizes[0] : '');
        setColor(data.product.colors[0]?.name ?? '');
      })
      .catch(() => {
        if (active) setState({ status: 'error', product: null, related: [] });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const product = state.product;

  useSeo({ title: product?.name, description: product?.description });
  useJsonLd(
    useMemo(() => {
      if (!product) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        brand: { '@type': 'Brand', name: 'LUNORA' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'IRR',
          price: product.price * 10,
          availability:
            product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      };
    }, [product]),
  );

  if (state.status === 'loading') {
    return (
      <div className="shell py-16">
        <LoadingState label="در حال بارگذاری محصول…" />
      </div>
    );
  }

  if (state.status === 'error' || !product) {
    return (
      <div className="shell py-16">
        <ErrorState message="این محصول پیدا نشد یا از فروشگاه حذف شده است." />
        <div className="mt-6 text-center">
          <Link to="/shop" className="btn btn-outline">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  const soldOut = product.stock <= 0;
  const saved = has(product.id);
  const maxQty = Math.min(product.stock, 5);

  const addToCart = () => {
    if (soldOut) return;
    if (product.sizes.length > 1 && !size) {
      notify('برای افزودن به سبد، سایز را انتخاب کنید.', 'error');
      return;
    }
    add(product, { size, color, quantity });
    notify('محصول به سبد خرید اضافه شد.');
  };

  return (
    <>
      <div className="shell pt-6">
        <Breadcrumb
          items={[
            { label: 'صفحه اصلی', to: '/' },
            { label: 'فروشگاه', to: '/shop' },
            { label: product.name },
          ]}
        />
      </div>

      <section className="shell grid gap-8 py-8 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-soft bg-cream">
            {product.images[activeImage] ? (
              <img
                src={img(product.images[activeImage], 1000)}
                alt={`${product.name} — تصویر ${toFa(activeImage + 1)}`}
                width={1000}
                height={1250}
                fetchpriority="high"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <ul className="mt-3 flex gap-2">
              {product.images.map((image, index) => (
                <li key={image}>
                  <button
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`نمایش تصویر ${toFa(index + 1)}`}
                    aria-current={index === activeImage ? 'true' : undefined}
                    className={`block h-20 w-16 overflow-hidden rounded-soft border transition-colors ${
                      index === activeImage ? 'border-ink' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img(image, 200)}
                      alt=""
                      width={64}
                      height={80}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="h1">{product.name}</h1>
              <Rating rating={product.rating} className="mt-2" />
            </div>
            <button
              type="button"
              onClick={() => toggle(product)}
              aria-pressed={saved}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-beige"
              aria-label={saved ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            >
              {saved ? <HeartFilled size={17} className="fill-ink" /> : <Heart size={17} />}
            </button>
          </div>

          <div className="mt-4">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          </div>

          <p className="mt-5 text-[13px] leading-7 text-muted">{product.description}</p>

          {product.colors.length ? (
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-ink">
                  رنگ: <span className="font-normal text-muted">{color}</span>
                </p>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.colors.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.name)}
                    aria-pressed={color === option.name}
                    className="flex min-h-10 items-center gap-2 rounded-soft border border-line bg-white px-3 text-[12px] transition-colors aria-pressed:border-ink"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: option.hex }}
                      aria-hidden="true"
                    />
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes.length ? (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-ink">
                  سایز: <span className="font-normal text-muted">{size ? sizeLabel(size) : 'انتخاب کنید'}</span>
                </p>
                <Link
                  to="/size-guide"
                  className="inline-flex min-h-9 items-center gap-1.5 text-[11px] text-muted underline underline-offset-4 hover:text-ink"
                >
                  <Ruler size={13} />
                  راهنمای سایز
                </Link>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className="chip min-w-12"
                  >
                    {sizeLabel(option)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-[12px] text-muted">
              {soldOut ? (
                <span className="text-clay">این محصول در حال حاضر موجود نیست.</span>
              ) : (
                <>
                  <Check size={13} className="me-1 inline text-ink" aria-hidden="true" />
                  موجود در انبار
                  {product.stock <= 4 ? (
                    <span className="num ms-2 text-clay">(تنها {toFa(product.stock)} عدد)</span>
                  ) : null}
                </>
              )}
            </p>
          </div>

          {!soldOut ? (
            <div className="mt-6 flex flex-wrap items-stretch gap-3">
              <div className="flex h-12 items-center rounded-soft border border-line bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(value + 1, maxQty))}
                  disabled={quantity >= maxQty}
                  className="flex h-12 w-11 items-center justify-center text-lg text-ink disabled:opacity-30"
                  aria-label="افزودن یک عدد"
                >
                  +
                </button>
                <span className="num w-8 text-center text-sm">{toFa(quantity)}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
                  disabled={quantity <= 1}
                  className="flex h-12 w-11 items-center justify-center text-lg text-ink disabled:opacity-30"
                  aria-label="کاهش یک عدد"
                >
                  −
                </button>
              </div>
              <button type="button" onClick={addToCart} className="btn btn-primary h-12 flex-1">
                افزودن به سبد خرید
              </button>
            </div>
          ) : (
            <Link to="/shop" className="btn btn-outline mt-6 h-12 w-full">
              مشاهده محصولات موجود
            </Link>
          )}

          <div className="mt-8 space-y-3 border-t border-line pt-6 text-[12px] text-muted">
            <p className="flex items-start gap-2">
              <Truck size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              ارسال سفارش‌ها بر اساس روش انتخابی در مرحله تسویه‌حساب محاسبه می‌شود.
            </p>
            <p className="flex items-start gap-2">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              شرایط بازگشت کالا مطابق قوانین فروشگاه است.{' '}
              <Link to="/shipping-returns" className="link-quiet">
                جزئیات
              </Link>
            </p>
          </div>

          <dl className="mt-8 space-y-4 border-t border-line pt-6 text-[12.5px] leading-7">
            <div>
              <dt className="font-medium text-ink">مشخصات</dt>
              <dd className="mt-1 text-muted">{product.details}</dd>
            </div>
            {product.care ? (
              <div>
                <dt className="font-medium text-ink">نگهداری</dt>
                <dd className="mt-1 text-muted">{product.care}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      {state.related.length > 0 ? (
        <section className="shell border-t border-line py-14">
          <SectionHeader eyebrow="پیشنهاد ما" title="محصولات مرتبط" />
          <div className="mt-8">
            <ProductGrid products={state.related} columns={4} />
          </div>
        </section>
      ) : null}
    </>
  );
}
