import { Link } from 'react-router-dom';
import { photo } from '../../lib/images.js';
import Reveal from '../ui/Reveal.jsx';
import { IconArrowLeft } from '../ui/Icons.jsx';

const BANNERS = [
  {
    id: 'sale',
    label: 'پیشنهاد محدود',
    title: 'فصل تازه، استایلی تازه',
    text: 'منتخب‌هایی برای ساختن استایلی متفاوت',
    cta: 'مشاهده تخفیف‌ها',
    to: '/category/sale',
    image: photo(11911863, 1200, 760),
    alt: 'رگال لباس در نور گرم ویترین فروشگاه',
  },
  {
    id: 'new-in',
    label: 'تازه رسیده‌ها',
    title: 'تازه‌ترین انتخاب‌ها',
    text: 'با جدیدترین ترندها آشنا شو',
    cta: 'مشاهده جدیدترین‌ها',
    to: '/shop?sort=newest',
    image: photo(26292716, 1200, 760),
    alt: 'رگال لباس و عینک در فروشگاه با نور گرم',
  },
];

export default function PromotionalBanners() {
  return (
    <section className="section section--tight" aria-label="پیشنهادهای فروشگاه">
      <div className="container">
        <div className="banners">
          {BANNERS.map((banner, index) => (
            <Reveal key={banner.id} delay={index * 80}>
              <Link to={banner.to} className="promo-banner">
                <img
                  className="promo-banner__image"
                  src={banner.image}
                  alt={banner.alt}
                  width={1200}
                  height={760}
                  loading="lazy"
                  decoding="async"
                />
                <span className="promo-banner__scrim" aria-hidden="true" />
                <span className="promo-banner__body">
                  <span className="promo-banner__label">{banner.label}</span>
                  <span className="promo-banner__title">{banner.title}</span>
                  <span className="promo-banner__text">{banner.text}</span>
                  <span className="promo-banner__cta">
                    {banner.cta}
                    <IconArrowLeft width={15} height={15} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
