"use client";

import { ShieldCheck, Star, Compass, Award } from "lucide-react";

export default function TrustStrip() {
  const stats = [
    { icon: <Compass className="w-5 h-5 text-primary" />, num: "120+", label: "Trips Completed" },
    { icon: <Star className="w-5 h-5 text-primary" />, num: "4.8★", label: "Customer Rating" },
    { icon: <ShieldCheck className="w-5 h-5 text-primary" />, num: "100%", label: "Group Security" },
    { icon: <Award className="w-5 h-5 text-primary" />, num: "30+", label: "Himalayan Passes" },
  ];

  return (
    <div className="w-full bg-[#111111] text-white py-6 px-6 lg:px-12 border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left px-4 md:border-r md:border-white/10 last:border-0"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <div className="font-sans font-black italic text-xl lg:text-2xl text-white leading-tight">
                {stat.num}
              </div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
