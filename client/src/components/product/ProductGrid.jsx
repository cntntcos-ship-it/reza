import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, columns = 6, priorityCount = 0 }) {
  const columnClass =
    columns === 4
      ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
      : columns === 3
        ? 'grid-cols-2 md:grid-cols-3'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';

  return (
    <div className={`grid gap-x-4 gap-y-10 md:gap-x-5 ${columnClass}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  );
}
