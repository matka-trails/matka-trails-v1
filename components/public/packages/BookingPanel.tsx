"use client";

import { formatPrice } from "@/lib/utils";
import { PublicPackage } from "@/lib/api";
import { FileText } from "lucide-react";

interface BookingPanelProps {
  pkg: PublicPackage;
}

export default function BookingPanel({ pkg }: BookingPanelProps) {
  const originalPrice = pkg.priceOriginal;
  const discountedPrice = pkg.priceDiscounted;
  const price = discountedPrice || originalPrice;
  const discountAmount = discountedPrice ? originalPrice - discountedPrice : 0;

  return (
    <div className="bg-[#111111] text-white rounded-2xl overflow-hidden shadow-float border border-white/5 p-6 space-y-5">
      {/* Price Header */}
      <div>
        <span className="text-[10px] text-white/40 block font-bold uppercase tracking-widest leading-none">
          Starting from
        </span>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-sans font-black italic text-4xl text-primary leading-none">
            {formatPrice(price)}
          </span>
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">
            / person
          </span>
        </div>
        
        {/* Discount Tag */}
        {discountAmount > 0 && (
          <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md mt-2.5">
            <span>Save {formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* PDF Itinerary Action Button */}
      <div>
        {pkg.pdfUrl ? (
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/packages/${pkg.id}/download-pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide py-4 rounded-xl shadow-orange transition-all duration-300 animate-pulse"
          >
            <FileText className="w-4.5 h-4.5 shrink-0" />
            <span>Download Itinerary PDF</span>
          </a>
        ) : (
          <button className="w-full border border-white/10 text-white/30 font-bold text-xs uppercase tracking-wide py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
            <FileText className="w-4.5 h-4.5 shrink-0" />
            <span>Itinerary PDF Coming Soon</span>
          </button>
        )}
      </div>
    </div>
  );
}
