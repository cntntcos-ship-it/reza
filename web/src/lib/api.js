const BASE = '/api';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.', 0, 'network_error');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      data?.error?.message || 'درخواست انجام نشد. لطفاً دوباره تلاش کنید.',
      response.status,
      data?.error?.code,
    );
  }
  return data;
}

const query = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, Array.isArray(value) ? value.join(',') : String(value));
  });
  const serialized = search.toString();
  return serialized ? `?${serialized}` : '';
};

export const api = {
  bootstrap: () => request('/bootstrap'),
  categories: () => request('/categories'),
  category: (slug) => request(`/categories/${encodeURIComponent(slug)}`),
  products: (params) => request(`/products${query(params)}`),
  product: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  suggest: (q) => request(`/search/suggest${query({ q })}`),
  subscribe: (body) => request('/newsletter', { method: 'POST', body }),
  contact: (body) => request('/contact', { method: 'POST', body }),
  createOrder: (body) => request('/orders', { method: 'POST', body }),
  lookupOrder: (code, phone) => request(`/orders/${encodeURIComponent(code)}${query({ phone })}`),
};
