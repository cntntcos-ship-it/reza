import { Router } from 'express';
import { query } from '../db.js';
import { badRequest, cleanText, HttpError, toInt, wrap } from '../http.js';
import { maxQuantityPerItem, orderStatusLabels, paymentStatusLabels, shippingMethods } from '../config.js';
import { mapProduct } from './products.js';

export const catalogRouter = Router();

catalogRouter.get(
  '/categories',
  wrap(async (_req, res) => {
    const { rows } = await query(
      `select c.*,
              (select count(*)::int from products p
                where p.category_slug = c.slug or (c.kind = 'gender' and p.gender = c.slug)) as product_count
       from categories c order by sort_order asc, id asc`,
    );
    res.json({
      categories: rows.map((row) => ({
        slug: row.slug,
        name: row.name,
        kind: row.kind,
        description: row.description,
        imageUrl: row.image_url,
        bannerUrl: row.banner_url,
        productCount: row.product_count,
      })),
    });
  }),
);

catalogRouter.get(
  '/categories/:slug',
  wrap(async (req, res) => {
    const { rows } = await query('select * from categories where slug = $1', [req.params.slug]);
    const category = rows[0];
    if (!category) throw new HttpError(404, 'دسته‌بندی مورد نظر پیدا نشد.');
    res.json({
      category: {
        slug: category.slug,
        name: category.name,
        kind: category.kind,
        description: category.description,
        imageUrl: category.image_url,
        bannerUrl: category.banner_url,
      },
    });
  }),
);

export const settingsRouter = Router();

settingsRouter.get('/', (_req, res) => {
  res.json({
    shippingMethods,
    maxQuantityPerItem,
    orderStatusLabels,
    paymentStatusLabels,
    // These integrations are not connected in this build; the UI says so instead of faking them.
    integrations: { onlinePayment: false, newsletterEmail: false },
  });
});

function orderNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}`.slice(2) + `${now.getMonth() + 1}`.padStart(2, '0') + `${now.getDate()}`.padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LN-${stamp}-${random}`;
}

export const ordersRouter = Router();

ordersRouter.post(
  '/',
  wrap(async (req, res) => {
    const body = req.body ?? {};
    const customer = body.customer ?? {};
    const address = body.address ?? {};
    const items = Array.isArray(body.items) ? body.items : [];

    const name = cleanText(customer.name, 80);
    const email = cleanText(customer.email, 160).toLowerCase();
    const phone = cleanText(customer.phone, 20);
    const province = cleanText(address.province, 60);
    const city = cleanText(address.city, 60);
    const line = cleanText(address.addressLine, 300);
    const postalCode = cleanText(address.postalCode, 20);

    if (name.length < 3) throw badRequest('نام و نام خانوادگی گیرنده را کامل وارد کنید.');
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) throw badRequest('ایمیل وارد شده معتبر نیست.');
    if (!/^0?9\d{9}$/.test(phone.replace(/\s/g, ''))) throw badRequest('شماره موبایل وارد شده معتبر نیست.');
    if (!province || !city) throw badRequest('استان و شهر را انتخاب کنید.');
    if (line.length < 10) throw badRequest('نشانی را کامل‌تر وارد کنید.');
    if (postalCode && !/^\d{10}$/.test(postalCode)) throw badRequest('کد پستی باید ۱۰ رقم باشد.');
    if (!items.length) throw badRequest('سبد خرید شما خالی است.');

    const method = shippingMethods.find((option) => option.id === body.shippingMethod) ?? shippingMethods[0];

    const ids = [...new Set(items.map((item) => toInt(item.productId, 0)).filter(Boolean))];
    if (!ids.length) throw badRequest('اقلام سبد خرید معتبر نیستند.');

    const { rows } = await query('select * from products where id = any($1::int[])', [ids]);
    const byId = new Map(rows.map((row) => [row.id, mapProduct(row)]));

    // Prices, availability and totals are recomputed here — never trusted from the client.
    const orderItems = [];
    let subtotal = 0;
    for (const raw of items) {
      const product = byId.get(toInt(raw.productId, 0));
      const quantity = Math.min(Math.max(toInt(raw.quantity, 1), 1), maxQuantityPerItem);
      if (!product) throw badRequest('یکی از محصولات سبد خرید دیگر موجود نیست.');
      if (product.stock <= 0) throw badRequest(`«${product.name}» در حال حاضر موجود نیست.`);
      if (quantity > product.stock) {
        throw badRequest(`از «${product.name}» تنها ${product.stock} عدد موجود است.`);
      }
      const size = cleanText(raw.size, 12);
      const color = cleanText(raw.color, 30);
      if (product.sizes.length && !product.sizes.includes(size)) {
        throw badRequest(`سایز انتخاب‌شده برای «${product.name}» معتبر نیست.`);
      }
      if (product.colors.length && !product.colors.some((c) => c.name === color)) {
        throw badRequest(`رنگ انتخاب‌شده برای «${product.name}» معتبر نیست.`);
      }
      const unitPrice = product.price;
      subtotal += unitPrice * quantity;
      orderItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? null,
        size,
        color,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      });
    }

    const total = subtotal + method.cost;

    const { rows: inserted } = await query(
      `insert into orders
         (order_number, user_id, customer_name, customer_email, customer_phone, address, items,
          subtotal, shipping_cost, total, shipping_method, payment_status, order_status, note)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'unpaid','awaiting_payment',$12)
       returning *`,
      [
        orderNumber(),
        req.user?.id ?? null,
        name,
        email,
        phone,
        JSON.stringify({ province, city, addressLine: line, postalCode }),
        JSON.stringify(orderItems),
        subtotal,
        method.cost,
        total,
        method.id,
        cleanText(body.note, 500) || null,
      ],
    );

    res.status(201).json({ order: serializeOrder(inserted[0]) });
  }),
);

