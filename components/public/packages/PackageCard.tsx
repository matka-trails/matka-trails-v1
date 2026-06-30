"use client";

import Image from "next/image";
import { Star, MapPin, Compass, ArrowRight } from "lucide-react";
import { PublicPackage } from "@/lib/api";
import { cn, formatPrice, getOptimizedImageUrl } from "@/lib/utils";

interface PackageCardProps {
  pkg: PublicPackage;
  className?: string;
}

export default function PackageCard({ pkg, className }: PackageCardProps) {
  // Use first 3 inclusions for display
  const displayInclusions = pkg.inclusions ? pkg.inclusions.slice(0, 3) : [];

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-gray-border flex flex-col h-[460px] hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/20 transition-all duration-300",
        className
      )}
    >
      {/* Cover Image & Badges */}
      <div className="h-[240px] relative overflow-hidden bg-gray-bg shrink-0">
        {pkg.coverImage ? (
          <Image
            src={getOptimizedImageUrl(pkg.coverImage, 600)}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <Compass className="w-10 h-10 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category / Group Type Badge */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-pill shadow-orange">
            {pkg.groupType}
          </span>
        </div>

        {/* Price & Duration Overlays */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 text-white">
          <div className="flex items-center gap-1 text-[11px] font-bold bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate max-w-[120px]">{pkg.destination?.name}</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-white/50 block font-bold uppercase tracking-widest leading-none">
              FROM
            </span>
            <span className="font-sans font-black italic text-xl text-primary leading-none">
              {formatPrice(pkg.priceDiscounted || pkg.priceOriginal)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Header row: duration & rating */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-light">
            <span className="flex items-center gap-1.5 bg-gray-bg px-2.5 py-1 rounded-md text-foreground">
              <Compass className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
            </span>
            
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
              <span className="font-bold text-foreground">4.8</span>
              <span className="text-[10px] text-gray-light font-medium">(24)</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans font-extrabold text-base text-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {pkg.title}
          </h3>

          {/* Short Summary */}
          {pkg.summary && (
            <p className="text-xs text-gray-mid line-clamp-2 leading-relaxed">
              {pkg.summary}
            </p>
          )}
        </div>

        {/* Inclusions & CTA */}
        <div className="pt-4 border-t border-gray-border flex items-center justify-between">
          {/* List of 3 small inclusions */}
          <div className="flex gap-2">
            {displayInclusions.map((inc, i) => (
              <span
                key={i}
                title={inc}
                className="text-[9px] font-bold text-gray-dark uppercase tracking-wider bg-gray-bg px-2 py-1 rounded border border-gray-border max-w-[70px] truncate"
              >
                {inc}
              </span>
            ))}
          </div>

          {/* Details CTA — no Link here to prevent nested <a> when card is wrapped in a link */}
          <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-primary group-hover:text-primary-dark transition-colors">
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}
