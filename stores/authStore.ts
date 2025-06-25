import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  phone: string;
  role: "user" | "admin" | "superadmin";
  isVerified: boolean;
}

interface AuthState {
  // الحالة
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // حالة OTP
  otpId: string | null;
  isOTPSent: boolean;
  otpExpiresAt: string | null;

  // حالة إعادة تعيين كلمة المرور
  resetToken: string | null;
  isResettingPassword: boolean;

  // الإجراءات
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // إجراءات OTP
  setOTPData: (otpId: string, expiresAt: string) => void;
  setOTPSent: (sent: boolean) => void;
  clearOTPData: () => void;

  // إجراءات إعادة تعيين كلمة المرور
  setResetToken: (token: string) => void;
  setResettingPassword: (status: boolean) => void;

  // تسجيل الخروج
  logout: () => void;

  // مسح جميع البيانات
  clearAll: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // الحالة الأولية
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // حالة OTP
      otpId: null,
      isOTPSent: false,
      otpExpiresAt: null,

      // حالة إعادة تعيين كلمة المرور
      resetToken: null,
      isResettingPassword: false,

      // الإجراءات الأساسية
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      },
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // إجراءات OTP
      setOTPData: (otpId, expiresAt) =>
        set({
          otpId,
          otpExpiresAt: expiresAt,
          isOTPSent: true,
        }),
      setOTPSent: (sent) => set({ isOTPSent: sent }),
      clearOTPData: () =>
        set({
          otpId: null,
          isOTPSent: false,
          otpExpiresAt: null,
        }),

      // إجراءات إعادة تعيين كلمة المرور
      setResetToken: (token) => set({ resetToken: token }),
      setResettingPassword: (status) => set({ isResettingPassword: status }),

      // تسجيل الخروج
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // مسح جميع البيانات
      clearAll: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          otpId: null,
          isOTPSent: false,
          otpExpiresAt: null,
          resetToken: null,
          isResettingPassword: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
