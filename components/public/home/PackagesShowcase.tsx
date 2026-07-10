"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { publicApi, PublicPackage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import PackageCard from "@/components/public/packages/PackageCard";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Star,
  ArrowRight,
  Clock,
} from "lucide-react";

const slideVariants = {
  initial: (dir: "left" | "right") => ({
    x: dir === "left" ? "105%" : "-105%",
    opacity: 0,
  }),
  active: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: "left" | "right") => ({
    x: dir === "left" ? "-105%" : "105%",
    opacity: 0,
  }),
};

// ─── Shimmer Skeleton ────────────────────────────────────────────────────────
function PackageCardSkeleton() {
  return (
    <div
      className="w-full max-w-[350px] bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 flex flex-col h-[240px] sm:h-[320px] md:h-[420px] shadow-lg animate-pulse relative p-5 justify-between"
    >
      {/* Top badges shimmer */}
      <div className="flex justify-between items-start">
        <div className="shimmer-bg h-6 w-16 rounded-full bg-neutral-800" />
        <div className="shimmer-bg h-6 w-24 rounded-full bg-neutral-800" />
      </div>
      
      {/* Bottom text shimmer */}
      <div className="space-y-3 w-full">
        {/* Inclusion bar */}
        <div className="shimmer-bg h-6 w-full rounded-lg bg-neutral-800" />
        {/* Title */}
        <div className="shimmer-bg h-7 w-5/6 rounded-md bg-neutral-800" />
        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
          <div className="shimmer-bg h-4 w-3/4 rounded bg-neutral-800" />
          <div className="shimmer-bg h-4 w-3/4 rounded bg-neutral-800" />
          <div className="shimmer-bg h-4 w-full rounded bg-neutral-800 col-span-2" />
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Zigzag Card ─────────────────────────────────────────────────────
function PackageZigzagCard({
  pkg,
  slot,
  onClick,
}: {
  pkg: PublicPackage;
  slot: number;
  onClick: () => void;
}) {
  const isCenter = slot === 1;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer w-full max-w-[350px] transition-all duration-300"
    >
      <PackageCard
        pkg={pkg}
        className={
          isCenter
            ? "border-2 border-primary shadow-lg shadow-primary/20 scale-[1.02]"
            : "shadow-lg border border-white/10"
        }
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PackagesShowcase() {
  const router = useRouter();
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startIdx, setStartIdx] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const animating = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    publicApi
      .getPackages({ limit: 12 })
      .then((res) => {
        setPackages(res.packages);
        if (res.packages.length > 0) setActiveCardId(res.packages[0].id);
      })
      .catch((err) => console.error("Packages fetch error", err))
      .finally(() => setIsLoading(false));
  }, []);

  // IntersectionObserver for mobile active card
  useEffect(() => {
    if (packages.length === 0 || !scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.pkgid;
            if (id) setActiveCardId(id);
          }
        });
      },
      { root: scrollRef.current, threshold: 0.6 },
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [packages]);

  const total = packages.length;
  const showNav = total > 3;
  const visiblePkgs = [0, 1, 2].map(
    (offset) => packages[(startIdx + offset) % total],
  );

  const goNext = () => {
    if (!showNav || animating.current) return;
    animating.current = true;
    setDirection("left");
    setStartIdx((prev) => (prev + 1) % total);
    setTimeout(() => {
      animating.current = false;
    }, 450);
  };

  const goPrev = () => {
    if (!showNav || animating.current) return;
    animating.current = true;
    setDirection("right");
    setStartIdx((prev) => (prev - 1 + total) % total);
    setTimeout(() => {
      animating.current = false;
    }, 450);
  };

  return (
    <section
      id="packages-showcase"
      className="w-full bg-white py-10 md:py-16 overflow-hidden relative bg-no-repeat bg-top"
      style={{
        backgroundImage: `url("https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1782819706/tourbg_bhks7i.png")`,
        backgroundSize: "100% 50%",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── MOBILE: Snap Scroll Carousel ── */}
        <div className="lg:hidden">
          {/* Mobile Section Header */}
          <div className="text-center mb-8">
            <h2 className="font-reminder text-3xl md:text-4xl text-black leading-none tracking-wide capitalize">
              Matka Popular <span className="marker-zigzag text-primary">Packages</span>
            </h2>
            <p className="text-gray-dark text-lg md:text-base mt-2">
              Explore our most popular tour packages.
            </p>
          </div>

          {isLoading ? (
            /* Mobile shimmer */
            <div className="flex gap-2 px-4 pb-4 overflow-x-hidden">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="shrink-0 animate-pulse"
                  style={{ width: "76%", minWidth: "76%" }}
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-border shadow-lg">
                    <div className="shimmer-bg h-[240px] w-full" />
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="shimmer-bg h-6 w-24 rounded-lg" />
                        <div className="shimmer-bg h-5 w-12 rounded-lg" />
                      </div>
                      <div className="shimmer-bg h-5 w-4/5 rounded" />
                      <div className="shimmer-bg h-9 w-full rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-2 px-4 pb-6 scrollbar-hide items-stretch"
            >
              {packages.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  data-pkgid={pkg.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`shrink-0 snap-center transition-all duration-300 cursor-pointer flex flex-col ${
                    activeCardId === pkg.id
                      ? "opacity-100 scale-100"
                      : "opacity-60 scale-[0.97]"
                  }`}
                  style={{ width: "89%", minWidth: "89%" }}
                  onClick={() => router.push(`/packages/${pkg.slug}`)}
                >
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DESKTOP: Zigzag 3-column layout ── */}
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-center">
            {showNav && (
              <button
                onClick={goPrev}
                className="absolute left-0 lg:-left-6 z-30 w-12 h-12 rounded-full bg-white border border-gray-border shadow-md hover:border-primary hover:bg-primary/5 flex items-center justify-center text-gray-mid hover:text-primary transition-all duration-200 cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
              </button>
            )}

            {isLoading ? (
              /* Desktop shimmer */
              <div className="w-full grid grid-cols-3 gap-10 items-start py-8 px-8">
                <div className="flex justify-center pt-16">
                  <PackageCardSkeleton />
                </div>
                <div className="flex flex-col items-center space-y-12">
                  <div className="text-center max-w-sm pb-2">
                    <h2 className="font-reminder text-3xl md:text-4xl text-black leading-none tracking-wide capitalize">
                      Matka Popular{" "}
                      <span className="marker-zigzag text-primary">
                        Packages
                      </span>
                    </h2>
                    <p className="text-gray-dark text-lg md:text-base mt-2">
                      Explore our most popular tour packages.
                    </p>
                  </div>
                  <PackageCardSkeleton />
                </div>
                <div className="flex justify-center pt-16">
                  <PackageCardSkeleton />
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start py-8 px-4 md:px-8">
                {/* Column 1 (Left slot) */}
                <div className="relative w-full h-[560px] overflow-hidden flex justify-center items-start lg:pt-16">
                  <AnimatePresence initial={false} custom={direction}>
                    {visiblePkgs[0] && (
                      <motion.div
                        key={visiblePkgs[0].id}
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="active"
                        exit="exit"
                        transition={{ duration: 0.48, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute w-full flex justify-center"
                      >
                        <PackageZigzagCard
                          pkg={visiblePkgs[0]}
                          slot={0}
                          onClick={() =>
                            router.push(`/packages/${visiblePkgs[0].slug}`)
                          }
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Column 2 (Middle slot) */}
                <div className="flex flex-col items-center space-y-12 w-full">
                  <div className="text-center max-w-sm pb-2">
                    <h2 className="font-reminder text-3xl md:text-4xl text-black leading-none tracking-wide capitalize">
                      Matka Popular{" "}
                      <span className="marker-zigzag text-primary">
                        Packages
                      </span>
                    </h2>
                    <p className="text-gray-dark text-lg md:text-base mt-2">
                      Explore our most popular tour packages.
                    </p>
                  </div>

                  <div className="relative w-full h-[560px] overflow-hidden flex justify-center items-start">
                    <AnimatePresence initial={false} custom={direction}>
                      {visiblePkgs[1] && (
                        <motion.div
                          key={visiblePkgs[1].id}
                          custom={direction}
                          variants={slideVariants}
                          initial="initial"
                          animate="active"
                          exit="exit"
                          transition={{ duration: 0.48, ease: [0.25, 1, 0.5, 1] }}
                          className="absolute w-full flex justify-center"
                        >
                          <PackageZigzagCard
                            pkg={visiblePkgs[1]}
                            slot={1}
                            onClick={() =>
                              router.push(`/packages/${visiblePkgs[1].slug}`)
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Column 3 (Right slot) */}
                <div className="relative w-full h-[560px] overflow-hidden flex justify-center items-start lg:pt-16">
                  <AnimatePresence initial={false} custom={direction}>
                    {visiblePkgs[2] && (
                      <motion.div
                        key={visiblePkgs[2].id}
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="active"
                        exit="exit"
                        transition={{ duration: 0.48, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute w-full flex justify-center"
                      >
                        <PackageZigzagCard
                          pkg={visiblePkgs[2]}
                          slot={2}
                          onClick={() =>
                            router.push(`/packages/${visiblePkgs[2].slug}`)
                          }
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {showNav && (
              <button
                onClick={goNext}
                className="absolute right-0 lg:-right-6 z-30 w-12 h-12 rounded-full bg-white border border-gray-border shadow-md hover:border-primary hover:bg-primary/5 flex items-center justify-center text-gray-mid hover:text-primary transition-all duration-200 cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
