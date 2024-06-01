import axios from 'axios';
import { create } from 'zustand';
import { getCookie } from '@/utils';
import { ONE_DAY } from '@/constants';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  checkAuthStatus: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: true });

    // Set accessToken in a cookie with a max age of one day
    document.cookie = `accessToken=${token}; max-age=${ONE_DAY}; path=/`;
  },
  clearAccessToken: () => {
    set({ accessToken: null, isAuthenticated: false });

    // Clear the cookie
    document.cookie = 'accessToken=; max-age=0; path=/';
  },
  checkAuthStatus: async () => {
    const token = get().accessToken || getCookie('accessToken');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        set({ accessToken: token, isAuthenticated: true });
      }
    } catch (error: any) {
      set({ isAuthenticated: false });

      // Clear the cookie
      document.cookie = 'accessToken=; max-age=0; path=/';
    }
  },
}));

export default useAuthStore;
