"use client";

import { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import CartIcon from "./CartIcon";
import QuickAddToCart from "./QuickAddToCart";
import { productAPI } from "@/lib/api/auth";
import RatingComponent from "./RatingComponent";

interface ProductImage {
  url: string;
  isMain: boolean;
}

interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  shortDescription?: string;
  priceAfterDiscount: number;
  priceBeforeDiscount?: number;
  category: string;
  tag?: string;
  averageRating?: number;
  numberOfReviews?: number;
  showReviews?: boolean;
  showDiscount?: boolean;
  showQuantity?: boolean;
  images: ProductImage[];
  quantity: number;
  discount?: number;
  maxQuantity?: number;
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory === "جميع المنتجات" ? undefined : selectedCategory,
          search: searchTerm,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy: sortBy === "featured" ? undefined : sortBy,
        };
        
        const { success, products } = await productAPI.getAllProducts(params);
        if (success) {
          setProducts(products.map((product: any) => ({
            ...product,
            discount: product.priceBeforeDiscount
              ? Math.round((1 - product.priceAfterDiscount / product.priceBeforeDiscount) * 100)
              : undefined,
            images: product.images || [] // تأكد من وجود مصفوفة images
          })));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  const getMainImage = (product: Product) => {
    if (!product.images || product.images.length === 0) return null;
    const mainImg = product.images.find(img => img.isMain);
    return mainImg || product.images[0];
  };

const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/placeholder.jpg'; // صورة افتراضية إذا كان المسار غير موجود
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${imagePath}`;
};

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    setCartCount(prev => prev + quantity);
    console.log(`Added product ${productId} with quantity ${quantity} to cart`);
  };

  const toggleWishlist = (productId: string) => {
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
            {loading ? "جاري التحميل..." : `عرض ${products.length} منتج`}
          </p>
          <div className="flex items-center gap-4">
            <CartIcon itemCount={cartCount} />
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-card border border-border/10 rounded-xl overflow-hidden h-96 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
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
            {products.map((product, index) => {
              const mainImage = getMainImage(product);
              return (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-background border border-gray-200 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                >
                  {/* Product Image */}
                  <div className={`relative bg-gray-50 ${viewMode === "list" ? "md:w-72 lg:w-80 h-64" : "h-60"} overflow-hidden`}>
                    {mainImage && (
  <Image
    src={getImageUrl(mainImage.url)}
    alt={product.name}
    fill
    unoptimized={true}
    className="object-cover transition-transform duration-500 group-hover:scale-105"
    quality={85}
    onError={(e) => {
      (e.target as HTMLImageElement).src = '/placeholder.jpg';
    }}
  />
)}
                    
                    {/* Badges - Top Right */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {product.tag && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-md">
                          {product.tag}
                        </span>
                      )}
                      {product.showDiscount && product.discount && product.discount > 0 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          خصم {product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Short Description - Top Left */}
                    {product.shortDescription && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium shadow-md">
                          {product.shortDescription}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleWishlist(product._id || product.id)}
                        className={`p-2 rounded-full shadow-md transition-all ${
                          wishlist.includes(product._id || product.id)
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-white hover:bg-red-50 text-gray-700"
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/product/${product._id || product.id}`}
                        className="p-2 bg-white hover:bg-blue-50 text-gray-700 rounded-full shadow-md transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openQuickAdd(product)}
                        className={`p-2 rounded-full shadow-md transition-all ${
                          product.quantity <= 0 
                            ? "bg-gray-300 cursor-not-allowed" 
                            : "bg-white hover:bg-green-50 text-gray-700"
                        }`}
                        disabled={product.quantity <= 0}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`p-5 ${viewMode === "list" ? "md:flex-1" : ""}`}>
                    <div className="flex flex-col h-full">
                      {/* Title and Rating */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        {product.showReviews && product.averageRating && (
                          <RatingComponent
                            rating={product.averageRating}
                            reviews={product.numberOfReviews || 0}
                          />
                        )}
                      </div>
                      
                      {/* Quantity Progress Bar */}
                      {product.showQuantity && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500 flex items-center">
                              <Package className="w-3 h-3 mr-1" />
                              الكمية المتاحة
                            </span>
                            <span className={`font-medium ${
                              product.quantity <= 5 ? 'text-red-500' : 'text-green-600'
                            }`}>
                              {product.quantity} وحدة
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                product.quantity <= 5 ? 'bg-red-400' : 
                                product.quantity <= 15 ? 'bg-yellow-400' : 'bg-green-400'
                              }`}
                              style={{ 
                                width: `${(product.quantity / (product.maxQuantity || 100)) * 100}%`,
                                transition: 'width 0.5s ease-in-out'
                              }}
                            />
                          </div>
                          {product.quantity <= 5 && (
                            <div className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              الكمية محدودة!
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Description */}
                      <div className="mb-4 flex-1">
                        {product.description && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {product.description.length > 150 
                              ? `${product.description.substring(0, 150)}...` 
                              : product.description}
                          </p>
                        )}
                      </div>

                      {/* Price and Add to Cart */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            {product.priceAfterDiscount > 0 ? (
                              <>
                                <span className="text-xl font-bold text-primary">
                                  {product.priceAfterDiscount.toLocaleString()} ريال
                                </span>
                                {product.priceBeforeDiscount && product.priceBeforeDiscount > product.priceAfterDiscount && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {product.priceBeforeDiscount.toLocaleString()} ريال
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {product.priceBeforeDiscount?.toLocaleString() || '0'} ريال
                              </span>
                            )}
                          </div>
                          
                          <AddToCartButton
                            productId={product._id || product.id}
                            productName={product.name}
                            disabled={product.quantity <= 0}
                            onAddToCart={handleAddToCart}
                            className={`px-4 py-2 rounded-lg text-white transition-colors ${
                              product.quantity <= 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-primary hover:bg-primary/90'
                            }`}
                          />
                        </div>
                        
                        {/* Rating at bottom for grid view */}
                        {product.showReviews && viewMode === "grid" && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <RatingComponent 
                              rating={product.averageRating!}
                              reviews={product.numberOfReviews!}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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