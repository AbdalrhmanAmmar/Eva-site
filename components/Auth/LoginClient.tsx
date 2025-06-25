"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { set } from "zod";

export default function LoginClient() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({});

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^966\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = (): boolean => {
    const newErrors: { phone?: string; password?: string } = {};

    if (!phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يبدأ بـ 966 ويتكون من 12 رقم";
    }

    if (!password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    const response = await fetch("http://localhost:4000/api/user/login", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "حدث خطأ في تسجيل الدخول");
    }

    // حفظ البيانات في Zustand والذي بدوره يحفظ في localStorage
    useAuthStore.getState().setUser(data.user);
    useAuthStore.getState().setToken(data.token);
    useAuthStore.getState().setAuthenticated(true);
     console.log("User info:", data.user);

    // التوجيه حسب الدور
    router.push(data.user.role === "admin" ? "/dashboard" : "/profile");
    router.refresh(); // إعادة تحميل الصفحة للتأكد من تطبيق الحالة

  } catch (error: any) {
    setErrors({ 
      general: error.message || "حدث خطأ في الاتصال بالخادم" 
    });
  } finally {
    setIsLoading(false);
  }
};
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // إزالة أي شيء غير رقمي

    // إضافة 966 تلقائياً إذا لم يكن موجوداً
    if (value.length > 0 && !value.startsWith("966")) {
      if (value.startsWith("5")) {
        value = "966" + value;
      }
    }

    // تحديد الحد الأقصى للأرقام (12 رقم)
    if (value.length <= 12) {
      setPhone(value);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Image
            src="/images/whitelogo.png"
            alt="EVA Logo"
            width={150}
            height={150}
            className="mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold">تسجيل الدخول</h2>
          <p className="mt-2 text-sm text-muted-foreground">مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500 text-sm">{errors.general}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                رقم الهاتف *
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="966501234567"
                  className={`appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-10 ${
                    errors.phone ? "border-red-500" : "border-border/20 focus:border-primary/50"
                  }`}
                />
                <Phone className="absolute right-3 top-3 h-5 w-5 text-muted" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">مثال: 966501234567 (يبدأ بـ 966)</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                كلمة المرور *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-10 ${
                    errors.password ? "border-red-500" : "border-border/20 focus:border-primary/50"
                  }`}
                  placeholder="كلمة المرور"
                />
                <Lock className="absolute right-3 top-3 h-5 w-5 text-muted" />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/80">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5 ml-2" />
                  تسجيل الدخول
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        <div className="mt-6 text-center">
          <Link href="/auth/signup" className="text-sm text-primary hover:text-primary/80">
            ليس لديك حساب؟ سجل الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
