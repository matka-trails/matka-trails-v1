"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { publicApi, HeroConfig, PublicDestination, PublicPackage } from "@/lib/api";
import { getOptimizedImageUrl } from "@/lib/utils";

// ─── Default fallback data ────────────────────────────────────────────────────
const DEFAULT_BG =
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783245391/bgCover_d221x3.png";
const DEFAULT_WORDS = ["Ladakh", "Spiti Valley", "Kedarnath", "Rishikesh", "Manali"];
const DEFAULT_SLIDES = [
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783244871/4_ranzlz.webp",
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783244871/1_tynl9k.webp",
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783244871/2_f52orp.webp",
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783244871/5_ghxoo5.webp",
];

// ─── Search result type ───────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  label: string;
  type: "destination" | "package";
  url: string;
  coverImage?: string | null;
}

// ─── Sub-component: Rotating word ────────────────────────────────────────────
function RotatingWord({
  words,
  className,
  style,
}: {
  words: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), 2800);
    return () => clearInterval(t);
  }, [words]);

  return (
    // overflow-hidden clips the slide animation vertically; whitespace-nowrap
    // prevents multi-word destinations ("Spiti Valley") from wrapping
    <span
      className={`inline-block overflow-hidden whitespace-nowrap ${className ?? ""}`}
      style={style}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.33, 1, 0.68, 1] }}
          className="block whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Sub-component: Desktop Glassmorphic Trip Cards (bottom-to-top on load) ──
