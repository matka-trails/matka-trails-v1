"use client";

import { Sparkles, Shield, UserCheck, ShieldAlert, Award } from "lucide-react";

export default function WhyMatkaTrails() {
  const points = [
    {
      title: "No Third Party Mess",
      desc: "100 percent in-house operations for all trips! No third parties involved, hence no fishy claims!",
      accent: "text-emerald-500",
      svgIllustration: (
        <svg className="w-16 h-16 text-emerald-500 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
          <path d="M12 8v4l3 3"/>
          <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      )
    },
    {
      title: "Transparency & Security",
      desc: "Real time monitoring of all trips by ground team! All routes and weather conditions are accurately updated!",
      accent: "text-blue-500",
      svgIllustration: (
        <svg className="w-16 h-16 text-blue-500 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="8" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      )
    },
    {
      title: "Co-Travelers Filtering",
      desc: "Multi-step filtering to bring only like-minded people together! That's our key to have fuss-free trips!",
      accent: "text-amber-500",
      svgIllustration: (
        <svg className="w-16 h-16 text-amber-500 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16v2L14 12v6l-4 2v-8L4 6V4z" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="5" r="2" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: "One Stop Hassle Free",
      desc: "Comfortable stays, trained drivers, hospitable staff and friendly trip leaders put together that one memorable trip!",
      accent: "text-cyan-500",
      svgIllustration: (
        <svg className="w-16 h-16 text-cyan-500 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-2.584 1.13 1.13 0 012.238 0 3.42 3.42 0 001.946 2.584 1.13 1.13 0 011.602 1.602 3.42 3.42 0 002.584 1.946 1.13 1.13 0 010 2.238 3.42 3.42 0 00-2.584 1.946 1.13 1.13 0 01-1.602 1.602 3.42 3.42 0 00-1.946 2.584 1.13 1.13 0 01-2.238 0 3.42 3.42 0 00-1.946-2.584 1.13 1.13 0 01-1.602-1.602 3.42 3.42 0 00-2.584-1.946 1.13 1.13 0 010-2.238 3.42 3.42 0 002.584-1.946 1.13 1.13 0 011.602-1.602z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-24 px-6 lg:px-12 bg-cream-bg relative overflow-hidden">
      {/* Decorative side mesh or glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-lg mx-auto">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 bg-primary-light px-3.5 py-1.5 rounded-full w-max mx-auto shadow-orange/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matka Trails DNA</span>
          </span>
          <h2 className="font-sans font-black italic text-3xl md:text-5xl text-black leading-none tracking-tight">
            Why Matka Trails?
          </h2>
          <p className="text-xs md:text-sm text-gray-mid leading-relaxed font-semibold">
            Say goodbye to coordination hassles. We run end-to-end, high-security group experiences curated specifically for modern nomads.
          </p>
        </div>

        {/* 4 Cards Grid - Styled beautifully with curves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-border overflow-hidden flex flex-col justify-between hover:shadow-float hover:-translate-y-1.5 transition-all duration-300 relative h-[360px] p-6 shadow-card group"
            >
              
              {/* Top Curved Accent Wave Line */}
              <div className="absolute top-0 left-0 w-full h-[60px] pointer-events-none opacity-20">
                <svg className="w-full h-full text-cyan-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,30 C30,70 70,10 100,50 L100,0 L0,0 Z" fill="currentColor"/>
                </svg>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 text-center mt-6 relative z-10">
                <h3 className="font-sans font-black text-base text-black uppercase tracking-tight group-hover:text-primary transition-colors">
                  {point.title}
                </h3>
                <p className="text-[11px] text-gray-mid leading-relaxed font-bold px-1">
                  {point.desc}
                </p>
              </div>

              {/* Bottom Custom SVG Illustration & Waves */}
              <div className="w-full text-center relative mt-auto pb-4">
                {point.svgIllustration}

                {/* Subtle bottom curve overlay */}
                <div className="absolute bottom-0 left-0 w-full h-[30px] pointer-events-none opacity-10">
                  <svg className="w-full h-full text-cyan-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,70 C30,30 70,90 100,50 L100,100 L0,100 Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
