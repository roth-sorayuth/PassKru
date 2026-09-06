import axios, { AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function getClerkToken(): Promise<string | null> {
  try {
    // @ts-ignore
    if (window.Clerk?.session) {
      // @ts-ignore
      const token = await window.Clerk.session.getToken();
      return token || null;
    }
  } catch (error) {
    console.error('Error getting Clerk token:', error);
  }
  return null;
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Clerk bearer token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getClerkToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const customError = new Error(message);
    (customError as any).statusCode = error.response?.status;
    (customError as any).data = error.response?.data;
    return Promise.reject(customError);
  }
);

export interface RequestOptions extends AxiosRequestConfig {
  body?: any;
}

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const { body, method = 'GET', headers, ...rest } = options;
  const response = await axiosInstance({
    url: endpoint,
    method,
    data: body !== undefined ? body : rest.data,
    headers,
    ...rest,
  });

  return response.data;
};