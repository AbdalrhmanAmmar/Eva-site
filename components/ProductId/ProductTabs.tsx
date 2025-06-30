"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string;
  specifications: { name: string; value: string }[];
  reviews: any[];
}

export default function ProductTabs({ 
  description, 
  specifications, 
  reviews 
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "description"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            الوصف
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "specifications"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            المواصفات
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            التقييمات ({reviews.length})
          </button>
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-4">
            {specifications.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {specifications.map((spec, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {spec.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">لا توجد مواصفات متاحة</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{review.userName}</h4>
                      <RatingComponent 
                        rating={review.rating} 
                        size="sm"
                        showText={false}
                      />
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">لا توجد تقييمات بعد</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}