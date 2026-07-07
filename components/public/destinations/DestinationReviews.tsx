"use client";

import { Star } from "lucide-react";

interface Review {
  name: string;
  location?: string;
  rating: number;
  text: string;
  avatar?: string | null;
  date?: string;
}

export default function DestinationReviews({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {reviews.map((review, i) => (
        <div
          key={i}
          className="bg-white border border-gray-border rounded-2xl p-5 shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3"
        >
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s < review.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Review text */}
          <p className="text-sm text-gray-mid font-medium leading-relaxed flex-1">
            &ldquo;{review.text}&rdquo;
          </p>

          {/* Reviewer info */}
          <div className="flex items-center gap-2.5 pt-1 border-t border-gray-border">
            {/* Avatar fallback — initials */}
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-primary uppercase">
                {review.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-black">{review.name}</p>
              <p className="text-[10px] text-gray-light font-semibold">
                {review.location}
                {review.date ? ` · ${review.date}` : ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
