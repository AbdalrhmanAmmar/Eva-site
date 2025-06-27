"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ForgotPasswordClient() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; general?: string }>({});

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^966\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setErrors({ phone: "رقم الهاتف مطلوب" });
      return;
    }
    
    if (!validatePhone(phone)) {
      setErrors({ phone: "رقم الهاتف غير صحيح" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:4000/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // حفظ رقم الهاتف للتحقق
        localStorage.setItem('resetPhone', phone);
        router.push('/auth/reset-password');
      } else {
        setErrors({ general: data.message || 'حدث خطأ في إرسال رمز التحقق' });
      }
    } catch (error) {
      setErrors({ general: 'حدث خطأ في الاتصال بالخادم' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // إزالة أي شيء غير رقمي
    
    // تحديد الحد الأقصى للأرقام (9 أرقام بعد 966)
    if (value.length <= 9) {
      // نضيف 966 للقيمة المخزنة
      setPhone('966' + value);
    }
  };

  // استخراج الأرقام بعد 966 للعرض في حقل الإدخال
  const displayPhone = phone.startsWith('966') ? phone.substring(3) : phone;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Image
            src="/images/whitelogo.png"
            alt="EVA Logo"
            width={150}
            height={150}
            className="mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold">استعادة كلمة المرور</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            أدخل رقم هاتفك لاستعادة كلمة المرور
          </p>
        </motion.div>

        {!isSubmitted ? (
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
                  <div className="absolute right-3 top-3 flex items-center gap-2 text-muted">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="absolute right-10 top-3 flex items-center gap-1 text-muted border-l border-border/20 pl-2">
                    <span className="text-sm font-medium">966</span>
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <Image 
                        src="https://flagcdn.com/sa.svg" 
                        alt="Saudi Arabia" 
                        width={20} 
                        height={20} 
                      />
                    </div>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={displayPhone}
                    onChange={handlePhoneChange}
                    className={`appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-32 ${
                      errors.phone ? 'border-red-500' : 'border-border/20 focus:border-primary/50'
                    }`}
                    placeholder="5XXXXXXXX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  مثال: 5XXXXXXXX (بدون 966)
                </p>
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
                  "إرسال رمز التحقق"
                )}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-500 font-medium mb-2">
                تم إرسال رمز التحقق بنجاح!
              </p>
              <p className="text-sm text-muted-foreground">
                تم إرسال رمز التحقق إلى رقم هاتفك
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              يرجى التحقق من رسائلك النصية واتباع التعليمات لاستعادة كلمة المرور
            </p>
            <Link href="/auth/verify">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
              >
                التحقق من الرمز
              </motion.button>
            </Link>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-primary hover:text-primary/80 inline-flex items-center"
          >
            <ArrowRight className="h-4 w-4 ml-1" />
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}