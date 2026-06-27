"use client";

import { useUiStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";
import { PublicPackage } from "@/lib/api";
import { Calendar, Users, FileText, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingPanelProps {
  pkg: PublicPackage;
}

export default function BookingPanel({ pkg }: BookingPanelProps) {
  const { openBookingModal } = useUiStore();

  const originalPrice = pkg.priceOriginal;
  const discountedPrice = pkg.priceDiscounted;
  const price = discountedPrice || originalPrice;
  const discountAmount = discountedPrice ? originalPrice - discountedPrice : 0;

  return (
    <div className="bg-[#111111] text-white rounded-2xl overflow-hidden shadow-float border border-white/5 p-6 space-y-6 sticky top-24">
      {/* Price Header */}
      <div>
        <span className="text-[10px] text-white/40 block font-bold uppercase tracking-widest leading-none">
          Starting from
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-sans font-black italic text-4xl text-primary leading-none">
            {formatPrice(price)}
          </span>
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">
            / person
          </span>
        </div>
        
        {/* Discount Tag */}
        {discountAmount > 0 && (
          <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded mt-2">
            <span>Save {formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 gap-3.5 border-y border-white/10 py-5 text-xs font-semibold text-white/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white/40 text-[9px] block uppercase tracking-wider font-bold">Departure Date</span>
            <span>Next Departure: {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Rolling Weekends"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white/40 text-[9px] block uppercase tracking-wider font-bold">Group Cap</span>
            <span>Max group size: {pkg.maxGroupSize || 12} travelers</span>
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="space-y-3">
        <button
          onClick={() => openBookingModal(pkg.id)}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide uppercase py-4 rounded-xl shadow-orange transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Book this Trail</span>
        </button>

        {pkg.pdfUrl ? (
          <a
            href={pkg.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-white/20 hover:border-white text-white font-bold text-xs uppercase tracking-wide py-3.5 rounded-xl transition-colors"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Download PDF Itinerary</span>
          </a>
        ) : (
          <button className="w-full border border-white/10 text-white/30 font-bold text-xs uppercase tracking-wide py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 shrink-0" />
            <span>Itinerary PDF Coming Soon</span>
          </button>
        )}
      </div>

      {/* Trust Sign */}
      <div className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3.5 text-[10px] text-white/50 leading-relaxed font-semibold">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          No payment is needed at checkout. We match traveler demographics first to confirm slot allocation.
        </p>
      </div>
    </div>
  );
}
