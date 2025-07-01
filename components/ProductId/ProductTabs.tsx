"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RatingComponent from "../store/RatingComponent";
import { reviewAPI } from "@/lib/api/auth";
import { Star } from "lucide-react";

interface ProductTabsProps {
  description: string;
  specifications: { name: string; value: string }[];
  className?: string;
  productId: string;
  averageRating?: number;
  numberOfReviews?: number;
  showReviews?: boolean;
}

export default function ProductTabs({
  description,
  specifications = [],
  className = "",
  productId,
  averageRating = 0,
  numberOfReviews = 0,
  showReviews = true,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">(
    "description"
  );
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const handleReviewSubmit = async () => {
    if (!userRating) return alert("يرجى اختيار تقييم من 1 إلى 5 نجوم");
    setSubmitLoading(true);
    try {
      await reviewAPI.addReview({
        productId,
        rating: userRating,
        comment: userComment,
      });
      setSubmitSuccess(true);
      setUserRating(0);
      setUserComment("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "فشل إرسال التقييم");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden ${className}`}>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === "description"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            الوصف
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === "specifications"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            المواصفات
          </button>
          
          {showReviews && (
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              التقييمات ({numberOfReviews})
            </button>
          )}
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-300 whitespace-pre-line">
              {description || "لا يوجد وصف متاح"}
            </p>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div className="space-y-4">
            {specifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="border-b border-gray-700 pb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">{spec.name}</span>
                      <span className="text-gray-300">{spec.value || "غير محدد"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">لا توجد مواصفات متاحة</p>
            )}
          </div>
        )}

        {/* Reviews Tab - يظهر فقط إذا كان showReviews = true */}
        {showReviews && activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <RatingComponent 
                    rating={averageRating || 0} 
                    size="lg"
                    className="text-yellow-400"
                    showText={false}
                  />
                </div>
                <div className="text-2xl font-bold text-white">
                  {numberOfReviews} تقييمات
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="text-center py-8 bg-gray-700 rounded-lg">
              <p className="text-gray-400">لا توجد تقييمات بعد</p>
              <p className="text-gray-500 text-sm mt-2">كن أول من يقيم هذا المنتج</p>
            </div>

            {/* Add Review Form */}
            <div className="mt-8 bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">أضف تقييمك</h3>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-300">تقييمك:</span>
                <div className="flex-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-2xl ${star <= userRating ? "text-yellow-400" : "text-gray-500"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {userRating > 0 ? `${userRating} من 5` : "اختر تقييمًا"}
                </span>
              </div>

              <textarea
                placeholder="شاركنا تجربتك مع هذا المنتج..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleReviewSubmit}
                disabled={submitLoading}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "جارٍ الإرسال..." : "إرسال التقييم"}
              </button>

              {submitSuccess && (
                <div className="mt-3 p-2 bg-green-900/30 text-green-400 rounded text-center">
                  شكرًا لك! تم إرسال تقييمك بنجاح
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}