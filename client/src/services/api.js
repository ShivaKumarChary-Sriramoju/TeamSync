import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true, // important for cookies
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/register') {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {}, { withCredentials: true });
        // Assume store is updated somewhere else or we just retry the request
        // since the new cookie is set. But we also need the access token if we use it in headers.
        // We will rely on Zustand store to hold access token, but for this instance we can just retry.
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, maybe redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// We will inject the token dynamically from the store where used, or we can use an interceptor for the request
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
