"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
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
          <h2 className="text-3xl font-bold">استعادة كلمة المرور</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            أدخل بريدك الإلكتروني لاستعادة كلمة المرور
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
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-border/20 placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-right pr-10"
                    placeholder="البريد الإلكتروني"
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-muted" />
                </div>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
              >
                إرسال رابط استعادة كلمة المرور
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
              <p className="text-green-500">
                تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لاستعادة كلمة المرور
            </p>
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