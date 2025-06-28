import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  business_id: number;
  name: {
    en: string;
  };
  created_at: string;
  updated_at: string;
  hire_date: string | null;
  salary: string;
  email: string;
  email_verified_at: string | null;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user: User, token: string) => {
        // Store token in cookie for axios interceptor
        Cookies.set("aar_luxe_token", token, { expires: 7 }); // 7 days

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Remove token from cookie
        Cookies.remove("aar_luxe_token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        const token = Cookies.get("aar_luxe_token");
        const state = get();

        if (token && state.user) {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          Cookies.remove("aar_luxe_token");
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
