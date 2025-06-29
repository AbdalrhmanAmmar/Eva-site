"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Image as ImageIcon,
  Percent,
  DollarSign,
  Tag,
  FileText,
  Check,
  Star,
  AlertCircle,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Product } from "@/stores/ProductsStore";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (productData: Partial<Product>) => void;
  isLoading: boolean;
}

export default function ProductForm({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    priceBeforeDiscount: 0,
    priceAfterDiscount: 0,
    quantity: 0,
    images: [],
    category: "",
    tag: "",
    shortDescription: "",
    showReviews: true,
    hasDiscount: false,
    discountPercentage: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Initialize form with product data when editing
useEffect(() => {
  if (product) {
    const discountCalc = product.priceBeforeDiscount && product.priceAfterDiscount
      ? Math.round(
          ((product.priceBeforeDiscount - product.priceAfterDiscount) /
          product.priceBeforeDiscount * 100)
      ) : 0;

    setFormData({
      ...product,
      hasDiscount: product.priceBeforeDiscount !== product.priceAfterDiscount,
      discountPercentage: discountCalc,
    });
    setPreviewImages(product.images || []);
  } else {
    setFormData({
      name: "",
      description: "",
      priceBeforeDiscount: 0,
      priceAfterDiscount: 0,
      quantity: 0,
      images: [],
      category: "",
      tag: "",
      shortDescription: "",
      showReviews: true,
      hasDiscount: false,
      discountPercentage: 0,
    });
    setPreviewImages([]);
  }
}, [product]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      const newPreviewImages = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages([...previewImages, ...newPreviewImages]);
      setFormData({
        ...formData,
        images: [...formData.images!, ...acceptedFiles],
      });
    },
  });

  const removeImage = (index: number) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    const newImages = [...formData.images!];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });

    // Calculate discount if priceBeforeDiscount or discountPercentage changes
    if (field === "priceBeforeDiscount" || field === "discountPercentage") {
      calculateDiscount();
    }
  };

  const toggleDiscount = () => {
    const newHasDiscount = !formData.hasDiscount;
    setFormData({
      ...formData,
      hasDiscount: newHasDiscount,
      priceAfterDiscount: newHasDiscount
        ? formData.priceBeforeDiscount! *
          (1 - formData.discountPercentage! / 100)
        : formData.priceBeforeDiscount,
    });
  };

  const calculateDiscount = () => {
    if (formData.hasDiscount) {
      const discountedPrice =
        formData.priceBeforeDiscount! *
        (1 - formData.discountPercentage! / 100);
      setFormData({
        ...formData,
        priceAfterDiscount: parseFloat(discountedPrice.toFixed(2)),
      });
    } else {
      setFormData({
        ...formData,
        priceAfterDiscount: formData.priceBeforeDiscount,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "اسم المنتج مطلوب";
    if (!formData.priceBeforeDiscount || formData.priceBeforeDiscount <= 0)
      newErrors.priceBeforeDiscount = "السعر قبل الخصم يجب أن يكون أكبر من الصفر";
    if (formData.hasDiscount && formData.discountPercentage <= 0)
      newErrors.discountPercentage = "نسبة الخصم يجب أن تكون أكبر من الصفر";
    if (previewImages.length === 0)
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const productData = {
        ...formData,
        priceAfterDiscount: formData.hasDiscount
          ? formData.priceAfterDiscount
          : formData.priceBeforeDiscount,
      };
      onSave(productData);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-border/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {product ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Section - Moved to Top */}
            <div>
              <label className="block text-sm font-medium mb-2">
                صور المنتج <span className="text-red-500">*</span>
              </label>
              {errors.images && (
                <p className="text-red-500 text-xs mb-2">{errors.images}</p>
              )}

              <div
                {...getRootProps()}
                className="border-2 border-dashed border-border/20 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    اسحب وأسقط الصور هنا أو انقر للاختيار
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (يسمح بحد أقصى 5 صور)
                  </p>
                </div>
              </div>

              {/* Preview Images */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border/10"
                    >
                      <img
                        src={img}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  اسم المنتج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-background border ${
                    errors.name ? "border-red-500" : "border-border/10"
                  } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-2"
                >
                  الفئة
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">اختر الفئة</option>
                  <option value="أنظمة المراقبة">أنظمة المراقبة</option>
                  <option value="أنظمة التحكم">أنظمة التحكم</option>
                  <option value="إدارة المباني">إدارة المباني</option>
                  <option value="كاميرات المراقبة">كاميرات المراقبة</option>
                  <option value="أنظمة الإنذار">أنظمة الإنذار</option>
                  <option value="أنظمة الاتصال">أنظمة الاتصال</option>
                </select>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                الوصف
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium mb-2"
              >
                وصف مختصر (اختياري)
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription || ""}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="priceBeforeDiscount"
                  className="block text-sm font-medium mb-2"
                >
                  السعر قبل الخصم <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="number"
                    id="priceBeforeDiscount"
                    name="priceBeforeDiscount"
                    min="0"
                    step="0.01"
                    value={formData.priceBeforeDiscount}
                    onChange={(e) => handleNumberChange(e, "priceBeforeDiscount")}
                    className={`w-full pl-4 pr-10 py-2 bg-background border ${
                      errors.priceBeforeDiscount
                        ? "border-red-500"
                        : "border-border/10"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
                {errors.priceBeforeDiscount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.priceBeforeDiscount}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="priceAfterDiscount"
                    className="block text-sm font-medium"
                  >
                    السعر بعد الخصم
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasDiscount"
                      checked={formData.hasDiscount}
                      onChange={toggleDiscount}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label
                      htmlFor="hasDiscount"
                      className="text-sm text-muted-foreground mr-2"
                    >
                      تطبيق خصم
                    </label>
                  </div>
                </div>

                {formData.hasDiscount ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Percent className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <input
                        type="number"
                        id="discountPercentage"
                        name="discountPercentage"
                        min="0"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={(e) =>
                          handleNumberChange(e, "discountPercentage")
                        }
                        className={`w-full pl-4 pr-10 py-2 bg-background border ${
                          errors.discountPercentage
                            ? "border-red-500"
                            : "border-border/10"
                        } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                        placeholder="نسبة الخصم"
                      />
                    </div>
                    {errors.discountPercentage && (
                      <p className="text-red-500 text-xs">
                        {errors.discountPercentage}
                      </p>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <input
                        type="number"
                        id="priceAfterDiscount"
                        name="priceAfterDiscount"
                        min="0"
                        step="0.01"
                        value={formData.priceAfterDiscount}
                        readOnly
                        className="w-full pl-4 pr-10 py-2 bg-muted/20 border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="number"
                      id="priceAfterDiscount"
                      name="priceAfterDiscount"
                      min="0"
                      step="0.01"
                      value={formData.priceBeforeDiscount}
                      readOnly
                      className="w-full pl-4 pr-10 py-2 bg-muted/20 border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Tag Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-2"
                >
                  الكمية المتاحة
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleNumberChange(e, "quantity")}
                  className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="tag" className="block text-sm font-medium mb-2">
                  العلامة (تاغ) <span className="text-xs text-muted-foreground">(اختياري)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    id="tag"
                    name="tag"
                    value={formData.tag || ""}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  خيارات إضافية
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showReviews"
                      name="showReviews"
                      checked={formData.showReviews}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          showReviews: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label
                      htmlFor="showReviews"
                      className="text-sm text-muted-foreground mr-2"
                    >
                      عرض التقييمات
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 bg-muted/20 text-foreground rounded-lg hover:bg-muted/30 transition-colors disabled:opacity-50"
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {product ? "حفظ التغييرات" : "إضافة المنتج"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}