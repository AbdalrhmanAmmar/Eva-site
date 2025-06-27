import axios from "axios";
import {
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  VerifyOTPFormData,
  ResetPasswordFormData,
  SendOTPFormData,
  CompleteRegistrationFormData,
} from "@/lib/validations/auth";

// إعداد Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
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
      window.location.href = "/auth/login";
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

export interface VerifyOTPOnlyResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
    otpId: string;
  };
}

// دوال API
export const authAPI = {
  // تسجيل الدخول
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/user/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في تسجيل الدخول"
      );
    }
  },

  // إرسال رمز التحقق للتسجيل
  sendOTP: async (data: SendOTPFormData): Promise<OTPResponse> => {
    try {
      const response = await api.post("/user/send-otp", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في إرسال رمز التحقق"
      );
    }
  },

  // التحقق من رمز OTP فقط (بدون استكمال التسجيل)
  verifyOTPOnly: async (data: VerifyOTPFormData & { otpId: string }): Promise<VerifyOTPOnlyResponse> => {
    try {
      const response = await api.post("/user/verify-otp-only", {
        otp: data.otp,
        otpId: data.otpId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "رمز التحقق غير صحيح"
      );
    }
  },

  // التحقق من الرمز واستكمال التسجيل
  verifyOTPAndCompleteRegistration: async (data: CompleteRegistrationFormData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/user/verify-otp-complete", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في استكمال التسجيل"
      );
    }
  },

  // طلب إعادة تعيين كلمة المرور
  forgotPassword: async (
    data: ForgotPasswordFormData
  ): Promise<OTPResponse> => {
    try {
      const response = await api.post("/user/forgot-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في إرسال رمز التحقق"
      );
    }
  },

  // التحقق من رمز OTP (للاستخدام العام)
  verifyOTP: async (
    data: VerifyOTPFormData & { otpId: string }
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/user/verify-otp", data);
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
      const response = await api.post("/user/reset-password", {
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
      const response = await api.post("/user/resend-otp", { otpId });
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
      const response = await api.post("/user/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "حدث خطأ في تسجيل الخروج"
      );
    }
  },
};

export default api;