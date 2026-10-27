import { useSiteConfig } from '../../context/ConfigContext.jsx';
import { photo } from '../../lib/images.js';
import NewsletterForm from '../newsletter/NewsletterForm.jsx';
import Reveal from '../ui/Reveal.jsx';

export default function NewsletterSection() {
  const config = useSiteConfig();

  return (
    <section className="section">
      <div className="container">
        <Reveal className="newsletter">
          <div className="newsletter__media">
            <img
              src={photo(21897127, 900, 900)}
              alt="مدل با کیف دستی چرم در استودیو"
              width={900}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="newsletter__body">
            <p className="eyebrow">خبرنامه لونورا</p>
            <h2 className="newsletter__title">به جمع استایل‌دوست‌ها بپیوند</h2>
            <p className="newsletter__text">
              از کالکشن‌های جدید، پیشنهادهای ویژه و انتخاب‌های تازه باخبر شو.
            </p>

            <NewsletterForm variant="home" />

            <p className="newsletter__note">
              {config.newsletter?.note ||
                'عضویت در خبرنامه در همین فروشگاه ذخیره می‌شود؛ اتصال به سرویس ارسال ایمیل هنوز تنظیم نشده است.'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
