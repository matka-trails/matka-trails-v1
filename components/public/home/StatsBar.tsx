"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles } from "lucide-react";

// Counter sub-component for animating individual metrics
function CounterItem({ target, duration = 1800, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setCount(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    },
    [target, duration]
  );

  useEffect(() => {
    if (inView) {
      requestAnimationFrame(animate);
    }
  }, [inView, animate]);

  return (
    <div ref={containerRef} className="font-sans font-black italic text-4xl lg:text-5xl text-primary leading-none">
      {count}
      <span className="text-white not-italic ml-0.5">{suffix}</span>
    </div>
  );
}

export default function StatsBar() {
  const stats = [
    { target: 500, suffix: "+", label: "Trails Logged" },
    { target: 30, suffix: "+", label: "Destinations Map" },
    { target: 5, suffix: "★", label: "Group Rating" },
    { target: 100, suffix: "%", label: "Captains Guided" },
  ];

  return (
    <section className="w-full bg-[#111111] text-white py-14 px-6 lg:px-12 relative z-10 border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center px-4 lg:border-r lg:border-white/10 last:border-0"
          >
            <CounterItem target={stat.target} suffix={stat.suffix} />
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-3">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
