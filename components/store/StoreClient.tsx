"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  Heart,
  Eye,
  Package,
  Grid3X3,
  List,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import CartIcon from "./CartIcon";
import QuickAddToCart from "./QuickAddToCart";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  discount?: number;
  tags: string[];
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "نظام المراقبة الذكي Pro",
    description: "نظام مراقبة متطور مع تقنيات الذكاء الاصطناعي وتحليل الفيديو في الوقت الفعلي",
    price: 4500,
    originalPrice: 5000,
    category: "أنظمة المراقبة",
    rating: 4.8,
    reviews: 124,
    image: "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg",
    images: [
      "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg",
      "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg",
    ],
    inStock: true,
    featured: true,
    discount: 10,
    tags: ["جديد", "الأكثر مبيعاً"],
  },
  {
    id: 2,
    name: "بوابة التحكم الذكية",
    description: "نظام تحكم متقدم بالدخول مع تقنية التعرف على الوجه والبصمة",
    price: 3200,
    category: "أنظمة التحكم",
    rating: 4.6,
    reviews: 89,
    image: "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg",
    images: [
      "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg",
    ],
    inStock: true,
    featured: false,
    tags: ["تقنية حديثة"],
  },
  {
    id: 3,
    name: "نظام إدارة المباني الذكية",
    description: "حل شامل لإدارة وتشغيل المباني مع أنظمة التحكم الآلي",
    price: 8500,
    category: "إدارة المباني",
    rating: 4.9,
    reviews: 67,
    image: "https://images.pexels.com/photos/3182530/pexels-photo-3182530.jpeg",
    images: [
      "https://images.pexels.com/photos/3182530/pexels-photo-3182530.jpeg",
    ],
    inStock: true,
    featured: true,
    tags: ["متقدم", "شامل"],
  },
  {
    id: 4,
    name: "كاميرا مراقبة خارجية 4K",
    description: "كاميرا عالية الدقة مقاومة للطقس مع رؤية ليلية متطورة",
    price: 850,
    originalPrice: 950,
    category: "كاميرات المراقبة",
    rating: 4.4,
    reviews: 203,
    image: "https://images.pexels.com/photos/96612/pexels-photo-96612.jpeg",
    images: [
      "https://images.pexels.com/photos/96612/pexels-photo-96612.jpeg",
    ],
    inStock: true,
    featured: false,
    discount: 11,
    tags: ["عرض خاص"],
  },
  {
    id: 5,
    name: "جهاز إنذار ذكي",
    description: "نظام إنذار متطور مع إشعارات فورية على الهاتف المحمول",
    price: 1200,
    category: "أنظمة الإنذار",
    rating: 4.3,
    reviews: 156,
    image: "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg",
    images: [
      "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg",
    ],
    inStock: false,
    featured: false,
    tags: ["نفد المخزون"],
  },
  {
    id: 6,
    name: "نظام الصوت والاتصال الداخلي",
    description: "نظام اتصال داخلي متطور مع جودة صوت عالية",
    price: 2100,
    category: "أنظمة الاتصال",
    rating: 4.5,
    reviews: 78,
    image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg",
    images: [
      "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg",
    ],
    inStock: true,
    featured: false,
    tags: ["جودة عالية"],
  },
];

const categories = [
  "جميع المنتجات",
  "أنظمة المراقبة",
  "أنظمة التحكم",
  "إدارة المباني",
  "كاميرات المراقبة",
  "أنظمة الإنذار",
  "أنظمة الاتصال",
];

export default function StoreClient() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "جميع المنتجات" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "featured":
      default:
        return b.featured ? 1 : -1;
    }
  });

  const handleAddToCart = (productId: number, quantity: number = 1) => {
    setCartCount(prev => prev + quantity);
    console.log(`Added product ${productId} with quantity ${quantity} to cart`);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const openQuickAdd = (product: Product) => {
    setQuickAddProduct(product);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            متجر EVA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            اكتشف مجموعة منتجاتنا المتميزة في مجال الأمن والحماية والتقنيات الذكية
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
            >
              <option value="featured">المميزة</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">التقييم</option>
              <option value="name">الاسم</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-primary text-background" : "hover:bg-primary/10"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-primary text-background" : "hover:bg-primary/10"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              فلاتر
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-border/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">نطاق السعر</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="flex-1 px-3 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="number"
                      placeholder="إلى"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1 px-3 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count and Cart */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            عرض {sortedProducts.length} من {products.length} منتج
          </p>
          <div className="flex items-center gap-4">
            <CartIcon itemCount={cartCount} />
          </div>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground">
              لم يتم العثور على منتجات تطابق معايير البحث
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card border border-border/10 rounded-xl overflow-hidden group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div className={`relative ${viewMode === "list" ? "w-64 h-48" : "h-48"}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.discount && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        -{product.discount}%
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-primary text-background px-2 py-1 rounded-full text-xs">
                        مميز
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                        نفد المخزون
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full transition-colors ${
                        wishlist.includes(product.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/80 hover:bg-white"
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/store/product/${product.id}`}
                      className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openQuickAdd(product)}
                      className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">{product.price} ريال</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice} ريال
                        </span>
                      )}
                    </div>
                    
                    <AddToCartButton
                      productId={product.id}
                      productName={product.name}
                      disabled={!product.inStock}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Add to Cart Modal */}
        <QuickAddToCart
          product={quickAddProduct!}
          isOpen={!!quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

