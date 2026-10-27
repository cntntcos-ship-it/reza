import { Link } from 'react-router-dom';
import { useSeo } from '../lib/useSeo.js';

export default function NotFound() {
  useSeo({ title: 'صفحه پیدا نشد' });

  return (
    <div className="shell flex flex-col items-center justify-center py-24 text-center">
      <span className="num text-[11px] text-muted">۴۰۴</span>
      <h1 className="h1 mt-3">این صفحه پیدا نشد</h1>
      <p className="lede mt-3 max-w-sm">
        ممکن است نشانی تغییر کرده باشد یا محصول از فروشگاه حذف شده باشد.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/" className="btn btn-primary">
          صفحه اصلی
        </Link>
        <Link to="/shop" className="btn btn-outline">
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}
