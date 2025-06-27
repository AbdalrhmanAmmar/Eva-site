"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, Lock, UserPlus, User, AlertCircle, ArrowRight, Mail, ChevronLeft } from "lucide-react";
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
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) {
      setPhone('966' + value);
    }
  };

  const displayPhone = phone.startsWith('966') ? phone.substring(3) : phone;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <Image
            src="/images/whitelogo.png"
            alt="EVA Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">مرحباً بك في إيفا</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          سجل حسابك الجديد في خطوات بسيطة
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 space-y-6"
        onSubmit={onSubmit}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
              رقم الجوال السعودي
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Phone className="h-5 w-5" />
              </div>
              <div className="absolute inset-y-0 right-10 flex items-center pr-2 border-r border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5 px-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">+966</span>
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <Image 
                      src="https://flagcdn.com/sa.svg" 
                      alt="Saudi Arabia" 
                      width={20} 
                      height={20} 
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={displayPhone}
                onChange={handlePhoneChange}
                placeholder="5X XXX XXXX"
                className="block w-full pr-32 py-3 text-right border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-all duration-200"
                dir="ltr"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
              مثال: 512345678
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإرسال...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>إرسال رمز التحقق</span>
                <Mail className="w-4 h-4 mr-2" />
              </div>
            )}
          </button>
        </motion.div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm"
      >
        <p className="text-gray-600 dark:text-gray-400">
          لديك حساب بالفعل؟{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            تسجيل الدخول
          </Link>
        </p>
      </motion.div>
    </div>
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
  timeLeft,
  onBack
}: {
  phone: string;
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onResendOTP: () => void;
  timeLeft: number;
  onBack: () => void;
}) => {
  const formattedPhone = `${phone.substring(0, 5)} **** ${phone.substring(9)}`;

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      onSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [otp]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4 ml-1" />
          العودة
        </button>
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تحقق من رقمك</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          تم إرسال رمز التحقق إلى الرقم{' '}
          <span className="font-medium text-gray-900 dark:text-white">{formattedPhone}</span>
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 space-y-6"
        onSubmit={onSubmit}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="otp" className="sr-only">رمز التحقق</label>
            <div className="flex justify-center space-x-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[index] = e.target.value.replace(/\D/g, '');
                      setOtp(newOtp.join(''));
                      
                      // Auto focus next input
                      if (e.target.value && index < 5) {
                        const nextInput = document.getElementById(`otp-${index + 1}`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-14 text-2xl font-bold text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all duration-200"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${(isLoading || otp.length !== 6) ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحقق...
              </div>
            ) : (
              'التحقق والمتابعة'
            )}
          </button>

          <div className="text-sm text-center">
            {timeLeft > 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                يمكنك إعادة الإرسال خلال{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </p>
            ) : (
              <button
                onClick={onResendOTP}
                disabled={isLoading}
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                إعادة إرسال الرمز
              </button>
            )}
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
};

// Step 3: Complete Registration
const CompleteRegistrationStep = ({
  formData,
  setFormData,
  isLoading,
  error,
  onSubmit,
  onBack
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
  onBack: () => void;
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4 ml-1" />
          العودة
        </button>
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
            <UserPlus className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">استكمال التسجيل</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          أكمل بياناتك الشخصية لإنشاء حسابك
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 space-y-6"
        onSubmit={onSubmit}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="block w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white text-right transition-all duration-200"
                placeholder="أدخل اسمك الكامل"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="block w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white text-right transition-all duration-200"
                placeholder="كلمة المرور (6 أحرف على الأقل)"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="block w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white text-right transition-all duration-200"
                placeholder="أعد إدخال كلمة المرور"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري إنشاء الحساب...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>إنشاء حساب</span>
                <UserPlus className="w-4 h-4 mr-2" />
              </div>
            )}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

// Main Component
export default function SignupClient() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated, setPendingPhone } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("966");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [registrationData, setRegistrationData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

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
      const response = await authAPI.sendOTP({ phone });
      
      if (response.success && response.data) {
        setOtpId(response.data.otpId);
        setPendingPhone(phone);
        setTimeLeft(5 * 60);
        setCurrentStep(2);
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ في إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("رمز التحقق يجب أن يكون 6 أرقام");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyOTPOnly({ otp, otpId });
      
      if (response.success) {
        setCurrentStep(3);
      }
    } catch (error: any) {
      setError(error.message || "رمز التحقق غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

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
        otpId,
        name: registrationData.name,
        password: registrationData.password,
        confirmPassword: registrationData.confirmPassword
      });

      if (response.success && response.data) {
        setUser(response.data.user);
        if (response.data.token) {
          setToken(response.data.token);
        }
        setAuthenticated(true);
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ في استكمال التسجيل");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.resendOTP(otpId);
      setTimeLeft(5 * 60);
    } catch (error: any) {
      setError(error.message || "حدث خطأ في إعادة إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setOtp("");
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: currentStep === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentStep === 1 ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8"
          >
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
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <CompleteRegistrationStep
                formData={registrationData}
                setFormData={setRegistrationData}
                isLoading={isLoading}
                error={error}
                onSubmit={handleCompleteRegistration}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}