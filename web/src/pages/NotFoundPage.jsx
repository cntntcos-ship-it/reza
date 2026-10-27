import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo.js';

export default function NotFoundPage() {
  useSeo({
    title: 'صفحه پیدا نشد',
    description: 'صفحه‌ی مورد نظر در لونورا پیدا نشد.',
  });

  return (
    <div className="page page--notfound">
      <div className="container container--narrow">
        <p className="notfound__code latin" aria-hidden="true">
          404
        </p>
        <h1 className="notfound__title">این صفحه پیدا نشد</h1>
        <p className="notfound__text">
          ممکن است نشانی تغییر کرده باشد یا محصول از فروشگاه حذف شده باشد. از این‌جا ادامه بده:
        </p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn--dark">
            صفحه اصلی
          </Link>
          <Link to="/shop" className="btn btn--outline">
            همه محصولات
          </Link>
          <Link to="/contact" className="btn btn--outline">
            تماس با ما
          </Link>
        </div>
      </div>
    </div>
  );
}
