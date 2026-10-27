import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSeo, useProductStructuredData } from '../lib/seo.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useUi } from '../context/UiContext.jsx';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';
import ProductGallery from '../components/product/ProductGallery.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { ErrorState, QuantityStepper } from '../components/ui/States.jsx';
import { IconHeart, IconReturn, IconStar, IconTruck } from '../components/ui/Icons.jsx';
import { formatNumber, formatToman } from '../lib/format.js';

const MAX_QTY = 10;

export default function ProductPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });
  const [selection, setSelection] = useState({ size: '', color: '', quantity: 1 });
  const [formError, setFormError] = useState('');

  const cart = useCart();
  const wishlist = useWishlist();
  const { notify } = useToast();
  const { openCart } = useUi();

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null, error: '' });
    setFormError('');

    (async () => {
      try {
        const data = await api.product(slug);
        if (!active) return;
        setState({ status: 'ready', data, error: '' });
        setSelection({
          size: data.product.sizes.length === 1 ? data.product.sizes[0] : '',
          color: data.product.colors.length === 1 ? data.product.colors[0].name : '',
          quantity: 1,
        });
      } catch (error) {
        if (active) setState({ status: 'error', data: null, error: error.message });
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  const product = state.data?.product ?? null;
  const related = state.data?.related ?? [];

  useSeo({ title: product?.name, description: product?.shortDescription });
  useProductStructuredData(product);

  if (state.status === 'loading') {
    return (
      <div className="page">
        <div className="container">
          <div className="pdp pdp--loading" aria-hidden="true">
            <div className="skeleton" style={{ aspectRatio: '4 / 5' }} />
            <div>
              <div className="skeleton skeleton--line" style={{ width: '60%', height: '1.6rem' }} />
              <div className="skeleton skeleton--line" style={{ width: '30%', marginTop: '1rem' }} />
              <div className="skeleton skeleton--line" style={{ width: '85%', marginTop: '1.5rem' }} />
              <div className="skeleton skeleton--line" style={{ width: '70%', marginTop: '.6rem' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'error' || !product) {
    return (
      <div className="page">
        <div className="container">
          <ErrorState
            title="این محصول پیدا نشد"
            text={state.error || 'ممکن است محصول حذف شده باشد.'}
            onRetry={() => window.location.reload()}
          />
          <p className="pdp__fallback">
            <Link to="/shop" className="btn btn--dark">
              بازگشت به فروشگاه
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const wished = wishlist.has(product.id);
  const maxQuantity = Math.min(product.stock || MAX_QTY, MAX_QTY);

  const handleAdd = () => {
    if (!product.inStock) return;
    if (!selection.color) {
      setFormError('لطفاً رنگ محصول را انتخاب کنید.');
      return;
    }
    if (!selection.size) {
      setFormError('لطفاً سایز محصول را انتخاب کنید.');
      return;
    }
    setFormError('');
    cart.addItem(product, {
      size: selection.size,
      color: selection.color,
      quantity: selection.quantity,
    });
    notify(`«${product.name}» به سبد خرید اضافه شد.`, 'success');
    openCart();
  };

  const handleWishlist = () => {
    wishlist.toggle(product.id);
    notify(wished ? 'از علاقه‌مندی‌ها حذف شد.' : 'به علاقه‌مندی‌ها اضافه شد.');
  };

  const stockNote = !product.inStock
    ? 'این محصول فعلاً ناموجود است.'
    : product.stock <= 5
      ? `تنها ${formatNumber(product.stock)} عدد در انبار باقی مانده است.`
      : 'موجود در انبار.';

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'فروشگاه', to: '/shop' },
            ...(state.data.breadcrumb ?? []).map((item) => ({ name: item.name, to: `/category/${item.slug}` })),
            { name: product.name, to: `/product/${product.slug}` },
          ]}
        />

        <div className="pdp">
          <ProductGallery images={product.images} name={product.name} />

          <div className="pdp__info">
            <p className="eyebrow">{state.data.breadcrumb?.at(-1)?.name || 'محصول'}</p>
            <h1 className="pdp__title">{product.name}</h1>

            <div className="pdp__meta">
              <span className="rating">
                <span className="rating__stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <IconStar key={index} filled={index < Math.round(product.rating)} />
                  ))}
                </span>
                <span className="visually-hidden">امتیاز {product.rating} از ۵</span>
                <span className="rating__count">({formatNumber(product.reviewCount)} نظر ثبت‌شده)</span>
              </span>
              <span className="pdp__code">
                کد کالا: <span dir="ltr">{product.slug}</span>
              </span>
            </div>

            <div className={`price price--lg ${product.discountPercent > 0 ? 'price--sale' : ''}`}>
              <span className="price__now">{formatToman(product.finalPrice)}</span>
              {product.discountPercent > 0 ? (
                <>
                  <span className="price__old">{formatToman(product.price)}</span>
                  <span className="badge badge--sale">{formatNumber(product.discountPercent)}٪ تخفیف</span>
                </>
              ) : null}
            </div>

            <p className="pdp__short">{product.shortDescription}</p>

            <div className="pdp__option">
              <div className="pdp__option-head">
                <span className="pdp__option-label">رنگ</span>
                <span className="pdp__option-value">{selection.color || 'انتخاب کنید'}</span>
              </div>
              <ul className="swatches">
                {product.colors.map((color) => (
                  <li key={color.name}>
                    <button
                      type="button"
                      className={`swatch ${selection.color === color.name ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelection((current) => ({ ...current, color: color.name }));
                        setFormError('');
                      }}
                      aria-pressed={selection.color === color.name}
                      aria-label={`رنگ ${color.name}`}
                      title={color.name}
                    >
                      <span style={{ background: color.hex }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pdp__option">
              <div className="pdp__option-head">
                <span className="pdp__option-label">سایز</span>
                <details className="size-guide">
                  <summary>راهنمای سایز</summary>
                  <div className="size-guide__panel">
                    <table>
                      <caption className="visually-hidden">راهنمای سایز لونورا</caption>
                      <thead>
                        <tr>
                          <th scope="col">سایز</th>
                          <th scope="col">دور سینه (cm)</th>
                          <th scope="col">دور کمر (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>XS</td>
                          <td>82</td>
                          <td>64</td>
                        </tr>
                        <tr>
                          <td>S</td>
                          <td>86</td>
                          <td>68</td>
                        </tr>
                        <tr>
                          <td>M</td>
                          <td>90</td>
                          <td>72</td>
                        </tr>
                        <tr>
                          <td>L</td>
                          <td>96</td>
                          <td>78</td>
                        </tr>
                        <tr>
                          <td>XL</td>
                          <td>102</td>
                          <td>84</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>اندازه‌ها با خطای ±۲ سانتی‌متر اندازه‌گیری شده‌اند.</p>
                  </div>
                </details>
              </div>
              <ul className="sizes">
                {product.sizes.map((size) => (
                  <li key={size}>
                    <button
                      type="button"
                      className={`size-btn ${selection.size === size ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelection((current) => ({ ...current, size }));
                        setFormError('');
                      }}
                      aria-pressed={selection.size === size}
                    >
                      {size === 'ONE' ? 'تک‌سایز' : size}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pdp__buy">
              <QuantityStepper
                value={selection.quantity}
                max={maxQuantity || 1}
                onChange={(quantity) => setSelection((current) => ({ ...current, quantity }))}
                label="تعداد"
              />
              <button type="button" className="btn btn--dark pdp__add" onClick={handleAdd} disabled={!product.inStock}>
                {product.inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
              </button>
              <button
                type="button"
                className={`icon-btn icon-btn--bordered pdp__wish ${wished ? 'is-active' : ''}`}
                onClick={handleWishlist}
                aria-pressed={wished}
                aria-label={wished ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              >
                <IconHeart filled={wished} />
              </button>
            </div>

            <p className="pdp__error" role="alert" aria-live="assertive">
              {formError}
            </p>

            <p className="pdp__stock">{stockNote}</p>

            <div className="pdp__notes">
              <p>
                <IconTruck width={18} height={18} aria-hidden="true" />
                ارسال با پست پیشتاز یا پیک؛ هزینه و زمان دقیق در مرحله‌ی تسویه حساب نمایش داده می‌شود.
              </p>
              <p>
                <IconReturn width={18} height={18} aria-hidden="true" />
                بازگشت کالا طبق شرایط فروشگاه، در صورت نداشتن مشکل استفاده.
              </p>
            </div>

            <div className="accordion">
              <details open>
                <summary>توضیحات محصول</summary>
                <div className="accordion__body">
                  <p>{product.description}</p>
                </div>
              </details>

              <details>
                <summary>مشخصات</summary>
                <div className="accordion__body">
                  <dl className="specs">
                    {product.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                      </div>
                    ))}
                    <div>
                      <dt>جنس</dt>
                      <dd>{product.material}</dd>
                    </div>
                    <div>
                      <dt>نگهداری</dt>
                      <dd>{product.care}</dd>
                    </div>
                  </dl>
                </div>
              </details>

              <details>
                <summary>ارسال و بازگشت</summary>
                <div className="accordion__body">
                  <p>
                    سفارش‌ها با پست پیشتاز (۳ تا ۵ روز کاری) یا پیک (۱ تا ۲ روز کاری) ارسال می‌شوند.
                    برای سفارش‌های بالای آستانه‌ی تعیین‌شده، ارسال رایگان است.
                  </p>
                  <p>
                    بازگشت کالا طبق شرایط فروشگاه و پیش از استفاده انجام می‌شود؛ برای ثبت درخواست، از{' '}
                    <Link to="/contact">فرم تماس</Link> یا صفحه‌ی <Link to="/faq">سؤالات متداول</Link> استفاده کنید.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {related.length ? (
          <section className="section section--tight" aria-labelledby="related-title">
            <div className="section-head">
              <div className="section-head__text">
                <p className="eyebrow">پیشنهاد لونورا</p>
                <h2 className="section-head__title" id="related-title">
                  محصولات مرتبط
                </h2>
              </div>
            </div>
            <ProductGrid products={related} skeletonCount={4} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
