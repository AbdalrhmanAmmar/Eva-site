"use client";

import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export default function RatingComponent({ 
  rating, 
  reviews = 0, 
  size = "md", 
  className = "",
  showText = true
}: RatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }`}
        />
      ))}
      {showText && (
        <>
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          {reviews > 0 && (
            <span className="text-sm text-gray-400">({reviews})</span>
          )}
        </>
      )}
    </div>
  );
}