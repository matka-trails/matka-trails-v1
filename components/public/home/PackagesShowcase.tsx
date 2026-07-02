"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { publicApi, PublicPackage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Star,
  ArrowRight,
  Clock,
} from "lucide-react";

// ─── Shimmer Skeleton ────────────────────────────────────────────────────────
function PackageCardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`w-full max-w-[350px] bg-white rounded-3xl overflow-hidden border border-gray-border shadow-lg animate-pulse`}
    >
      <div
        className={`shimmer-bg w-full ${tall ? "h-[250px]" : "h-[210px]"}`}
      />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="shimmer-bg h-6 w-24 rounded-lg" />
          <div className="shimmer-bg h-5 w-12 rounded-lg" />
        </div>
        <div className="shimmer-bg h-5 w-4/5 rounded" />
        <div className="shimmer-bg h-4 w-full rounded" />
        <div className="shimmer-bg h-4 w-3/5 rounded" />
        <div className="shimmer-bg h-9 w-full rounded-xl mt-2" />
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
      <div
        className={`bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 group-hover:-translate-y-2
          ${
            isCenter
              ? "shadow-2xl border-2 border-primary/40 ring-2 ring-primary/5"
              : "shadow-lg border border-gray-border group-hover:shadow-xl"
          }`}
      >
        {/* Cover Image */}
        <div
          className="relative overflow-hidden"
          style={{ height: isCenter ? 250 : 210 }}
        >
          {pkg.coverImage ? (
            <Image
              src={pkg.coverImage}
              alt={pkg.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <Compass className="w-10 h-10 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Group type badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`text-[9px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow
              ${isCenter ? "bg-primary text-white" : "bg-white/90 text-black"}`}
            >
              {pkg.groupType}
            </span>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-4 right-4 text-right">
            <span className="text-[9px] text-white/60 uppercase tracking-widest font-bold block leading-none">
              From
            </span>
            <span
              className={`font-sans font-black italic leading-none
              ${isCenter ? "text-2xl text-primary" : "text-xl text-white"}`}
            >
              {formatPrice(pkg.priceDiscounted || pkg.priceOriginal)}
            </span>
          </div>

          {/* Destination */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white/80 text-[10px] font-semibold">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="truncate max-w-[120px]">
              {pkg.destination?.name}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-gray-light">
              <span className="flex items-center gap-1.5 bg-gray-bg px-2.5 py-1 rounded-lg text-gray-dark">
                <Clock className="w-3 h-3 text-primary" />
                <span>
                  {pkg.durationDays}D / {pkg.durationNights}N
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="font-bold text-gray-dark">4.8</span>
              </span>
            </div>

            <h3
              className={`font-sans font-extrabold leading-tight text-black group-hover:text-primary transition-colors line-clamp-2
              ${isCenter ? "text-base" : "text-sm"}`}
            >
              {pkg.title}
            </h3>

            {pkg.summary && (
              <p className="text-[11px] text-gray-mid line-clamp-2 leading-relaxed">
                {pkg.summary}
              </p>
            )}
          </div>

          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300
                ${
                  isCenter
                    ? "bg-primary text-white px-5 py-2.5 rounded-xl w-full justify-center shadow-orange hover:bg-primary-dark"
                    : "bg-white border border-gray-border text-gray-dark hover:border-primary hover:text-primary px-4 py-2 rounded-xl"
                }`}
            >
              <span>More Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Snap Card ────────────────────────────────────────────────────────
function MobilePackageCard({ pkg }: { pkg: PublicPackage }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-border flex flex-col h-full w-full justify-between">
      {/* Cover Image */}
      <div className="relative overflow-hidden h-[240px] w-full shrink-0">
        {pkg.coverImage ? (
          <Image
            src={pkg.coverImage}
            alt={pkg.title}
            fill
            sizes="85vw"
            className="object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <Compass className="w-8 h-8 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-white">
            {pkg.groupType}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 text-right">
          <span className="text-[9px] text-white/60 uppercase tracking-widest font-bold block leading-none">
            From
          </span>
          <span className="font-sans font-black italic text-xl text-primary leading-none">
            {formatPrice(pkg.priceDiscounted || pkg.priceOriginal)}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/80 text-[10px] font-semibold">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="truncate max-w-[120px]">
            {pkg.destination?.name}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-semibold">
            <span className="flex items-center gap-1.5 bg-gray-bg px-2 py-1 rounded-lg text-gray-dark">
              <Clock className="w-3 h-3 text-primary" />
              {pkg.durationDays}D / {pkg.durationNights}N
            </span>
            <span className="flex items-center gap-1 text-gray-mid">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="font-bold text-gray-dark">4.8</span>
            </span>
          </div>

          <h3 className="font-sans font-extrabold text-sm leading-tight text-black line-clamp-2">
            {pkg.title}
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-primary text-white px-4 py-2 mt-2 rounded-xl w-full justify-center">
          <span>More Details</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PackagesShowcase() {
  const router = useRouter();
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startIdx, setStartIdx] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
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
    setAnimDir("left");
    setTimeout(() => {
      setStartIdx((prev) => (prev + 1) % total);
      setAnimDir(null);
      animating.current = false;
    }, 280);
  };

  const goPrev = () => {
    if (!showNav || animating.current) return;
    animating.current = true;
    setAnimDir("right");
    setTimeout(() => {
      setStartIdx((prev) => (prev - 1 + total) % total);
      setAnimDir(null);
      animating.current = false;
    }, 280);
  };

  return (
    <section
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
            <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize">
              Our Popular <span className="marker-zigzag text-primary">Packages</span>
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
                  <MobilePackageCard pkg={pkg} />
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
                    <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize">
                      Our Popular{" "}
                      <span className="marker-zigzag text-primary">
                        Packages
                      </span>
                    </h2>
                    <p className="text-gray-dark text-lg md:text-base mt-2">
                      Explore our most popular tour packages.
                    </p>
                  </div>
                  <PackageCardSkeleton tall />
                </div>
                <div className="flex justify-center pt-16">
                  <PackageCardSkeleton />
                </div>
              </div>
            ) : (
              <div
                className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start py-8 px-4 md:px-8"
                style={{
                  opacity: animDir ? 0.4 : 1,
                  transform:
                    animDir === "left"
                      ? "translateX(-16px)"
                      : animDir === "right"
                        ? "translateX(16px)"
                        : "translateX(0)",
                  transition: "opacity 0.28s ease, transform 0.28s ease",
                }}
              >
                <div className="flex justify-center lg:pt-16">
                  {visiblePkgs[0] && (
                    <PackageZigzagCard
                      pkg={visiblePkgs[0]}
                      slot={0}
                      onClick={() =>
                        router.push(`/packages/${visiblePkgs[0].slug}`)
                      }
                    />
                  )}
                </div>

                <div className="flex flex-col items-center space-y-12">
                  <div className="text-center max-w-sm pb-2">
                    <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize">
                      Our Popular{" "}
                      <span className="marker-zigzag text-primary">
                        Packages
                      </span>
                    </h2>
                    <p className="text-gray-dark text-lg md:text-base mt-2">
                      Explore our most popular tour packages.
                    </p>
                  </div>

                  {visiblePkgs[1] && (
                    <PackageZigzagCard
                      pkg={visiblePkgs[1]}
                      slot={1}
                      onClick={() =>
                        router.push(`/packages/${visiblePkgs[1].slug}`)
                      }
                    />
                  )}
                </div>

                <div className="flex justify-center lg:pt-16">
                  {visiblePkgs[2] && (
                    <PackageZigzagCard
                      pkg={visiblePkgs[2]}
                      slot={2}
                      onClick={() =>
                        router.push(`/packages/${visiblePkgs[2].slug}`)
                      }
                    />
                  )}
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
