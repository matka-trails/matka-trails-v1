"use client";

import Image from "next/image";
import { Star, MapPin, Compass, Calendar, Clock } from "lucide-react";
import { PublicPackage } from "@/lib/api";
import { cn, formatPrice, getOptimizedImageUrl } from "@/lib/utils";

interface PackageCardProps {
  pkg: PublicPackage;
  className?: string;
}

export default function PackageCard({ pkg, className }: PackageCardProps) {
  const originalPrice = pkg.priceOriginal;
  const discountedPrice = pkg.priceDiscounted;
  const displayPrice = discountedPrice || originalPrice;

  // Use first 3 inclusions for key highlights
  const displayInclusions = pkg.inclusions ? pkg.inclusions.slice(0, 3) : [];
  const extraInclusionsCount = pkg.inclusions && pkg.inclusions.length > 3 ? pkg.inclusions.length - 3 : 0;

  // Format departure date
  const departureDateStr = pkg.startDate
    ? new Date(pkg.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "Rolling Weekends";

  return (
    <div
      className={cn(
        "group relative rounded-3xl overflow-hidden border border-white/10 flex flex-col h-[320px] md:h-[420px] shadow-card hover:shadow-float hover:-translate-y-1.5 transition-all duration-300 select-none",
        className
      )}
    >
      {/* ── 1. Full Bleed Cover Image ── */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        {pkg.coverImage ? (
          <Image
            src={getOptimizedImageUrl(pkg.coverImage, 600)}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Compass className="w-12 h-12 text-white/10" />
          </div>
        )}
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10 group-hover:via-black/50 transition-colors duration-300" />
      </div>

      {/* ── 2. Top Header Badges Row ── */}
      <div className="absolute top-2.5 left-2.5 right-2.5 md:top-4 md:left-4 md:right-4 z-20 flex justify-between items-start gap-1">
        {/* Group Type / Category (Left) */}
        <span className="bg-primary/95 text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-orange">
          {pkg.groupType}
        </span>

        {/* Pricing Pill (Right) - Styled exactly like the yellow reference badges */}
        <div className="bg-[#FFE500] text-black text-[7px] md:text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-md flex items-center gap-1">
          {originalPrice && discountedPrice && (
            <span className="line-through text-black/50 font-bold">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span>{formatPrice(displayPrice)}/- onwards</span>
        </div>
      </div>

      {/* ── 3. Overlay Contents at the Bottom ── */}
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 flex flex-col gap-2">
        
        {/* Highlights / Key Stops Bar */}
        {displayInclusions.length > 0 && (
          <div className="bg-black/60 backdrop-blur-xs border border-white/10 rounded-lg px-2.5 py-1.5 text-[8px] md:text-[10px] flex items-center justify-between text-white/90 font-bold leading-none tracking-wide shrink-0">
            <span className="truncate max-w-[70%]">
              {displayInclusions.join(" • ")}
            </span>
            {extraInclusionsCount > 0 && (
              <span className="text-[#FFE500] font-extrabold shrink-0">
                +{extraInclusionsCount} More
              </span>
            )}
          </div>
        )}

        {/* Package Title */}
        <h3 className="font-sans font-black text-white text-xs md:text-lg leading-tight uppercase tracking-tight line-clamp-2 drop-shadow-md">
          {pkg.title}
        </h3>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 border-t border-white/10 text-[8px] md:text-[11px] font-bold text-white/80 leading-none">
          {/* Duration info */}
          <div className="flex items-center gap-1 truncate">
            <Clock className="w-3 h-3 text-[#FFE500] shrink-0" />
            <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
          </div>

          {/* Territory location */}
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-[#FFE500] shrink-0" />
            <span>{pkg.destination?.name || "Territory"}</span>
          </div>

          {/* Departure Date batch */}
          <div className="flex items-center gap-1 col-span-2 truncate text-white">
            <Calendar className="w-3 h-3 text-[#38bdf8] shrink-0" />
            <span className="truncate">
              {departureDateStr} <span className="text-[#38bdf8] ml-1 font-extrabold">+3 batches</span>
            </span>
          </div>
        </div>

        {/* Rating overlay line (Only on desktop screens for cleaner spacing) */}
        <div className="hidden md:flex items-center gap-1 text-[9px] text-white/50 font-bold uppercase mt-0.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary shrink-0" />
            ))}
          </div>
          <span>4.8 (24 reviews)</span>
        </div>

      </div>
    </div>
  );
}
