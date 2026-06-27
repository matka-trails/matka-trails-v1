"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { publicApi, PublicPackage } from "@/lib/api";
import PackageCard from "../packages/PackageCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ArrowRight, Sparkles, MoveRight, Layers } from "lucide-react";

export default function PackagesSection() {
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  
  // Mobile stack deck index state
  const [topIndex, setTopIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Fetch featured packages
  useEffect(() => {
    publicApi
      .getPackages({ limit: 6 })
      .then((res) => {
        setPackages(res.packages);
      })
      .catch((err) => console.error("Featured packages fetch fail", err));
  }, []);

  // Desktop horizontal pin scroll effect
  useEffect(() => {
    if (isMobile || packages.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    // Pin the section and scroll the track sideways
    const scrollAnimation = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 120),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
        pin: true,
        scrub: 1.1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      scrollAnimation.scrollTrigger?.kill();
      scrollAnimation.kill();
    };
  }, [isMobile, packages]);

  // Handler to cycle deck stack on mobile
  const cycleDeck = () => {
    if (packages.length <= 1) return;
    setTopIndex((prev) => (prev + 1) % packages.length);
  };

  if (packages.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${
        isMobile ? "py-16 px-6 bg-gray-bg" : "h-screen bg-gray-bg flex items-center overflow-hidden"
      }`}
    >
      {/* ── DESKTOP SCROLL PIN LAYOUT ── */}
      {!isMobile ? (
        <div className="flex h-[80%] items-center w-full px-12 lg:px-24 select-none">
          {/* Static Left text */}
          <div className="w-[30%] shrink-0 pr-12 flex flex-col justify-center space-y-5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRENDING TRAILS</span>
            </span>
            <h2 className="font-sans font-black text-4xl lg:text-5xl text-black leading-none tracking-tight">
              Our Signature <br />
              <span className="text-primary italic">Weekenders.</span>
            </h2>
            <p className="text-sm text-gray-mid leading-relaxed font-semibold max-w-[280px]">
              No mapping headaches. No booking stress. Just lock your dates and join your tribe.
            </p>
            <div className="pt-2">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-dark group"
              >
                <span>View All Trails</span>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Horizontal scroll track */}
          <div ref={trackRef} className="flex gap-6 pl-4 items-center">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                className="w-[340px] shrink-0"
              />
            ))}
            
            {/* View all card at the end */}
            <div className="w-[280px] h-[460px] rounded-2xl border-2 border-dashed border-gray-border flex flex-col items-center justify-center text-center p-8 bg-white shrink-0 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
                <MoveRight className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-extrabold text-lg text-black mb-1">
                More Adventures
              </h4>
              <p className="text-xs text-gray-light leading-relaxed mb-6 font-semibold">
                Discover 20+ other hand-crafted trekking routes and rafting expeditions.
              </p>
              <Link
                href="/packages"
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-xl shadow-orange transition-colors"
              >
                Browse All
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ── MOBILE CARD DECK STACK ── */
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>POPULAR TRAILS</span>
            </span>
            <h2 className="font-sans font-black text-3xl text-black leading-none tracking-tight">
              Featured Weekends
            </h2>
            <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-[260px] mx-auto">
              Solo in, group out. Scroll down or tap to shuffle available trips.
            </p>
          </div>

          {/* Physical Deck container */}
          <div className="relative h-[480px] w-full max-w-[340px] mx-auto mt-6">
            {packages.map((pkg, idx) => {
              // Calculate deck index relative to topIndex
              const position = (idx - topIndex + packages.length) % packages.length;
              
              // Only render the top 3 cards in the deck, hide the rest
              if (position > 2) return null;

              // Top card gets full opacity, rotation 0
              // Second card offset slightly with tiny rotation
              // Third card offset more
              const styles = [
                { zIndex: 3, top: "0px", transform: "scale(1) rotate(0deg)", opacity: 1 },
                { zIndex: 2, top: "12px", transform: "scale(0.96) rotate(-1.5deg) translateX(-4px)", opacity: 0.9 },
                { zIndex: 1, top: "24px", transform: "scale(0.92) rotate(1.5deg) translateX(4px)", opacity: 0.7 },
              ][position];

              return (
                <div
                  key={pkg.id}
                  onClick={position === 0 ? cycleDeck : undefined}
                  className="absolute left-0 right-0 transition-all duration-300 ease-out select-none cursor-pointer"
                  style={styles}
                >
                  <PackageCard pkg={pkg} className="shadow-float" />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              onClick={cycleDeck}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary-light px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Shuffle Deck</span>
            </button>
            <p className="text-[10px] text-gray-light font-medium">
              Tap card or button to cycle to the next weekend package.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
