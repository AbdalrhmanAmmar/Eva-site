"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "نشط" | "مسودة" | "متوقف";
  views: number;
  sales: number;
  image: string;
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "نظام المراقبة الذكي",
    description: "نظام متكامل للمراقبة الأمنية مع تقنيات الذكاء الاصطناعي",
    price: 5000,
    category: "الأمن والحماية",
    status: "نشط",
    views: 245,
    sales: 12,
    image: "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "بوابة التحكم بالدخول",
    description: "نظام متطور للتحكم في الدخول باستخدام التقنيات الحيوية",
    price: 3500,
    category: "الأمن والحماية",
    status: "نشط",
    views: 189,
    sales: 8,
    image: "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "إدارة المباني الذكية",
    description: "حل شامل لإدارة المرافق والصيانة في المباني",
    price: 7500,
    category: "إدارة الأملاك",
    status: "مسودة",
    views: 67,
    sales: 0,
    image: "https://images.pexels.com/photos/3182530/pexels-photo-3182530.jpeg",
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    name: "تطوير المجمعات السكنية",
    description: "خدمات تطوير وإدارة المجمعات السكنية المتكاملة",
    price: 15000,
    category: "التطوير العقاري",
    status: "نشط",
    views: 156,
    sales: 3,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    createdAt: "2024-01-05",
  },
];

export default function SellerProductsClient() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");

  const categories = ["الكل", "الأمن والحماية", "التطوير العقاري", "إدارة الأملاك"];
  const statuses = ["الكل", "نشط", "مسودة", "متوقف"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "الكل" || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-500/10 text-green-500";
      case "مسودة":
        return "bg-yellow-500/10 text-yellow-500";
      case "متوقف":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع منتجاتك ({filteredProducts.length} منتج)
          </p>
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

      {/* Filters */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Filter Button */}
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
            <Filter className="w-4 h-4" />
            تصفية
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== "الكل" || selectedStatus !== "الكل"
              ? "لم يتم العثور على منتجات تطابق معايير البحث"
              : "لم تقم بإضافة أي منتجات بعد"}
          </p>
          <Link href="/seller/add-product">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
            >
              إضافة منتج جديد
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border/10 rounded-xl overflow-hidden group"
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <button className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
                  <span className="text-lg font-bold text-primary">{product.price} ريال</span>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span>{product.createdAt}</span>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{product.views} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{product.sales} مبيعة</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center justify-center p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}