import crypto from 'node:crypto';
import express from 'express';
import { SITE_CONFIG } from './config.js';
import { getDb, initDb, saveDb } from './store.js';

initDb();

const app = express();
const PORT = Number(process.env.PORT || 8000);

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const toLatinDigits = (value) =>
  String(value ?? '').replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

const normalizePhone = (value) => toLatinDigits(value).replace(/[\s\-()]/g, '');

const fail = (res, status, message, code = 'invalid_request') =>
  res.status(status).json({ error: { code, message } });

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(value || '').trim());

const isMobile = (value) => /^09\d{9}$/.test(normalizePhone(value));

const publicProduct = (product) => {
  const price = product.price;
  const salePrice = typeof product.salePrice === 'number' ? product.salePrice : null;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    categoryId: product.categoryId,
    price,
    salePrice,
    finalPrice: salePrice ?? price,
    discountPercent: salePrice ? Math.round(((price - salePrice) / price) * 100) : 0,
    currency: product.currency,
    images: product.images,
    primaryImage: product.images[0],
    hoverImage: product.images[1] ?? null,
    colors: product.colors,
    sizes: product.sizes,
    stock: product.stock,
    inStock: product.stock > 0,
    featured: !!product.featured,
    rating: product.rating,
    reviewCount: product.reviewCount,
    createdAt: product.createdAt,
    isNew: Date.now() - new Date(product.createdAt).getTime() < 21 * 86400000,
  };
};

const categoryById = (id) => getDb().categories.find((c) => c.id === id) ?? null;
const categoryBySlug = (slug) => getDb().categories.find((c) => c.slug === slug) ?? null;

const descendantIds = (category) => {
  if (!category) return [];
  const ids = [category.id];
  const { categories } = getDb();
  let frontier = [category.id];
  while (frontier.length) {
    const children = categories.filter((c) => frontier.includes(c.parentId)).map((c) => c.id);
    const next = children.filter((id) => !ids.includes(id));
    ids.push(...next);
    frontier = next;
  }
  return ids;
};

const breadcrumbFor = (category) => {
  const trail = [];
  let current = category;
  while (current) {
    trail.unshift({ id: current.id, name: current.name, slug: current.slug });
    current = current.parentId ? categoryById(current.parentId) : null;
  }
  return trail;
};

const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// ---------------------------------------------------------------------------
// catalogue
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  const { products, categories } = getDb();
  res.json({ ok: true, products: products.length, categories: categories.length });
});

app.get('/api/config', (_req, res) => {
  res.json(SITE_CONFIG);
});

app.get('/api/bootstrap', (_req, res) => {
  const { categories } = getDb();
  res.json({
    config: SITE_CONFIG,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parentId,
      image: c.image,
      inCircles: !!c.inCircles,
      circleOrder: c.circleOrder ?? 99,
      inFeaturedGrid: !!c.inFeaturedGrid,
      featuredTitle: c.featuredTitle ?? c.name,
      featuredImage: c.featuredImage ?? c.image,
      isSale: !!c.isSale,
    })),
  });
});

app.get('/api/categories', (_req, res) => {
  const { categories, products } = getDb();
  res.json(
    categories.map((c) => {
      const ids = descendantIds(c);
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parentId,
        image: c.image,
        description: c.description,
        productCount: products.filter((p) => ids.includes(p.categoryId) && p.status === 'active').length,
      };
    }),
  );
});

app.get('/api/categories/:slug', (req, res) => {
  const category = categoryBySlug(req.params.slug);
  if (!category) return fail(res, 404, 'این دسته‌بندی پیدا نشد.', 'category_not_found');
  const { categories, products } = getDb();
  const ids = descendantIds(category);
  res.json({
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      image: category.image,
      description: category.description,
      isSale: !!category.isSale,
      productCount: products.filter((p) => ids.includes(p.categoryId) && p.status === 'active').length,
    },
    breadcrumb: breadcrumbFor(category),
    children: categories
      .filter((c) => c.parentId === category.id)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  });
});

