"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { ChevronLeft, ChevronRight, MapPin, X, ZoomIn } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils";
import Image from "next/image";

export default function GalleryFramesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Touch swipe states for mobile tinder-style card stack
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: () => publicApi.getGalleryItems(),
  });

  const nextSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Get current circular slice of 4 visible items for desktop
  const getVisibleItems = () => {
    if (items.length === 0) return [];
    if (items.length <= 4) return items;
    
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const idx = (currentIndex + i) % items.length;
      visible.push(items[idx]);
    }
    return visible;
  };

  // Get stacked cards for mobile view (depth 0 is top, depth 1 is middle, depth 2 is bottom)
  const getStackedItems = () => {
    if (items.length === 0) return [];
    const count = Math.min(items.length, 3);
    const stacked = [];
    for (let i = 0; i < count; i++) {
      const idx = (currentIndex + i) % items.length;
      stacked.push({
        item: items[idx],
        depth: i,
        originalIndex: idx,
      });
    }
    return stacked;
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const deltaX = touchStartX.current - touchEndX.current;
    
    // Swipe distance threshold
    if (deltaX > 60) {
      // Swiped Left -> Shuffle Next
      nextSlide();
    } else if (deltaX < -60) {
      // Swiped Right -> Shuffle Prev
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

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
      <section className="py-2 bg-cream-bg flex items-center justify-center">
        <div className="text-center italic font-bold text-xs text-gray-light">
          Loading frames of happiness...
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const visibleItems = getVisibleItems();
  const stackedItems = getStackedItems();

  return (
    <section className="py-6 bg-cream-bg overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center space-y-0.5 mb-4">
          <h2 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight leading-none">
            Journey In Frames
          </h2>
          <p className="font-sans text-[9px] md:text-[10px] font-bold text-gray-mid uppercase tracking-widest">
            Pictures Perfect Moments
          </p>
        </div>

        {/* ── 1. Desktop & Tablet View: 3D Panorama Ribbon ── */}
        <div className="hidden md:flex relative w-full max-w-5xl mx-auto items-center justify-center">
          
          {/* Navigation - Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-2 z-30 w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-orange cursor-pointer hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3px]" />
          </button>

          {/* Panoramic Curved Track */}
          <div className="w-full flex items-center justify-center min-h-[460px] py-1 overflow-visible">
            <div 
              className="flex gap-2.5 items-stretch justify-center w-full max-w-5xl px-1"
              style={{ perspective: "1200px" }}
            >
              {visibleItems.map((item, idx) => {
                let rotateY = 0;
                let translateY = 0;
                let scale = 1;
                
                if (idx === 0) {
                  rotateY = 18;
                  translateY = -4;
                  scale = 1.05;
                } else if (idx === 1) {
                  rotateY = 5;
                  translateY = 4;
                  scale = 0.94;
                } else if (idx === 2) {
                  rotateY = -5;
                  translateY = 4;
                  scale = 0.94;
                } else if (idx === 3) {
                  rotateY = -18;
                  translateY = -4;
                  scale = 1.05;
                }

                // Get original index in main items array for lightbox
                const originalIndex = items.findIndex((i) => i.id === item.id);

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => originalIndex !== -1 && openLightbox(originalIndex)}
                    className="relative w-full max-w-[285px] aspect-[3/4] bg-black border border-gray-border overflow-hidden group shadow-lg rounded-[32px] cursor-zoom-in transition-all duration-700 ease-out"
                    style={{
                      transform: `rotateY(${rotateY}deg) translateY(${translateY}px) scale(${scale})`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="relative w-full h-full animate-fadeIn">
                      <Image
                        src={getOptimizedImageUrl(item.imageUrl, 600)}
                        alt={item.caption || item.placeName}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-700 z-0"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />

                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-full border border-white/10 shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item.placeName}</span>
                      </span>
                    </div>

                    {/* Hover Zoom overlay */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-2 rounded-xl border border-white/10 text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation - Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-2 z-30 w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-orange cursor-pointer hover:scale-105 transition-all"
          >
            <ChevronRight className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>

        {/* ── 2. Mobile View: Swipeable Tinder-Style Card Stack ── */}
        <div className="block md:hidden w-full py-4 flex flex-col items-center">
          {/* Card Stack Base */}
          <div 
            className="relative w-full max-w-[270px] aspect-[3/4] h-[360px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {stackedItems.map(({ item, depth, originalIndex }) => {
              // Calculate stacked projection (0 is top card, 1 is middle, 2 is bottom)
              // Each card sits slightly below and scales down from the one above it
              const scale = 1 - depth * 0.05; 
              const translateY = depth * 14; 
              const opacity = 1 - depth * 0.2; 
              const zIndex = 30 - depth * 10; 

              return (
                <div
                  key={item.id}
                  onClick={() => depth === 0 && openLightbox(originalIndex)}
                  className="absolute inset-0 bg-black border border-gray-border rounded-[28px] overflow-hidden shadow-lg transition-all duration-300 ease-out origin-bottom cursor-pointer"
                  style={{
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                >
                  <Image
                    src={getOptimizedImageUrl(item.imageUrl, 500)}
                    alt={item.caption || item.placeName}
                    fill
                    className="object-cover"
                    priority={depth === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent z-10" />

                  {/* Location Pin Badge */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-full border border-white/10">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span>{item.placeName}</span>
                    </span>
                  </div>
                  
                  {/* Swipe Help Guide Overlay (Only top card shows indicator) */}
                  {depth === 0 && (
                    <div className="absolute top-4 right-4 z-20 bg-black/40 p-2 rounded-xl border border-white/10 text-white animate-pulse">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe / Shuffle Action Buttons */}
          <div className="flex gap-4 items-center justify-center mt-12 w-full">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border border-gray-border text-gray-dark flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>
            <span className="text-[10px] font-bold text-gray-light uppercase tracking-wider">
              Swipe Left / Right
            </span>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border border-gray-border text-gray-dark flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>
        </div>

      </div>

      {/* ── 3. Lightbox Fullscreen Modal Viewer ── */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fadeIn">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-55 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation - Prev */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 z-55 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border border-white/10"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5px]" />
          </button>

          {/* Active Image frame */}
          <div className="relative w-full max-w-3xl aspect-[3/4] md:max-h-[80vh] flex flex-col justify-end p-6 rounded-3xl overflow-hidden border border-white/10 bg-gray-dark">
            <Image
              src={items[lightboxIndex].imageUrl}
              alt={items[lightboxIndex].caption || items[lightboxIndex].placeName}
              fill
              className="object-contain"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

            {/* Meta tags at bottom */}
            <div className="relative z-20 space-y-1.5 text-white max-w-xl">
              <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-md shadow-orange">
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

          {/* Navigation - Next */}
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
