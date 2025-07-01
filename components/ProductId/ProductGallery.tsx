"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
  url: string;
  isMain: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
  className?: string;
}

export default function ProductGallery({ images, name, className = "" }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  // تحديد الصورة الرئيسية عند التحميل الأولي
  useEffect(() => {
    if (images && images.length > 0) {
      const mainIndex = images.findIndex(img => img.isMain);
      if (mainIndex !== -1) {
        setCurrentImageIndex(mainIndex);
      }
    }
  }, [images]);

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '/placeholder.jpg';
    
    // إذا كان المسار يحتوي على اسم الملف فقط
    if (!imagePath.includes('http') && !imagePath.includes('blob:')) {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  const nextImage = () => {
    if (!images || images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setMainImageLoaded(false);
  };

  const prevImage = () => {
    if (!images || images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setMainImageLoaded(false);
  };

  // إذا كانت المصفوفة فارغة، نعرض صورة بديلة
  if (!images || images.length === 0) {
    return (
      <div className={`relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">لا توجد صور متاحة</span>
      </div>
    );
  }

  const currentImage = images[currentImageIndex] || images[0];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* الصورة الرئيسية */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        {!mainImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">جاري تحميل الصورة...</span>
          </div>
        )}
        
        <Image
          src={getImageUrl(currentImage.url)}
          fill
          alt={name}
          className={`object-contain transition-opacity duration-300 ${
            mainImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setMainImageLoaded(true)}
          onError={(e) => {
            console.error('فشل تحميل الصورة:', currentImage.url);
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
            setMainImageLoaded(true);
          }}
        />
        
        {/* أسهم التنقل - تظهر فقط إذا كان هناك أكثر من صورة */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
              aria-label="الصورة السابقة"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
              aria-label="الصورة التالية"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* الصور المصغرة - تظهر فقط إذا كان هناك أكثر من صورة */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                setMainImageLoaded(false);
              }}
              className={`relative aspect-square bg-white rounded-md overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`عرض الصورة ${index + 1}`}
            >
              <Image
                src={getImageUrl(image.url)}
                alt={`${name} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}