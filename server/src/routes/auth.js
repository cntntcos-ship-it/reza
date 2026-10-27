import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { badRequest, cleanText, HttpError, isEmail, wrap } from '../http.js';

export const COOKIE_NAME = 'lunora_session';
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const secret = () => process.env.JWT_SECRET || 'dev-only-placeholder-change-me';

export const publicUser = (row) => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  phone: row.phone,
  createdAt: row.created_at,
});

function setSessionCookie(res, user) {
  const token = jwt.sign({ sub: String(user.id), email: user.email }, secret(), {
    expiresIn: '30d',
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: THIRTY_DAYS,
    path: '/',
  });
}

export async function loadUser(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret());
    const { rows } = await query('select * from users where id = $1', [payload.sub]);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export const optionalUser = wrap(async (req, _res, next) => {
  req.user = await loadUser(req);
  next();
});

export const requireUser = wrap(async (req, res, next) => {
  req.user = req.user ?? (await loadUser(req));
  if (!req.user) throw new HttpError(401, 'برای این کار باید وارد حساب خود شوید.');
  next();
});

export const authRouter = Router();

authRouter.post(
  '/register',
  wrap(async (req, res) => {
    const fullName = cleanText(req.body?.fullName, 80);
    const email = cleanText(req.body?.email, 160).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (fullName.length < 2) throw badRequest('نام و نام خانوادگی را کامل وارد کنید.');
    if (!isEmail(email)) throw badRequest('ایمیل وارد شده معتبر نیست.');
    if (password.length < 8) throw badRequest('گذرواژه باید دست‌کم ۸ کاراکتر باشد.');

    const existing = await query('select id from users where lower(email) = $1', [email]);
    if (existing.rowCount > 0) throw badRequest('این ایمیل قبلاً ثبت شده است.');

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `insert into users (email, password_hash, full_name) values ($1, $2, $3) returning *`,
      [email, hash, fullName],
    );
    setSessionCookie(res, rows[0]);
    res.status(201).json({ user: publicUser(rows[0]) });
  }),
);

authRouter.post(
  '/login',
  wrap(async (req, res) => {
    const email = cleanText(req.body?.email, 160).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!isEmail(email) || !password) throw badRequest('ایمیل و گذرواژه را وارد کنید.');

    const { rows } = await query('select * from users where lower(email) = $1', [email]);
    const user = rows[0];
    const valid = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!valid) throw new HttpError(401, 'ایمیل یا گذرواژه درست نیست.');

    setSessionCookie(res, user);
    res.json({ user: publicUser(user) });
  }),
);

authRouter.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

authRouter.get(
  '/me',
  wrap(async (req, res) => {
    const user = req.user ?? (await loadUser(req));
    res.json({ user: user ? publicUser(user) : null });
  }),
);
