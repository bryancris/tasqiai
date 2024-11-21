import axios, { AxiosInstance } from 'axios';

export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    return res.json();
  });

export const LISTS_KEY = '/api/lists';
export const LABELS_KEY = '/api/labels';

export const api: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to handle authentication and CSRF
api.interceptors.request.use(async (config) => {
  // Get CSRF token from cookie
  const csrfToken = document.cookie.split('; ').find((row) => row.startsWith('next-auth.csrf-token='))?.split('=')[1];

  if (csrfToken) {
    config.headers['csrf-token'] = csrfToken;
  }

  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 405) {
      console.error('Method not allowed. Check API route configuration:', {
        method: error.config?.method,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);