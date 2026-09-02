const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let tokenGetter: (() => Promise<string | null>) | null = null;
let apiToken: string | null = null;

export const setApiToken = (token: string | null) => {
  apiToken = token;
};

export const setTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

async function getAuthToken(): Promise<string | null> {
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) return token;
    } catch (e) {
      console.warn('Error from tokenGetter:', e);
    }
  }

  // Fallback to window.Clerk session
  try {
    // @ts-ignore
    if (window.Clerk?.session) {
      // @ts-ignore
      const token = await window.Clerk.session.getToken();
      if (token) return token;
    }
  } catch (error) {
    console.warn('Error getting Clerk token:', error);
  }

  return apiToken;
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const { json, ...init } = options;
  const token = await getAuthToken();

  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}) 
  };

  const res = await fetch(`${BASE}${endpoint}`, {
    ...init,
    headers,
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.message ?? data?.detail ?? `Request failed ${res.status}`);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T = unknown>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', json: body }),
  put: <T = unknown>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', json: body }),
  delete: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
