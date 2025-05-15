"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export default function NotFoundClient() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/whitelogo.png"
            alt="EVA Logo"
            width={150}
            height={150}
            className="mx-auto mb-8"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold mb-4">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-primary text-background rounded-full hover:bg-primary/90 transition-colors"
              >
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </motion.button>
            </Link>
            <Link href="/info">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                تواصل معنا
                <ArrowRight className="w-5 h-5 mr-2" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <Link href="/security" className="group">
            <div className="p-6 rounded-xl bg-card/50 border border-border/10 hover:border-primary/20 transition-all">
              <h3 className="font-semibold mb-2">الأمن والحماية</h3>
              <p className="text-sm text-muted-foreground">
                حلول أمنية متكاملة لحماية ممتلكاتك
              </p>
            </div>
          </Link>
          
          <Link href="/real-estate" className="group">
            <div className="p-6 rounded-xl bg-card/50 border border-border/10 hover:border-primary/20 transition-all">
              <h3 className="font-semibold mb-2">التطوير العقاري</h3>
              <p className="text-sm text-muted-foreground">
                مشاريع عقارية مبتكرة ومستدامة
              </p>
            </div>
          </Link>
          
          <Link href="/property-management" className="group">
            <div className="p-6 rounded-xl bg-card/50 border border-border/10 hover:border-primary/20 transition-all">
              <h3 className="font-semibold mb-2">إدارة الأملاك</h3>
              <p className="text-sm text-muted-foreground">
                خدمات إدارة شاملة لممتلكاتك
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}