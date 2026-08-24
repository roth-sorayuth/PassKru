const API_URL = 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    (error as any).statusCode = response.status;
    throw error;
  }

  return data;
};
