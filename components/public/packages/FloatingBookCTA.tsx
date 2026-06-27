"use client";

import { useEffect, useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";
import { PublicPackage } from "@/lib/api";

interface FloatingBookCTAProps {
  pkg: PublicPackage;
}

export default function FloatingBookCTA({ pkg }: FloatingBookCTAProps) {
  const { openBookingModal } = useUiStore();
  const [visible, setVisible] = useState(false);

  const price = pkg.priceDiscounted || pkg.priceOriginal;

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-gray-border px-6 py-4 flex items-center justify-between shadow-float animate-fadeIn">
      {/* Price section */}
      <div>
        <span className="text-[9px] text-gray-light font-bold uppercase tracking-wider block">
          STARTING FROM
        </span>
        <span className="font-sans font-black italic text-lg text-primary">
          {formatPrice(price)}
        </span>
      </div>

      {/* Book Button */}
      <button
        onClick={() => openBookingModal(pkg.id)}
        className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-xl shadow-orange transition-colors"
      >
        Book Trail
      </button>
    </div>
  );
}
