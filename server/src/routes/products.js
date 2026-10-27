import { Router } from 'express';
import { query } from '../db.js';
import { HttpError, toInt, wrap } from '../http.js';
import { productsPerPage } from '../config.js';

export const mapProduct = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  gender: row.gender,
  categorySlug: row.category_slug,
  price: row.price,
  compareAtPrice: row.compare_at_price,
  stock: row.stock,
  sizes: row.sizes,
  colors: row.colors,
  images: row.images,
  description: row.description,
  details: row.details,
  care: row.care,
  isFeatured: row.is_featured,
  isNew: row.is_new,
  // Ratings appear only when real review data exists; the demo catalog has none.
  rating: row.rating_count > 0 ? { average: Number(row.rating_avg), count: row.rating_count } : null,
  createdAt: row.created_at,
});

const SORTS = {
  newest: 'created_at desc, id desc',
  featured: 'is_featured desc, created_at desc',
  'price-asc': 'price asc',
  'price-desc': 'price desc',
};

const asList = (value) =>
  typeof value === 'string'
    ? value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

/**
 * Builds the shared WHERE clause. `scope` filters (search / gender / category)
 * are reused for facets so the filter sidebar does not collapse while narrowing.
 */
function buildFilters(params, { includeNarrowing = true } = {}) {
  const where = [];
  const values = [];

  const search = typeof params.q === 'string' ? params.q.trim() : '';
  if (search) {
    values.push(`%${search}%`);
    const i = values.length;
    where.push(`(name ilike $${i} or description ilike $${i})`);
  }

  if (params.gender === 'women' || params.gender === 'men') {
    values.push(params.gender);
    where.push(`gender = $${values.length}`);
  }

  if (typeof params.category === 'string' && params.category) {
    const slugs = params.category.split(',').map((s) => s.trim()).filter(Boolean);
    if (slugs.length === 1) {
      values.push(slugs[0]);
      where.push(`category_slug = $${values.length}`);
    } else if (slugs.length > 1) {
      values.push(slugs);
      where.push(`category_slug = any($${values.length}::text[])`);
    }
  }

  if (params.onSale === '1' || params.onSale === 'true') {
    where.push('compare_at_price is not null and compare_at_price > price');
  }
  if (params.newOnly === '1' || params.newOnly === 'true') {
    where.push('is_new = true');
  }
  if (params.featured === '1') {
    where.push('is_featured = true');
  }

  if (!includeNarrowing) {
    return { clause: where.length ? `where ${where.join(' and ')}` : '', values };
  }

  if (params.minPrice) {
    values.push(toInt(params.minPrice, 0));
    where.push(`price >= $${values.length}`);
  }
  if (params.maxPrice) {
    values.push(toInt(params.maxPrice, 0));
    where.push(`price <= $${values.length}`);
  }

  const sizes = asList(params.sizes);
  if (sizes.length) {
    values.push(sizes);
    where.push(`sizes && $${values.length}::text[]`);
  }

  const colors = asList(params.colors);
  if (colors.length) {
    values.push(colors);
    where.push(
      `exists (select 1 from jsonb_array_elements(colors) c where c->>'name' = any($${values.length}::text[]))`,
    );
  }

  return { clause: where.length ? `where ${where.join(' and ')}` : '', values };
}

export const productsRouter = Router();

productsRouter.get(
  '/',
  wrap(async (req, res) => {
    const { clause, values } = buildFilters(req.query);
    const sort = SORTS[req.query.sort] ?? SORTS.featured;
    const perPage = Math.min(Math.max(toInt(req.query.perPage, productsPerPage), 1), 48);
    const requestedPage = Math.max(toInt(req.query.page, 1), 1);

    const countResult = await query(`select count(*)::int as total from products ${clause}`, values);
    const total = countResult.rows[0].total;
    const pages = Math.max(Math.ceil(total / perPage), 1);
    const page = Math.min(requestedPage, pages);

    const rows = await query(
      `select * from products ${clause}
       order by ${sort}
       limit $${values.length + 1} offset $${values.length + 2}`,
      [...values, perPage, (page - 1) * perPage],
    );

    const scope = buildFilters(req.query, { includeNarrowing: false });
    const [sizeRows, colorRows, priceRows] = await Promise.all([
      query(
        `select distinct size from products, unnest(sizes) as size ${scope.clause} order by size`,
        scope.values,
      ),
      query(
        `select c->>'name' as name, min(c->>'hex') as hex
         from products, jsonb_array_elements(colors) as c
         ${scope.clause ? `${scope.clause} and` : 'where'} c->>'name' is not null
         group by c->>'name' order by c->>'name'`,
        scope.values,
      ),
      query(`select min(price) as min_price, max(price) as max_price from products ${scope.clause}`, scope.values),
    ]);

    res.json({
      items: rows.rows.map(mapProduct),
      total,
      page,
      pages,
      perPage,
      facets: {
        sizes: sizeRows.rows.map((row) => row.size).filter(Boolean),
        colors: colorRows.rows,
        minPrice: priceRows.rows[0]?.min_price ?? 0,
        maxPrice: priceRows.rows[0]?.max_price ?? 0,
      },
    });
  }),
);

productsRouter.get(
  '/:slug',
  wrap(async (req, res) => {
    const { rows } = await query('select * from products where slug = $1', [req.params.slug]);
    const product = rows[0];
    if (!product) throw new HttpError(404, 'محصول مورد نظر پیدا نشد.');

    const related = await query(
      `select * from products
       where category_slug = $1 and id <> $2
       order by is_featured desc, created_at desc limit 4`,
      [product.category_slug, product.id],
    );

    res.json({ product: mapProduct(product), related: related.rows.map(mapProduct) });
  }),
);
