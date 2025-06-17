"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Package,
  Plus,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  Users,
  DollarSign
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "الرئيسية", href: "/seller" },
  { icon: Package, label: "المنتجات", href: "/seller/products" },
  { icon: Plus, label: "إضافة منتج", href: "/seller/add-product" },
  // { icon: BarChart3, label: "التقارير", href: "/seller/analytics" },
  // { icon: ShoppingBag, label: "الطلبات", href: "/seller/orders" },
  // { icon: Users, label: "العملاء", href: "/seller/customers" },
  // { icon: Settings, label: "الإعدادات", href: "/seller/settings" },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: "16rem" }}
        animate={{ width: isSidebarOpen ? "16rem" : "4rem" }}
        className="bg-card border-l border-border/10 h-screen sticky top-0 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold"
            >
              لوحة البائع
            </motion.h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
              >
                <item.icon className="w-5 h-5 text-primary" />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                تسجيل الخروج
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}