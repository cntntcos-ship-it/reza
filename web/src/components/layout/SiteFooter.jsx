import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../context/ConfigContext.jsx';
import NewsletterForm from '../newsletter/NewsletterForm.jsx';
import { SOCIAL_ICONS } from '../ui/Icons.jsx';

const SHOP_LINKS = [
  { to: '/shop', label: 'همه محصولات' },
  { to: '/shop?sort=newest', label: 'جدیدترین‌ها' },
  { to: '/category/women', label: 'زنانه' },
  { to: '/category/men', label: 'مردانه' },
  { to: '/category/sale', label: 'حراج' },
];

const CARE_LINKS = [
  { to: '/contact', label: 'تماس با ما' },
  { to: '/faq#orders', label: 'راهنمای خرید' },
  { to: '/faq#shipping', label: 'روش‌های ارسال' },
  { to: '/faq#returns', label: 'شرایط بازگشت کالا' },
  { to: '/faq', label: 'سؤالات متداول' },
];

const ABOUT_LINKS = [
  { to: '/about', label: 'داستان ما' },
  { to: '/privacy', label: 'سیاست حفظ حریم خصوصی' },
  { to: '/terms', label: 'شرایط استفاده' },
  { to: '/contact', label: 'همکاری با ما' },
];

export default function SiteFooter() {
  const config = useSiteConfig();
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <span className="footer__brand latin">LUNORA</span>
            <p className="footer__about">{config.brand.description}</p>
            <ul className="footer__social" aria-label="شبکه‌های اجتماعی">
              {config.social.map((item) => {
                const Icon = SOCIAL_ICONS[item.id];
                if (!Icon) return null;
                return (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      aria-label={item.label}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="footer__social-link"
                    >
                      <Icon width={18} height={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav className="footer__col" aria-label="خرید">
            <h2 className="footer__title">خرید</h2>
            <ul className="footer__links">
              {SHOP_LINKS.map((link) => (
                <li key={link.to + link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="خدمات مشتریان">
            <h2 className="footer__title">خدمات مشتریان</h2>
            <ul className="footer__links">
              {CARE_LINKS.map((link) => (
                <li key={link.to + link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="درباره برند">
            <h2 className="footer__title">درباره برند</h2>
            <ul className="footer__links">
              {ABOUT_LINKS.map((link) => (
                <li key={link.to + link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col footer__col--newsletter">
            <h2 className="footer__title">عضویت در خبرنامه</h2>
            <p className="footer__about">کالکشن‌های تازه و پیشنهادهای ویژه، بدون ایمیل اضافه.</p>
            <NewsletterForm variant="footer" />
            <p className="footer__note">
              راه ارتباطی فعلی فروشگاه، <Link to="/contact">فرم تماس</Link> است.
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {year} لونورا — همه حقوق محفوظ است.</p>
          {config.demoCatalogue ? (
            <p className="footer__disclaimer">محصولات، تصاویر و قیمت‌های این نسخه، داده‌ی نمونه هستند.</p>
          ) : null}
          <div className="footer__legal">
            <Link to="/terms">شرایط استفاده</Link>
            <Link to="/privacy">حریم خصوصی</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
