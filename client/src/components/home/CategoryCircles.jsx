import { Link } from 'react-router-dom';
import { img } from '../../lib/img.js';

export default function CategoryCircles({ categories }) {
  if (!categories?.length) return null;

  const items = [
    ...categories.map((category) => ({
      label: category.name,
      to: `/category/${category.slug}`,
      image: category.imageUrl,
    })),
    { label: 'حراجی', to: '/shop?onSale=1', sale: true },
  ];

  return (
    <section aria-label="دسته‌بندی‌ها" className="pb-12 pt-4 md:pb-16">
      <div className="shell">
        <ul className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-9 lg:gap-4">
          {items.map((item) => (
            <li key={item.label} className="w-[86px] shrink-0 snap-start md:w-auto">
              <Link to={item.to} className="group flex flex-col items-center gap-3 text-center">
                {item.sale ? (
                  <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-onyx text-[13px] font-medium text-white transition-transform duration-200 group-hover:scale-105 md:h-[92px] md:w-[92px] lg:h-[88px] lg:w-[88px]">
                    حراج
                  </span>
                ) : (
                  <span className="relative block h-[76px] w-[76px] overflow-hidden rounded-full bg-cream ring-1 ring-line transition-transform duration-200 group-hover:scale-105 md:h-[92px] md:w-[92px] lg:h-[88px] lg:w-[88px]">
                    <img
                      src={img(item.image, 240)}
                      alt=""
                      width={88}
                      height={88}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </span>
                )}
                <span className="text-[11.5px] text-muted transition-colors group-hover:text-ink">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
