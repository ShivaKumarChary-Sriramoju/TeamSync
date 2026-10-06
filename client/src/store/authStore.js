import { create } from 'zustand';
import api, { setAuthToken } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, ...userData } = response.data;
    setAuthToken(accessToken);
    set({ user: userData, isAuthenticated: true, isLoading: false });
    return userData;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { accessToken, ...userData } = response.data;
    setAuthToken(accessToken);
    set({ user: userData, isAuthenticated: true, isLoading: false });
    return userData;
  },

  logout: async () => {
    await api.post('/auth/logout');
    setAuthToken(null);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { accessToken } = response.data;
      setAuthToken(accessToken);
      // Ideally we should also fetch user profile if it's not in the token
      // For now, we will decode it from token or just set authenticated
      // A better approach is to return user data from refresh endpoint.
      // Let's assume refresh returns only access token for now and we decode it.
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      set({ user: { _id: payload.id }, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setAuthToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

export default useAuthStore;
