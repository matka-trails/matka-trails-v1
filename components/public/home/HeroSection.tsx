"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { publicApi, PublicDestination } from "@/lib/api";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Fallback high-quality destinations if local DB is empty
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

  // Fetch real destinations from DB
  useEffect(() => {
    publicApi
      .getDestinations()
      .then((data) => {
        if (data && data.length > 0) {
          // Map DB keys to match slides
          const mapped = data.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            description: d.description || "Explore beautiful trails and groups with the Captain.",
            coverImage: d.coverImage || FALLBACK_DESTINATIONS[0].coverImage,
          }));
          setDestinations(mapped);
        }
      })
      .catch((err) => console.log("Using fallback hero destinations", err));
  }, []);

  const total = destinations.length;

  // Auto-advance logic
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

  // Swiping controls for mobile
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

  // Staggered text animations
  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Stack of 3 upcoming preview cards
  const card1 = destinations[(activeIndex + 1) % total];
  const card2 = destinations[(activeIndex + 2) % total];
  const card3 = destinations[(activeIndex + 3) % total];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className="relative w-full h-[calc(100vh-72px)] min-h-[580px] bg-black overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Layer (Crossfading Images) ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getOptimizedImageUrl(destinations[activeIndex].coverImage, 1920)})`,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-transparent" />
      </div>

      {/* ── Left Timeline Indicators (Desktop Only) ── */}
      {!isMobile && (
        <div className="absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-10">
          <div className="w-[1px] h-32 bg-white/20 relative">
            <motion.div
              className="absolute w-full bg-primary"
              animate={{
                top: `${(activeIndex / (total - 1 || 1)) * 100}%`,
                height: "16px",
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {destinations.map((d, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={d.id}
                onClick={() => setActiveIndex(index)}
                className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full border border-white/40 transition-all duration-300 ${
                    active
                      ? "bg-primary border-primary scale-125 shadow-orange"
                      : "bg-transparent group-hover:border-white"
                  }`}
                />
                {active && (
                  <span className="absolute left-6 font-sans font-bold text-[10px] text-primary tracking-widest">
                    {pad(index + 1)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Central Details & CTA ── */}
      <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24 z-10">
        <div className="w-full lg:max-w-2xl text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-pill px-4 py-1.5 text-[10px] font-bold text-primary uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>FEATURED TRAIL</span>
              </div>

              {/* Title Mask Reveal */}
              <div className="overflow-hidden py-1">
                <motion.h1
                  variants={textVariants}
                  className="font-sans font-black italic text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-none tracking-tighter"
                >
                  {destinations[activeIndex].name.split(" ")[0]}
                  <span className="text-primary font-black">
                    .
                  </span>
                </motion.h1>
              </div>

              {/* Description */}
              <motion.p
                variants={textVariants}
                className="text-sm md:text-base text-white/70 max-w-lg leading-relaxed font-semibold"
              >
                {destinations[activeIndex].description}
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={textVariants} className="pt-4">
                <Link
                  href={`/packages?destinationId=${destinations[activeIndex].id}`}
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-xl shadow-orange hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Explore Package</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right Floating Cards Stack (Desktop Only) ── */}
      {!isMobile && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-8 lg:pr-12 gap-4 z-10">
          <div className="flex items-center gap-[-40px]">
            {/* Card 1 */}
            <motion.div
              onClick={() => setActiveIndex((activeIndex + 1) % total)}
              layoutId={`card-${card1.id}`}
              className="w-[200px] h-[300px] rounded-2xl overflow-hidden relative cursor-pointer shadow-float hover:scale-102 border border-white/10 transition-all z-20 shrink-0"
            >
              <Image
                src={getOptimizedImageUrl(card1.coverImage, 400)}
                alt={card1.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  NEXT UP
                </span>
                <h3 className="text-white font-bold text-sm truncate uppercase mt-0.5">
                  {card1.name}
                </h3>
              </div>
            </motion.div>

            {/* Card 2 */}
            <div
              onClick={() => setActiveIndex((activeIndex + 2) % total)}
              className="w-[180px] h-[270px] rounded-2xl overflow-hidden relative cursor-pointer shadow-float border border-white/5 opacity-70 hover:opacity-90 scale-95 -ml-8 transition-all z-10 shrink-0"
            >
              <Image
                src={getOptimizedImageUrl(card2.coverImage, 400)}
                alt={card2.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-xs truncate uppercase">
                  {card2.name}
                </h3>
              </div>
            </div>

            {/* Card 3 (Half Peek) */}
            <div
              onClick={() => setActiveIndex((activeIndex + 3) % total)}
              className="w-[160px] h-[240px] rounded-2xl overflow-hidden relative cursor-pointer shadow-float border border-white/5 opacity-40 hover:opacity-60 scale-90 -ml-8 transition-all z-0 shrink-0"
            >
              <Image
                src={getOptimizedImageUrl(card3.coverImage, 400)}
                alt={card3.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Dot Indicators & Swiping chips (Mobile Only) ── */}
      {isMobile && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {destinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "bg-primary w-6 shadow-orange"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Bottom Control Panel ── */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10 md:left-16 md:right-16 lg:left-24 lg:right-24">
        {/* Count */}
        <div className="font-sans font-extrabold text-sm text-white/50 tracking-wider">
          <span className="text-white">{pad(activeIndex + 1)}</span> / {pad(total)}
        </div>

        {/* Arrow Controls */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center text-white hover:text-primary transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center text-white hover:text-primary transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Fill */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-bold text-white/40">01</span>
          <div className="w-32 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white/40">{pad(total)}</span>
        </div>
      </div>

      {/* Background Ghost Title */}
      <div className="absolute bottom-20 left-6 md:left-16 lg:left-24 font-sans font-black italic text-8xl text-white/[0.03] uppercase tracking-tighter pointer-events-none select-none select-none">
        {destinations[activeIndex].name.split(" ")[0]}
      </div>
    </section>
  );
}
