const withQuery = (path, params) => {
  if (!params) return path;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
};

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.');
  }
  return data;
}

export const api = {
  get: (path, params) => request(withQuery(path, params)),
  post: (path, body) => request(path, { method: 'POST', body }),
};
