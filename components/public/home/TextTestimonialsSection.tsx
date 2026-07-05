"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApi, TextTestimonial } from "@/lib/api";
import { Star } from "lucide-react";

export default function TextTestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery<TextTestimonial[]>({
    queryKey: ["public-text-testimonials"],
    queryFn: () => publicApi.getTextTestimonials(),
  });

  if (isLoading) {
    return (
      <div className="py-16 bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  // Duplicate testimonials array multiple times to create a seamless infinite loop
  const list = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-bg/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="font-sans text-[10px] md:text-xs font-black text-gray-light uppercase tracking-widest">
          Traveler Love
        </p>
        <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none capitalize mt-1">
          Love from our <span className="text-primary">travelers</span>
        </h2>
      </div>

      {/* Styled Marquee Container */}
      <div className="relative w-full overflow-hidden py-4 flex group">
        {/* CSS for custom animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 60s linear infinite;
          }
          .group:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}} />

        {/* Marquee list */}
        <div className="animate-marquee flex gap-6">
          {list.map((t, idx) => (
            <div
              key={t.id + "-" + idx}
              className="bg-white border border-gray-150/70 shadow-sm rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 w-[280px] lg:w-[320px] shrink-0"
            >
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < t.stars ? "fill-amber-500 text-amber-500" : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed font-medium mt-4 italic">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-black leading-none">{t.name}</h4>
                  <p className="text-[9px] text-gray-light font-bold uppercase tracking-wider mt-1.5">
                    Verified Explorer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
