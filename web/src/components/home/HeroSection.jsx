import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { photo, slideNumber } from '../../lib/images.js';
import { IconArrowLeft, IconCheck, IconReturn, IconShield, IconTruck } from '../ui/Icons.jsx';

const SLIDES = [
  {
    id: 'signature',
    label: 'مجموعه جدید',
    title: 'استایل تو، امضای توست',
    text: 'انتخاب‌هایی ماندگار برای هر روز؛ ترکیبی از سادگی، ظرافت و کیفیت برای استایلی که به تو تعلق دارد.',
    primary: { label: 'مشاهده محصولات', to: '/shop' },
    secondary: { label: 'مشاهده کالکشن', to: '/category/women' },
    image: photo(29905798, 1100, 1400),
    alt: 'مدل زن با کت و شلوار بژ در نور طبیعی روز',
  },
  {
    id: 'quiet',
    label: 'کالکشن پاییز',
    title: 'آرامش در جزئیات',
    text: 'پارچه‌های طبیعی، رنگ‌های خنثی و برش‌هایی که با تو همراه می‌شوند؛ ساده، اما ماندگار.',
    primary: { label: 'تازه‌ترین‌ها', to: '/shop?sort=newest' },
    secondary: { label: 'پیراهن و لباس', to: '/category/dresses' },
    image: photo(27228782, 1100, 1400),
    alt: 'مدل زن با کت‌شلوار کرم‌رنگ روی صندلی حصیری',
  },
  {
    id: 'evening',
    label: 'منتخب مجلسی',
    title: 'شب‌های ماندگار',
    text: 'پیراهن‌ها و اکسسوری‌هایی برای لحظه‌هایی که می‌خواهی به یاد بمانند.',
    primary: { label: 'مشاهده پیراهن‌ها', to: '/category/dresses' },
    secondary: { label: 'اکسسوری‌ها', to: '/category/accessories' },
    image: photo(29850173, 1100, 1400),
    alt: 'مدل زن با پیراهن مشکی در استودیو',
  },
];

const HERO_BENEFITS = [
  { id: 'shipping', icon: IconTruck, title: 'ارسال سفارش', text: 'به سراسر ایران' },
  { id: 'returns', icon: IconReturn, title: 'بازگشت کالا', text: 'طبق شرایط فروشگاه' },
  { id: 'payment', icon: IconShield, title: 'پرداخت در محل', text: 'هنگام تحویل سفارش' },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (paused || reducedMotion) return undefined;
    timer.current = window.setTimeout(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 7000);
    return () => window.clearTimeout(timer.current);
  }, [index, paused, reducedMotion]);

  const slide = SLIDES[index];

  return (
    <section
      className="hero"
      aria-label="معرفی مجموعه‌های لونورا"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__label">{slide.label}</p>
          <h1 className="hero__title">{slide.title}</h1>
          <p className="hero__text">{slide.text}</p>

          <div className="hero__actions">
            <Link className="btn btn--dark" to={slide.primary.to}>
              {slide.primary.label}
              <IconArrowLeft width={16} height={16} />
            </Link>
            <Link className="btn btn--outline" to={slide.secondary.to}>
              {slide.secondary.label}
            </Link>
          </div>

          <ul className="hero__benefits">
            {HERO_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.id}>
                  <Icon width={22} height={22} aria-hidden="true" />
                  <span>
                    <span className="hero__benefit-title">{benefit.title}</span>
                    <span className="hero__benefit-text">{benefit.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hero__media">
          {SLIDES.map((item, itemIndex) => (
            <img
              key={item.id}
              className={`hero__image ${itemIndex === index ? 'is-active' : ''}`}
              src={item.image}
              alt={item.alt}
              width={1100}
              height={1400}
              loading={itemIndex === 0 ? 'eager' : 'lazy'}
              fetchpriority={itemIndex === 0 ? 'high' : undefined}
              decoding={itemIndex === 0 ? 'sync' : 'async'}
              aria-hidden={itemIndex !== index}
            />
          ))}

          <div className="hero__indicator" role="group" aria-label="اسلایدهای معرفی">
            {SLIDES.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={`hero__dot ${itemIndex === index ? 'is-active' : ''}`}
                onClick={() => setIndex(itemIndex)}
                aria-pressed={itemIndex === index}
                aria-label={`اسلاید ${slideNumber(itemIndex)}: ${item.label}`}
              >
                {slideNumber(itemIndex)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <p className="hero__trust">
          <IconCheck width={14} height={14} aria-hidden="true" />
          سفارش‌ها با پرداخت در محل ثبت می‌شوند؛ درگاه پرداخت آنلاین هنوز فعال نشده است.
        </p>
      </div>
    </section>
  );
}
