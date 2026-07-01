"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { ChevronLeft, ChevronRight, MapPin, X, ZoomIn } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils";
import Image from "next/image";

export default function GalleryFramesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: () => publicApi.getGalleryItems(),
  });

  const showNav = items.length > 4;

  const nextSlide = () => {
    if (items.length <= 4) return;
    const maxIndex = items.length - 4;
    setCurrentIndex((prev) => {
      if (prev === maxIndex) return 0;
      return Math.min(maxIndex, prev + 2);
    });
  };

  const prevSlide = () => {
    if (items.length <= 4) return;
    const maxIndex = items.length - 4;
    setCurrentIndex((prev) => {
      if (prev === 0) return maxIndex;
      return Math.max(0, prev - 2);
    });
  };

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextLightbox = () => {
    if (lightboxIndex === null || items.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % items.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null || items.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-cream-bg flex items-center justify-center">
        <div className="text-center italic font-bold text-xs text-gray-light">
          Loading frames of happiness...
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const CARD_WIDTH = 250;
  const CARD_GAP = 20;
  const VIEWPORT_WIDTH = 4 * CARD_WIDTH + 3 * CARD_GAP; // Width for exactly 4 cards + gaps

  return (
    <section 
      className="py-10 overflow-hidden select-none bg-no-repeat bg-center"
      style={{
        backgroundImage: `url("https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1782821160/gallery_a5ssc5.png")`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-sans font-black text-2xl md:text-3xl text-black uppercase tracking-tight leading-none">
            Journey In <span className="marker-highlight text-primary">Frames</span>
          </h2>
          <p className="font-reminder text-primary text-xl md:text-2xl not-italic font-normal capitalize tracking-wide block">
            Pictures Perfect Moments
          </p>
        </div>

        {/* ── 1. Desktop View: Smooth Sliding 3D Curved Panorama Ribbon ── */}
        <div className="hidden md:flex relative w-full items-center justify-center">
          
          {/* Navigation - Left Arrow */}
          {showNav && (
            <button
              onClick={prevSlide}
              className="absolute left-4 lg:left-8 z-30 w-11 h-11 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-orange cursor-pointer hover:scale-105 transition-all"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3px]" />
            </button>
          )}

          {/* Panoramic Curved Viewport */}
          <div 
            className="overflow-hidden py-4 overflow-visible"
            style={{ width: VIEWPORT_WIDTH }}
          >
            <div
              className="flex items-start transition-transform duration-700 ease-out"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
                gap: `${CARD_GAP}px`,
                transform: `translateX(-${currentIndex * (CARD_WIDTH + CARD_GAP)}px)`,
              }}
            >
              {items.map((item, idx) => {
                const rel = idx - currentIndex;
                let rotateY = 0;
                let translateY = 0;
                let scale = 1;
                let opacity = 1;

                // Curved cylinder Y-rotation only (keeping translateY=0 and scale=1 to avoid height deformation/shrinking)
                if (rel === 0) { rotateY = 22; }
                else if (rel === 1) { rotateY = 6; }
                else if (rel === 2) { rotateY = -6; }
                else if (rel === 3) { rotateY = -22; }
                else {
                  opacity = 0.15; // Dim/fade cards out of the viewport window
                }

                const originalIndex = items.findIndex((i) => i.id === item.id);
                const height = Math.round(CARD_WIDTH * 1.33);

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => originalIndex !== -1 && openLightbox(originalIndex)}
                    className="relative shrink-0 bg-black border border-gray-border overflow-hidden group shadow-lg cursor-zoom-in transition-all duration-700 ease-out rounded-none"
                    style={{
                      width: CARD_WIDTH,
                      height,
                      transform: `rotateY(${rotateY}deg)`,
                      transformStyle: "preserve-3d",
                      opacity,
                    }}
                  >
                    <div className="relative w-full h-full rounded-none">
                      <Image
                        src={getOptimizedImageUrl(item.imageUrl, 600)}
                        alt={item.caption || item.placeName}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 z-0 rounded-none"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 rounded-none" />
                    
                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 border border-white/10 shadow-md rounded-none">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span>{item.placeName}</span>
                      </span>
                    </div>

                    {/* Zoom icon on hover */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-2 border border-white/10 text-white rounded-none">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation - Right Arrow */}
          {showNav && (
            <button
              onClick={nextSlide}
              className="absolute right-4 lg:right-8 z-30 w-11 h-11 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-orange cursor-pointer hover:scale-105 transition-all"
            >
              <ChevronRight className="w-5 h-5 stroke-[3px]" />
            </button>
          )}

        </div>

        {/* ── 2. Mobile View: Native Horizontal Scroll with snap-align and curve (No rounded corners) ── */}
        <div className="block md:hidden w-full">
          <div className="flex overflow-x-auto gap-4 px-6 pb-6 scrollbar-none snap-x snap-mandatory w-full" style={{ perspective: "800px" }}>
            {items.map((item, idx) => {
              const originalIndex = items.findIndex((i) => i.id === item.id);
              
              // Apply a dynamic Y-rotation on mobile for a panoramic feel (no translateY or scale changes to avoid deformation)
              const isEven = idx % 2 === 0;
              const rotateY = isEven ? 8 : -8;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => originalIndex !== -1 && openLightbox(originalIndex)}
                  className="w-[75vw] flex-shrink-0 snap-center relative aspect-[3/4] bg-black border border-gray-border/30 cursor-zoom-in rounded-none shadow-lg"
                  style={{
                    transform: `rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Image
                    src={getOptimizedImageUrl(item.imageUrl, 500)}
                    alt={item.caption || item.placeName}
                    fill
                    sizes="70vw"
                    className="object-cover rounded-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent z-10 rounded-none" />

                  {/* Location Badge */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-2 border border-white/10 rounded-none">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span>{item.placeName}</span>
                    </span>
                  </div>

                  {/* Zoom hint */}
                  <div className="absolute top-4 right-4 z-20 bg-black/40 p-2 border border-white/10 text-white rounded-none">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── 3. Lightbox Fullscreen Modal Viewer ── */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-55 w-10 h-10 rounded-none bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 z-55 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border border-white/10"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5px]" />
          </button>

          {/* Active Image */}
          <div className="relative w-full max-w-3xl aspect-[3/4] md:max-h-[80vh] flex flex-col justify-end p-6 border border-white/10 bg-gray-dark rounded-none animate-fadeIn">
            <Image
              src={items[lightboxIndex].imageUrl}
              alt={items[lightboxIndex].caption || items[lightboxIndex].placeName}
              fill
              className="object-contain rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none rounded-none" />
            <div className="relative z-20 space-y-1.5 text-white max-w-xl">
              <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 shadow-orange rounded-none">
                <MapPin className="w-3.5 h-3.5 text-white" />
                {items[lightboxIndex].placeName}
              </span>
              {items[lightboxIndex].caption && (
                <p className="text-xs md:text-sm font-semibold text-white/90 leading-relaxed drop-shadow-md">
                  {items[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={nextLightbox}
            className="absolute right-4 z-55 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border border-white/10"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5px]" />
          </button>

        </div>
      )}
    </section>
  );
}
