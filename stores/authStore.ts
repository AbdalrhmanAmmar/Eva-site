import { create } from "zustand";

interface AuthState {
  user: {
    name: string;
    phone: string;
    role: "user" | "admin" | "superadmin";
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isOTPVerified: boolean;
  isResettingPassword: boolean;

  // Actions
  setUser: (user: AuthState["user"]) => void;
  setToken: (token: string) => void;
  setIsAuthenticated: (status: boolean) => void;
  setOTPVerified: (status: boolean) => void;
  setResettingPassword: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isOTPVerified: false,
  isResettingPassword: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  setOTPVerified: (status) => set({ isOTPVerified: status }),
  setResettingPassword: (status) => set({ isResettingPassword: status }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isOTPVerified: false,
      isResettingPassword: false,
    }),
}));