app.get('/api/products', (req, res) => {
  const { products } = getDb();
  let scoped = products.filter((p) => p.status === 'active');

  const category = req.query.category ? categoryBySlug(String(req.query.category)) : null;
  if (req.query.category) {
    if (!category) return fail(res, 404, 'این دسته‌بندی پیدا نشد.', 'category_not_found');
    const ids = descendantIds(category);
    scoped = scoped.filter((p) => ids.includes(p.categoryId));
  }

  if (String(req.query.featured) === '1') scoped = scoped.filter((p) => p.featured);

  const idsParam = parseList(req.query.ids);
  if (idsParam.length) {
    const wanted = new Set(idsParam);
    scoped = scoped.filter((p) => wanted.has(p.id));
  }

  // Facets describe the current category scope, so filters never offer
  // options that would return nothing.
  const facetSizes = [...new Set(scoped.flatMap((p) => p.sizes))]
    .filter((s) => s !== 'ONE')
    .sort((a, b) => String(a).localeCompare(String(b), 'fa'));
  const facetColors = [...new Map(scoped.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];
  const prices = scoped.map((p) => p.salePrice ?? p.price);

  let filtered = scoped;

  const q = String(req.query.q || '').trim();
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.shortDescription.toLowerCase().includes(needle) ||
        (categoryById(p.categoryId)?.name ?? '').toLowerCase().includes(needle),
    );
  }

  const min = Number(toLatinDigits(req.query.min));
  const max = Number(toLatinDigits(req.query.max));
  if (Number.isFinite(min) && req.query.min !== undefined && String(req.query.min) !== '') {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) >= min);
  }
  if (Number.isFinite(max) && req.query.max !== undefined && String(req.query.max) !== '') {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) <= max);
  }

  const sizes = parseList(req.query.sizes);
  if (sizes.length) filtered = filtered.filter((p) => p.sizes.some((s) => sizes.includes(s)));

  const colors = parseList(req.query.colors);
  if (colors.length) filtered = filtered.filter((p) => p.colors.some((c) => colors.includes(c.name)));

  if (category?.isSale) filtered = filtered.filter((p) => p.salePrice != null);

  const sort = String(req.query.sort || 'newest');
  const sorted = [...filtered];
  if (sort === 'price-asc') sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  else if (sort === 'price-desc') sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  else if (sort === 'popular') sorted.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
  else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 48);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const start = (page - 1) * limit;
  const items = sorted.slice(start, start + limit);

  res.json({
    items: items.map(publicProduct),
    total: sorted.length,
    page,
    limit,
    hasMore: start + items.length < sorted.length,
    facets: {
      sizes: facetSizes,
      colors: facetColors,
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
    },
  });
});

app.get('/api/products/:slug', (req, res) => {
  const { products } = getDb();
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return fail(res, 404, 'این محصول پیدا نشد.', 'product_not_found');

  const related = products
    .filter((p) => p.status === 'active' && p.id !== product.id)
    .map((p) => {
      const sameCategory = p.categoryId === product.categoryId ? 2 : 0;
      const parentId = categoryById(p.categoryId)?.parentId;
      const sameParent = parentId && parentId === categoryById(product.categoryId)?.parentId ? 1 : 0;
      return { p, score: sameCategory + sameParent };
    })
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .slice(0, 4)
    .map(({ p }) => publicProduct(p));

  res.json({
    product: {
      ...publicProduct(product),
      description: product.description,
      material: product.material,
      care: product.care,
      specs: product.specs,
      currency: product.currency,
    },
    breadcrumb: breadcrumbFor(categoryById(product.categoryId)),
    related,
  });
});

app.get('/api/search/suggest', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q.length < 2) return res.json({ items: [] });
  const { products } = getDb();
  const items = products
    .filter((p) => p.status === 'active' && (p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.salePrice ?? p.price,
      image: p.images[0],
      category: categoryById(p.categoryId)?.name ?? '',
    }));
  res.json({ items });
});

// ---------------------------------------------------------------------------
// newsletter & contact
// ---------------------------------------------------------------------------

app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const consent = req.body?.consent !== false;

  if (!isEmail(email)) return fail(res, 422, 'آدرس ایمیل معتبر نیست.', 'invalid_email');
  if (!consent) return fail(res, 422, 'برای عضویت باید با دریافت خبرنامه موافقت کنید.', 'consent_required');

  const db = getDb();
  if (db.newsletter.some((entry) => entry.email === email)) {
    return res.status(200).json({ status: 'already_subscribed', message: 'این ایمیل قبلاً در خبرنامه ثبت شده است.' });
  }

  db.newsletter.push({ id: crypto.randomUUID(), email, consent: true, createdAt: new Date().toISOString() });
  saveDb();
  res.status(201).json({ status: 'subscribed', message: 'عضویت شما ثبت شد.' });
});

app.post('/api/contact', (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const subject = String(req.body?.subject || '').trim();
  const message = String(req.body?.message || '').trim();

  if (name.length < 2) return fail(res, 422, 'نام را کامل وارد کنید.', 'invalid_name');
  if (!isEmail(email)) return fail(res, 422, 'آدرس ایمیل معتبر نیست.', 'invalid_email');
  if (message.length < 10) return fail(res, 422, 'متن پیام باید حداقل ۱۰ نویسه باشد.', 'invalid_message');

  const db = getDb();
  db.messages.push({
    id: crypto.randomUUID(),
    name,
    email,
    subject: subject.slice(0, 120),
    message: message.slice(0, 2000),
    createdAt: new Date().toISOString(),
  });
  saveDb();
  res.status(201).json({ status: 'received', message: 'پیام شما ثبت شد.' });
});

// ---------------------------------------------------------------------------
// orders
// ---------------------------------------------------------------------------

const orderCode = () => `LN-${crypto.randomInt(100000, 999999)}`;

