import { site } from '../../config/site.js';
import NewsletterForm from '../ui/NewsletterForm.jsx';

export default function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="pb-14 md:pb-20">
      <div className="shell">
        <div className="grid overflow-hidden rounded-soft bg-cream md:grid-cols-2">
          <div className="relative min-h-[240px] md:min-h-[340px]">
            <img
              src={site.newsletter.image}
              alt={site.newsletter.imageAlt}
              width={900}
              height={900}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <span className="eyebrow">{site.newsletter.eyebrow}</span>
            <h2 id="newsletter-title" className="h1 mt-3">
              {site.newsletter.title}
            </h2>
            <p className="lede mt-3 max-w-md">{site.newsletter.description}</p>
            <div className="mt-6 max-w-md">
              <NewsletterForm idPrefix="home-newsletter" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
