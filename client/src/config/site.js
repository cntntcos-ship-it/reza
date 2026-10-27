import { img } from '../lib/img.js';

/**
 * Central store settings — change the brand, contact details, hero art and
 * marketing banners here instead of inside components.
 *
 * Contact and social values are intentionally empty: no real, verified details
 * exist for this store yet, and inventing them would mislead customers. Fill
 * them in and the UI will start showing them (empty values stay hidden).
 */
export const site = {
  brand: {
    name: 'LUNORA',
    nameFa: 'لونورا',
    tagline: 'استایل ماندگار',
    taglineLong: 'استایل ماندگار، انتخابی برای هر روز',
    about:
      'مجموعه‌ای از انتخاب‌های مدرن برای ساختن استایلی ساده، هماهنگ و شخصی.',
  },
  contact: {
    email: '',
    phone: '',
    address: '',
    workingHours: '',
  },
  socials: [
    // { label: 'اینستاگرام', href: '' }  ← add a verified profile URL to display it
  ],
  announcement: 'این نسخه پیش‌نمایش است و محصولات، قیمت‌ها و موجودی آن داده نمایشی هستند.',
  hero: {
    eyebrow: 'کالکشن جدید',
    title: 'استایل ماندگار، برای هر روز شما',
    description:
      'ترکیبی از طراحی مدرن، رنگ‌های هماهنگ و انتخاب‌هایی که سادگی و ظرافت را به استایل روزمره شما می‌آورند.',
    primaryCta: { label: 'مشاهده محصولات', to: '/shop' },
    secondaryCta: { label: 'کشف کالکشن جدید', to: '/shop?sort=newest' },
    image: img('https://images.pexels.com/photos/9255742/pexels-photo-9255742.jpeg', 1500),
    imageAlt: 'چهار مدل، دو مرد و دو زن، با پوشش کرم و بژ در کنار یکدیگر',
  },
  banners: [
    {
      eyebrow: 'پیشنهاد محدود',
      title: 'فصل تازه، استایل تازه',
      description: 'انتخاب‌هایی برای ساختن ترکیب‌های تازه و جذاب.',
      cta: 'مشاهده پیشنهادها',
      to: '/shop?sort=newest',
      image: img('https://images.pexels.com/photos/33774463/pexels-photo-33774463.jpeg', 1000),
      imageAlt: 'مدل زن با استایل مینیمال و پوشش بژ در فضای باز',
    },
    {
      eyebrow: 'تازه رسیده‌ها',
      title: 'جدیدترین انتخاب‌ها',
      description: 'با جدیدترین مدل‌ها، استایل شخصی خودتان را بسازید.',
      cta: 'مشاهده محصولات جدید',
      to: '/shop?sort=newest',
      image: img('https://images.pexels.com/photos/8387807/pexels-photo-8387807.jpeg', 1000),
      imageAlt: 'رگال لباس‌های مدرن با رنگ‌های هماهنگ',
    },
  ],
  newsletter: {
    eyebrow: 'برای اولین نفر باخبر شوید',
    title: 'به دنیای استایل ما بپیوندید',
    description:
      'برای اطلاع از کالکشن‌های جدید، پیشنهادهای ویژه و ایده‌های استایل، عضو خبرنامه شوید.',
    image: img('https://images.pexels.com/photos/27351827/pexels-photo-27351827.jpeg', 1200),
    imageAlt: 'مدل زن با کت بژ در محیطی روشن و مینیمال',
  },
  nav: [
    { label: 'صفحه اصلی', to: '/' },
    { label: 'فروشگاه', to: '/shop' },
    { label: 'زنانه', to: '/category/women' },
    { label: 'مردانه', to: '/category/men' },
    { label: 'لباس‌ها', to: '/shop?categories=tops,dresses,trousers' },
    { label: 'کیف و کفش', to: '/shop?categories=bags,shoes' },
    { label: 'اکسسوری', to: '/shop?category=accessories' },
    { label: 'کالکشن جدید', to: '/shop?sort=newest' },
    { label: 'حراجی', to: '/shop?onSale=1' },
  ],
  footerColumns: [
    {
      title: 'فروشگاه',
      links: [
        { label: 'همه محصولات', to: '/shop' },
        { label: 'جدیدترین محصولات', to: '/shop?sort=newest' },
        { label: 'زنانه', to: '/category/women' },
        { label: 'مردانه', to: '/category/men' },
        { label: 'لباس‌ها', to: '/shop?categories=tops,dresses,trousers' },
        { label: 'کیف و کفش', to: '/shop?categories=bags,shoes' },
        { label: 'اکسسوری', to: '/shop?category=accessories' },
        { label: 'حراجی', to: '/shop?onSale=1' },
      ],
    },
    {
      title: 'خدمات مشتریان',
      links: [
        { label: 'تماس با ما', to: '/contact' },
        { label: 'راهنمای خرید', to: '/faq' },
        { label: 'روش‌های ارسال', to: '/shipping-returns' },
        { label: 'قوانین بازگشت کالا', to: '/shipping-returns' },
        { label: 'سؤالات متداول', to: '/faq' },
        { label: 'پیگیری سفارش', to: '/track-order' },
      ],
    },
    {
      title: 'درباره ما',
      links: [
        { label: 'داستان برند', to: '/about' },
        { label: 'راهنمای سایز', to: '/size-guide' },
        { label: 'حریم خصوصی', to: '/privacy' },
        { label: 'قوانین و مقررات', to: '/terms' },
      ],
    },
  ],
};

export const hasContactInfo = Boolean(
  site.contact.email || site.contact.phone || site.contact.address,
);
