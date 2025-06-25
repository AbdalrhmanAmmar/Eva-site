"use client";

import { useProductsStore } from "@/stores/ProductsStore";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star,
  ShoppingCart,
  Eye,
} from "lucide-react";

export default function ProductStats() {
  const {
    getTotalProducts,
    getTotalValue,
    getTotalQuantity,
    getLowStockProducts,
    getOutOfStockProducts,
    getAveragePrice,
    getTotalPoints,
    getDiscountedProducts,
  } = useProductsStore();

  const totalProducts = getTotalProducts();
  const totalValue = getTotalValue();
  const totalQuantity = getTotalQuantity();
  const lowStockProducts = getLowStockProducts().length;
  const outOfStockProducts = getOutOfStockProducts().length;
  const averagePrice = getAveragePrice();
  const totalPoints = getTotalPoints();
  const discountedProducts = getDiscountedProducts().length;

  const stats = [
    {
      icon: Package,
      label: "إجمالي المنتجات",
      value: totalProducts.toString(),
      subValue: `${discountedProducts} منتج بخصم`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: DollarSign,
      label: "قيمة المخزون",
      value: `${totalValue.toLocaleString()} ريال`,
      subValue: `متوسط ${averagePrice.toFixed(0)} ريال`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: ShoppingCart,
      label: "إجمالي الكمية",
      value: totalQuantity.toString(),
      subValue: `${totalQuantity > 0 ? Math.round((totalQuantity / Math.max(totalProducts, 1)) * 100) / 100 : 0} متوسط لكل منتج`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: AlertTriangle,
      label: "تنبيهات المخزون",
      value: lowStockProducts.toString(),
      subValue: `${outOfStockProducts} نفد المخزون`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Star,
      label: "إجمالي النقاط",
      value: totalPoints.toString(),
      subValue: `${totalProducts > 0 ? Math.round(totalPoints / totalProducts) : 0} متوسط لكل منتج`,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{stat.subValue}</p>
        </motion.div>
      ))}
    </div>
  );
}