import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import {
  Compass,
  MapPin,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import PackageCard from "@/components/public/packages/PackageCard";
import QuickCallForm from "@/components/public/destinations/QuickCallForm";
import MobileQuickQuote from "@/components/public/destinations/MobileQuickQuote";
import DestinationFaqAccordion from "@/components/public/destinations/DestinationFaqAccordion";
import DestinationVideoGrid from "@/components/public/destinations/DestinationVideoGrid";
import DestinationReviews from "@/components/public/destinations/DestinationReviews";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Fallback data ──────────────────────────────────────────────────────────
const FALLBACK_GUIDELINES = [
  "Carry a valid government-issued photo ID at all times.",
  "Wear proper trekking shoes with ankle support.",
  "Stay hydrated — drink at least 3–4 litres of water per day on trail.",
  "Do not litter; carry your waste back to the base.",
  "Listen to your trek leader at all times, especially in high-altitude sections.",
  "Inform our team of any medical conditions before departure.",
];

const FALLBACK_NOTES =
  "Trip cancellation policy: 100% refund if cancelled 14+ days before departure, 50% refund for 7–14 days, no refund within 7 days. Weather-related cancellations are fully refunded.";

const FALLBACK_FAQS = [
  {
    question: "What is the best time to visit this destination?",
    answer:
      "The ideal window is typically between March–June and September–November, when trails are accessible and weather is clear. Monsoon treks are available on select routes with our experienced leaders.",
  },
  {
    question: "What is included in the package price?",
    answer:
      "All our packages include accommodation (tents / homestays), meals on trek, certified trek leaders, permits, and a first-aid kit. Transport from the meeting point is also included unless noted.",
  },
  {
    question: "Is this trek suitable for beginners?",
    answer:
      "Yes! Most of our routes are rated easy-to-moderate. We'll send you a detailed fitness guide 10 days before departure so you can prepare. Our leaders are trained to support first-timers.",
  },
  {
    question: "Can I join solo without knowing anyone?",
    answer:
      "Absolutely — 'Solo in, Group out' is our motto. You'll be grouped with like-minded travellers and leave as friends. Many of our solo participants have returned multiple times.",
  },
  {
    question: "What should I pack?",
    answer:
      "We'll send you a complete packing list on booking. Essentials include a daypack, warm layers, rain jacket, sunscreen, personal medication, and a reusable water bottle.",
  },
];

const FALLBACK_REVIEWS = [
  {
    name: "Priya Sharma",
    location: "Delhi NCR",
    rating: 5,
    text: "Absolutely life-changing experience! The trek leaders were knowledgeable and the group bonding was incredible. Already booked my next trip with Matka Trails.",
    avatar: null,
    date: "March 2025",
  },
  {
    name: "Rahul Verma",
    location: "Mumbai",
    rating: 5,
    text: "Booked solo and was worried, but the team made me feel at home instantly. Views were breathtaking, food was amazing, and the itinerary was perfectly paced.",
    avatar: null,
    date: "January 2025",
  },
  {
    name: "Ananya Patel",
    location: "Bangalore",
    rating: 5,
    text: "My first trek ever and Matka Trails made it unforgettable. Every detail was taken care of — from permits to hot meals at camp. Highly recommended!",
    avatar: null,
    date: "February 2025",
  },
];

const FALLBACK_GALLERY = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    caption: "Trail Summit View",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    caption: "Mountain Campsite",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    caption: "Trekking Through Forests",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80",
    caption: "River Crossing",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
    caption: "Group at Base Camp",
  },
];

const FALLBACK_VIDEOS = [
  {
    title: "Rishikesh Adventure Weekend — Traveller Experience",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    title: "Solo Trekker's Review — 5-Star Experience!",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  },
];

