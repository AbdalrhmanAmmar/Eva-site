"use client";

import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviews: number;
}

export default function RatingComponent({ rating, reviews }: RatingProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span>{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviews})</span>
    </div>
  );
}