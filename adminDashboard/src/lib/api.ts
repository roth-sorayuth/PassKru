import axios, { AxiosRequestConfig } from 'axios';

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

export const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message = data?.message ?? data?.detail ?? error.message ?? `Request failed ${error.response?.status}`;
    const customError = new Error(message);
    (customError as any).statusCode = error.response?.status;
    (customError as any).data = data;
    return Promise.reject(customError);
  }
);

export const api = {
  get: async <T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.get<T>(endpoint, config);
    return res.data;
  },
  post: async <T = unknown>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.post<T>(endpoint, body, config);
    return res.data;
  },
  put: async <T = unknown>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.put<T>(endpoint, body, config);
    return res.data;
  },
  patch: async <T = unknown>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.patch<T>(endpoint, body, config);
    return res.data;
  },
  delete: async <T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.delete<T>(endpoint, config);
    return res.data;
  },
};

