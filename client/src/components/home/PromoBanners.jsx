import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { site } from '../../config/site.js';
import { img } from '../../lib/img.js';

export default function PromoBanners() {
  return (
    <section aria-label="پیشنهادهای فروشگاه" className="pb-12 md:pb-16">
      <div className="shell">
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {site.banners.map((banner) => (
            <article
              key={banner.title}
              className="grid grid-cols-2 overflow-hidden rounded-soft bg-cream"
            >
              <div className="flex flex-col justify-center p-5 md:p-7">
                <span className="text-[10.5px] text-muted">{banner.eyebrow}</span>
                <h3 className="h2 mt-2 text-[15px] md:text-[18px]">{banner.title}</h3>
                <p className="mt-2 hidden text-[12px] leading-6 text-muted sm:block">
                  {banner.description}
                </p>
                <Link
                  to={banner.to}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-[12px] text-ink transition-colors hover:text-muted"
                >
                  {banner.cta}
                  <ArrowLeft size={13} aria-hidden="true" />
                </Link>
              </div>
              <div className="relative min-h-[190px] md:min-h-[230px]">
                <img
                  src={banner.image}
                  alt={banner.imageAlt}
                  width={700}
                  height={700}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
