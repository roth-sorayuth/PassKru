// const API_URL = 'http://localhost:5000/api';

// interface RequestOptions extends RequestInit {
//   body?: any;
// }

// export const api = async (endpoint: string, options: RequestOptions = {}) => {
//   const token = localStorage.getItem('token');
  
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...(options.headers || {}),
//   };

//   const config: RequestInit = {
//     ...options,
//     headers,
//   };

//   if (options.body) {
//     config.body = JSON.stringify(options.body);
//   }

//   const response = await fetch(`${API_URL}${endpoint}`, config);
//   const data = await response.json();

//   if (!response.ok) {
//     const error = new Error(data.message || 'Something went wrong');
//     (error as any).statusCode = response.status;
//     throw error;
//   }

//   return data;
// };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

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

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const token = await getClerkToken();

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

  // Handle empty responses
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.message || 'Something went wrong');
    (error as any).statusCode = response.status;
    throw error;
  }

  return data;
};