function DesktopGlassCards({
  cards,
}: {
  cards: { imageUrl: string; destinationName?: string | null }[];
}) {
  const [top, setTop] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Slight delay so initial animation plays nicely after hero mounts
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (cards.length <= 1) return;
    const t = setInterval(() => setTop((i) => (i + 1) % cards.length), 3200);
    return () => clearInterval(t);
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <div className="relative w-[240px] h-[320px] select-none">
      {cards.map((card, i) => {
        const offset = (i - top + cards.length) % cards.length;
        const isVisible = offset < 3;
        const zIndex = 10 - offset;
        const scale = 1 - offset * 0.06;
        const ty = offset * -20;
        const tx = offset * 10;
        const opacity = offset === 0 ? 1 : offset === 1 ? 0.72 : 0.42;

        return (
          <motion.div
            key={card.imageUrl + i}
            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-default"
            style={{ zIndex }}
            initial={loaded ? undefined : { y: 60, opacity: 0, scale: 0.85 }}
            animate={{
              y: loaded ? ty : 0,
              x: tx,
              scale: loaded ? scale : 1,
              opacity: loaded ? (isVisible ? opacity : 0) : 1,
            }}
            transition={{
              duration: loaded ? 0.6 : 0.7,
              ease: [0.33, 1, 0.68, 1],
              delay: loaded ? 0 : i * 0.12,
            }}
          >
            {/* Image */}
            <div className="absolute inset-0">
              {card.imageUrl && (
                <Image
                  src={getOptimizedImageUrl(card.imageUrl, 600) || card.imageUrl}
                  alt={card.destinationName || "Trip"}
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>

            {/* Glass label */}
            {card.destinationName && (
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <div className="bg-white/12 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2.5">
                  <p className="text-white font-bold text-sm tracking-wide truncate">
                    {card.destinationName}
                  </p>
                  <p className="text-white/55 text-[11px] font-medium mt-0.5">Adventure Awaits</p>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Sub-component: Mobile Carousel ──────────────────────────────────────────
function MobileCarousel({
  slides,
}: {
  slides: { imageUrl: string; destination?: { slug: string; name: string } | null }[];
}) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 3500);
  }, [slides.length]);

  useEffect(() => {
    startAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [startAuto]);

  const goTo = (n: number) => {
    setCurrent((n + slides.length) % slides.length);
    startAuto();
  };

  if (slides.length === 0) return null;

  const slide = slides[current];
  const href = slide.destination ? `/destinations/${slide.destination.slug}` : "#";

  return (
    <div className="w-full px-5">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-xl"
        style={{ aspectRatio: "16/9" }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current}
            initial={{ x: "100%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.6 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Link href={href} className="block w-full h-full">
              <Image
                src={getOptimizedImageUrl(slide.imageUrl, 800) || slide.imageUrl}
                alt={slide.destination?.name || "Trip poster"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 600px"
                priority={current === 0}
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-primary w-5" : "bg-gray-300 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sub-component: Search Bar ────────────────────────────────────────────────
function HeroSearchBar({ variant }: { variant: "desktop" | "mobile" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [allPackages, setAllPackages] = useState<PublicPackage[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    publicApi.getDestinations().then(setDestinations).catch(() => {});
    publicApi
      .getPackages({ status: "PUBLISHED", limit: 200 })
      .then((res) => setAllPackages(res.packages))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const doSearch = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      const lower = q.toLowerCase();
      const destResults: SearchResult[] = destinations
        .filter((d) => d.name.toLowerCase().includes(lower))
        .slice(0, 4)
        .map((d) => ({
          id: d.id,
          label: d.name,
          type: "destination",
          url: `/destinations/${d.slug}`,
          coverImage: d.coverImage,
        }));
      const pkgResults: SearchResult[] = allPackages
        .filter((p) => p.title.toLowerCase().includes(lower))
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          label: p.title,
          type: "package",
          url: `/packages/${p.slug}`,
          coverImage: p.coverImage,
        }));
      setResults([...destResults, ...pkgResults].slice(0, 8));
      setOpen(true);
      setLoading(false);
    },
    [destinations, allPackages]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 200);
  };

  const placeholders = ["Spiti Valley", "Ladakh", "Kedarnath", "Rishikesh"];
  const [phIdx, setPhIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % placeholders.length), 2500);
    return () => clearInterval(t);
  }, []);

  const isMobile = variant === "mobile";

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Input box */}
      <div
        className={`flex items-center gap-2.5 ${
          isMobile
            ? "bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md"
            : "bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-5 py-3.5 shadow-xl"
        }`}
      >
        <Search
          className={`w-4 h-4 shrink-0 ${isMobile ? "text-gray-400" : "text-white/60"}`}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={`Search ${placeholders[phIdx]}...`}
          className={`flex-1 bg-transparent outline-none text-sm font-medium placeholder:font-normal ${
            isMobile
              ? "text-gray-800 placeholder:text-gray-400"
              : "text-white placeholder:text-white/40"
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className={isMobile ? "text-gray-400 hover:text-gray-600" : "text-white/40 hover:text-white"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {loading && (
              <div className="px-4 py-3 text-xs text-gray-400 font-medium">Searching...</div>
            )}

            {!loading && results.length === 0 && query.trim() && (
              <div className="px-4 py-5 text-sm text-gray-400 font-medium text-center">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}

            {!loading && results.length > 0 && (
              <div>
                {results.filter((r) => r.type === "destination").length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Destinations
                    </div>
                    {results
                      .filter((r) => r.type === "destination")
                      .map((r) => (
                        <Link
                          key={r.id}
                          href={r.url}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-light transition-colors group"
                        >
                          {r.coverImage && (
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={getOptimizedImageUrl(r.coverImage, 80) || r.coverImage}
                                alt={r.label}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors flex-1 truncate">
                            {r.label}
                          </span>
                          <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full shrink-0">
                            Destination
                          </span>
                        </Link>
                      ))}
                  </div>
                )}

                {results.filter((r) => r.type === "package").length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Packages
                    </div>
                    {results
                      .filter((r) => r.type === "package")
                      .map((r) => (
                        <Link
                          key={r.id}
                          href={r.url}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-light transition-colors group"
                        >
                          {r.coverImage && (
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={getOptimizedImageUrl(r.coverImage, 80) || r.coverImage}
                                alt={r.label}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors flex-1 truncate">
                            {r.label}
                          </span>
                          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full shrink-0">
                            Package
                          </span>
                        </Link>
                      ))}
                  </div>
                )}

                <div className="border-t border-gray-100 px-4 py-2.5">
                  <Link
                    href={`/packages?search=${encodeURIComponent(query)}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View all results for &ldquo;{query}&rdquo; →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroNew() {
  const [config, setConfig] = useState<HeroConfig | null>(null);

  useEffect(() => {
    publicApi
      .getHeroConfig()
      .then(setConfig)
      .catch(() => {});
  }, []);

  const bgImage = config?.desktopBgImage || DEFAULT_BG;
  const words =
    config?.desktopDynamicWords?.length ? config.desktopDynamicWords : DEFAULT_WORDS;
  const desktopCards = config?.desktopCards || [];
  const mobileSlides: {
    imageUrl: string;
    destination?: { slug: string; name: string } | null;
  }[] =
    config?.mobileCarouselSlides?.length
      ? config.mobileCarouselSlides
      : DEFAULT_SLIDES.map((url) => ({ imageUrl: url, destination: null }));

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP HERO (lg and above) — 75vh
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="hidden lg:block relative w-full overflow-y-visible overflow-x-clip select-none z-20"
        style={{ height: "75vh" }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getOptimizedImageUrl(bgImage, 1920) || bgImage}
            alt="Matka Trails Hero"
            fill
            priority
            quality={90}
            className="object-cover object-center"
          />
          {/* Left-heavy gradient for text legibility; right side stays lighter */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-12 flex items-center justify-between gap-12">
          
          {/* ── LEFT: Text + Search ── */}
          <div className="flex-1 flex flex-col gap-6 max-w-[500px] pt-14 lg:pt-16">

            <div className="flex flex-col gap-1.5">
              {/* Eyebrow text styled as normal text with font-reminder and same small size */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-reminder text-primary text-xl font-normal tracking-wide lowercase first-letter:uppercase"
              >
                bored of your office view?
              </motion.p>

              {/* Heading — "Book a trip / to [Word] / with Matka Trails" */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
              >
                <h1
                  className="font-sans font-black text-white uppercase leading-[1.15]"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)", fontSize: "clamp(2.5rem, 4.5vw, 3.75rem)" }}
                >
                  Book a trip
                  <br />
                  {/* "to" uppercase + rotating dynamic word in font-reminder — same line, no wrap */}
                  <span className="flex items-baseline gap-3 flex-nowrap overflow-visible whitespace-nowrap normal-case">
                    <span className="uppercase font-sans font-black" style={{ fontSize: "inherit" }}>to</span>
                    <RotatingWord
                      words={words}
                      className="font-reminder text-primary normal-case font-normal"
                      style={{ fontSize: "clamp(2.8rem, 5vw, 4.2rem)", lineHeight: 1 }}
                    />
                  </span>
                </h1>

                {/* "with Matka Trails" in script font */}
                <p
                  className="font-reminder text-3xl xl:text-4xl text-white/85 mt-2 normal-case"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
                >
                  with Matka Trails
                </p>
              </motion.div>
            </div>

            {/* Sub-description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/65 text-[15px] font-medium leading-relaxed"
            >
              Weekend getaways, treks & group departures — handcrafted for working professionals.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full max-w-md"
            >
              <HeroSearchBar variant="desktop" />
            </motion.div>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex gap-3 flex-wrap"
            >
              {["Zero Hidden Charges", "100% Customized", "Local Certified Guides"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold text-white/65 border border-white/15 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full"
                >
                  ✓ {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Glassmorphic cards (if configured) or SVG doodle fallback ── */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="shrink-0 hidden lg:flex flex-col items-center gap-4"
          >
            {desktopCards.length > 0 ? (
              <>
                <DesktopGlassCards cards={desktopCards} />
                <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest">
                  Featured Trips
                </p>
              </>
            ) : (
              /* SVG doodle fallback when no cards are configured */
              <div className="flex flex-col items-center justify-center gap-4 w-[240px]">
                <svg viewBox="0 0 240 280" className="w-full opacity-75" fill="none">
                  <polygon
                    points="20,240 90,100 160,240"
                    fill="rgba(255,102,0,0.12)"
                    stroke="rgba(255,102,0,0.45)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="80,240 150,128 220,240"
                    fill="rgba(255,255,255,0.05)"
                    stroke="rgba(255,255,255,0.28)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <polygon points="90,100 79,126 101,126" fill="white" opacity="0.65" />
                  <circle cx="190" cy="65" r="30" fill="rgba(255,102,0,0.1)" stroke="rgba(255,102,0,0.5)" strokeWidth="2" />
                  <polygon points="190,44 197,65 190,60 183,65" fill="#ff6600" />
                  <polygon points="190,86 197,65 190,70 183,65" fill="rgba(255,255,255,0.35)" />
                  <circle cx="190" cy="65" r="3.5" fill="#ff6600" />
                  {[[55,48],[210,155],[35,165],[185,215]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="1.8" fill="rgba(255,255,255,0.55)" />
                  ))}
                  <circle cx="95" cy="92" r="6.5" fill="rgba(255,102,0,0.75)" />
                  <line x1="95" y1="99" x2="95" y2="116" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="95" y1="106" x2="85" y2="114" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="95" y1="106" x2="105" y2="114" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="95" y1="116" x2="88" y2="128" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="95" y1="116" x2="102" y2="128" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="108" y1="100" x2="115" y2="132" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 252 Q70 247 120 254 Q170 261 220 252" stroke="rgba(255,102,0,0.32)" strokeWidth="2" strokeDasharray="6,5" fill="none" />
                  <path d="M142 181 C142 174 152 166 152 178 C152 188 142 194 142 194 C142 194 132 188 132 178 C132 166 142 174 142 181Z" fill="rgba(255,102,0,0.8)" />
                  <circle cx="142" cy="179" r="3.5" fill="white" />
                </svg>
                <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest text-center">
                  Every trail tells a story
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* NO white overlay at bottom — removed intentionally */}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE HERO (below lg) — flexible height, gradient bg
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="lg:hidden flex flex-col w-full select-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,102,0,0.18) 0%, rgba(255,120,0,0.11) 45%, rgba(255,255,255,0) 85%)",
        }}
      >
        {/* Top content block — pt-[88px] leaves room for transparent absolute navbar */}
        <div className="px-5 pt-[88px] pb-3">
          {/* Heading — flex baseline centers text and reminder font perfectly */}
          <h1 className="font-sans font-black text-[22px] text-black leading-snug whitespace-nowrap overflow-hidden flex items-baseline gap-1.5">
            <span>Book a trip to</span>
            <RotatingWord
              words={words}
              className="font-reminder text-primary text-[26px] font-normal"
            />
          </h1>

          <p className="text-[11px] text-gray-mid font-medium mt-1 mb-3">
            Treks, getaways & group tours — crafted for you.
          </p>

          {/* Search bar */}
          <HeroSearchBar variant="mobile" />
        </div>

        {/* Carousel — tight spacing */}
        <div className="pb-3 pt-1">
          <MobileCarousel slides={mobileSlides} />
        </div>

        {/* Very small bottom breathing room before DestinationExplorer */}
        <div className="h-2" />
      </section>
    </>
  );
}
