import express from 'express';
import cookieParser from 'cookie-parser';
import { query } from './db.js';
import { HttpError } from './http.js';
import { authRouter, optionalUser, requireUser } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import {
  accountRouter,
  catalogRouter,
  newsletterRouter,
  ordersRouter,
  settingsRouter,
} from './routes/store.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(optionalUser);

// Small in-memory throttle for the write endpoints that accept user input.
const hits = new Map();
function rateLimit(max, windowMs = 60_000) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const entry = hits.get(key) ?? { count: 0, reset: now + windowMs };
    if (now > entry.reset) {
      entry.count = 0;
      entry.reset = now + windowMs;
    }
    entry.count += 1;
    hits.set(key, entry);
    if (entry.count > max) {
      return res.status(429).json({ error: 'درخواست‌های زیاد. لطفاً کمی بعد دوباره تلاش کنید.' });
    }
    next();
  };
}

app.get('/api/health', async (_req, res) => {
  try {
    await query('select 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.use('/api/auth', rateLimit(20), authRouter);
app.use('/api/products', productsRouter);
app.use('/api', catalogRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/orders', rateLimit(20), ordersRouter);
app.use('/api/account', requireUser, accountRouter);
app.use('/api/newsletter', rateLimit(10), newsletterRouter);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'مسیر مورد نظر پیدا نشد.' });
});

app.use((error, _req, res, _next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'داده ارسال‌شده معتبر نیست.' });
  }
  console.error('unhandled error:', error);
  res.status(500).json({ error: 'خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`LUNORA API listening on ${port}`);
});
