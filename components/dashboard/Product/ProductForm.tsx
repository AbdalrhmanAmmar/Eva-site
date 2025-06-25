"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Save,
  Upload,
  Package,
  DollarSign,
  Hash,
  FileText,
  Tag,
  AlertCircle,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { Product } from "@/stores/productsStore";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (productData: Partial<Product>) => void;
  isLoading: boolean;
}

const categories = [
  "أنظمة المراقبة",
  "أنظمة التحكم",
  "إدارة المباني",
  "كاميرات المراقبة",
  "أنظمة الإنذار",
  "أنظمة الاتصال",
];

export default function ProductForm({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceBeforeDiscount: "",
    priceAfterDiscount: "",
    quantity: "",
    points: "",
    image: "",
    category: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        priceBeforeDiscount: product.priceBeforeDiscount?.toString() || "",
        priceAfterDiscount: product.priceAfterDiscount.toString(),
        quantity: product.quantity.toString(),
        points: product.points.toString(),
        image: product.image || "",
        category: product.category,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        priceBeforeDiscount: "",
        priceAfterDiscount: "",
        quantity: "",
        points: "",
        image: "",
        category: "",
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    }

    if (!formData.priceAfterDiscount.trim()) {
      newErrors.priceAfterDiscount = "السعر بعد الخصم مطلوب";
    } else if (isNaN(Number(formData.priceAfterDiscount)) || Number(formData.priceAfterDiscount) <= 0) {
      newErrors.priceAfterDiscount = "يجب أن يكون السعر رقماً موجباً";
    }

    if (formData.priceBeforeDiscount.trim()) {
      if (isNaN(Number(formData.priceBeforeDiscount)) || Number(formData.priceBeforeDiscount) <= 0) {
        newErrors.priceBeforeDiscount = "يجب أن يكون السعر رقماً موجباً";
      } else if (Number(formData.priceBeforeDiscount) <= Number(formData.priceAfterDiscount)) {
        newErrors.priceBeforeDiscount = "السعر قبل الخصم يجب أن يكون أكبر من السعر بعد الخصم";
      }
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = "الكمية مطلوبة";
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = "يجب أن تكون الكمية رقماً غير سالب";
    }

    if (!formData.points.trim()) {
      newErrors.points = "النقاط مطلوبة";
    } else if (isNaN(Number(formData.points)) || Number(formData.points) < 0) {
      newErrors.points = "يجب أن تكون النقاط رقماً غير سالب";
    }

    if (!formData.category.trim()) {
      newErrors.category = "الفئة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData: Partial<Product> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      priceAfterDiscount: Number(formData.priceAfterDiscount),
      quantity: Number(formData.quantity),
      points: Number(formData.points),
      category: formData.category,
    };

    if (formData.priceBeforeDiscount.trim()) {
      productData.priceBeforeDiscount = Number(formData.priceBeforeDiscount);
    }

    if (formData.image.trim()) {
      productData.image = formData.image.trim();
    }

    onSave(productData);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files && files[0]) {
      // In a real app, you would upload the file to a server
      // For now, we'll use a placeholder URL
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData(prev => ({ ...prev, image: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {product ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسم المنتج *
                </label>
                <div className="relative">
                  <Package className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="أدخل اسم المنتج"
                    className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                      errors.name ? "border-red-500" : "border-border/10"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  الوصف
                </label>
                <div className="relative">
                  <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="وصف المنتج (اختياري)"
                    rows={3}
                    className="w-full pl-4 pr-10 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    السعر قبل الخصم (اختياري)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceBeforeDiscount}
                      onChange={(e) => handleInputChange("priceBeforeDiscount", e.target.value)}
                      placeholder="0.00"
                      className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                        errors.priceBeforeDiscount ? "border-red-500" : "border-border/10"
                      }`}
                    />
                  </div>
                  {errors.priceBeforeDiscount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.priceBeforeDiscount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    السعر بعد الخصم *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceAfterDiscount}
                      onChange={(e) => handleInputChange("priceAfterDiscount", e.target.value)}
                      placeholder="0.00"
                      className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                        errors.priceAfterDiscount ? "border-red-500" : "border-border/10"
                      }`}
                    />
                  </div>
                  {errors.priceAfterDiscount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.priceAfterDiscount}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity and Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الكمية *
                  </label>
                  <div className="relative">
                    <Hash className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      placeholder="0"
                      className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                        errors.quantity ? "border-red-500" : "border-border/10"
                      }`}
                    />
                  </div>
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    النقاط *
                  </label>
                  <div className="relative">
                    <Hash className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="0"
                      value={formData.points}
                      onChange={(e) => handleInputChange("points", e.target.value)}
                      placeholder="0"
                      className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                        errors.points ? "border-red-500" : "border-border/10"
                      }`}
                    />
                  </div>
                  {errors.points && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.points}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  الفئة *
                </label>
                <div className="relative">
                  <Tag className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                      errors.category ? "border-red-500" : "border-border/10"
                    }`}
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  صورة المنتج
                </label>
                
                {formData.image ? (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                      className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-border/20"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-2">
                      اسحب الصورة هنا أو انقر للتحديد
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      اختيار صورة
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/10 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-muted/20 text-foreground rounded-lg hover:bg-muted/30 transition-colors"
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {product ? "تحديث المنتج" : "إضافة المنتج"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}