"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

export default function VerifyClient() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("user@example.com"); // This should come from signup state

  useEffect(() => {
    if (timer > 0 && !isVerified) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isVerified]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        const prevInput = e.currentTarget.previousSibling as HTMLInputElement;
        if (prevInput) prevInput.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would verify the OTP with your backend
    const enteredOTP = otp.join("");
    console.log("Verifying OTP:", enteredOTP);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerified(true);
    }, 1500);
  };

  const handleResend = () => {
    setTimer(60);
    // Here you would call your backend to resend the OTP
    console.log("Resending OTP to:", email);
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
          <h2 className="text-3xl font-bold">التحقق من الحساب</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            تم إرسال رمز التحقق إلى بريدك الإلكتروني
          </p>
          <p className="text-sm text-primary font-medium mt-1">{email}</p>
        </motion.div>

        {!isVerified ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl font-bold rounded-lg border border-border/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                />
              ))}
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
              >
                تحقق من الرمز
              </motion.button>
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  يمكنك طلب رمز جديد خلال {timer} ثانية
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة إرسال الرمز
                </button>
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
                تم التحقق من حسابك بنجاح!
              </p>
            </div>
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <ArrowRight className="w-4 h-4" />
                الذهاب إلى تسجيل الدخول
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}