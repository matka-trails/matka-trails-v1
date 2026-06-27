"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Users, Map, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HowItWorks() {
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    
    // Animate dash offset to 0
    path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
    path.style.strokeDashoffset = "0";
  }, [inView]);

  const steps = [
    {
      num: "01",
      icon: <Map className="w-5 h-5 text-primary" />,
      title: "Pick Your Trail",
      desc: "Browse our hand-crafted weekend routes. Filter by duration, budget, or target peaks.",
    },
    {
      num: "02",
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Get Grouped",
      desc: "Travel solo but never alone. We match you into a dynamic cohort of like-minded explorers.",
    },
    {
      num: "03",
      icon: <Compass className="w-5 h-5 text-primary" />,
      title: "Show Up & Explore",
      desc: "Your expert Group Captain handles all routes, logs, and stays. You just hike and bond.",
    },
  ];

  return (
    <section ref={sectionRef} className="relative w-full py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-12 relative">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW IT WORKS</span>
          </span>
          <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl text-black leading-none tracking-tight">
            Solo In. <span className="text-primary italic">Group Out.</span>
          </h2>
          <p className="text-sm text-gray-mid leading-relaxed font-semibold max-w-md mx-auto">
            Our micro-group format guarantees a structured, safe, and highly memorable weekend getaway.
          </p>
        </div>

        {/* SVG Connecting Path (Desktop Only) */}
        <div className="hidden lg:block absolute inset-0 top-16 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
            <path
              ref={pathRef}
              d="M 220 200 C 400 100, 500 300, 600 200 C 700 100, 800 300, 980 200"
              stroke="#ff6600"
              strokeWidth="2"
              strokeDasharray="8 8"
              className="opacity-70"
            />
          </svg>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                "bg-white border border-gray-border hover:border-primary/30 rounded-2xl p-6 space-y-4 hover:shadow-card transition-all duration-300 transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transition: `all 0.5s ease-out ${idx * 0.2}s` }}
            >
              {/* Top Row: Icon & Num */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center border border-primary/20">
                  {step.icon}
                </div>
                <span className="font-sans font-black italic text-xl text-primary-light bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                  {step.num}
                </span>
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-base text-black">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-mid leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
