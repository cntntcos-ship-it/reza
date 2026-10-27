import { Link } from 'react-router-dom';
import { site, hasContactInfo } from '../config/site.js';
import { useSeo } from '../lib/useSeo.js';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';

export default function Contact() {
  useSeo({
    title: 'تماس با ما',
    description: 'راه‌های ارتباط با فروشگاه لونورا.',
  });

  return (
    <div className="shell pb-16 pt-6">
      <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'تماس با ما' }]} />

      <div className="mt-5 max-w-2xl">
        <span className="eyebrow">ارتباط</span>
        <h1 className="h1 mt-3">تماس با ما</h1>
        <p className="lede mt-3">
          برای پرسش درباره سفارش، سایز یا شرایط خرید با ما در ارتباط باشید.
        </p>

        {hasContactInfo ? (
          <dl className="mt-8 divide-y divide-line border-y border-line text-[13px]">
            {site.contact.email ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted">ایمیل</dt>
                <dd>
                  <a href={`mailto:${site.contact.email}`} className="ltr inline-block text-ink hover:text-muted">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {site.contact.phone ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted">تلفن</dt>
                <dd>
                  <a href={`tel:${site.contact.phone}`} className="ltr inline-block text-ink hover:text-muted">
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {site.contact.address ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted">نشانی</dt>
                <dd className="text-start text-ink">{site.contact.address}</dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <div className="mt-8 rounded-soft border border-dashed border-line bg-white p-6">
            <p className="text-[13px] text-ink">راه‌های ارتباطی هنوز ثبت نشده است.</p>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              برای نمایش ایمیل، تلفن یا نشانی در این صفحه، آن‌ها را در تنظیمات مرکزی فروشگاه
              (<span className="ltr inline-block text-[11px] text-ink">client/src/config/site.js</span>)
              وارد کنید. تا آن زمان هیچ شماره یا نشانی ساختگی نمایش داده نمی‌شود.
            </p>
          </div>
        )}

        {site.socials.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-light btn-sm"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-10 rounded-soft bg-cream p-6">
          <h2 className="h2">پرسش پرتکرار را اینجا پیدا کنید</h2>
          <p className="mt-2 text-[12.5px] leading-7 text-muted">
            پاسخ پرسش‌های مربوط به ارسال، بازگشت کالا و پرداخت در صفحه سؤالات متداول آمده است.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/faq" className="btn btn-primary btn-sm">
              سؤالات متداول
            </Link>
            <Link to="/track-order" className="btn btn-light btn-sm">
              پیگیری سفارش
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
