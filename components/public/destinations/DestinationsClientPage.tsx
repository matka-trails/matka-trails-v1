"use client";

import Link from "next/link";
import Image from "next/image";
import { Compass, MoveRight, Sparkles } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils";
import QuickCallForm from "./QuickCallForm";
import MobileQuickQuote from "./MobileQuickQuote";
import TextTestimonialsSection from "../home/TextTestimonialsSection";
import GalleryFramesSection from "../home/GalleryFramesSection";
import VideoTestimonialsSection from "../home/VideoTestimonialsSection";
import Faqs from "../home/Faqs";
import QueryProvider from "@/components/shared/QueryProvider";

const DEFAULT_BG =
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783245391/bgCover_d221x3.png";

interface PublicDestination {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  packageCount?: number;
  _count?: {
    packages: number;
  };
}

export default function DestinationsClientPage({
  destinations,
}: {
  destinations: PublicDestination[];
}) {
  return (
    <QueryProvider>
      <div className="w-full min-h-screen flex flex-col relative select-none bg-gray-bg">
        
        {/* 1. Header Banner with Cloudinary Background Image & Black Overlay */}
        <div 
          className="relative w-full h-[280px] md:h-[300px] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center border-b border-white/5 shrink-0 z-10"
          style={{ backgroundImage: `url(${DEFAULT_BG})` }}
        >
          {/* Dark overlay specifically inside the header banner to ensure text readability */}
          <div className="absolute inset-0 bg-neutral-950/70 z-0 pointer-events-none" />

          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="space-y-2 text-white">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
                <Compass className="w-4 h-4" />
                <span>TERRITORY DIRECTORY</span>
              </span>
              <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
                Explore <span className="text-primary italic">Territories</span>
              </h1>
              <p className="text-xs lg:text-sm text-white/60 leading-relaxed font-semibold max-w-md">
                Find trails grouped by regions. From spiritual high altitude treks to river camping and rafting weekenders.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main Content Section (Light background, matching standard pages) */}
        <div className="w-full py-16 flex-grow bg-transparent relative z-10">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            {/* Grid layout - split into left grid and right sticky form on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Destinations Grid (Spans 8 columns on desktop) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-xs font-bold text-gray-dark uppercase tracking-widest leading-none">
                    All Available Regions ({destinations.length})
                  </h2>
                </div>

                {destinations.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-gray-border rounded-3xl shadow-sm">
                    <Compass className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-xs text-gray-light font-semibold italic">No destinations seeded yet.</p>
                  </div>
                ) : (
                  /* Mobile: 2 columns, Desktop: 3 columns, cards are scaled down */
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {destinations.map((d) => {
                      const packageCount = d._count?.packages ?? d.packageCount ?? 0;
                      return (
                        <Link
                          key={d.id}
                          href={`/destinations/${d.slug}`}
                          className="group relative rounded-2xl overflow-hidden border border-gray-border shadow-card bg-gray-bg h-[150px] sm:h-[180px] md:h-[220px] block"
                        >
                          {/* Background image */}
                          {d.coverImage && (
                            <Image
                              src={getOptimizedImageUrl(d.coverImage, 600)}
                              alt={d.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}

                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-primary/60 transition-colors duration-300" />

                          {/* Info Text overlays */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 text-white">
                            <div className="min-w-0 pr-2">
                              <h3 className="font-sans font-extrabold text-sm md:text-base lg:text-lg uppercase leading-none truncate">
                                {d.name}
                              </h3>
                              <span className="text-[8px] md:text-[9px] text-white/60 font-bold uppercase tracking-wider block mt-1.5 leading-none">
                                {packageCount} {packageCount === 1 ? "trail" : "trails"} available
                              </span>
                            </div>

                            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center text-white group-hover:text-primary transition-all shrink-0">
                              <MoveRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Quick Callback Form (Spans 4 columns on desktop, hidden on mobile) */}
              <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 z-20">
                <QuickCallForm />
              </div>

            </div>
          </div>

          {/* Extra Sections rendered sequentially with no gap margins */}
          <div className="mt-16">
            {/* Reviews Ticker Section */}
            <TextTestimonialsSection />

            {/* Gallery Frame panorama */}
            <GalleryFramesSection />

            {/* Video Testimonials */}
            <VideoTestimonialsSection />

            {/* Global FAQs Section */}
            <Faqs />
          </div>
        </div>

        {/* Mobile / Tablet sticky quote drawer bar */}
        <MobileQuickQuote />
      </div>
    </QueryProvider>
  );
}
