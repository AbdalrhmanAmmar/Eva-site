import { z } from "zod";

// تسجيل الدخول
export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^966\d{9}$/, "رقم الهاتف غير صحيح"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// إرسال رمز التحقق
export const sendOTPSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^966\d{9}$/, "رقم الهاتف غير صحيح"),
});

export type SendOTPFormData = z.infer<typeof sendOTPSchema>;

// التحقق من رمز OTP
export const verifyOTPSchema = z.object({
  otp: z
    .string()
    .min(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .max(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .regex(/^\d{6}$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
});

export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

// استكمال التسجيل
export const completeRegistrationSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^966\d{9}$/, "رقم الهاتف غير صحيح"),
  otp: z
    .string()
    .min(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .max(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .regex(/^\d{6}$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
  otpId: z.string().min(1, "معرف OTP مطلوب"),
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم يجب أن يكون أقل من 50 حرف"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .max(100, "كلمة المرور طويلة جداً"),
  confirmPassword: z
    .string()
    .min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

export type CompleteRegistrationFormData = z.infer<typeof completeRegistrationSchema>;

// التسجيل (الطريقة القديمة - للتوافق مع الأنظمة القديمة)
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم يجب أن يكون أقل من 50 حرف"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^966\d{9}$/, "رقم الهاتف غير صحيح"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .max(100, "كلمة المرور طويلة جداً"),
  confirmPassword: z
    .string()
    .min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// نسيان كلمة المرور
export const forgotPasswordSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^966\d{9}$/, "رقم الهاتف غير صحيح"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// إعادة تعيين كلمة المرور
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .max(100, "كلمة المرور طويلة جداً"),
  confirmPassword: z
    .string()
    .min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// تحديث الملف الشخصي
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم يجب أن يكون أقل من 50 حرف")
    .optional(),
  phone: z
    .string()
    .regex(/^966\d{9}$/, "رقم الهاتف غير صحيح")
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// تغيير كلمة المرور
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z
    .string()
    .min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل")
    .max(100, "كلمة المرور طويلة جداً"),
  confirmNewPassword: z
    .string()
    .min(6, "تأكيد كلمة المرور الجديدة مطلوب"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "كلمة المرور الجديدة غير متطابقة",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية",
  path: ["newPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;