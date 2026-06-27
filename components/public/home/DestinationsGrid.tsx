"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Sparkles, MoveRight } from "lucide-react";
import { publicApi } from "@/lib/api";
import { cn, getOptimizedImageUrl } from "@/lib/utils";

const FALLBACK_DESTINATIONS = [
  {
    id: "kedarnath",
    name: "Kedarnath",
    slug: "kedarnath",
    packagesCount: 4,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "manali",
    name: "Manali",
    slug: "manali",
    packagesCount: 6,
    image: "https://images.unsplash.com/photo-1626621340025-013b242d2b51?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    slug: "rishikesh",
    packagesCount: 3,
    image: "https://images.unsplash.com/photo-1598977123418-45f04b616a0e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "spiti",
    name: "Spiti Valley",
    slug: "spiti",
    packagesCount: 5,
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "kasol",
    name: "Kasol",
    slug: "kasol",
    packagesCount: 2,
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=800",
  },
];

export default function DestinationsGrid() {
  const [destinations, setDestinations] = useState<any[]>(FALLBACK_DESTINATIONS);

  useEffect(() => {
    publicApi
      .getDestinations()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            packagesCount: d._count?.packages || 0,
            image: d.coverImage || FALLBACK_DESTINATIONS[0].image,
          }));
          setDestinations(mapped);
        }
      })
      .catch((err) => console.log("Using fallback grid destinations", err));
  }, []);

  // Max 6 on desktop, but show all on the destinations page
  const MAX_CARDS = 6;
  const shown = destinations.slice(0, MAX_CARDS);
  const hasMore = destinations.length > MAX_CARDS;

  return (
    <section className="w-full py-16 px-4 md:px-6 lg:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLORE TERRITORIES</span>
            </span>
            <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl text-black leading-none tracking-tight">
              Where will your <br />
              <span className="text-primary italic">trail lead?</span>
            </h2>
          </div>
          <div>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-dark group"
            >
              <span>All Destinations</span>
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Grid — Desktop: masonry/pinterest, Mobile: 2×2 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {shown.map((d, index) => {
            // First item spans 2 columns on desktop
            const isFeatured = index === 0;
            return (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className={cn(
                  "group relative rounded-2xl overflow-hidden border border-gray-border shadow-card bg-gray-bg block",
                  isFeatured
                    ? "col-span-2 h-[200px] md:h-[340px]"
                    : "h-[160px] md:h-[260px]"
                )}
              >
                {/* Background image */}
                <Image
                  src={getOptimizedImageUrl(d.image, 800)}
                  alt={d.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark to transparent overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-primary/60 transition-colors duration-300" />

                {/* Info Text overlays */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-end justify-between z-10 text-white">
                  <div>
                    <h3 className="font-sans font-extrabold text-base md:text-xl uppercase leading-none truncate max-w-[180px]">
                      {d.name}
                    </h3>
                    <span className="text-[9px] md:text-[10px] text-white/60 font-bold uppercase tracking-wider block mt-0.5">
                      {d.packagesCount} {d.packagesCount === 1 ? "trail" : "trails"} available
                    </span>
                  </div>

                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center text-white group-hover:text-primary transition-all shrink-0">
                    <MoveRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Explore More button if more than 6 destinations */}
        {hasMore && (
          <div className="flex justify-center pt-2">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-orange hover:bg-primary-dark transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore More Destinations</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