// ───────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await publicApi.getDestinationBySlug(slug);
    return {
      title:
        destination.metaTitle ||
        `${destination.name} Trips & Weekend Treks — Matka Trails`,
      description:
        destination.metaDescription ||
        destination.description ||
        `Browse group trekking packages for ${destination.name}.`,
    };
  } catch {
    return { title: "Destination Not Found" };
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let destination: any;
  try {
    destination = await publicApi.getDestinationBySlug(slug);
  } catch {
    notFound();
  }

  // Use backend data if available, otherwise fall back to demo content
  const gallery =
    destination.gallery?.length > 0 ? destination.gallery : FALLBACK_GALLERY;
  const packages = destination.packages || [];
  const faqs =
    destination.faqs?.length > 0 ? destination.faqs : FALLBACK_FAQS;
  const testimonials =
    destination.testimonials?.length > 0
      ? destination.testimonials
      : FALLBACK_VIDEOS;
  const guidelines =
    destination.guidelines?.length > 0
      ? destination.guidelines
      : FALLBACK_GUIDELINES;
  const notes = destination.notes || FALLBACK_NOTES;

  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════ HERO BANNER ════════════════════════ */}
      <section className="relative w-full h-[320px] md:h-[420px] overflow-hidden flex items-end">
        {destination.coverImage ? (
          <Image
            src={destination.coverImage}
            alt={destination.name}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/60 hover:text-white uppercase tracking-widest mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Territories</span>
          </Link>

          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>TERRITORY VIEW</span>
          </span>

          <h1 className="font-sans font-black italic text-5xl md:text-7xl text-white uppercase leading-none tracking-tight drop-shadow-xl">
            {destination.name}
          </h1>

          <div className="flex items-center gap-5 mt-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-white/70 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {packages.length} Published Trail{packages.length !== 1 ? "s" : ""}
            </span>
            <span className="text-white/50 text-xs font-bold">
              · {gallery.length} Gallery Photo{gallery.length !== 1 ? "s" : ""}
            </span>
            <span className="text-white/50 text-xs font-bold">
              · {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════ MAIN GRID ════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ━━━━━━━━━━━━━━━━━━━ LEFT COLUMN (8/12) ━━━━━━━━━━━━━━━━━━━ */}
          <div className="lg:col-span-8 space-y-12">

            {/* About the Region */}
            {destination.description && (
              <section>
                <SectionHeading title="About the Region" />
                <p className="text-sm text-gray-mid leading-relaxed font-medium">
                  {destination.description}
                </p>
              </section>
            )}

            {/* ── GALLERY ── */}
            <section>
              <SectionHeading title="Territory Gallery" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[140px]">
                {gallery.slice(0, 6).map((img: any, i: number) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-2xl border border-gray-border bg-gray-bg group cursor-pointer ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.caption || `${destination.name} ${i + 1}`}
                      fill
                      sizes="(max-width:640px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-[10px] font-semibold">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── TRAIL GUIDELINES ── */}
            <section>
              <SectionHeading title="Trail Guidelines" />
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    Safety &amp; Instructions
                  </span>
                </div>
                <ul className="space-y-3">
                  {guidelines.map((line: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-dark">
                      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── IMPORTANT NOTES ── */}
            {notes && (
              <section>
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex gap-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1.5">
                      Important Note
                    </p>
                    <p className="text-sm text-amber-800 font-medium leading-relaxed whitespace-pre-line">
                      {notes}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ── AVAILABLE TRAILS ── */}
            <section>
              <SectionHeading title="Available Trails in this Region" />
              {packages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  {packages.map((pkg: any) => (
                    <Link key={pkg.id || pkg._id} href={`/packages/${pkg.slug}`}>
                      <PackageCard pkg={pkg} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-border rounded-2xl p-12 text-center">
                  <Compass className="w-8 h-8 text-gray-light mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-light">
                    No trails published for this region yet.
                  </p>
                  <p className="text-xs text-gray-light/70 mt-1">
                    Check back soon — trails are being added.
                  </p>
                </div>
              )}
            </section>

            {/* ── TRAVELLER REVIEWS (Text) ── */}
            <section>
              <SectionHeading title="Traveller Reviews" />
              <DestinationReviews reviews={FALLBACK_REVIEWS} />
            </section>

          </div>

          {/* ━━━━━━━━━━━━━━━━━━━ RIGHT SIDEBAR (4/12) ━━━━━━━━━━━━━━━━━━━ */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

            {/* ── BOOKING FORM ── */}
            <QuickCallForm defaultDestination={destination.name} />

            {/* ── VIDEO TESTIMONIALS (sidebar) ── */}
            <DestinationVideoGrid testimonials={testimonials} />

          </div>
        </div>
      </div>

      {/* ════════════════════════ FAQs FULL-WIDTH ════════════════════════ */}
      <DestinationFaqAccordion faqs={faqs} destinationName={destination.name} />

      {/* ── Mobile Sticky Quote ── */}
      <MobileQuickQuote defaultDestination={destination.name} />
    </div>
  );
}

// ─── Heading helper ────────────────────────────────────────────────────────
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1 h-6 bg-primary rounded-full" />
      <h2 className="font-sans font-black text-xl text-black uppercase tracking-tight">
        {title}
      </h2>
    </div>
  );
}
