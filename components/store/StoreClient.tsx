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
} from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import CartIcon from "./CartIcon";
import QuickAddToCart from "./QuickAddToCart";
import { productAPI } from "@/lib/api/auth";
import RatingComponent from "./RatingComponent";

interface Product {
  id: string;
   _id?: any;
  name: string;
  description: string;
  shortDescription?: string;
  priceAfterDiscount: number;
  priceBeforeDiscount?: number;
  category: string;
  tag?: string;
  rating?: number;
  reviews?: number;
  showReviews?: boolean;
  images: string[];
  quantity: number;
  discount?: number;
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
          console.log(`sucess   `)
          console.log(products)
          setProducts(products.map((product: any) => ({
        
            ...product,
            discount: product.priceBeforeDiscount
              ? Math.round((1 - product.priceAfterDiscount / product.priceBeforeDiscount) * 100)
              : undefined
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
            {products.map((product, index) => (
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
                  {product.images.length > 0 && (
                    <Image
  src={`http://localhost:4000/uploads/${product.images[0]}`}
                      alt={product.name}
                      fill
                       unoptimized={true} 
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.discount && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        -{product.discount}%
                      </span>
                    )}
                    {product.tag && (
                      <span className="bg-primary text-background px-2 py-1 rounded-full text-xs">
                        {product.tag}
                      </span>
                    )}
                    {product.quantity <= 0 && (
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
                        href={`/product/${product?._id.toString()  || '2'}`}

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
                    {product.showReviews && product.rating && (
                      <RatingComponent 
                        rating={product.rating} 
                        reviews={product.reviews || 0} 
                      />
                    )}
                  </div>
                  
                  {product.shortDescription && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        {product.priceAfterDiscount} ريال
                      </span>
                      {product.priceBeforeDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.priceBeforeDiscount} ريال
                        </span>
                      )}
                    </div>
                    
                    <AddToCartButton
                      productId={product.id}
                      productName={product.name}
                      disabled={product.quantity <= 0}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                  {product.showReviews && (
                                                          <h2 className="text-red-500">hello</h2>


                  )}

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