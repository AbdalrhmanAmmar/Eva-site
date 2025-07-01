"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight, ShoppingCart, Eye, Package, AlertCircle } from "lucide-react";
import { notFound } from 'next/navigation';
import Breadcrumb from "@/components/ProductId/Breadcrumb";
import AddToCartButton from "@/components/store/AddToCartButton";
import ProductTabs from "@/components/ProductId/ProductTabs";
import RatingComponent from "@/components/store/RatingComponent";
import ProductGallery from "@/components/ProductId/ProductGallery";

interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  shortDescription?: string;
  priceAfterDiscount: number;
  priceBeforeDiscount?: number;
  category: string;
  tag?: string;
    averageRating?: number;
    numberOfReviews?: number;
  showReviews?: boolean;
  images: string[];
  quantity: number;
  maxQuantity?: number;
  discount?: number;
  showDiscount?: boolean;
  specifications?: any[];
  showQuantity?: boolean;
  showTag?: boolean;
  showShortDescription?: boolean;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // إعدادات العرض - يمكن جلبها من API أو context
  const displaySettings = {
    showQuantity: true,
    showDiscount: true,
    showTag: true,
    showShortDescription: true,
    showReviews: true,
    showRating: true
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) return notFound();
          throw new Error('Failed to fetch product');
        }

        const data = await res.json();
        if (!data.success || !data.product) {
          return notFound();
        }

        const productData = {
          ...data.product,
          id: data.product._id ? data.product._id.toString() : data.product.id,
          specifications: data.product.specifications || [],
          reviews: data.product.reviews || [],
          description: data.product.description || 'لا يوجد وصف تفصيلي',
          shortDescription: data.product.shortDescription || 'لا يوجد وصف مختصر',
          discount: data.product.discount || 0,
          rating: data.product.rating || 0,
          tag: data.product.tag || '',
          priceBeforeDiscount: data.product.priceBeforeDiscount || data.product.priceAfterDiscount,
          maxQuantity: data.product.maxQuantity || 100,
          showQuantity: data.product.showQuantity !== undefined ? data.product.showQuantity : true,
          showDiscount: data.product.showDiscount !== undefined ? data.product.showDiscount : true,
          showTag: data.product.showTag !== undefined ? data.product.showTag : true,
          averageRating: data.product.averageRating || 0,
        numberOfReviews: data.product.numberOfReviews || 0,
          showShortDescription: data.product.showShortDescription !== undefined ? data.product.showShortDescription : true,
          showReviews: data.product.showReviews !== undefined ? data.product.showReviews : true,
          showRating: data.product.showRating !== undefined ? data.product.showRating : true
        };

        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-gray-800 rounded w-1/4"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2 h-96 bg-gray-800 rounded-lg"></div>
              <div className="lg:w-1/2 space-y-6">
                <div className="h-10 bg-gray-800 rounded w-3/4"></div>
                <div className="h-6 bg-gray-800 rounded w-1/2"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                <div className="h-12 bg-gray-800 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb 
          items={[
            { name: "الرئيسية", href: "/" },
            { name: "المتجر", href: "/store" },
            { name: product.category, href: `/store?category=${product.category}` },
            { name: product.name, href: `#` },
          ]}
          className="text-sm mb-6"
        />

        <div className="mt-6 lg:mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* معرض المنتج */}
            <div className="lg:w-1/2">
              <ProductGallery 
                images={product.images} 
                name={product.name}
                className="rounded-lg border border-gray-700 shadow-lg"
              />
            </div>

            {/* معلومات المنتج */}
            <div className="lg:w-1/2">
              <div className="sticky top-4">
                <div className="space-y-6">
                  {/* العنوان والتقييم */}
                  <div>
                    <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                    
                {product.showReviews && (
  <div className="mt-3 flex items-center gap-3">
    <RatingComponent 
      rating={product.averageRating || 0} 
      reviews={product.numberOfReviews! || 0} 
      size="lg"
      className="text-yellow-400"
    />
    <span className="text-gray-400 text-sm">
      ({product.numberOfReviews || 0} تقييمات)
    </span>
  </div>
)}
                  </div>

                  {/* السعر والخصم */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-400">
                      {product.priceAfterDiscount.toLocaleString()} ر.س
                    </span>
                    
                    {product.showDiscount && product.priceBeforeDiscount && product.priceBeforeDiscount > product.priceAfterDiscount && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {product.priceBeforeDiscount.toLocaleString()} ر.س
                        </span>
                        {product.discount && product.discount > 0 && (
                          <span className="bg-red-900 text-red-200 px-2 py-1 rounded-md text-sm font-medium">
                            وفر {product.discount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* الوصف المختصر */}
                  {product.showShortDescription && (
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* العلامة */}
                  {product.showTag && product.tag && (
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                        {product.tag}
                      </span>
                    </div>
                  )}

                  {/* الكمية المتبقية */}
                  {product.showQuantity && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          الكمية المتاحة
                        </span>
                        <span className={`font-medium ${
                          product.quantity <= 5 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {product.quantity} وحدة
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            product.quantity <= 5 ? 'bg-red-400' : 
                            product.quantity <= 15 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ 
                            width: `${(product.quantity / (product.maxQuantity || 100)) * 100}%`,
                            transition: 'width 0.5s ease-in-out'
                          }}
                        />
                      </div>
                      
                      {product.quantity <= 5 && (
                        <div className="text-xs text-red-400 mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          الكمية محدودة!
                        </div>
                      )}
                    </div>
                  )}

                  {/* إضافة إلى السلة */}
                  <div className="pt-4">
                    <AddToCartButton 
                      productId={product.id}
                      productName={product.name}
                      price={product.priceAfterDiscount}
                      image={product.images[0]}
                      disabled={product.quantity <= 0}
                      className={`w-full py-3 text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        product.quantity <= 0 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-blue-700 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.quantity <= 0 ? 'نفذ من المخزون' : 'أضف إلى السلة'}
                    </AddToCartButton>
                  </div>

                  {/* معلومات سريعة */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">التصنيف:</span>
                      <span className="font-medium text-white">{product.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">الحالة:</span>
                      <span className={`font-medium ${
                        product.quantity > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {product.quantity > 0 ? 'متوفر' : 'نفد من المخزون'}
                      </span>
                    </div>
                  </div>

                  {/* المفضلة */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      wishlist.includes(product.id)
                        ? 'bg-red-900 text-red-100'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        wishlist.includes(product.id) ? 'fill-current' : ''
                      }`} 
                    />
                    {wishlist.includes(product.id) ? 'في قائمة المفضلة' : 'إضافة إلى المفضلة'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* علامات التبويب */}
          <div className="mt-12 bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
          <ProductTabs 
  description={product.description}
  specifications={product.specifications || []}
  productId={product.id}
  averageRating={product.showReviews ? product.averageRating : undefined}
  numberOfReviews={product.showReviews ? product.numberOfReviews : undefined}
  showReviews={product.showReviews}
  className="text-gray-300"
/>
          </div>
        </div>
      </div>
    </div>
  );
}