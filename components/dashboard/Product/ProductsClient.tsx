"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, X, Upload, Image as ImageIcon, Plus, Star, Trash2, Edit, AlertCircle } from "lucide-react";
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
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  showQuantity: z.boolean(),
  showRatings: z.boolean(),
  showDiscount: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type ImagePreview = {
  url: string;
  isMain: boolean;
  file?: File;
};

export default function ProductsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [mainImageName, setMainImageName] = useState("");

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
      description: "",
      shortDescription: "",
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
      const newPreviews = acceptedFiles.slice(0, 5 - previews.length).map(file => ({
        url: URL.createObjectURL(file),
        isMain: false,
        file
      }));
      
      // إذا كانت هذه أول صورة يتم رفعها، اجعلها الصورة الرئيسية تلقائياً
      if (previews.length === 0 && newPreviews.length > 0) {
        newPreviews[0].isMain = true;
        setMainImageName(newPreviews[0].file?.name || "");
      }
      
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [previews.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
  });

  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    const removedPreview = newPreviews.splice(index, 1)[0];
    
    // إذا كانت الصورة المحذوفة هي الرئيسية، اجعل أول صورة متبقية هي الرئيسية
    if (removedPreview.isMain && newPreviews.length > 0) {
      newPreviews[0].isMain = true;
      setMainImageName(newPreviews[0].file?.name || newPreviews[0].url.split('/').pop() || "");
    }
    
    setPreviews(newPreviews);
  };

  const setAsMainImage = (index: number) => {
    const newPreviews = previews.map((preview, i) => ({
      ...preview,
      isMain: i === index
    }));
    
    setPreviews(newPreviews);
    setMainImageName(
      newPreviews[index].file?.name || 
      newPreviews[index].url.split('/').pop() || 
      ""
    );
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
        description: editingProduct?.description || "",
        shortDescription: editingProduct?.shortDescription || "",
        showQuantity: editingProduct?.showQuantity || false,
        showRatings: editingProduct?.showRatings || false,
      });
      
      if (editingProduct?.images) {
        const initialPreviews = editingProduct.images.map((img: any) => ({
          url: img.url,
          isMain: img.isMain,
        }));
        setPreviews(initialPreviews);
        
        const mainImg = editingProduct.images.find((img: any) => img.isMain);
        setMainImageName(mainImg?.url.split('/').pop() || "");
      } else {
        setPreviews([]);
        setMainImageName("");
      }
    }
  }, [isModalOpen, editingProduct, reset]);

  const handleOpenModal = (product: any = null) => {
    setEditingProduct(product);
     if (product?.images) {
    const productImages = product.images.map((img: any) => ({
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${img.url}`,
      isMain: img.isMain
    }));
    setPreviews(productImages);
    
    // تحديد الصورة الرئيسية
    const mainImg = product.images.find((img: any) => img.isMain);
    if (mainImg) {
      setMainImageName(mainImg.url);
    }
  } else {
    setPreviews([]);
    setMainImageName("");
  }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPreviews([]);
    setMainImageName("");
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
      formData.append("description", values.description || "");
      formData.append("shortDescription", values.shortDescription || "");
      formData.append("showQuantity", values.showQuantity.toString());
      formData.append("showRatings", values.showRatings.toString());
      
      // إضافة الصور الجديدة
      previews.forEach((preview) => {
        if (preview.file) {
          formData.append("images", preview.file);
        }
      });
      
      // إضافة الصور الموجودة مسبقاً
      if (editingProduct?.images) {
        editingProduct.images.forEach((image: any) => {
          formData.append("existingImages", image.url);
        });
      }
      
      // إضافة الصورة الرئيسية
      if (mainImageName) {
        formData.append("mainImageName", mainImageName);
      }

      let response;
      if (editingProduct && editingProduct._id) {
        response = await updateProduct(editingProduct._id, formData);
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
      console.log(error)
      toast.error(error.message || "حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!productId) {
      toast.error("معرف المنتج غير صالح");
      return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("تم حذف المنتج بنجاح");
        setProducts(products.filter(product => product._id !== productId));
      } else {
        toast.error(response.message || "حدث خطأ أثناء حذف المنتج");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حذف المنتج");
    }
  };

  // الحصول على الصورة الرئيسية للمنتج
  const getMainImage = (product: any) => {
    if (!product.images || product.images.length === 0) return null;
    const mainImg = product.images.find((img: any) => img.isMain);
    return mainImg || product.images[0];
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">إدارة المنتجات</h1>
        <Button 
          onClick={() => handleOpenModal()} 
          className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        >
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg shadow overflow-hidden border border-border/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/20">
            <thead className="bg-gradient-to-r from-card to-card/80">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">الصورة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">السعر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">التصنيف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">الكمية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Loader className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => {
                  const mainImage = getMainImage(product);
                  return (
                    <tr key={product._id} className="hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mainImage ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden relative">
                            <Image
                              width={40}
                              height={40}
                              src={`http://localhost:4000/uploads/${mainImage.url}`}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                              }}
                            />
                            {mainImage.isMain && (
                              <div className="absolute top-0 left-0 bg-primary/80 text-white p-1 rounded-br-md">
                                <Star className="h-3 w-3 fill-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-background/50 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          {product.tag && (
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit mt-1">
                              {product.tag}
                            </span>
                          )}
                        </div>
                        {product.showRatings && (
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-muted-foreground mr-1">{product.rating || 0}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {product.showDiscount && product.discountAmount ? (
                          <>
                            <span className="line-through text-muted-foreground mr-1">{product.priceBeforeDiscount?.toFixed(2)} ر.س</span>
                            <span className="text-primary font-medium">{product.priceAfterDiscount?.toFixed(2)} ر.س</span>
                          </>
                        ) : (
                          <span>{product.priceBeforeDiscount?.toFixed(2)} ر.س</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {product.showQuantity ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.quantity}
                          </span>
                        ) : (
                          <span>{product.quantity}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="text-primary hover:text-primary/90 p-1 rounded-md hover:bg-primary/10 transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id || '')}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100/10 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-muted-foreground">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border/20">
            <div className="flex justify-between items-center border-b border-border/20 p-4 sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold text-foreground">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-background/50 transition-colors"
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
                  className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-background/50"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-primary">قم بإسقاط الصور هنا...</p>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-primary" />
                      <p className="text-foreground">اسحب وأسقط الصور هنا، أو انقر للاختيار</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, WEBP (الحد الأقصى 5MB لكل صورة)
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Previews */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group h-24 rounded-md overflow-hidden border border-border/20">
                      <img
                        src={preview.url}
                        alt={`Preview ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsMainImage(index);
                        }}
                        className={`absolute top-1 left-1 p-1 rounded-full ${
                          preview.isMain 
                            ? 'bg-yellow-400 text-yellow-900' 
                            : 'bg-white/80 text-gray-600 hover:bg-yellow-100'
                        }`}
                        title={preview.isMain ? "الصورة الرئيسية" : "تحديد كصورة رئيسية"}
                      >
                        <Star className="h-3 w-3" fill={preview.isMain ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="حذف الصورة"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {preview.isMain && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs text-center py-0.5">
                          رئيسية
                        </div>
                      )}
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
                  className={`mt-1 bg-background/50 ${formState.errors.name ? "border-red-500" : "border-border/20"}`}
                />
                {formState.errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
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
                    className={`mt-1 bg-background/50 ${formState.errors.priceBeforeDiscount ? "border-red-500" : "border-border/20"}`}
                  />
                  {formState.errors.priceBeforeDiscount && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
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
                    className="mt-1 bg-background/50 border-border/20"
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
                    className="mt-1 bg-background/50 border-border/20"
                  />
                </div>
              </div>

              {/* Discount Toggle */}
              <div className="flex items-center gap-4 p-3 bg-background/50 rounded-md border border-border/20">
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
              <div className="bg-background/50 p-4 rounded-md border border-border/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">السعر النهائي:</span>
                  <div className="flex items-center gap-2">
                    {showDiscount && discountAmount && discountAmount > 0 ? (
                      <>
                        <span className="line-through text-muted-foreground">
                          {priceBeforeDiscount?.toFixed(2)} ر.س
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {(priceBeforeDiscount - (discountAmount || 0)).toFixed(2)} ر.س
                        </span>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {discountPercentage?.toFixed(0)}% خصم
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
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
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50 text-foreground ${
                        formState.errors.category ? "border-red-500" : "border-border/20 focus:border-primary/50"
                      }`}
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
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
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
                    className={`mt-1 bg-background/50 ${formState.errors.quantity ? "border-red-500" : "border-border/20"}`}
                  />
                  {formState.errors.quantity && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formState.errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Category */}
              <div className="bg-background/50 p-3 rounded-md border border-border/20">
                <label className="text-sm font-medium text-foreground mb-1">إضافة تصنيف جديد</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="أدخل اسم تصنيف جديد"
                    className="flex-1 bg-background/50 border-border/20"
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                    className="whitespace-nowrap bg-green-600 hover:bg-green-600/90"
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
                  className="mt-1 bg-background/50 border-border/20"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">الوصف الكامل</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="أدخل وصفاً كاملاً للمنتج"
                  rows={5}
                  className="w-full px-3 py-2 border border-border/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-background/50 text-foreground mt-1"
                />
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription">وصف مختصر</Label>
                <textarea
                  id="shortDescription"
                  {...register("shortDescription")}
                  placeholder="أدخل وصفاً مختصراً للمنتج"
                  rows={3}
                  className="w-full px-3 py-2 border border-border/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-background/50 text-foreground mt-1"
                />
              </div>

              {/* Toggles Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-background/50 rounded-md border border-border/20">
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

                <div className="flex items-center gap-4 p-3 bg-background/50 rounded-md border border-border/20">
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
             <div className="flex justify-end gap-4 pt-6 border-t border-border/20">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  variant="outline"
                  className="border-border/20 hover:bg-background/50"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || previews.length === 0}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
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
  <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground mb-1">
    {children}
  </label>
);

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
      checked ? 'bg-primary' : 'bg-muted'
    }`}
    onClick={() => onChange(!checked)}
    aria-pressed={checked}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);