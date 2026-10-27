import { Link } from 'react-router-dom';

export default function CategoryCircleList({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="circles" aria-label="دسته‌بندی محصولات">
      <div className="container">
        <ul className="circles__list">
          {categories.map((category) => (
            <li className="circles__item" key={category.id}>
              <Link to={`/category/${category.slug}`} className="circle-card">
                <span className="circle-card__media">
                  <img
                    src={category.image}
                    alt={`دسته‌بندی ${category.name}`}
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="circle-card__name">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
