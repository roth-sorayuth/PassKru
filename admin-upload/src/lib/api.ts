const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let apiToken: string | null = null;

export const setApiToken = (token: string | null) => {
  apiToken = token;
};

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const { json, ...init } = options;
  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    ...(init.headers ?? {}) 
  };

  const res = await fetch(`${BASE}${endpoint}`, {
    ...init,
    headers,
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed ${res.status}`);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T = unknown>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', json: body }),
  delete: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
