import { productAPI } from "@/lib/api/auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Heart, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import ProductGallery from './../../../components/ProductId/ProductGallery';
import RatingComponent from './../../../components/store/RatingComponent';
import Breadcrumb from "@/components/ProductId/Breadcrumb";
import AddToCartButton from "@/components/store/AddToCartButton";
import ProductTabs from "@/components/ProductId/ProductTabs";


interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { success, product } = await productAPI.getProductById(params.id);
    
    if (!success || !product) {
      return notFound();
    }

    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { name: "الرئيسية", href: "/" },
              { name: "المتجر", href: "/store" },
              { name: product.category, href: `/store?category=${product.category}` },
              { name: product.name, href: `#` },
            ]}
          />

          <div className="mt-6 lg:mt-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Images */}
              <div className="lg:w-1/2">
                <ProductGallery images={product.images} name={product.name} />
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2">
                <div className="sticky top-4">
                  <div className="space-y-4">
                    {/* Title and Rating */}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                      {product.showReviews && product.rating && (
                        <div className="mt-2">
                          <RatingComponent 
                            rating={product.rating} 
                            reviews={product.reviews || 0} 
                            size="lg"
                          />
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-primary">
                        {product.priceAfterDiscount?.toLocaleString()} ر.س
                      </span>
                      {product.priceBeforeDiscount && (
                        <span className="text-xl text-gray-500 line-through">
                          {product.priceBeforeDiscount?.toLocaleString()} ر.س
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                          وفر {product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && (
                      <p className="text-gray-700 text-lg">
                        {product.shortDescription}
                      </p>
                    )}

                    {/* Tags */}
                    {product.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag: string) => (
                          <span 
                            key={tag}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add to Cart */}
                    <div className="pt-4">
                      <AddToCartButton 
                        productId={product.id}
                        productName={product.name}
                        disabled={product.quantity <= 0}
                        className="w-full py-3 text-lg"
                      />
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">التصنيف:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">الحالة:</span>
                        <span className={`font-medium ${
                          product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.quantity > 0 ? 'متوفر' : 'نفد من المخزون'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12">
              <ProductTabs 
                description={product.description}
                specifications={product.specifications || []}
                reviews={product.reviews || []}
              />
            </div>

            {/* Related Products */}
            {product.relatedProducts?.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">منتجات ذات صلة</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Render related products here */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}