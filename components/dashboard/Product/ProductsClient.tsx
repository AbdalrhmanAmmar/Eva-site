"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Grid3X3,
  List,
  MoreVertical,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
  Upload,
  Tag,
  DollarSign,
  Hash,
  FileText,
  Calendar,
  User,
  BarChart3,
} from "lucide-react";
import ProductForm from "./ProductForm";
import ProductStats from "./ProductStats";
import { Product, useProductsStore } from "@/stores/ProductsStore";

const categories = [
  "الكل",
  "أنظمة المراقبة",
  "أنظمة التحكم",
  "إدارة المباني",
  "كاميرات المراقبة",
  "أنظمة الإنذار",
  "أنظمة الاتصال",
];

export default function ProductsClient() {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProductAPI,
    deleteProductAPI,
    setError,
    getProductsByCategory,
    searchProducts,
  } = useProductsStore();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchProducts(searchTerm);
    }

    // Apply category filter
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "priceAfterDiscount":
          aValue = a.priceAfterDiscount;
          bValue = b.priceAfterDiscount;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "points":
          aValue = a.points;
          bValue = b.points;
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder, searchProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const success = await deleteProductAPI(productId);
      if (success) {
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      let result;
      
      if (selectedProduct) {
        // Update existing product
        result = await updateProductAPI(selectedProduct._id, productData);
      } else {
        // Add new product
        result = await createProduct(productData);
      }
      
      if (result) {
        setShowProductForm(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const getDiscountPercentage = (product: Product) => {
    if (!product.priceBeforeDiscount) return 0;
    return Math.round(((product.priceBeforeDiscount - product.priceAfterDiscount) / product.priceBeforeDiscount) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "نفد المخزون", color: "text-red-500 bg-red-500/10" };
    if (quantity < 10) return { label: "مخزون منخفض", color: "text-yellow-500 bg-yellow-500/10" };
    return { label: "متوفر", color: "text-green-500 bg-green-500/10" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع المنتجات ({filteredProducts.length} منتج)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة منتج جديد
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-500">{error}</span>
          <button
            onClick={() => setError(null)}
            className="mr-auto p-1 hover:bg-red-500/10 rounded"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <ProductStats />

      {/* Filters and Search */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Search */}
          <div className="relative md:col-span-2">
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
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as "asc" | "desc");
            }}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            <option value="createdAt-desc">الأحدث أولاً</option>
            <option value="createdAt-asc">الأقدم أولاً</option>
            <option value="name-asc">الاسم (أ-ي)</option>
            <option value="name-desc">الاسم (ي-أ)</option>
            <option value="priceAfterDiscount-asc">السعر (الأقل)</option>
            <option value="priceAfterDiscount-desc">السعر (الأعلى)</option>
            <option value="quantity-desc">المخزون (الأعلى)</option>
            <option value="quantity-asc">المخزون (الأقل)</option>
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
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="mr-3 text-muted-foreground">جاري التحميل...</span>
        </div>
      )}

      {/* Products Grid/List */}
      {!isLoading && filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== "الكل"
              ? "لم يتم العثور على منتجات تطابق معايير البحث"
              : "لم تقم بإضافة أي منتجات بعد"}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddProduct}
            className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            إضافة منتج جديد
          </motion.button>
        </div>
      ) : !isLoading ? (
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card border border-border/10 rounded-xl overflow-hidden group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div className={`relative ${viewMode === "list" ? "w-48 h-32" : "h-48"}`}>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.priceBeforeDiscount && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{getDiscountPercentage(product)}%
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(product.quantity).color}`}>
                      {getStockStatus(product.quantity).label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="تعديل المنتج"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product._id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold line-clamp-1 flex-1">{product.name}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">{product.points}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">السعر:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{product.priceAfterDiscount} ريال</span>
                        {product.priceBeforeDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.priceBeforeDiscount} ريال
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">المخزون:</span>
                      <span className="font-medium">{product.quantity} قطعة</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/10">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{product.createdBy.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditProduct(product)}
                        className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteConfirm(product._id)}
                        className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={handleSaveProduct}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-border/10 rounded-2xl p-6 w-full max-w-md z-50"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">تأكيد الحذف</h3>
                <p className="text-muted-foreground mb-6">
                  هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2 px-4 bg-muted/20 text-foreground rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteProduct(showDeleteConfirm)}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "جاري الحذف..." : "حذف"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}