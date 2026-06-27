"use client";

import { Star, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string | null;
  reviewImages: string[];
  createdAt: string | Date;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Generate user initials
  const initials = review.customerName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-3.5 shadow-card hover:border-primary/20 transition-all duration-200">
      {/* Review Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar Circle */}
          <div className="w-10 h-10 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center font-sans font-extrabold text-sm text-primary">
            {initials || <User className="w-4 h-4" />}
          </div>
          <div>
            <h5 className="font-sans font-bold text-sm text-black">
              {review.customerName}
            </h5>
            <span className="text-[10px] text-gray-light font-bold">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating ? "fill-primary text-primary" : "text-gray-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Text */}
      {review.reviewText && (
        <p className="text-xs md:text-sm text-gray-dark leading-relaxed font-semibold">
          "{review.reviewText}"
        </p>
      )}

      {/* Customer uploaded images (if any) */}
      {review.reviewImages && review.reviewImages.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto pt-1">
          {review.reviewImages.map((img, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-border shrink-0 bg-gray-bg"
            >
              <img
                src={img}
                alt="Review image"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
