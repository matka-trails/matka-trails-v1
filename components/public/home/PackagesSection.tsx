"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { publicApi, PublicPackage } from "@/lib/api";
import PackageCard from "../packages/PackageCard";
import CardFanDeck from "@/components/ui/CardFanDeck";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sparkles, MoveRight, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function PackagesSection() {
  const router = useRouter();
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [startIndex, setStartIndex] = useState(0);

  // Fetch featured packages
  useEffect(() => {
    publicApi
      .getPackages({ limit: 8 })
      .then((res) => {
        setPackages(res.packages);
      })
      .catch((err) => console.error("Featured packages fetch fail", err));
  }, []);

  if (packages.length === 0) return null;

  // Append a Browse All card structure to the slider items
  const allItems = [
    ...packages.map((pkg) => ({ type: "package" as const, data: pkg })),
    { type: "more" as const },
  ];

  const visibleCount = 4;
  const maxIndex = Math.max(0, allItems.length - visibleCount);

  const nextSlide = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Get current slice of items to display on desktop
  const visibleItems = allItems.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="w-full py-20 bg-gray-bg relative overflow-hidden select-none">
      {!isMobile ? (
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRENDING TRAILS</span>
              </span>
              <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl text-black leading-none tracking-tight">
                Our Signature <br />
                <span className="text-primary italic">Weekenders.</span>
              </h2>
              <p className="text-sm text-gray-mid leading-relaxed font-semibold max-w-md">
                No mapping headaches. No booking stress. Just lock your dates and join your tribe.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="w-11 h-11 rounded-full border border-gray-200 hover:border-primary hover:bg-primary/10 flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-200 cursor-pointer bg-white shadow-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-11 h-11 rounded-full border border-gray-200 hover:border-primary hover:bg-primary/10 flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-200 cursor-pointer bg-white shadow-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
              </button>
            </div>
          </div>

          {/* Cards slider row using slice method to prevent overflow outside 7xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full min-h-[480px]">
            {visibleItems.map((item, idx) =>
              item.type === "package" ? (
                <div
                  key={item.data.id}
                  className="w-full cursor-pointer"
                  onClick={() => router.push(`/packages/${item.data.slug}`)}
                >
                  <PackageCard pkg={item.data} className="shadow-sm hover:shadow-md transition-all h-full" />
                </div>
              ) : (
                <div
                  key="more-card"
                  className="w-full h-[460px] rounded-2xl border-2 border-dashed border-gray-border flex flex-col items-center justify-center text-center p-8 bg-white hover:border-primary/40 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
                    <MoveRight className="w-6 h-6" />
                  </div>
                  <h4 className="font-sans font-extrabold text-lg text-black mb-1">More Adventures</h4>
                  <p className="text-xs text-gray-light leading-relaxed mb-6 font-semibold">
                    Discover 20+ other hand-crafted trekking routes and rafting expeditions.
                  </p>
                  <Link
                    href="/packages"
                    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-xl shadow-orange transition-colors"
                  >
                    Browse All
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        /* ── MOBILE FAN CARD DECK ── */
        <div className="space-y-5 px-6">
          <div className="text-center space-y-1.5">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POPULAR TRAILS</span>
            </span>
            <h2 className="font-sans font-black text-3xl text-black leading-none tracking-tight">
              Featured Weekends
            </h2>
            <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-[260px] mx-auto">
              Solo in, group out. Swipe or tap to shuffle available trips.
            </p>
          </div>

          {/* Fan Card Deck */}
          <CardFanDeck
            items={packages}
            renderCard={(pkg, isTop) => (
              <div
                className="cursor-pointer w-full h-full"
                onClick={() => router.push(`/packages/${pkg.slug}`)}
              >
                <PackageCard
                  pkg={pkg}
                  className={`shadow-float transition-shadow duration-300 ${isTop ? "shadow-lg" : ""}`}
                />
              </div>
            )}
          />

          <div className="text-center pt-2">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 bg-primary-light px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <span>View All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
