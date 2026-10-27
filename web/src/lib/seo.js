import { useEffect } from 'react';

const BRAND = 'لونورا';

/** Keeps the document title and meta description in sync per page. */
export function useSeo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${BRAND}` : `${BRAND} | فروشگاه پوشاک و اکسسوری`;

    if (!description) return;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, [title, description]);
}

/** Adds Product structured data while a product page is mounted. */
export function useProductStructuredData(product) {
  useEffect(() => {
    if (!product) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.lunora = 'product';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDescription,
      image: product.images,
      brand: { '@type': 'Brand', name: 'LUNORA' },
      offers: {
        '@type': 'Offer',
        price: product.finalPrice,
        priceCurrency: 'IRR',
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    });
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [product]);
}
