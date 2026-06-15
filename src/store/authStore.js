import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  login: (username, password) => {
    if (username === 'admin' && password === 'root') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
}));
