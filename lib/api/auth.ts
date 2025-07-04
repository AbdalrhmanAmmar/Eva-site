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
  sendOTP: async (data: { phone: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post("/user/send-otp", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ في إرسال رمز التحقق");
    }
  },

  // التحقق من رمز OTP فقط (بدون استكمال التسجيل)
  verifyOTPOnly: async (data: { otp: string; otpId: string }): Promise<{ 
    success: boolean; 
    message: string;
    data?: { verified: boolean; otpId: string }
  }> => {
    try {
      const response = await api.post("/user/verify-otp-only", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "رمز التحقق غير صحيح");
    }
  },

  // التحقق من الرمز واستكمال التسجيل
verifyOTPAndCompleteRegistration: async (data: {
    otp: string;
    otpId: string;
    name: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await api.post("/user/verify-otp-complete", {
        otpId: data.otpId,
        otp: data.otp,
        name: data.name,
        password: data.password
      });
      
      // هنا يجب أن يكون التوكن موجودًا في response.data.token
      const token = response.data.token;
      
      // حفظ التوكن في localStorage أو Cookies
      localStorage.setItem('authToken', token);
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ في استكمال التسجيل");
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
export const pointsAPI = {
  // جلب كل عروض النقاط
  getAllPointsPackages: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await api.get("/points");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ في جلب عروض النقاط");
    }
  },

  // إنشاء عرض نقاط جديد (مطلوب صلاحيات)
  createPointsPackage: async (data: { pointsAmount: number; price: number }): Promise<{ success: boolean; message: string; data: any }> => {
    try {
      const response = await api.post("/points", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ في إنشاء عرض النقاط");
    }
  },

  // تعديل عرض نقاط موجود (مطلوب صلاحيات)
  updatePointsPackage: async (id: string, data: { pointsAmount?: number; price?: number }): Promise<{ success: boolean; message: string; data: any }> => {
    try {
      const response = await api.put(`/points/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ في تعديل عرض النقاط");
    }
  },

  // حذف عرض نقاط (مطلوب صلاحيات)
  deletePointsPackage: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/points/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ في حذف عرض النقاط");
    }
  },
};

export const productAPI = {
  // جلب جميع المنتجات مع الفلترة والبحث
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;
  }): Promise<{ success: boolean; products: any[]; total: number }> => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء جلب المنتجات");
    }
  },

  // جلب منتج واحد عبر ID
getProductById: async (id: string): Promise<{ success: boolean; product: any | null }> => {
  try {
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId(id)) {
      return { success: false, product: null };
    }

    const response = await api.get(`/products/${id}`);

    if (!response.data?.success || !response.data?.product) {
      return { success: false, product: null };
    }

    const product = response.data.product;
    return {
      success: true,
      product: {
        ...product,
        id: product._id?.toString?.() ?? product.id,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, product: null };
  }
},


  // جلب منتجات حسب التصنيف
  getProductsByCategory: async (category: string): Promise<{ success: boolean; products: any[] }> => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء جلب منتجات التصنيف");
    }
  },

  // إنشاء منتج جديد (مع صور)
  createProduct: async (formData: FormData): Promise<{ success: boolean; product: any }> => {
    try {
      const response = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء إنشاء المنتج");
    }
  },

  // تحديث منتج
  updateProduct: async (id: string, formData: FormData): Promise<{ success: boolean; product: any }> => {
    try {
      const response = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء تحديث المنتج");
    }
  },

  // حذف منتج
  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء حذف المنتج");
    }
  },
};
export const reviewAPI = {
  // إنشاء مراجعة
  addReview: async (data: { productId: string; rating: number; comment?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post("/reviews", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء إضافة المراجعة");
    }
  },

  // جلب جميع مراجعات منتج
  getReviewsByProduct: async (productId: string): Promise<{ success: boolean; count: number; reviews: any[] }> => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء جلب المراجعات");
    }
  },

  // حذف مراجعة
  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء حذف المراجعة");
    }
  },

  // تعديل مراجعة
  updateReview: async (id: string, data: { rating?: number; comment?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.put(`/reviews/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء تعديل المراجعة");
    }
  },

  // جلب متوسط تقييم منتج
  getAverageRating: async (productId: string): Promise<{ success: boolean; averageRating: number; numberOfReviews: number }> => {
    try {
      const response = await api.get(`/reviews/average/${productId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "حدث خطأ أثناء جلب متوسط التقييم");
    }
  },
};



export default api;