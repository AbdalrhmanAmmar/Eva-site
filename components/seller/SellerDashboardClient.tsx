"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stats = [
  {
    icon: Package,
    label: "إجمالي المنتجات",
    value: "24",
    change: "+3 هذا الشهر",
    isPositive: true,
  },
  {
    icon: ShoppingCart,
    label: "الطلبات الجديدة",
    value: "12",
    change: "+8.2%",
    isPositive: true,
  },
  {
    icon: DollarSign,
    label: "إجمالي المبيعات",
    value: "45,000 ريال",
    change: "+15.3%",
    isPositive: true,
  },
  {
    icon: TrendingUp,
    label: "معدل التحويل",
    value: "3.2%",
    change: "-2.1%",
    isPositive: false,
  },
];

const recentProducts = [
  {
    id: 1,
    name: "نظام المراقبة الذكي",
    price: "5,000 ريال",
    status: "نشط",
    views: 245,
    image: "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg",
  },
  {
    id: 2,
    name: "بوابة التحكم بالدخول",
    price: "3,500 ريال",
    status: "نشط",
    views: 189,
    image: "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg",
  },
  {
    id: 3,
    name: "إدارة المباني الذكية",
    price: "7,500 ريال",
    status: "مسودة",
    views: 67,
    image: "https://images.pexels.com/photos/3182530/pexels-photo-3182530.jpeg",
  },
];

const recentOrders = [
  {
    id: 1,
    customer: "أحمد محمد",
    product: "نظام المراقبة الذكي",
    amount: "5,000 ريال",
    status: "جديد",
    date: "اليوم",
  },
  {
    id: 2,
    customer: "سارة خالد",
    product: "بوابة التحكم بالدخول",
    amount: "3,500 ريال",
    status: "قيد المعالجة",
    date: "أمس",
  },
  {
    id: 3,
    customer: "محمد علي",
    product: "إدارة المباني الذكية",
    amount: "7,500 ريال",
    status: "مكتمل",
    date: "منذ يومين",
  },
];

export default function SellerDashboardClient() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مرحباً بك في لوحة البائع</h1>
          <p className="text-muted-foreground mt-2">إدارة منتجاتك ومتابعة مبيعاتك</p>
        </div>
        <Link href="/seller/add-product">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة منتج جديد
          </motion.button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-4 ${
              stat.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              {stat.isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-card border border-border/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">منتجاتك الحديثة</h2>
            <Link href="/seller/products" className="text-primary hover:text-primary/80 text-sm">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-primary font-bold">{product.price}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status === "نشط"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {product.views} مشاهدة
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                  <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">الطلبات الحديثة</h2>
            <Link href="/seller/orders" className="text-primary hover:text-primary/80 text-sm">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 bg-background/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "جديد"
                      ? "bg-blue-500/10 text-blue-500"
                      : order.status === "قيد المعالجة"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-green-500/10 text-green-500"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">{order.amount}</span>
                  <span className="text-sm text-muted-foreground">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}