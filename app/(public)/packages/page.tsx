import PackageFilters from "@/components/public/packages/PackageFilters";
import PackageGrid from "@/components/public/packages/PackageGrid";
import { MessageSquare, PhoneCall, Compass } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "All Weekend Trails & Treks — Matka Trails",
  description: "Browse hand-crafted group treks and adventure packages. Use filters to lock your duration, budget and formats.",
};

export default function PackagesPage() {
  return (
    <div className="w-full bg-gray-bg min-h-screen pb-20">
      {/* ── 1. Page Header Hero Strip ── */}
      <div className="relative w-full h-[240px] bg-black overflow-hidden flex items-center px-6 md:px-16 lg:px-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200"
            alt="Kedarnath Mountain Pass Trek"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 space-y-2 text-white">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>TERRITORY DIRECTORY</span>
          </span>
          <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
            Find Your <span className="text-primary italic">Trail.</span>
          </h1>
          <p className="text-xs lg:text-sm text-white/60 leading-relaxed font-semibold max-w-md">
            All departures are led by verified group captains. Find details, day-by-day trails, and book in 30 seconds.
          </p>
        </div>
      </div>

      {/* ── 2. Content Layout (Grid + Sidebar) ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Filters & Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Dynamic Filters bar */}
          <PackageFilters />
          
          {/* Query loader grid */}
          <PackageGrid />
        </div>

        {/* Right Help Sidebar */}
        <div className="space-y-6">
          {/* Custom trail card */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-extrabold text-sm text-black">
                Need a Custom Trail?
              </h3>
              <p className="text-xs text-gray-mid leading-relaxed font-semibold">
                Planning a corporate team outing, college group, or family reunion? Let our Captain draft a customized itinerary for you.
              </p>
            </div>
            
            <a
              href="https://wa.me/919999999999?text=Hi%20Matka%20Trails%2C%20I%20want%20to%20plan%20a%20custom%20group%20trip%20..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide py-3.5 rounded-xl shadow-orange transition-colors"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Talk to Captain</span>
            </a>
          </div>

          {/* Quick FAQ summary box */}
          <div className="bg-[#111111] text-white rounded-2xl p-6 shadow-card space-y-3">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
              Trail Guidelines
            </h4>
            <ul className="space-y-3 text-xs font-semibold text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✦</span>
                <span>Structured dynamic groups tailored by age/interests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✦</span>
                <span>Verified Group Captains lead every trek.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✦</span>
                <span>Medical support kits & guides on-site.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
