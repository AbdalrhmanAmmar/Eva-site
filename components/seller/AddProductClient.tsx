"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Save,
  Eye,
  ArrowRight,
  Image as ImageIcon,
  Package,
  DollarSign,
  FileText,
  Tag,
} from "lucide-react";
import Image from "next/image";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  status: "نشط" | "مسودة";
  images: string[];
  features: string[];
  specifications: { key: string; value: string }[];
}

const categories = [
  "الأمن والحماية",
  "التطوير العقاري",
  "إدارة الأملاك",
  "التقنيات الذكية",
  "الاستشارات",
];

export default function AddProductClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "مسودة",
    images: [],
    features: [""],
    specifications: [{ key: "", value: "" }],
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSpecificationChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  };

  const removeSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      // In a real app, you would upload these files to a server
      // For now, we'll just create placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg?${index}`
      );
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
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

  const handleSubmit = (status: "نشط" | "مسودة") => {
    const productData = { ...formData, status };
    console.log("Submitting product:", productData);
    
    // In a real app, you would send this data to your backend
    // For now, we'll just redirect back to products page
    router.push("/seller/products");
  };

  const steps = [
    { id: 1, title: "المعلومات الأساسية", icon: Package },
    { id: 2, title: "الصور والوسائط", icon: ImageIcon },
    { id: 3, title: "التفاصيل والمواصفات", icon: FileText },
    { id: 4, title: "المراجعة والنشر", icon: Eye },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
          <p className="text-muted-foreground mt-2">أضف منتجاً جديداً إلى متجرك</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-3 ${
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? "bg-primary text-background" : "bg-muted/20"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="font-medium hidden md:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted/20"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border/10 rounded-xl p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">اسم المنتج *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="أدخل اسم المنتج"
                  className="w-full px-4 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">السعر (ريال سعودي) *</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-4 pr-12 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الفئة *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">وصف المنتج *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="اكتب وصفاً مفصلاً للمنتج..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Images */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">الصور والوسائط</h2>
            
            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border/20"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">اسحب الصور هنا أو انقر للتحديد</h3>
              <p className="text-muted-foreground mb-4">
                يمكنك رفع حتى 10 صور بصيغة JPG, PNG أو WebP
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                اختيار الصور
              </label>
            </div>

            {/* Uploaded Images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-primary text-background text-xs rounded">
                        الصورة الرئيسية
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Details and Specifications */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">التفاصيل والمواصفات</h2>
            
            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-4">المميزات</label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="أدخل ميزة المنتج"
                      className="flex-1 px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    {formData.features.length > 1 && (
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addFeature}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  + إضافة ميزة أخرى
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium mb-4">المواصفات التقنية</label>
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                      placeholder="المواصفة (مثل: الأبعاد)"
                      className="flex-1 px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      placeholder="القيمة (مثل: 50x30x20 سم)"
                      className="flex-1 px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    {formData.specifications.length > 1 && (
                      <button
                        onClick={() => removeSpecification(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addSpecification}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  + إضافة مواصفة أخرى
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">مراجعة المنتج</h2>
            
            <div className="bg-background/50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-muted-foreground">اسم المنتج</h3>
                  <p className="text-lg">{formData.name || "غير محدد"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">السعر</h3>
                  <p className="text-lg text-primary font-bold">
                    {formData.price ? `${formData.price} ريال` : "غير محدد"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">الفئة</h3>
                  <p className="text-lg">{formData.category || "غير محدد"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">عدد الصور</h3>
                  <p className="text-lg">{formData.images.length} صورة</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">الوصف</h3>
                <p className="text-sm">{formData.description || "غير محدد"}</p>
              </div>

              <div>
                <h3 className="font-medium text-muted-foreground mb-2">المميزات</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {formData.features.filter(f => f.trim()).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-border/10">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 bg-muted/20 text-foreground rounded-lg hover:bg-muted/30 transition-colors"
              >
                السابق
              </motion.button>
            )}
          </div>

          <div className="flex gap-3">
            {currentStep === 4 ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubmit("مسودة")}
                  className="flex items-center gap-2 px-6 py-3 bg-muted/20 text-foreground rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  حفظ كمسودة
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubmit("نشط")}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  نشر المنتج
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
              >
                التالي
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}