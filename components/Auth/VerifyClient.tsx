"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, RefreshCw, Shield } from "lucide-react";

import { authAPI } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import LoadingButton from "@/components/ui/LoadingButton";
import { VerifyOTPFormData, verifyOTPSchema } from "@/lib/validations/auth";

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationType = searchParams.get("type") || "signup"; // 'signup' or 'reset'

  const [timer, setTimer] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const {
    user,
    otpId,
    isOTPSent,
    setUser,
    setToken,
    setAuthenticated,
    setResetToken,
    setLoading,
    setError,
    clearOTPData,
    isLoading,
    error,
  } = useAuthStore();

  // العد التنازلي
  useEffect(() => {
    if (timer > 0 && !isVerified) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, isVerified]);

  // إعادة توجيه إذا لم يتم إرسال OTP
  useEffect(() => {
    if (!isOTPSent || !otpId) {
      const redirectPath =
        verificationType === "reset" ? "/auth/forgot-password" : "/auth/signup";
      router.push(redirectPath);
    }
  }, [isOTPSent, otpId, verificationType, router]);

  const formik = useFormik<VerifyOTPFormData>({
    initialValues: {
      otp: "",
    },
    validationSchema: toFormikValidationSchema(verifyOTPSchema),
    onSubmit: async (values) => {
      if (!otpId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await authAPI.verifyOTP({
          otp: values.otp,
          otpId: otpId,
        });

        if (response.success && response.data) {
          setIsVerified(true);
          clearOTPData();

          if (verificationType === "reset") {
            // إعادة تعيين كلمة المرور - احفظ التوكن وانتقل لصفحة إعادة التعيين
            if (response.data.token) {
              setResetToken(response.data.token);
              setTimeout(() => {
                router.push("/auth/reset-password");
              }, 2000);
            }
          } else {
            // تسجيل جديد - سجل دخول المستخدم
            setUser(response.data.user);
            if (response.data.token) {
              setToken(response.data.token);
            }
            setAuthenticated(true);

            setTimeout(() => {
              router.push("/");
            }, 2000);
          }
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    if (!otpId || !canResend) return;

    try {
      setLoading(true);
      setError(null);

      await authAPI.resendOTP(otpId);
      setTimer(60);
      setCanResend(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // تنسيق OTP input
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    formik.setFieldValue("otp", value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTitle = () => {
    if (verificationType === "reset") {
      return "تأكيد إعادة تعيين كلمة المرور";
    }
    return "التحقق من الحساب";
  };

  const getDescription = () => {
    if (verificationType === "reset") {
      return "تم إرسال رمز التحقق لإعادة تعيين كلمة المرور";
    }
    return "تم إرسال رمز التحقق لتفعيل حسابك";
  };

  const getSuccessMessage = () => {
    if (verificationType === "reset") {
      return "تم التحقق بنجاح! سيتم توجيهك لإعادة تعيين كلمة المرور";
    }
    return "تم التحقق من حسابك بنجاح! مرحباً بك في EVA";
  };

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
          <h2 className="text-3xl font-bold">{getTitle()}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {getDescription()}
          </p>
          {user?.phone && (
            <p className="text-sm text-primary font-medium mt-1">
              {user.phone}
            </p>
          )}
        </motion.div>

        {!isVerified ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-3 text-center">
                أدخل رمز التحقق المكون من 6 أرقام
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={formik.values.otp}
                  onChange={handleOTPChange}
                  onBlur={formik.handleBlur}
                  className="w-full text-center text-2xl font-bold py-4 bg-background border border-border/20 rounded-lg focus:outline-none focus:border-primary/50 tracking-widest"
                  placeholder="000000"
                  dir="ltr"
                />
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {formik.touched.otp && formik.errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {formik.errors.otp}
                </p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={formik.values.otp.length !== 6 || isLoading}
              className="w-full"
              size="lg"
            >
              تحقق من الرمز
            </LoadingButton>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  يمكنك طلب رمز جديد خلال {formatTime(timer)}
                </p>
              ) : (
                <LoadingButton
                  onClick={handleResendOTP}
                  loading={isLoading}
                  disabled={!canResend || isLoading}
                  variant="outline"
                  className="text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة إرسال الرمز
                </LoadingButton>
              )}
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="flex justify-center mb-4"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
              <p className="text-green-500 font-medium">
                {getSuccessMessage()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              سيتم توجيهك تلقائياً...
            </p>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
