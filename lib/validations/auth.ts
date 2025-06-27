import { z } from 'zod';

// تحقق من رقم الهاتف السعودي
const saudiPhoneRegex = /^966\d{9}$/;

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(saudiPhoneRegex, 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 966 ويتكون من 12 رقم)'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

// مخطط إرسال رمز التحقق
export const sendOTPSchema = z.object({
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(saudiPhoneRegex, 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 966 ويتكون من 12 رقم)'),
});

// مخطط استكمال التسجيل بعد التحقق
export const completeRegistrationSchema = z.object({
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(saudiPhoneRegex, 'رقم الهاتف غير صحيح'),
  otp: z
    .string()
    .min(1, 'رمز التحقق مطلوب')
    .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
    .regex(/^\d+$/, 'رمز التحقق يجب أن يحتوي على أرقام فقط'),
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم لا يجب أن يتجاوز 50 حرف'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

// مخطط التسجيل القديم (للتوافق)
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم لا يجب أن يتجاوز 50 حرف'),
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(saudiPhoneRegex, 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 966 ويتكون من 12 رقم)'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(saudiPhoneRegex, 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 966 ويتكون من 12 رقم)'),
});

export const verifyOTPSchema = z.object({
  otp: z
    .string()
    .min(1, 'رمز التحقق مطلوب')
    .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
    .regex(/^\d+$/, 'رمز التحقق يجب أن يحتوي على أرقام فقط'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

// أنواع البيانات
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SendOTPFormData = z.infer<typeof sendOTPSchema>;
export type CompleteRegistrationFormData = z.infer<typeof completeRegistrationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;