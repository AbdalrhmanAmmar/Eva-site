import axios from "axios";
import {
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  VerifyOTPFormData,
  ResetPasswordFormData,
} from "@/lib/validations/auth";

// إعداد Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن للطلبات
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/user/login";
    }
    return Promise.reject(error);
  }
);

// واجهات البيانات
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      phone: string;
      role: "user" | "admin" | "superadmin";
      isVerified: boolean;
    };
    token?: string;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    otpId: string;
    expiresAt: string;
  };
}

// دوال API
export const authAPI = {
  // تسجيل الدخول
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في تسجيل الدخول"
      );
    }
  },

  // إنشاء حساب جديد
  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/signup", {
        name: data.name,
        phone: data.phone,
        password: data.password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في إنشاء الحساب"
      );
    }
  },

  // طلب إعادة تعيين كلمة المرور
  forgotPassword: async (
    data: ForgotPasswordFormData
  ): Promise<OTPResponse> => {
    try {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في إرسال رمز التحقق"
      );
    }
  },

  // التحقق من رمز OTP
  verifyOTP: async (
    data: VerifyOTPFormData & { otpId: string }
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/verify-otp", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "رمز التحقق غير صحيح");
    }
  },

  // إعادة تعيين كلمة المرور
  resetPassword: async (
    data: ResetPasswordFormData & { token: string }
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/reset-password", {
        password: data.password,
        token: data.token,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في إعادة تعيين كلمة المرور"
      );
    }
  },

  // إعادة إرسال رمز التحقق
  resendOTP: async (otpId: string): Promise<OTPResponse> => {
    try {
      const response = await api.post("/auth/resend-otp", { otpId });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في إعادة إرسال الرمز"
      );
    }
  },

  // تسجيل الخروج
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في تسجيل الخروج"
      );
    }
  },
};

export default api;
