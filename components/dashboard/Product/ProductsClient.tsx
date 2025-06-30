"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, X, Upload, Image as ImageIcon, Plus, Star, Trash2, Edit } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { productAPI } from "@/lib/api/auth";
import Image from "next/image";

const { createProduct, getAllProducts, updateProduct, deleteProduct } = productAPI;

// Schema validation
const productSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  priceBeforeDiscount: z.number().min(0, "السعر يجب أن يكون موجب"),
  discountAmount: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  showDiscount: z.boolean(),
  quantity: z.number().min(0, "الكمية يجب أن تكون موجبة"),
  category: z.string().min(1, "التصنيف مطلوب"),
  tag: z.string().optional(),
  shortDescription: z.string().optional(),
  showDescription: z.boolean(),
  showCategory: z.boolean(),
  showQuantity: z.boolean(),
  showRatings: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      priceBeforeDiscount: 0,
      discountAmount: 0,
      discountPercentage: 0,
      showDiscount: false,
      quantity: 0,
      category: "",
      tag: "",
      shortDescription: "",
      showDescription: false,
      showCategory: false,
      showQuantity: false,
      showRatings: false,
    },
  });

  const { watch, setValue, control, handleSubmit, reset, formState, register } = form;
  const priceBeforeDiscount = watch("priceBeforeDiscount");
  const discountAmount = watch("discountAmount");
  const discountPercentage = watch("discountPercentage");
  const showDiscount = watch("showDiscount");

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllProducts();
      if (response.success) {
        setProducts(response.products);
        // Extract unique categories
        const uniqueCategories = [...new Set(response.products.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب المنتجات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle image uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const newImages = [...images, ...acceptedFiles.slice(0, 5 - images.length)];
      setImages(newImages);
      
      const newPreviews = acceptedFiles.slice(0, 5 - images.length).map(file => {
        return URL.createObjectURL(file);
      });
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate discount automatically
  useEffect(() => {
    if (priceBeforeDiscount && discountPercentage) {
      const calculatedAmount = (priceBeforeDiscount * discountPercentage) / 100;
      setValue("discountAmount", calculatedAmount, { shouldValidate: true });
    }
  }, [priceBeforeDiscount, discountPercentage, setValue]);

  useEffect(() => {
    if (priceBeforeDiscount && discountAmount) {
      const calculatedPercentage = (discountAmount / priceBeforeDiscount) * 100;
      setValue("discountPercentage", calculatedPercentage, { shouldValidate: true });
    }
  }, [priceBeforeDiscount, discountAmount, setValue]);

  // Reset form when opening/closing modal
  useEffect(() => {
    if (isModalOpen) {
      reset({
        name: editingProduct?.name || "",
        priceBeforeDiscount: editingProduct?.priceBeforeDiscount || 0,
        discountAmount: editingProduct?.discountAmount || 0,
        discountPercentage: editingProduct?.discountPercentage || 0,
        showDiscount: editingProduct?.showDiscount || false,
        quantity: editingProduct?.quantity || 0,
        category: editingProduct?.category || "",
        tag: editingProduct?.tag || "",
        shortDescription: editingProduct?.shortDescription || "",
        showDescription: editingProduct?.showDescription || false,
        showCategory: editingProduct?.showCategory || false,
        showQuantity: editingProduct?.showQuantity || false,
        showRatings: editingProduct?.showRatings || false,
      });
      
      if (editingProduct?.images) {
        setPreviews(editingProduct.images);
      } else {
        setPreviews([]);
      }
      setImages([]);
    }
  }, [isModalOpen, editingProduct, reset]);

  const handleOpenModal = (product: any = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPreviews([]);
    setImages([]);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setValue("category", newCategory.trim());
      setNewCategory("");
      toast.success("تمت إضافة الفئة بنجاح");
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("priceBeforeDiscount", values.priceBeforeDiscount.toString());
      formData.append("priceAfterDiscount", (values.priceBeforeDiscount - (values.discountAmount || 0)).toString());
      formData.append("discountAmount", values.discountAmount?.toString() || "0");
      formData.append("discountPercentage", values.discountPercentage?.toString() || "0");
      formData.append("showDiscount", values.showDiscount.toString());
      formData.append("quantity", values.quantity.toString());
      formData.append("category", values.category);
      formData.append("tag", values.tag || "");
      formData.append("shortDescription", values.shortDescription || "");
      formData.append("showDescription", values.showDescription.toString());
      formData.append("showCategory", values.showCategory.toString());
      formData.append("showQuantity", values.showQuantity.toString());
      formData.append("showRatings", values.showRatings.toString());

      images.forEach((file) => {
        formData.append("images", file);
      });

      // Append existing images if editing
      if (editingProduct?.images) {
        editingProduct.images.forEach((image: string) => {
          formData.append("existingImages", image);
        });
      }

      let response;
      if (editingProduct) {
        response = await updateProduct(editingProduct.id, formData);
      } else {
        response = await createProduct(formData);
      }

      if (response.success) {
        toast.success(editingProduct ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
        fetchProducts();
        handleCloseModal();
      } else {
        toast.error(response.message || "حدث خطأ أثناء حفظ المنتج");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        toast.success("تم حذف المنتج بنجاح");
        setProducts(products.filter(product => product.id !== id));
      } else {
        toast.error(response.message || "حدث خطأ أثناء حذف المنتج");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حذف المنتج");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
        <Button 
          onClick={() => handleOpenModal()} 
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الصورة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">السعر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">التصنيف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الكمية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Loader className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.images?.length > 0 ? (
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            width={40}
                            height={40}
  src={`http://localhost:4000/uploads/${product.images[0]}`}

                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        {product.tag && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit mt-1">
                            {product.tag}
                          </span>
                        )}
                      </div>
                      {product.showRatings && (
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500 mr-1">{product.rating || 0}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.showDiscount && product.discountAmount ? (
                        <>
                          <span className="line-through text-gray-400 mr-1">{product.priceBeforeDiscount?.toFixed(2)} ر.س</span>
                          <span className="text-blue-600 font-medium">{product.priceAfterDiscount?.toFixed(2)} ر.س</span>
                        </>
                      ) : (
                        <span>{product.priceBeforeDiscount?.toFixed(2)} ر.س</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.showCategory ? product.category : "---"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.showQuantity ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.quantity}
                        </span>
                      ) : (
                        "---"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    لا توجد منتجات متاحة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div>
                <Label htmlFor="images">صور المنتج (الحد الأقصى 5 صور)</Label>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors bg-blue-50"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-blue-500">قم بإسقاط الصور هنا...</p>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-blue-400" />
                      <p className="text-gray-700">اسحب وأسقط الصور هنا، أو انقر للاختيار</p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG, WEBP (الحد الأقصى 5MB لكل صورة)
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Previews */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group h-24 rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <Label htmlFor="name">اسم المنتج *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="أدخل اسم المنتج"
                  className="mt-1"
                />
                {formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Price and Discount Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priceBeforeDiscount">السعر قبل الخصم *</Label>
                  <Input
                    id="priceBeforeDiscount"
                    type="number"
                    {...register("priceBeforeDiscount", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="mt-1"
                  />
                  {formState.errors.priceBeforeDiscount && (
                    <p className="mt-1 text-sm text-red-600">
                      {formState.errors.priceBeforeDiscount.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="discountAmount">قيمة الخصم</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    {...register("discountAmount", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="discountPercentage">نسبة الخصم %</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    {...register("discountPercentage", {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Discount Toggle */}
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-md">
                <Controller
                  name="showDiscount"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="showDiscount">إظهار نسبة الخصم على المنتج</Label>
              </div>

              {/* Final Price Display */}
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">السعر النهائي:</span>
                  <div className="flex items-center gap-2">
                    {showDiscount && discountAmount && discountAmount > 0 ? (
                      <>
                        <span className="line-through text-gray-500">
                          {priceBeforeDiscount?.toFixed(2)} ر.س
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {(priceBeforeDiscount - (discountAmount || 0)).toFixed(2)} ر.س
                        </span>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {discountPercentage?.toFixed(0)}% خصم
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">
                        {priceBeforeDiscount?.toFixed(2)} ر.س
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">التصنيف *</Label>
                  <div className="flex gap-2 mt-1">
                    <select
                      id="category"
                      {...register("category")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر تصنيف</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formState.errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quantity">الكمية *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register("quantity", {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    min="0"
                    className="mt-1"
                  />
                  {formState.errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {formState.errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Category */}
              <div className="bg-gray-50 p-3 rounded-md">
                <label>إضافة تصنيف جديد</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="أدخل اسم تصنيف جديد"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                    className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                  >
                    إضافة تصنيف
                  </Button>
                </div>
              </div>

              {/* Tag Input */}
              <div>
                <Label htmlFor="tag">العلامة (Tag)</Label>
                <Input
                  id="tag"
                  {...register("tag")}
                  placeholder="أدخل علامة للمنتج (اختياري)"
                  className="mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="shortDescription">وصف مختصر</Label>
                <textarea
                  id="shortDescription"
                  {...register("shortDescription")}
                  placeholder="أدخل وصفاً مختصراً للمنتج"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>

              {/* Toggles Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                  <Controller
                    name="showDescription"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="showDescription">إظهار الوصف على صفحة المنتج</Label>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                  <Controller
                    name="showCategory"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="showCategory">إظهار التصنيف على صفحة المنتج</Label>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                  <Controller
                    name="showQuantity"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="showQuantity">إظهار الكمية المتبقية</Label>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                  <Controller
                    name="showRatings"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="showRatings">إظهار التقييمات</Label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 inline mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    editingProduct ? "تحديث المنتج" : "حفظ المنتج"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Label component
const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

// Custom Switch component
const Switch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    }`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);