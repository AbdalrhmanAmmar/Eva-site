"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "المستخدمين النشطين",
    value: "2,451",
    change: "+12.5%",
    isPositive: true,
  },
  {
    icon: ShoppingCart,
    label: "إجمالي المبيعات",
    value: "152,000 ريال",
    change: "+8.2%",
    isPositive: true,
  },
  {
    icon: TrendingUp,
    label: "معدل التحويل",
    value: "3.2%",
    change: "-2.1%",
    isPositive: false,
  },
  {
    icon: Eye,
    label: "الزيارات",
    value: "12,543",
    change: "+15.3%",
    isPositive: true,
  },
];

const recentOrders = [
  { id: 1, customer: "أحمد محمد", product: "نظام المراقبة الذكي", amount: "5,000 ريال", status: "مكتمل" },
  { id: 2, customer: "سارة خالد", product: "بوابة التحكم بالدخول", amount: "3,500 ريال", status: "قيد المعالجة" },
  { id: 3, customer: "محمد علي", product: "إدارة المباني الذكية", amount: "7,500 ريال", status: "مكتمل" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
     
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

      {/* Recent Orders */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">آخر الطلبات</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="text-right py-3 px-4">رقم الطلب</th>
                <th className="text-right py-3 px-4">العميل</th>
                <th className="text-right py-3 px-4">المنتج</th>
                <th className="text-right py-3 px-4">المبلغ</th>
                <th className="text-right py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/10">
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.product}</td>
                  <td className="py-3 px-4">{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "مكتمل"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}