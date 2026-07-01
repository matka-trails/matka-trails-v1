"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Map, Users, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function HowItWorks() {
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

  const steps = [
    {
      num: "01",
      title: "Book as a Solo Traveller",
      desc: "Don't wait for friends who keep cancelling. Join a community of like-minded adventurers ready to explore.",
    },
    {
      num: "02",
      title: "Expert Guided Integration",
      desc: "Our vibe-check officers ensure everyone feels at home from day one with curated icebreakers.",
    },
    {
      num: "03",
      title: "Lifetime Tribe Connections",
      desc: "Return with more than memories. You'll leave with a global family for your next epic journey.",
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full py-10 md:py-16 px-6 lg:px-12 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
        
        {/* ── LEFT COLUMN: High-quality optimized image showcase ── */}
        <div className="relative flex items-center justify-center lg:justify-start">
          {/* Circular bubble background element */}
          <div className="w-[260px] h-[260px] rounded-full bg-primary-light/40 absolute -left-4 -top-8 z-0 pointer-events-none" />

          {/* Styled Image Container */}
          <div 
            className={cn(
              "relative w-full max-w-[510px] aspect-[4/3] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] z-10 transition-all duration-700 ease-out transform rounded-[2rem] overflow-hidden",
              inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            )}
          >
            <Image
              src="https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1782835284/HowItWorks_zygnfo.png"
              alt="How It Works"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN: Title with Highlight + Ghost Pointers ── */}
        <div className="space-y-8 lg:space-y-10 text-left">
          
          {/* Header */}
          <div className="pb-2">
            <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize">
              Solo In, <span className="marker-zigzag text-primary">Group Out</span>
            </h2>
          </div>

          {/* Staggered Pointers List */}
          <div className="space-y-6 lg:space-y-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-4 lg:gap-6 transition-all duration-500 transform",
                  inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                )}
                style={{ transitionDelay: `${idx * 0.15}s` }}
              >
                {/* Ghost Number Indicator */}
                <span className="font-sans font-black text-5xl lg:text-6xl text-primary/10 select-none tracking-tighter leading-none pt-0.5">
                  {step.num}
                </span>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="font-sans font-extrabold text-base lg:text-lg text-black leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-md">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
