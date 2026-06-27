"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { publicApi } from "@/lib/api";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const FALLBACK_DESTINATIONS = [
  {
    id: "kedarnath",
    name: "Kedarnath Trek",
    slug: "kedarnath",
    description: "Trek through the spiritual trails of Himalayas. A journey of faith, pristine snow-capped peaks, and high-altitude lakes.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "rishikesh",
    name: "Rishikesh Adventure",
    slug: "rishikesh",
    description: "Conquer the rapids of Ganges, camp under the stars, and feel the adrenaline in India's official adventure capital.",
    coverImage: "https://images.unsplash.com/photo-1598977123418-45f04b616a0e?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "manali",
    name: "Manali Explorer",
    slug: "manali",
    description: "Hampta pass climbs, scenic solang valleys, hot water springs, and rustic wooden cottage stays amidst pine forests.",
    coverImage: "https://images.unsplash.com/photo-1626621340025-013b242d2b51?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "spiti",
    name: "Spiti Cold Desert",
    slug: "spiti",
    description: "Navigate through treacherous mud monasteries, wind-blown canyons, and high pass terrains in the trans-Himalayan desert.",
    coverImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function HeroSection() {
  const [destinations, setDestinations] = useState<any[]>(FALLBACK_DESTINATIONS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    publicApi
      .getDestinations()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            description: d.description || "Explore beautiful trails and groups with the Captain.",
            coverImage: d.coverImage || FALLBACK_DESTINATIONS[0].coverImage,
          })).slice(0, 5);
          setDestinations(mapped);
        }
      })
      .catch((err) => console.log("Using fallback hero destinations", err));
  }, []);

  const total = destinations.length;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(timer);
  }, [total, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const card1 = destinations[(activeIndex + 1) % total];
  const card2 = destinations[(activeIndex + 2) % total];
  const card3 = destinations[(activeIndex + 3) % total];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className="relative w-full h-[calc(100vh-72px)] min-h-[650px] bg-black overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getOptimizedImageUrl(destinations[activeIndex].coverImage, 1920)})`,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-black/30 to-black/20" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between">
        {/* ── Main content row ── */}
        <div className="flex-1 flex items-center w-full max-w-7xl mx-auto px-6 lg:px-12 gap-12 pt-12">
          
          {/* ── Left Indicator Timeline ── */}
          {!isMobile && (
            <div className="hidden lg:flex flex-col items-center gap-5 shrink-0 relative pr-4">
              {destinations.map((d, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveIndex(index)}
                    className="group relative flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                  >
                    {active && (
                      <span className="absolute -left-8 font-sans font-black text-[11px] text-primary tracking-wider">
                        {pad(index + 1)}
                      </span>
                    )}
                    <div
                      className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                        active ? "bg-primary border-primary scale-125" : "bg-white/30 border-transparent group-hover:bg-white/60"
                      }`}
                    />
                    {index < total - 1 && (
                      <div className={`w-[1px] h-8 my-1 transition-colors ${active ? 'bg-primary' : 'bg-white/10'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Central Details ── */}
          <div className="flex-1 min-w-0 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4 max-w-xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>FEATURED TRAIL</span>
                </div>

                <div className="overflow-hidden py-1">
                  <motion.h1
                    variants={textVariants}
                    className="font-sans font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-none tracking-tight"
                  >
                    {destinations[activeIndex].name.split(" ")[0]}
                    <span className="text-primary">.</span>
                  </motion.h1>
                </div>

                <motion.p
                  variants={textVariants}
                  className="text-sm md:text-base text-white/60 max-w-md leading-relaxed font-normal"
                >
                  {destinations[activeIndex].description}
                </motion.p>

                <motion.div variants={textVariants} className="pt-4">
                  <Link
                    href={`/destinations/${destinations[activeIndex].slug}`}
                    className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-bold text-xs tracking-widest uppercase px-7 py-3.5 rounded-full transition-all duration-200"
                  >
                    <span>Explore Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Floating Cards Dashboard ── */}
          {!isMobile && (
            <div className="hidden lg:flex items-end shrink-0 gap-4 self-center pt-8" style={{ width: "420px" }}>
              
              {/* Card 1 — Active / Primary Preview */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-center w-full px-2">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-0.5">NEXT UP</span>
                  <p className="text-white font-extrabold text-[13px] uppercase tracking-wide truncate max-w-[160px]">{card1.name}</p>
                  <div className="flex gap-1 mt-1.5 justify-center">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className={`w-1.5 h-1 rounded-full ${i === 0 ? 'bg-primary' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </div>
                <motion.div
                  onClick={() => setActiveIndex((activeIndex + 1) % total)}
                  layoutId={`card-${card1.id}`}
                  className="w-[170px] h-[250px] rounded-3xl overflow-hidden relative cursor-pointer border border-white/10 shadow-2xl hover:scale-[1.03] transition-all duration-300 z-20"
                >
                  <Image src={getOptimizedImageUrl(card1.coverImage, 400)} alt={card1.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </div>

              {/* Card 2 — Balanced Secondary */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-center w-full px-2 opacity-70">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">&nbsp;</span>
                  <p className="text-white/90 font-bold text-xs uppercase tracking-wide truncate max-w-[120px]">{card2.name}</p>
                  <div className="flex gap-1 mt-1.5 justify-center">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="w-1 h-1 rounded-full bg-white/20" />
                    ))}
                  </div>
                </div>
                <div
                  onClick={() => setActiveIndex((activeIndex + 2) % total)}
                  className="w-[125px] h-[190px] rounded-2xl overflow-hidden relative cursor-pointer border border-white/5 opacity-60 hover:opacity-100 transition-all duration-300 z-10"
                >
                  <Image src={getOptimizedImageUrl(card2.coverImage, 400)} alt={card2.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </div>

              {/* Card 3 — Smallest Background Element */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-center w-full opacity-40">
                  <p className="text-white/60 font-bold text-[10px] uppercase tracking-wide truncate max-w-[80px]">{card3.name}</p>
                </div>
                <div
                  onClick={() => setActiveIndex((activeIndex + 3) % total)}
                  className="w-[85px] h-[140px] rounded-2xl overflow-hidden relative cursor-pointer border border-white/5 opacity-30 hover:opacity-80 transition-all duration-300 z-0"
                >
                  <Image src={getOptimizedImageUrl(card3.coverImage, 400)} alt={card3.name} fill className="object-cover" />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── Bottom Control Panel Row ── */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pb-10 flex items-center justify-between z-20">
          
          {/* Mobile Dot Indicators or Left Page Count */}
          {isMobile ? (
            <div className="flex gap-2">
              {destinations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex ? "bg-primary w-5" : "bg-white/30 w-2"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="font-sans font-black text-sm tracking-widest text-white/40">
              <span className="text-white">{pad(activeIndex + 1)}</span> / {pad(total)}
            </div>
          )}

          {/* Centered Arrow Navigation Controls right under cards */}
          <div className="flex gap-2 lg:mr-[220px]">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Linear Progress bar exactly matching Foxico */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/30">01</span>
            <div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-white/30">{pad(total)}</span>
          </div>
        </div>
      </div>

      {/* Large Ambient Watermark Title */}
      <div className="absolute bottom-24 left-0 right-0 z-0 pointer-events-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <span className="font-sans font-black text-9xl text-white/[0.02] uppercase tracking-tighter block select-none">
            {destinations[activeIndex].name.split(" ")[0]}
          </span>
        </div>
      </div>
    </section>
  );
}