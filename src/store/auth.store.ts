import axios from 'axios';
import { create } from 'zustand';
import { getCookie } from '@/utils';
import { ONE_DAY } from '@/constants';

interface UserInfo {
  id: number;
  username: string;
  picture: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: UserInfo | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  fetchAccessToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  userInfo: null,
  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: true, isLoading: false });

    // Set accessToken in a cookie with a max age of one day
    document.cookie = `accessToken=${token}; max-age=${ONE_DAY}; path=/`;
  },
  clearAccessToken: () => {
    set({ accessToken: null, isAuthenticated: false });

    // Clear the cookie
    document.cookie = 'accessToken=; max-age=0; path=/';
  },
  fetchAccessToken: async () => {
    const token = get().accessToken || getCookie('accessToken');
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
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
        const userData: UserInfo = response.data;
        // Set auth token in cookie with a max age of one day
        document.cookie = `accessToken=${token}; max-age=${ONE_DAY}; path=/`;
        set({ accessToken: token, isAuthenticated: true, userInfo: userData });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
