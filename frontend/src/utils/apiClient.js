import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers && typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type');
      config.headers.delete('content-type');
    } else if (config.headers) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
  }

  const match = document.cookie.match(new RegExp('(^| )gx_csrf=([^;]+)'));
  
  if (config.headers && typeof config.headers.set === 'function') {
    if (match) {
      config.headers.set('x-csrf-token', match[2]);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } else if (config.headers) {
    if (match) {
      config.headers['x-csrf-token'] = match[2];
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error && error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data === 'object' && data !== null) {
        const extracted = data.message || data.error || data.code;
        if (typeof extracted === 'string' && extracted.trim()) {
          error.message = extracted;
        }
      } else if (typeof data === 'string' && data.trim()) {
        error.message = data;
      }
    }
    return Promise.reject(error);
  }
);
