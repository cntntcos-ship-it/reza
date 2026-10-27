import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { discountLabel, formatNumber, formatToman } from '../../lib/format.js';
import { IconHeart, IconStar } from '../ui/Icons.jsx';

const canQuickAdd = (product) =>
  product.sizes.length === 1 && product.colors.length === 1 && product.inStock;

export default function ProductCard({ product }) {
  const { toggle, has } = useWishlist();
  const cart = useCart();
  const { notify } = useToast();
  const wished = has(product.id);

  const handleWishlist = () => {
    toggle(product.id);
    notify(wished ? 'از علاقه‌مندی‌ها حذف شد.' : 'به علاقه‌مندی‌ها اضافه شد.', 'default');
  };

  const handleQuickAdd = () => {
    cart.addItem(product, { size: product.sizes[0], color: product.colors[0].name, quantity: 1 });
    notify(`«${product.name}» به سبد خرید اضافه شد.`, 'success');
  };

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link to={`/product/${product.slug}`} className="product-card__media-link" tabIndex={-1} aria-hidden="true">
          <img
            className="product-card__img"
            src={product.primaryImage}
            alt=""
            width={900}
            height={1125}
            loading="lazy"
            decoding="async"
          />
          {product.hoverImage ? (
            <img
              className="product-card__img product-card__img--hover"
              src={product.hoverImage}
              alt=""
              width={900}
              height={1125}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </Link>

        <div className="product-card__badges">
          {product.discountPercent > 0 ? <span className="badge badge--sale">{discountLabel(product.discountPercent)}</span> : null}
          {product.isNew && product.discountPercent === 0 ? <span className="badge badge--new">جدید</span> : null}
          {!product.inStock ? <span className="badge badge--soft">ناموجود</span> : null}
        </div>

        <button
          type="button"
          className={`product-card__wish ${wished ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-pressed={wished}
          aria-label={wished ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
        >
          <IconHeart filled={wished} width={18} height={18} />
        </button>

        <div className="product-card__quick">
          {canQuickAdd(product) ? (
            <button type="button" className="product-card__quick-btn" onClick={handleQuickAdd}>
              افزودن به سبد
            </button>
          ) : (
            <Link to={`/product/${product.slug}`} className="product-card__quick-btn">
              انتخاب سایز و رنگ
            </Link>
          )}
        </div>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className={`price ${product.discountPercent > 0 ? 'price--sale' : ''}`}>
          <span className="price__now">{formatToman(product.finalPrice)}</span>
          {product.discountPercent > 0 ? <span className="price__old">{formatToman(product.price)}</span> : null}
        </div>

        <div className="product-card__meta">
          <span className="rating">
            <span className="rating__stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <IconStar key={index} filled={index < Math.round(product.rating)} />
              ))}
            </span>
            <span className="visually-hidden">امتیاز {product.rating} از ۵</span>
            <span className="rating__count">({formatNumber(product.reviewCount)} نظر)</span>
          </span>

          {product.colors.length > 1 ? (
            <span className="product-card__colors" aria-label="رنگ‌های موجود">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  className="color-dot"
                  style={{ background: color.hex }}
                  title={color.name}
                />
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
