import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader.jsx';
import { img } from '../../lib/img.js';

const cards = [
  { key: 'women', slug: 'women', title: 'کالکشن زنانه', cta: 'مشاهده محصولات' },
  { key: 'men', slug: 'men', title: 'کالکشن مردانه', cta: 'مشاهده محصولات' },
  {
    key: 'clothing',
    slug: 'tops',
    title: 'لباس‌های منتخب',
    cta: 'کشف استایل',
    to: '/shop?categories=tops,dresses,trousers',
  },
  { key: 'accessories', slug: 'accessories', title: 'اکسسوری و جزئیات', cta: 'مشاهده مجموعه' },
];

export default function CategoryShowcase({ categories }) {
  const bySlug = Object.fromEntries((categories ?? []).map((category) => [category.slug, category]));

  return (
    <section className="section pt-0" aria-labelledby="category-showcase-title">
      <div className="shell">
        <SectionHeader
          eyebrow="خرید بر اساس دسته‌بندی"
          title="استایل دلخواهتان را پیدا کنید"
          action={{ label: 'مشاهده همه دسته‌ها', to: '/shop' }}
        />
        <h2 id="category-showcase-title" className="sr-only">
          دسته‌بندی‌های اصلی
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:gap-4 lg:grid-cols-4">
          {cards.map((card) => {
            const category = bySlug[card.slug];
            const image = category?.bannerUrl || category?.imageUrl;
            const to = card.to ?? `/category/${card.slug}`;
            return (
              <Link
                key={card.key}
                to={to}
                className="group relative block overflow-hidden rounded-soft bg-cream"
              >
                <div className="relative aspect-[3/4] w-full">
                  {image ? (
                    <img
                      src={img(image, 700)}
                      alt={`${card.title} — کالکشن لونورا`}
                      width={700}
                      height={933}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-cream" aria-hidden="true" />
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <h3 className="text-[14px] font-medium text-white md:text-[15px]">
                      {card.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-white/85 transition-colors group-hover:text-white">
                      {card.cta}
                      <ArrowLeft size={12} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
