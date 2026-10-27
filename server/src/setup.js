import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, query } from './db.js';
import { categories, products } from './data/catalog.js';

const here = path.dirname(fileURLToPath(import.meta.url));

async function waitForDatabase() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      await query('select 1');
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  throw new Error('database did not become ready in time');
}

async function seedCategories() {
  for (const category of categories) {
    await query(
      `insert into categories (slug, name, kind, description, image_url, banner_url, sort_order)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (slug) do update set
         name = excluded.name,
         kind = excluded.kind,
         description = excluded.description,
         image_url = excluded.image_url,
         banner_url = excluded.banner_url,
         sort_order = excluded.sort_order`,
      [
        category.slug,
        category.name,
        category.kind,
        category.description,
        category.image_url,
        category.banner_url,
        category.sort_order,
      ],
    );
  }
}

async function seedProducts() {
  const { rows } = await query('select count(*)::int as total from products');
  if (rows[0].total > 0) return 0;

  for (const product of products) {
    await query(
      `insert into products
        (slug, name, gender, category_slug, price, compare_at_price, stock, sizes, colors, images,
         description, details, care, is_featured, is_new)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        product.slug,
        product.name,
        product.gender,
        product.category_slug,
        product.price,
        product.compare_at_price,
        product.stock,
        product.sizes,
        JSON.stringify(product.colors),
        JSON.stringify(product.images),
        product.description,
        product.details,
        product.care,
        product.is_featured,
        product.is_new,
      ],
    );
  }
  return products.length;
}

async function main() {
  await waitForDatabase();
  const schema = await fs.readFile(path.join(here, 'schema.sql'), 'utf8');
  await query(schema);
  await seedCategories();
  const inserted = await seedProducts();
  console.log(
    inserted > 0
      ? `seeded ${inserted} demo products and ${categories.length} categories`
      : 'catalog already present, nothing to seed',
  );
  await pool.end();
}

main().catch(async (error) => {
  console.error('setup failed:', error.message);
  await pool.end().catch(() => {});
  process.exit(1);
});
