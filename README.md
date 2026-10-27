# LUNORA

فروشگاه اینترنتی پوشاک و اکسسوری، فارسی و راست‌چین. رابط کاربری با React + Vite ساخته شده،
و یک API کوچک Express داده‌ها (کاتالوگ، سفارش، خبرنامه، پیام تماس) را در یک فایل JSON نگه می‌دارد.

## اجرا

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- فروشگاه: <http://localhost:3000>
- API (برای دیباگ): <http://localhost:8000/api/health>

در محیط Base44 همین دستور از سمت پلتفرم اجرا می‌شود و پیش‌نمایش روی پورت ۳۰۰۰ باز می‌شود.

## ساختار

```
api/                 Express API
  src/config.js      تنظیمات فروشگاه: آستانه ارسال رایگان، روش‌های ارسال، وضعیت پرداخت آنلاین
  src/seed.js        کاتالوگ نمونه (۱۳ دسته، ۱۸ محصول) + عکس‌های Pexels
  src/store.js       لایه‌ی داده JSON (نوشتن اتمیک)
  src/server.js      مسیرهای API، اعتبارسنجی و محاسبه‌ی مبلغ سفارش
  data/store.json    داده‌ی محلی (git-ignored) — برای ریست، حذفش کنید
web/                 React + Vite
  src/styles/        Design tokens و لایه‌های CSS (tokens, base, layout, home, shop, pages)
  src/components/    Header/Nav/Mega, Hero, Circles, Category grid, Banners, ProductCard/Grid,
                     Filters, Gallery, CartDrawer, SearchPanel, Footer, Newsletter
  src/pages/         Home, Shop, Category, Product, Cart, Checkout, Search, Wishlist,
                     Account (order tracking), About, Contact, FAQ, Terms, Privacy, 404
  src/context/       Config, Cart, Wishlist, UI (drawer/search), Toast
```

## API

| مسیر | توضیح |
| --- | --- |
| `GET /api/bootstrap` | تنظیمات فروشگاه + دسته‌بندی‌ها |
| `GET /api/products` | فیلتر `category`, `q`, `min`, `max`, `sizes`, `colors`, `sort`, `page`, `limit`, `featured`, `ids` |
| `GET /api/products/:slug` | محصول + breadcrumb + محصولات مرتبط |
| `GET /api/categories/:slug` | دسته‌بندی + زیردسته‌ها + breadcrumb |
| `POST /api/newsletter` | عضویت با ایمیل + رضایت |
| `POST /api/contact` | ثبت پیام تماس |
| `POST /api/orders` | ساخت سفارش؛ قیمت، موجودی و مبلغ نهایی **روی سرور** محاسبه می‌شود |
| `GET /api/orders/:code?phone=…` | پیگیری سفارش با کد + شماره موبایل |

## چه چیزی واقعاً کار می‌کند

- فیلتر دسته‌بندی، سایز، رنگ و بازه‌ی قیمت + مرتب‌سازی + صفحه‌بندی (همه روی داده‌ی سرور).
- جست‌وجو با پیشنهاد زنده و صفحه‌ی نتایج.
- سبد خرید و علاقه‌مندی‌ها (در مرورگر)، شمارنده‌ها، دراور سبد.
- ثبت سفارش: کنترل موجودی، اعتبارسنجی سایز/رنگ، محاسبه‌ی هزینه ارسال و کسر موجودی.
- پیگیری سفارش با کد و شماره موبایل.
- خبرنامه و فرم تماس با ذخیره‌سازی واقعی.

## چه چیزی وصل نیست

- **درگاه پرداخت آنلاین**: تنظیم نشده؛ سفارش‌ها با «پرداخت در محل» ثبت می‌شوند و هیچ تراکنشی انجام نمی‌شود.
- **سرویس ارسال ایمیل**: ایمیل‌های خبرنامه فقط ذخیره می‌شوند و ارسال نمی‌شوند.
- **احراز هویت**: ورود/ثبت‌نام ندارد؛ پیگیری سفارش با کد + شماره انجام می‌شود.
- **شبکه‌های اجتماعی**: آدرس‌ها در `api/src/config.js` به صفحه‌ی اصلی هر پلتفرم اشاره می‌کنند و باید با
  اکانت واقعی برند جایگزین شوند.
- **فونت IRANYekan**: فایل مجاز در مخزن نیست؛ فعلاً Vazirmatn (مجوز باز) نمایش داده می‌شود.
  راهنمای افزودن فونت واقعی: [`web/public/fonts/README.md`](web/public/fonts/README.md).

## داده‌ی نمونه

محصولات، قیمت‌ها، امتیازها و تصاویر، داده‌ی نمونه برای بررسی تجربه‌ی خرید هستند و ادعای موجودی واقعی
ندارند (این نکته در فوتر هم آمده است). برای تغییر کاتالوگ، `api/src/seed.js` را ویرایش و
`api/data/store.json` را حذف کنید.
