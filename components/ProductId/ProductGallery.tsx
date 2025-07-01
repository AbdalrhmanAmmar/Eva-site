"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // إذا كانت المصفوفة فارغة، نعرض صورة بديلة
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <Image
          src={`http://localhost:4000/uploads/${images[currentImageIndex]}`}
          fill
          alt={name}
          className="object-contain"
          priority={currentImageIndex === 0} // الأولوية للصورة الأولى فقط
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            console.error("Failed to load image:", e);
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        
        {/* Navigation Arrows - تظهر فقط إذا كان هناك أكثر من صورة */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - تظهر فقط إذا كان هناك أكثر من صورة */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square bg-white rounded-md overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={`http://localhost:4000/uploads/${image}`}
                alt={`${name} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}