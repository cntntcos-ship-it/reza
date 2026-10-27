import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import { IconArrowLeft } from '../ui/Icons.jsx';

export default function FeaturedCategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="section-head__text">
            <p className="eyebrow">خرید بر اساس دسته‌بندی</p>
            <h2 className="section-head__title">استایل موردعلاقه‌ات را پیدا کن</h2>
          </div>
          <Link to="/shop" className="section-head__link">
            مشاهده همه دسته‌بندی‌ها
            <IconArrowLeft width={15} height={15} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 70}>
              <Link to={`/category/${category.slug}`} className="category-card">
                <span className="category-card__media">
                  <img
                    src={category.featuredImage}
                    alt={`کالکشن ${category.featuredTitle}`}
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="category-card__body">
                  <span className="category-card__title">{category.featuredTitle}</span>
                  <span className="category-card__cta">
                    مشاهده مجموعه
                    <IconArrowLeft width={14} height={14} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
