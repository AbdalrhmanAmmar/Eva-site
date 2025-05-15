"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, UserPlus } from "lucide-react";

export default function SignupClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup form submitted:", { email, password, name });
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
          <h2 className="text-3xl font-bold">إنشاء حساب جديد</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            انضم إلينا! أنشئ حسابك الجديد
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                الاسم
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-border/20 placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-right pr-10"
                  placeholder="الاسم الكامل"
                />
                <UserPlus className="absolute right-3 top-3 h-5 w-5 text-muted" />
              </div>
            </div>

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

            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-border/20 placeholder-muted bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-right pr-10"
                  placeholder="كلمة المرور"
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
            >
              <UserPlus className="h-5 w-5 ml-2" />
              إنشاء حساب
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
      </div>
    </div>
  );
}