app.post('/api/orders', (req, res) => {
  const body = req.body || {};
  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) return fail(res, 422, 'سبد خرید خالی است.', 'empty_cart');

  const customer = body.customer || {};
  const fullName = String(customer.fullName || '').trim();
  const phone = normalizePhone(customer.phone);
  const email = String(customer.email || '').trim().toLowerCase();

  if (fullName.length < 3) return fail(res, 422, 'نام و نام خانوادگی را کامل وارد کنید.', 'invalid_name');
  if (!isMobile(phone)) return fail(res, 422, 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.', 'invalid_phone');
  if (email && !isEmail(email)) return fail(res, 422, 'آدرس ایمیل معتبر نیست.', 'invalid_email');

  const shippingInput = body.shipping || {};
  const province = String(shippingInput.province || '').trim();
  const city = String(shippingInput.city || '').trim();
  const address = String(shippingInput.address || '').trim();
  if (province.length < 2) return fail(res, 422, 'استان را انتخاب کنید.', 'invalid_province');
  if (city.length < 2) return fail(res, 422, 'شهر را وارد کنید.', 'invalid_city');
  if (address.length < 10) return fail(res, 422, 'نشانی را کامل وارد کنید.', 'invalid_address');

  const shippingMethod =
    SITE_CONFIG.shippingMethods.find((m) => m.id === shippingInput.method) ?? SITE_CONFIG.shippingMethods[0];

  const paymentMethod = String(body.paymentMethod || 'cash_on_delivery');
  if (paymentMethod === 'online_gateway') {
    return fail(res, 503, SITE_CONFIG.payments.note, 'gateway_unavailable');
  }
  if (!SITE_CONFIG.payments.cashOnDelivery) {
    return fail(res, 503, 'در حال حاضر امکان ثبت سفارش وجود ندارد.', 'payment_unavailable');
  }

  const db = getDb();
  const items = [];
  const stockChanges = [];

  for (const raw of rawItems) {
    const product = db.products.find((p) => p.id === raw?.productId || p.slug === raw?.productId);
    if (!product || product.status !== 'active') {
      return fail(res, 422, 'یکی از محصولات سبد دیگر موجود نیست.', 'product_unavailable');
    }

    const quantity = Math.min(Math.max(Number(toLatinDigits(raw.quantity)) || 1, 1), 10);
    const size = String(raw.size ?? '');
    const colorName = String(raw.color ?? '');

    if (!product.sizes.includes(size)) {
      return fail(res, 422, `سایز «${product.name}» را انتخاب کنید.`, 'invalid_size');
    }
    if (!product.colors.some((c) => c.name === colorName)) {
      return fail(res, 422, `رنگ «${product.name}» را انتخاب کنید.`, 'invalid_color');
    }
    if (product.stock < quantity) {
      return fail(res, 409, `موجودی «${product.name}» کافی نیست.`, 'insufficient_stock');
    }

    const unitPrice = product.salePrice ?? product.price;
    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      size,
      color: colorName,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    });
    stockChanges.push({ productId: product.id, quantity });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingCost = subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : shippingMethod.price;
  const total = subtotal + shippingCost;

  for (const change of stockChanges) {
    const product = db.products.find((p) => p.id === change.productId);
    product.stock -= change.quantity;
  }

  const order = {
    id: crypto.randomUUID(),
    code: orderCode(),
    items,
    customer: { fullName, phone, email },
    shipping: {
      method: shippingMethod.id,
      methodTitle: shippingMethod.title,
      province,
      city,
      address,
      postalCode: String(shippingInput.postalCode || '').trim(),
      note: String(shippingInput.note || '').trim().slice(0, 500),
    },
    payment: { method: paymentMethod, status: 'unpaid', note: SITE_CONFIG.payments.note },
    subtotal,
    shippingCost,
    total,
    currency: SITE_CONFIG.currency.code,
    orderStatus: 'registered',
    createdAt: new Date().toISOString(),
  };

  db.orders.push(order);
  saveDb();

  // Never log customer contact details.
  console.log(`[orders] created ${order.code} (${items.length} items)`);

  res.status(201).json({
    order: {
      code: order.code,
      items,
      subtotal,
      shippingCost,
      total,
      shipping: order.shipping,
      payment: order.payment,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    },
  });
});

app.get('/api/orders/:code', (req, res) => {
  const code = String(req.params.code || '').trim().toUpperCase();
  const phone = normalizePhone(req.query.phone);
  if (!isMobile(phone)) return fail(res, 422, 'برای پیگیری، شماره موبایل سفارش را وارد کنید.', 'invalid_phone');

  const order = getDb().orders.find((o) => o.code.toUpperCase() === code && o.customer.phone === phone);
  if (!order) return fail(res, 404, 'سفارشی با این کد و شماره پیدا نشد.', 'order_not_found');

  res.json({
    order: {
      code: order.code,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      shipping: order.shipping,
      payment: order.payment,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    },
  });
});

// ---------------------------------------------------------------------------

app.use('/api', (_req, res) => fail(res, 404, 'این آدرس در سرور وجود ندارد.', 'not_found'));

app.use((err, _req, res, _next) => {
  console.error('[api] unexpected error:', err.message);
  res.status(500).json({ error: { code: 'server_error', message: 'خطای غیرمنتظره در سرور رخ داد.' } });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] LUNORA API listening on :${PORT}`);
});
