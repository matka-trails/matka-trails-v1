"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { ChevronLeft, ChevronRight, Play, X, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function VideoTestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: () => publicApi.getVideoTestimonials(),
  });

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Convert watch/share YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  // Extract YouTube ID for default high-res thumbnail
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white flex items-center justify-center">
        <div className="text-center italic font-bold text-xs text-gray-light">
          Loading stories of journey...
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className=" bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize mt-2">
            Real People, <span className="marker-zigzag text-primary">Real Stories</span>
          </h2>
          <p className="font-sans text-xs md:text-sm font-bold text-gray-mid uppercase tracking-widest">
            Client Testimonials & Trip Reviews
          </p>
        </div>

        {/* Video Slider Showcase */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
          
          {/* Navigation - Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-[-20px] md:left-[-60px] z-30 w-11 h-11 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-orange cursor-pointer hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3px]" />
          </button>

          {/* Current Active Card Frame */}
          <div className="w-full bg-white border border-gray-border rounded-3xl overflow-hidden shadow-card hover:shadow-float transition-all duration-300">
            {testimonials.map((t, idx) => {
              if (idx !== currentIndex) return null;

              const ytId = getYoutubeId(t.videoUrl);
              const thumbUrl = t.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "/images/placeholder.jpg");

              return (
                <div key={t.id} className="animate-fadeIn">
                  {/* Thumbnail & Play button container */}
                  <div
                    onClick={() => setActiveVideoUrl(getEmbedUrl(t.videoUrl))}
                    className="relative w-full aspect-video bg-black cursor-pointer group overflow-hidden"
                  >
                    <Image
                      src={thumbUrl}
                      alt={t.title}
                      fill
                      priority
                      className="object-cover opacity-90 group-hover:scale-101 transition-transform duration-500"
                    />

                    {/* Semi-transparent radial shadow overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />

                    {/* Custom YouTube-style red play button in the center */}
                    <div className="absolute inset-0 flex items-center justify-center z-25">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-orange hover:scale-108 transition-all duration-300">
                        <Play className="w-7 h-7 md:w-8 md:h-8 fill-white text-white ml-1 shrink-0" />
                      </div>
                    </div>

                    {/* Top rating strip */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-gray-border rounded-xl px-3 py-1.5 shadow-md">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase text-black tracking-wide ml-1">
                        5.0 Review
                      </span>
                    </div>
                  </div>

                  {/* Title Bar bottom */}
                  <div className="p-6 md:p-8 flex items-center gap-4 bg-gray-bg/40 border-t border-gray-border">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0 font-sans font-black italic uppercase tracking-wider text-xs">
                      MT
                    </div>
                    <div className="flex-1">
                      <h4 className="font-sans font-extrabold text-sm md:text-base text-black leading-snug">
                        {t.title}
                      </h4>
                      <p className="text-[10px] text-gray-light font-bold uppercase tracking-wider mt-0.5">
                        Matka Trails Explorer Reviews
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation - Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-[-20px] md:right-[-60px] z-30 w-11 h-11 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-orange cursor-pointer hover:scale-105 transition-all"
          >
            <ChevronRight className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>

      </div>

      {/* Lightbox Video Modal Overlay */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 md:p-10 animate-fadeIn">
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-4 right-4 z-55 w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-float">
            <iframe
              src={activeVideoUrl}
              title="Video Testimonial Player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
