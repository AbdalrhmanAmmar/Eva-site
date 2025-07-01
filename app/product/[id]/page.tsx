"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
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
  rating?: number;
  reviews?: any[];
  showReviews?: boolean;
  images: string[];
  quantity: number;
  discount?: number;
  specifications?: any[];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);

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
          priceBeforeDiscount: data.product.priceBeforeDiscount || data.product.priceAfterDiscount
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
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { name: "الرئيسية", href: "/", className: "text-blue-400 hover:text-blue-300" },
            { name: "المتجر", href: "/store", className: "text-blue-400 hover:text-blue-300" },
            { name: product.category, href: `/store?category=${product.category}`, className: "text-blue-400 hover:text-blue-300" },
            { name: product.name, href: `#`, className: "text-gray-400" },
          ]}
          className="text-sm mb-6"
        />

        <div className="mt-6 lg:mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Gallery */}
            <div className="lg:w-1/2">
              <ProductGallery 
                images={product.images} 
                name={product.name}
                className="rounded-lg border border-gray-700 shadow-lg"
                onImageChange={(index) => setCurrentImageIndex(index)}
              />
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2">
              <div className="sticky top-4">
                <div className="space-y-6">
                  {/* Title and Rating */}
                  <div>
                    <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                    {product.showReviews && (
                      <div className="mt-3 flex items-center gap-3">
                        <RatingComponent 
                          rating={product.rating || 0} 
                          reviews={product.reviews?.length || 0} 
                          size="lg"
                          className="text-yellow-400"
                        />
                        <span className="text-gray-400 text-sm">
                          ({product.reviews?.length || 0} تقييمات)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-400">
                      {product.priceAfterDiscount.toLocaleString()} ر.س
                    </span>
                    {product.priceBeforeDiscount && product.priceBeforeDiscount > product.priceAfterDiscount && (
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

                  {/* Short Description */}
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Tags */}
                  {product.tag && (
                    <div className="flex flex-wrap gap-2">
                      <span 
                        className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {product.tag}
                      </span>
                    </div>
                  )}

                  {/* Add to Cart */}
                  <div className="pt-4">
                    <AddToCartButton 
                      productId={product.id}
                      productName={product.name}
                      price={product.priceAfterDiscount}
                      image={product.images[0]}
                      disabled={product.quantity <= 0}
                      className="w-full py-3 text-lg bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      أضف إلى السلة
                    </AddToCartButton>
                  </div>

                  {/* Quick Info */}
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

                  {/* Wishlist Button */}
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

          {/* Product Details Tabs */}
          <div className="mt-12 bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <ProductTabs 
              description={product.description}
              specifications={product.specifications}
              reviews={product.reviews}
              className="text-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}