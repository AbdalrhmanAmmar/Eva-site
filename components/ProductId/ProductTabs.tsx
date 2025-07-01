"use client";

import { useState } from "react";
import RatingComponent from "../store/RatingComponent";

interface ProductTabsProps {
  description: string;
  specifications: { name: string; value: string }[];
  reviews: any[];
  className?: string;
}

export default function ProductTabs({ 
  description, 
  specifications = [], 
  reviews = [],
  className = ""
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");

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
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === "reviews"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            التقييمات ({reviews.length})
          </button>
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-300 whitespace-pre-line">{description || "لا يوجد وصف متاح"}</p>
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

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                      {review.userName?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-200">{review.userName || "مستخدم مجهول"}</h4>
                        <span className="text-sm text-gray-500">
                          {review.date ? new Date(review.date).toLocaleDateString('ar-SA') : "تاريخ غير معروف"}
                        </span>
                      </div>
                      <RatingComponent 
                        rating={review.rating || 0} 
                        size="sm"
                        className="mt-1"
                        showText={false}
                      />
                    </div>
                  </div>
                  <p className="text-gray-300 pl-14">{review.comment || "لا يوجد تعليق"}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">لا توجد تقييمات بعد</p>
                <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
                  كن أول من يقيم هذا المنتج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}