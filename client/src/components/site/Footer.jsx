import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { site } from '../../config/site.js';
import NewsletterForm from '../ui/NewsletterForm.jsx';

const socialIcons = { اینستاگرام: Instagram, فیسبوک: Facebook };

export default function Footer() {
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());

  return (
    <footer className="bg-[#171717] text-white/80">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-extrabold tracking-[0.32em] text-white">
                {site.brand.name}
              </span>
              <span className="mt-2 text-[11px] text-white/50">{site.brand.taglineLong}</span>
            </Link>
            <p className="mt-5 max-w-xs text-[13px] leading-7 text-white/60">{site.brand.about}</p>

            {site.socials.length > 0 ? (
              <ul className="mt-6 flex items-center gap-2">
                {site.socials.map((social) => {
                  const Icon = socialIcons[social.label];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                        aria-label={social.label}
                      >
                        <Icon size={16} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {site.footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <h3 className="text-[12px] font-medium text-white">{column.title}</h3>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="flex min-h-9 items-center text-[12.5px] text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <h3 className="text-[12px] font-medium text-white">ارتباط و عضویت</h3>
            <p className="mt-3 text-[12px] leading-6 text-white/60">
              برای اطلاع از کالکشن‌های جدید، ایمیل خود را وارد کنید.
            </p>
            <div className="mt-4">
              <NewsletterForm tone="dark" compact idPrefix="footer-newsletter" />
            </div>

            {site.contact.email || site.contact.phone ? (
              <ul className="mt-5 space-y-1 text-[12px] text-white/60">
                {site.contact.email ? (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className="ltr inline-block hover:text-white">
                      {site.contact.email}
                    </a>
                  </li>
                ) : null}
                {site.contact.phone ? (
                  <li>
                    <a href={`tel:${site.contact.phone}`} className="ltr inline-block hover:text-white">
                      {site.contact.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] text-white/45">
            © {year} {site.brand.nameFa}. تمام حقوق محفوظ است.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/50">
            <li>
              <Link to="/privacy" className="hover:text-white">
                حریم خصوصی
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">
                قوانین و مقررات
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="hover:text-white">
                پیگیری سفارش
              </Link>
            </li>
          </ul>
        </div>
        <p className="mt-4 text-[10.5px] leading-5 text-white/35">
          این نسخه یک پیش‌نمایش است؛ محصولات، قیمت‌ها و موجودی نمایش‌داده‌شده نمونه هستند و سفارش
          واقعی ثبت نمی‌شود.
        </p>
      </div>
    </footer>
  );
}
