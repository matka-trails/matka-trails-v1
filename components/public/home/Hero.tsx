"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Compass, CheckCircle } from "lucide-react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <section className="relative w-full h-[85vh] bg-[#fff8f0] flex flex-col items-center justify-center gap-4">
        <Compass className="w-12 h-12 text-primary animate-pulse" />
        <span className="text-xs text-black/50 tracking-widest font-semibold uppercase">Preparing Trails...</span>
      </section>
    );
  }

  const popularDestinations = [
    { name: "Kedarnath", id: "packages-showcase" },
    { name: "Spiti Valley", id: "packages-showcase" },
    { name: "Ladakh", id: "packages-showcase" },
    { name: "Rishikesh", id: "packages-showcase" },
  ];

  return (
    <section className="relative w-full min-h-fit bg-[#fff8f0] overflow-hidden flex flex-col select-none">
      
      {/* ─── DESKTOP LAYOUT (lg and above) ─── */}
      <div className="hidden lg:flex relative w-full h-[calc(100vh-72px)] flex-col justify-between py-12 px-12 z-10 overflow-hidden bg-[#0c0c0d]">
        
        {/* Background Image Layer (0.8 Opacity over Dark Background) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-80">
            <Image
              src="/hero-bg.png"
              alt="Matka Trails Landscape"
              fill
              priority
              quality={100}
              className="object-cover object-bottom"
            />
          </div>
          {/* Dark Overlay to ensure maximum contrast */}
          <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        </div>

        {/* Top Space Balancer */}
        <div className="h-6" />

        {/* Central Branding Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center px-6">
          <h1 
            className="font-sans font-extrabold text-5xl xl:text-6xl text-white leading-[1.2] uppercase tracking-tight"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}
          >
            Bored of the office view? <br />
            Escape this weekend with <br />
            <motion.span 
              className="font-reminder text-primary inline-block pb-2 cursor-default"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              Matka Trails
            </motion.span>
          </h1>

          <p 
            className="text-lg text-white/90 font-semibold max-w-2xl mt-5 leading-relaxed"
            style={{ textShadow: "0 1px 5px rgba(0, 0, 0, 0.5)" }}
          >
            Ditch the office cubicle. We arrange custom weekend getaways, trekking trails, and group departures starting every Friday. Handcrafted for working professionals.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-row gap-4 items-center justify-center mt-8">
            <button
              onClick={() => handleScrollTo("packages-showcase")}
              className="group inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-xl shadow-orange transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>See Our Packages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleScrollTo("contact-section")}
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-dark text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Book a Quick Quote</span>
              <Compass className="w-4 h-4 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Bottom Trust Indicators & Quick Pills (Strictly in one row) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-row justify-between items-center gap-4 mt-auto border-t border-white/10 pt-6">
          {/* Quick pills */}
          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            <span className="text-[11px] font-black text-white/60 uppercase tracking-widest mr-2 shrink-0" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              Popular Trails:
            </span>
            <div className="flex flex-row gap-2 flex-nowrap">
              {popularDestinations.map((dest, i) => (
                <button
                  key={i}
                  onClick={() => handleScrollTo(dest.id)}
                  className="text-xs font-bold px-3.5 py-1.5 bg-white/10 hover:bg-primary border border-white/10 hover:border-transparent text-white rounded-full shadow-sm backdrop-blur-xs transition-all duration-200 cursor-pointer shrink-0"
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Benefits badge strip */}
          <div className="flex items-center gap-3 flex-nowrap shrink-0">
            {[
              "100% Customized Trips",
              "Local Certified Sherpas",
              "Zero Hidden Charges",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-xl shadow-sm shrink-0">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="shrink-0">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MOBILE LAYOUT (lg and below) ─── */}
      <div className="lg:hidden flex flex-col h-auto w-full relative bg-[#fff8f0]">
        
        {/* Mountain Illustration Section - Top 38% */}
        <div className="relative w-full h-[38vh] min-h-[260px] overflow-hidden shrink-0">
          <Image
            src="/hero-bg.png"
            alt="Matka Trails Mountain View"
            fill
            priority
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-black/15 flex flex-col items-center justify-center p-6" />

          {/* Catchy & Crazy Line Directly Over the Image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <span 
                className="font-reminder text-white text-3xl font-black tracking-wider px-5 py-2.5 bg-black/35 backdrop-blur-xs border-2 border-white rounded-3xl transform rotate-[-2deg] shadow-lg select-none"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                Out of Office: ON!
              </span>
              <span 
                className="text-[10px] text-white font-black uppercase tracking-widest mt-2 px-3 py-1 bg-primary rounded-full shadow-md select-none"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
              >
                Your desk can wait. The fun can&apos;t!
              </span>
            </motion.div>
          </div>
        </div>

        {/* Curved Content Sheet - Auto height wrapper (flows naturally, no stretching, packages show immediately below) */}
        <div className="w-full bg-cream-bg rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] border-t border-white/60 -mt-10 relative z-20 px-6 pt-10 pb-12 flex flex-col justify-start gap-6 h-auto">
          
          {/* Typography Heading */}
          <div className="text-center space-y-3">
            <h1 className="font-sans font-extrabold text-2xl text-black leading-[1.3] uppercase">
              Stuck in the office? <br />
              Escape this weekend with <br />
              <motion.span 
                className="font-reminder text-primary inline-block cursor-default"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                Matka Trails
              </motion.span>
            </h1>
            <p className="text-xs font-bold text-gray-mid leading-relaxed max-w-xs mx-auto">
              Ditch the 9-to-5 routine. Premium weekend trips starting every Friday night. Handcrafted for busy corporate employees.
            </p>
          </div>

          {/* Inline Buttons (Immediately positioned below description, flexible spacing) */}
          <div className="flex flex-row gap-2 w-full px-1 mt-2">
            <button
              onClick={() => handleScrollTo("packages-showcase")}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary active:bg-primary-dark text-white font-bold text-[11px] uppercase tracking-wider py-3.5 rounded-xl shadow-orange transition-all duration-150 cursor-pointer"
            >
              <span>See Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleScrollTo("contact-section")}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-black active:bg-gray-dark text-white font-bold text-[11px] uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all duration-150 cursor-pointer"
            >
              <span>Quick Quote</span>
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
