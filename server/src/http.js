const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message) => new HttpError(400, message);

export const isEmail = (value) => typeof value === 'string' && EMAIL_RE.test(value.trim());

export const cleanText = (value, max = 200) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export const toInt = (value, fallback = 0) => {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) ? number : fallback;
};

// Wraps async route handlers so rejected promises reach the error middleware.
export const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
