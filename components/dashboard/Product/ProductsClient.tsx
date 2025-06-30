"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, X, Upload, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { productAPI } from "@/lib/api/auth";

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
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSave: (data: FormData) => Promise<void>;
}

export default function ProductForm({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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
      ...product,
    },
  });

  const { watch, setValue, control, handleSubmit, reset } = form;
  const priceBeforeDiscount = watch("priceBeforeDiscount");
  const discountAmount = watch("discountAmount");
  const discountPercentage = watch("discountPercentage");
  const showDiscount = watch("showDiscount");

  // Handle image uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setImages((prev) => [...prev, ...acceptedFiles]);

      // Create previews
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 5,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
      setValue("discountPercentage", calculatedPercentage, {
        shouldValidate: true,
      });
    }
  }, [priceBeforeDiscount, discountAmount, setValue]);

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      reset({
        name: product?.name || "",
        priceBeforeDiscount: product?.priceBeforeDiscount || 0,
        discountAmount: product?.discountAmount || 0,
        discountPercentage: product?.discountPercentage || 0,
        showDiscount: product?.showDiscount || false,
        quantity: product?.quantity || 0,
        category: product?.category || "",
        tag: product?.tag || "",
        shortDescription: product?.shortDescription || "",
        showDescription: product?.showDescription || false,
        showCategory: product?.showCategory || false,
        showQuantity: product?.showQuantity || false,
      });

      if (product?.images) {
        setPreviews(product.images);
      } else {
        setPreviews([]);
      }
      setImages([]);
    }
  }, [isOpen, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append(
        "priceBeforeDiscount",
        values.priceBeforeDiscount.toString()
      );
      formData.append(
        "priceAfterDiscount",
        (values.priceBeforeDiscount - (values.discountAmount || 0)).toString()
      );
      formData.append(
        "discountAmount",
        values.discountAmount?.toString() || "0"
      );
      formData.append(
        "discountPercentage",
        values.discountPercentage?.toString() || "0"
      );
      formData.append("showDiscount", values.showDiscount.toString());
      formData.append("quantity", values.quantity.toString());
      formData.append("category", values.category);
      formData.append("tag", values.tag || "");
      formData.append("shortDescription", values.shortDescription || "");
      formData.append("showDescription", values.showDescription.toString());
      formData.append("showCategory", values.showCategory.toString());
      formData.append("showQuantity", values.showQuantity.toString());

      // Append images
      images.forEach((file) => {
        formData.append("images", file);
      });

      await onSave(formData);
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <Label>صور المنتج (الحد الأقصى 5 صور)</Label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>قم بإسقاط الصور هنا...</p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p>اسحب وأسقط الصور هنا، أو انقر للاختيار</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, WEBP (الحد الأقصى 5MB لكل صورة)
                  </p>
                </div>
              )}
            </div>

            {/* Image Previews */}
            {(previews.length > 0 || images.length > 0) && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="name">اسم المنتج *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="أدخل اسم المنتج"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
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
                {...form.register("priceBeforeDiscount", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {form.formState.errors.priceBeforeDiscount && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.priceBeforeDiscount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="discountAmount">قيمة الخصم</Label>
              <Input
                id="discountAmount"
                type="number"
                {...form.register("discountAmount", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="discountPercentage">نسبة الخصم %</Label>
              <Input
                id="discountPercentage"
                type="number"
                {...form.register("discountPercentage", {
                  valueAsNumber: true,
                })}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Discount Toggle */}
          <div className="flex items-center gap-4">
            <Controller
              name="showDiscount"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="showDiscount"
                />
              )}
            />
            <Label htmlFor="showDiscount">إظهار نسبة الخصم على المنتج</Label>
          </div>

          {/* Final Price Display */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">السعر النهائي:</span>
              <div className="flex items-center gap-2">
                {showDiscount && discountAmount && discountAmount > 0 ? (
                  <>
                    <span className="line-through text-gray-500">
                      {priceBeforeDiscount?.toFixed(2)} ر.س
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {(priceBeforeDiscount - (discountAmount || 0)).toFixed(2)}{" "}
                      ر.س
                    </span>
                    {discountPercentage && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        {discountPercentage?.toFixed(0)}% خصم
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-lg font-bold">
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
              <Input
                id="category"
                {...form.register("category")}
                placeholder="أدخل تصنيف المنتج"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">الكمية *</Label>
              <Input
                id="quantity"
                type="number"
                {...form.register("quantity", {
                  valueAsNumber: true,
                })}
                placeholder="0"
                min="0"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Tag Input */}
          <div>
            <Label htmlFor="tag">العلامة (Tag)</Label>
            <Input
              id="tag"
              {...form.register("tag")}
              placeholder="أدخل علامة للمنتج (اختياري)"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="shortDescription">وصف مختصر</Label>
            <Textarea
              id="shortDescription"
              {...form.register("shortDescription")}
              placeholder="أدخل وصفاً مختصراً للمنتج"
              rows={3}
            />
          </div>

          {/* Toggles Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Controller
                name="showDescription"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="showDescription"
                  />
                )}
              />
              <Label htmlFor="showDescription">
                إظهار الوصف على صفحة المنتج
              </Label>
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name="showCategory"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="showCategory"
                  />
                )}
              />
              <Label htmlFor="showCategory">
                إظهار التصنيف على صفحة المنتج
              </Label>
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name="showQuantity"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="showQuantity"
                  />
                )}
              />
              <Label htmlFor="showQuantity">إظهار الكمية المتبقية</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ المنتج"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
