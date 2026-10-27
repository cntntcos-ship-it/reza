import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';
import { EmptyState, ErrorState, ProductGridSkeleton } from '../ui/States.jsx';

export default function ProductGrid({
  products = [],
  loading = false,
  error = '',
  onRetry,
  skeletonCount = 8,
  emptyTitle = 'محصولی با این مشخصات پیدا نشد',
  emptyText = 'فیلترها را تغییر دهید یا همه‌ی محصولات را ببینید.',
}) {
  if (loading && products.length === 0) {
    return <ProductGridSkeleton count={skeletonCount} />;
  }

  if (error && products.length === 0) {
    return <ErrorState text={error} onRetry={onRetry} />;
  }

  if (!loading && products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        text={emptyText}
        action={
          <Link to="/shop" className="btn btn--outline">
            مشاهده همه‌ی محصولات
          </Link>
        }
      />
    );
  }

  return (
    <div className={`product-grid ${loading ? 'is-loading' : ''}`} aria-busy={loading}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
