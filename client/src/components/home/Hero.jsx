import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { site } from '../../config/site.js';

/**
 * Static hero. This is intentionally NOT a slider: one fixed image of four models
 * (two men, two women) with no rotation, autoplay, dots or arrows.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pb-10 pt-4 md:pb-14 md:pt-6">
      <div className="shell">
        <div className="grid items-center gap-8 lg:grid-cols-[45fr_55fr] lg:gap-14">
          <div className="flex flex-col items-start">
            <span className="eyebrow">{site.hero.eyebrow}</span>
            <h1 id="hero-title" className="display mt-4 max-w-[15ch]">
              {site.hero.title}
            </h1>
            <p className="lede mt-5 max-w-md">{site.hero.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={site.hero.primaryCta.to} className="btn btn-primary">
                {site.hero.primaryCta.label}
                <ArrowLeft size={15} aria-hidden="true" />
              </Link>
              <Link to={site.hero.secondaryCta.to} className="btn btn-outline">
                {site.hero.secondaryCta.label}
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 text-[11px] text-muted">
              <span className="block h-px w-10 bg-beige" aria-hidden="true" />
              <span>کالکشن پوشاک زنانه و مردانه</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-soft bg-cream sm:h-[480px] lg:h-[620px]">
              <img
                src={site.hero.image}
                alt={site.hero.imageAlt}
                width={1200}
                height={1600}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-[50%_28%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
