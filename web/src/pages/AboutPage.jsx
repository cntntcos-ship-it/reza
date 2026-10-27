import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo.js';
import { photo } from '../lib/images.js';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';

export default function AboutPage() {
  useSeo({
    title: 'داستان ما',
    description: 'لونورا؛ فروشگاهی با تمرکز بر طراحی مینیمال، پارچه‌های طبیعی و دوخت ماندگار.',
  });

  return (
    <div className="page">
      <div className="container container--narrow">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'داستان ما', to: '/about' },
          ]}
        />

        <header className="page__head">
          <p className="eyebrow">درباره لونورا</p>
          <h1 className="page__title">سادگی، ماندگار است</h1>
          <p className="page__lead">
            لونورا با یک ایده‌ی ساده شروع شد: لباس‌هایی که هر روز بپوشی و بعد از سال‌ها هنوز دوستشان داشته باشی.
          </p>
        </header>

        <div className="about-hero">
          <img
            src={photo(7959651, 1200, 800)}
            alt="مدل با کت اورسایز در نور طبیعی"
            width={1200}
            height={800}
            loading="lazy"
          />
        </div>

        <div className="prose">
          <h2>چه چیزی ما را متفاوت می‌کند</h2>
          <p>
            ما به‌جای دنبال کردن فصل‌های پرسرعت مد، روی برش‌های ساده، رنگ‌های خنثی و پارچه‌هایی تمرکز می‌کنیم که
            سال‌ها دوام بیاورند. هر قطعه پیش از اضافه شدن به کالکشن، از نظر دوخت، افت پارچه و راحتی بررسی می‌شود.
          </p>

          <h2>اصول ما</h2>
          <ul>
            <li>
              <strong>طراحی بی‌زمان:</strong> فرم‌هایی که به ترند یک فصل وابسته نیستند.
            </li>
            <li>
              <strong>پارچه‌ی درست:</strong> پشم، کتان و نخ پنبه در اولویت؛ با مشخصات دقیق روی هر محصول.
            </li>
            <li>
              <strong>شفافیت:</strong> اطلاعات جنس، نگهداری و سایز برای هر کالا کامل نوشته شده است.
            </li>
            <li>
              <strong>احترام به زمان شما:</strong> خرید سریع، بدون شلوغی و پیشنهادهای اضافه.
            </li>
          </ul>

          <h2>وضعیت این نسخه</h2>
          <p>
            این نسخه‌ی فروشگاه، محصولات و تصاویر نمونه دارد تا تجربه‌ی کامل خرید — از مرور کالکشن تا ثبت سفارش —
            قابل بررسی باشد. داده‌های نمونه در بخش محصولات مشخص‌اند و سفارش‌ها در همین فروشگاه ثبت می‌شوند.
          </p>
          <p>
            برای همکاری، پیشنهاد یا هر پرسشی، از <Link to="/contact">فرم تماس</Link> استفاده کنید.
          </p>
        </div>
      </div>
    </div>
  );
}
