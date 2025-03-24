import axios, { InternalAxiosRequestConfig } from 'axios';
import { UserRole } from '../types/auth';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  console.log('[Auth Client] Request interceptor:', {
    url: config.url,
    hasToken: !!token,
    headers: config.headers,
  });

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Auth Client] Added token to request:', {
      url: config.url,
      hasAuthHeader: !!config.headers.Authorization,
    });
  }
  return config;
});

// Handle 401 responses
client.interceptors.response.use(
  response => {
    console.log('[Auth Client] Response success:', {
      url: response.config.url,
      status: response.status,
      hasAuthHeader: !!response.config.headers.Authorization,
    });
    return response;
  },
  error => {
    console.log('[Auth Client] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      hasAuthHeader: !!error.config?.headers.Authorization,
    });

    if (error.response?.status === 401) {
      console.log('[Auth Client] Unauthorized response, clearing token');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  token: string;
}

export interface UserData {
  email: string;
  roles: UserRole[];
  createdAt: string;
}

export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('[Auth Client] Attempting login');
    const response = await client.post<LoginResponse>('/auth/login', { email, password });
    console.log('[Auth Client] Login successful, storing token');
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('[Auth Client] Attempting registration');
    const response = await client.post<LoginResponse>('/auth/register', { email, password });
    console.log('[Auth Client] Registration successful, storing token');
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  validateToken: async (): Promise<UserData> => {
    console.log('[Auth Client] Validating token');
    const token = localStorage.getItem('token');
    console.log('[Auth Client] Token exists:', !!token);

    const response = await client.get<UserData>('/auth/validate');
    console.log('[Auth Client] Token validation response:', {
      email: response.data.email,
      roles: response.data.roles,
    });
    return response.data;
  },

  logout: () => {
    console.log('[Auth Client] Logging out, clearing token');
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};
