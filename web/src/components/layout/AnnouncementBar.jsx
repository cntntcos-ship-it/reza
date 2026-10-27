import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../context/ConfigContext.jsx';
import { formatToman } from '../../lib/format.js';

export default function AnnouncementBar() {
  const config = useSiteConfig();

  return (
    <div className="announce">
      <div className="container announce__inner">
        <p className="announce__item">
          ارسال رایگان برای سفارش‌های بالای {formatToman(config.freeShippingThreshold)}
        </p>
        <span className="announce__sep" aria-hidden="true" />
        <Link to="/faq" className="announce__link">
          شرایط ارسال و بازگشت کالا
        </Link>
      </div>
    </div>
  );
}
