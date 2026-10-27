// Store-wide settings that drive both the UI and server-side order totals.
// Change shipping thresholds, payment availability or social handles here —
// no component needs to be touched.

export const SITE_CONFIG = {
  brand: {
    nameFa: 'لونورا',
    nameLat: 'LUNORA',
    tagline: 'استایلی ماندگار، انتخابی برای تو',
    description:
      'لونورا مجموعه‌ای از پوشاک و اکسسوری با طراحی مینیمال و دوخت باکیفیت است؛ برای کسانی که سادگی و ظرافت را به شلوغی ترجیح می‌دهند.',
  },
  currency: { code: 'IRT', label: 'تومان' },
  freeShippingThreshold: 5000000,
  shippingMethods: [
    { id: 'standard', title: 'پست پیشتاز', price: 69000, eta: '۳ تا ۵ روز کاری' },
    { id: 'express', title: 'ارسال سریع (پیک)', price: 129000, eta: '۱ تا ۲ روز کاری' },
  ],
  payments: {
    cashOnDelivery: true,
    onlineGateway: false,
    note: 'درگاه پرداخت آنلاین هنوز به فروشگاه متصل نشده است؛ سفارش‌ها با پرداخت در محل ثبت می‌شوند.',
  },
  newsletter: {
    provider: null,
    note: 'عضویت در خبرنامه در همین فروشگاه ذخیره می‌شود؛ اتصال به سرویس ارسال ایمیل هنوز تنظیم نشده است.',
  },
  // Placeholder handles: replace with the real brand accounts when they exist.
  // Kept in config so no component contains hardcoded social URLs.
  social: [
    { id: 'instagram', label: 'اینستاگرام', url: 'https://www.instagram.com/' },
    { id: 'facebook', label: 'فیسبوک', url: 'https://www.facebook.com/' },
    { id: 'pinterest', label: 'پینترست', url: 'https://www.pinterest.com/' },
    { id: 'tiktok', label: 'تیک‌تاک', url: 'https://www.tiktok.com/' },
  ],
  // The catalogue ships with seeded demo products; the UI never claims they are
  // live stock of a real store.
  demoCatalogue: true,
};
