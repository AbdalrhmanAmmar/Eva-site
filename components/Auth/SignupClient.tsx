"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, Lock, UserPlus, User, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authAPI } from "@/lib/api/auth";
import { FaSaudi } from "react-icons/fa6";

// Step 1: Phone verification
const PhoneVerificationStep = ({
  phone,
  setPhone,
  isLoading,
  error,
  onSubmit
}: {
  phone: string;
  setPhone: (phone: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}) => {
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
    <>
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
        <h2 className="text-3xl font-bold">إنشاء حساب جديد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الخطوة الأولى: التحقق من رقم الهاتف
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-6"
        onSubmit={onSubmit}
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
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
                placeholder="5XXXXXXXX"
                className="appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-32"
              />
            </div>
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

      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-primary hover:text-primary/80"
        >
          لديك حساب بالفعل؟ سجل دخولك
        </Link>
      </div>
    </>
  );
};

// Step 2: OTP Verification
const OTPVerificationStep = ({
  phone,
  otp,
  setOtp,
  isLoading,
  error,
  onSubmit,
  onResendOTP,
  timeLeft
}: {
  phone: string;
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onResendOTP: () => void;
  timeLeft: number;
}) => {
  return (
    <>
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
        <h2 className="text-3xl font-bold">التحقق من رقم الهاتف</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          تم إرسال رمز التحقق إلى {phone}
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-6"
        onSubmit={onSubmit}
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-2 text-center">
              أدخل رمز التحقق المكون من 6 أرقام
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl font-bold py-4 bg-background border border-border/20 rounded-lg focus:outline-none focus:border-primary/50 tracking-widest"
              placeholder="000000"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              "التحقق والمتابعة"
            )}
          </motion.button>
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              يمكنك طلب رمز جديد خلال {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          ) : (
            <button
              onClick={onResendOTP}
              disabled={isLoading}
              className="text-sm text-primary hover:text-primary/80"
            >
              إعادة إرسال الرمز
            </button>
          )}
        </div>
      </motion.form>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary hover:text-primary/80 inline-flex items-center"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          العودة للخلف
        </button>
      </div>
    </>
  );
};

// Step 3: Complete Registration
const CompleteRegistrationStep = ({
  formData,
  setFormData,
  isLoading,
  error,
  onSubmit
}: {
  formData: {
    name: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: (data: any) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
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
        <h2 className="text-3xl font-bold">استكمال بيانات الحساب</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          تم التحقق من رقم هاتفك بنجاح، يرجى استكمال بيانات حسابك
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-6"
        onSubmit={onSubmit}
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              الاسم الكامل *
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-10"
                placeholder="أدخل اسمك الكامل"
              />
              <User className="absolute right-3 top-3 h-5 w-5 text-muted" />
            </div>
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
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-10"
                placeholder="كلمة المرور"
              />
              <Lock className="absolute right-3 top-3 h-5 w-5 text-muted" />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              تأكيد كلمة المرور *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-10"
                placeholder="تأكيد كلمة المرور"
              />
              <Lock className="absolute right-3 top-3 h-5 w-5 text-muted" />
            </div>
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
                <UserPlus className="h-5 w-5 ml-2" />
                إنشاء حساب
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </>
  );
};

// Main Component
export default function SignupClient() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated, setPendingPhone } = useAuthStore();
  
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("966");
  const [otp, setOtp] = useState("");
  const [registrationData, setRegistrationData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError("رقم الهاتف مطلوب");
      return;
    }
    
    if (!/^966\d{9}$/.test(phone)) {
      setError("رقم الهاتف غير صحيح (يجب أن يبدأ بـ 966 ويتكون من 12 رقم)");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authAPI.sendOTP({ phone });
      
      // حفظ رقم الهاتف للخطوات التالية
      setPendingPhone(phone);
      
      // بدء العد التنازلي (5 دقائق)
      setTimeLeft(5 * 60);
      
      // الانتقال للخطوة التالية
      setCurrentStep(2);
    } catch (error: any) {
      setError(error.message || "حدث خطأ في إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("رمز التحقق يجب أن يكون 6 أرقام");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // هنا نتحقق فقط من صحة الرمز دون استكمال التسجيل
      await authAPI.verifyOTP({ otp, otpId: phone });
      
      // الانتقال للخطوة التالية
      setCurrentStep(3);
    } catch (error: any) {
      setError(error.message || "رمز التحقق غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationData.name.trim()) {
      setError("الاسم مطلوب");
      return;
    }
    
    if (registrationData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    
    if (registrationData.password !== registrationData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyOTPAndCompleteRegistration({
        phone,
        otp,
        name: registrationData.name,
        password: registrationData.password,
        confirmPassword: registrationData.confirmPassword
      });

      if (response.success && response.data) {
        // حفظ بيانات المستخدم
        setUser(response.data.user);
        if (response.data.token) {
          setToken(response.data.token);
        }
        setAuthenticated(true);

        // توجيه المستخدم للصفحة الرئيسية
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ في استكمال التسجيل");
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة إرسال رمز التحقق
  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.sendOTP({ phone });
      setTimeLeft(5 * 60); // إعادة ضبط العد التنازلي
    } catch (error: any) {
      setError(error.message || "حدث خطأ في إعادة إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث العد التنازلي
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {currentStep === 1 && (
          <PhoneVerificationStep
            phone={phone}
            setPhone={setPhone}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSendOTP}
          />
        )}

        {currentStep === 2 && (
          <OTPVerificationStep
            phone={phone}
            otp={otp}
            setOtp={setOtp}
            isLoading={isLoading}
            error={error}
            onSubmit={handleVerifyOTP}
            onResendOTP={handleResendOTP}
            timeLeft={timeLeft}
          />
        )}

        {currentStep === 3 && (
          <CompleteRegistrationStep
            formData={registrationData}
            setFormData={setRegistrationData}
            isLoading={isLoading}
            error={error}
            onSubmit={handleCompleteRegistration}
          />
        )}
      </div>
    </div>
  );
}