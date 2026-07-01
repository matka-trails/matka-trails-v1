"use client";

import { Sparkles, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function WhyMatkaTrails() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const points = [
    {
      num: "01",
      title: "No Third Party Mess",
      desc: "100 percent in-house operations for all trips! No third parties involved, hence no fishy claims!",
    },
    {
      num: "02",
      title: "Transparency & Security",
      desc: "Real time monitoring of all trips by ground team! All routes and weather conditions are accurately updated!",
    },
    {
      num: "03",
      title: "Co-Travelers Filtering",
      desc: "Multi-step filtering to bring only like-minded people together! That's our key to have fuss-free trips!",
    },
    {
      num: "04",
      title: "One Stop Hassle Free",
      desc: "Comfortable stays, trained drivers, hospitable staff and friendly trip leaders put together that one memorable trip!",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full py-10 md:py-16 px-6 lg:px-12 bg-cream-bg relative overflow-hidden"
    >
      {/* Background glow elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
        
        {/* ── LEFT COLUMN: Header + 4 Pointers with Ghost Numbers ── */}
        <div className="space-y-8 lg:space-y-10 text-left">
          
          {/* Header with Marker Highlight Effect */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest bg-primary-light px-3 py-1 border border-primary/10 rounded-full w-max shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Matka Trails DNA</span>
            </span>
            <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize pb-2">
              Why Choose <span className="marker-zigzag text-primary">Matka Trails?</span>
            </h2>
            <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-md">
              Say goodbye to coordination hassles. We run end-to-end, high-security group experiences curated specifically for modern nomads.
            </p>
          </div>

          {/* 4 Pointers with Ghost Numbers */}
          <div className="space-y-5 lg:space-y-6">
            {points.map((point, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-4 lg:gap-6 transition-all duration-500 transform",
                  inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                )}
                style={{ transitionDelay: `${idx * 0.12}s` }}
              >
                {/* Ghost Number */}
                <span className="font-sans font-black text-5xl lg:text-6xl text-primary/10 select-none tracking-tighter leading-none pt-0.5">
                  {point.num}
                </span>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="font-sans font-extrabold text-base lg:text-lg text-black leading-tight">
                    {point.title}
                  </h3>
                  <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-md">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: High-quality optimized image showcase with premium overlay design ── */}
        <div 
          className={cn(
            "relative w-full max-w-[500px] aspect-[4/3] lg:aspect-square shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)] mx-auto lg:ml-auto transition-all duration-700 ease-out transform rounded-[2rem] md:rounded-[3rem] overflow-hidden",
            inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          )}
        >
          <Image
            src="https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1782831491/whychoose_gdchnw.png"
            alt="Why Choose Matka Trails"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {/* Subtle vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />



          {/* Bottom-Left Glassmorphic Info Card */}
          <div className="absolute bottom-4 left-4 z-20 bg-black/40 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl shadow-lg max-w-[180px] text-left">
            <span className="font-sans font-black text-white text-lg block leading-none mb-1">100%</span>
            <span className="font-sans font-extrabold text-white/80 text-[8px] uppercase tracking-widest block leading-tight">
              Direct Operations
            </span>
          </div>

          {/* Bottom-Right Floating Gradient Icon Button */}
          <div className="absolute -bottom-2 -right-2 z-30 w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-orange-400 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-4 h-4 fill-white text-white" />
          </div>
        </div>

      </div>
    </section>
  );
}
