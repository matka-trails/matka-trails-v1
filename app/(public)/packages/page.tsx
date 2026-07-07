import PackageGrid from "@/components/public/packages/PackageGrid";
import QuickCallForm from "@/components/public/destinations/QuickCallForm";
import MobileQuickQuote from "@/components/public/destinations/MobileQuickQuote";
import WhyMatkaTrails from "@/components/public/home/WhyMatkaTrails";
import TextTestimonialsSection from "@/components/public/home/TextTestimonialsSection";
import GalleryFramesSection from "@/components/public/home/GalleryFramesSection";
import VideoTestimonialsSection from "@/components/public/home/VideoTestimonialsSection";
import Faqs from "@/components/public/home/Faqs";
import ContactSection from "@/components/public/home/ContactSection";
import { Compass } from "lucide-react";

export const metadata = {
  title: "All Weekend Trails & Treks — Matka Trails",
  description: "Browse hand-crafted group treks and adventure packages. Use filters to lock your duration, budget and formats.",
};

const DEFAULT_BG =
  "https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1783245391/bgCover_d221x3.png";

export default function PackagesPage() {
  return (
    <div className="w-full bg-gray-bg min-h-screen">
      {/* ── 1. Page Header Hero Strip with Cloudinary Background & Black Overlay ── */}
      <div 
        className="relative w-full h-[280px] md:h-[300px] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center border-b border-white/5 shrink-0 z-10"
        style={{ backgroundImage: `url(${DEFAULT_BG})` }}
      >
        {/* Dark overlay inside the header banner to ensure text readability */}
        <div className="absolute inset-0 bg-neutral-950/70 z-0 pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="space-y-2 text-white">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Compass className="w-4 h-4" />
              <span>TERRITORY DIRECTORY</span>
            </span>
            <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
              Find Your <span className="text-primary italic">Trail</span>
            </h1>
            <p className="text-xs lg:text-sm text-white/60 leading-relaxed font-semibold max-w-md">
              All departures are led by verified group captains. Find details, day-by-day trails, and book in 30 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Content Layout (Grid + Sidebar) ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Listing Grid (Spans 8 columns on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Query loader grid */}
          <PackageGrid />
        </div>

        {/* Right Sticky Form Sidebar (Spans 4 columns on desktop, hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 z-20">
          <QuickCallForm />
        </div>
      </div>

      {/* ── 3. Extra Sections rendered sequentially with no gap margins ── */}
      <div className="mt-8">
        {/* Why Matka Trails DNA Section */}
        <WhyMatkaTrails />

        {/* Reviews Ticker Section */}
        <TextTestimonialsSection />

        {/* Gallery Frame panorama */}
        <GalleryFramesSection />

        {/* Video Testimonials */}
        <VideoTestimonialsSection />

        {/* Global FAQs Section */}
        <Faqs />

        {/* Contact Form Section */}
        <ContactSection />
      </div>

      {/* Mobile / Tablet sticky quote drawer bar */}
      <MobileQuickQuote />
    </div>
  );
}