const serializeOrder = (row) => ({
  orderNumber: row.order_number,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  address: row.address,
  items: row.items,
  subtotal: row.subtotal,
  shippingCost: row.shipping_cost,
  total: row.total,
  shippingMethod: row.shipping_method,
  paymentStatus: row.payment_status,
  orderStatus: row.order_status,
  note: row.note,
  createdAt: row.created_at,
});

// A guest can look up an order with its number plus the email used at checkout;
// a signed-in owner can read it too. Nothing else is exposed.
ordersRouter.get(
  '/:orderNumber',
  wrap(async (req, res) => {
    const { rows } = await query('select * from orders where order_number = $1', [req.params.orderNumber]);
    const order = rows[0];
    if (!order) throw new HttpError(404, 'سفارشی با این شماره پیدا نشد.');
    const email = cleanText(req.query.email, 160).toLowerCase();
    const isOwner = req.user && order.user_id === req.user.id;
    if (!isOwner && (!email || email !== order.customer_email)) {
      throw new HttpError(403, 'برای مشاهده این سفارش، ایمیل ثبت‌شده در سفارش را وارد کنید.');
    }
    res.json({ order: serializeOrder(order) });
  }),
);

export const accountRouter = Router();

accountRouter.get(
  '/orders',
  wrap(async (req, res) => {
    const { rows } = await query(
      'select * from orders where user_id = $1 order by created_at desc limit 50',
      [req.user.id],
    );
    res.json({ orders: rows.map(serializeOrder) });
  }),
);

export const newsletterRouter = Router();

newsletterRouter.post(
  '/',
  wrap(async (req, res) => {
    const email = cleanText(req.body?.email, 160).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) throw badRequest('ایمیل وارد شده معتبر نیست.');
    if (req.body?.consent !== true) throw badRequest('برای عضویت باید با دریافت ایمیل‌ها موافقت کنید.');

    const { rowCount } = await query(
      `insert into newsletter_subscribers (email, consent) values ($1, true)
       on conflict (email) do nothing`,
      [email],
    );
    res.status(201).json({
      ok: true,
      alreadySubscribed: rowCount === 0,
      // No email provider is wired up in this build — the client states that plainly.
      emailDeliveryConfigured: false,
    });
  }),
);
