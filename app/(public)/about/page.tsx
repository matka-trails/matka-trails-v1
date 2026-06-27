import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Compass, Sparkles, Shield, Users, MapPin } from "lucide-react";
import StatsBar from "@/components/public/home/StatsBar";

export const metadata: Metadata = {
  title: "About Matka Trails — Our Story & Philosophy",
  description: "Learn how Matka Trails was founded to solve the solo traveler problem. Curated weekend small-group itineraries for working professionals.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* ── 1. Page Header Hero ── */}
      <div className="relative w-full h-[280px] bg-black overflow-hidden flex items-center px-6 md:px-16 lg:px-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200"
            alt="Trekkers in Himalayas"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 space-y-2 text-white">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>OUR ANATOMY</span>
          </span>
          <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
            We are <span className="text-primary italic">Matka Trails.</span>
          </h1>
          <p className="text-xs lg:text-sm text-white/60 leading-relaxed font-semibold max-w-md">
            Dedicated to solving the solo travel hurdle for active corporate professionals.
          </p>
        </div>
      </div>

      {/* ── 2. Content Story Column ── */}
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Our Story text */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-10 shadow-card space-y-6">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>THE ORIGIN STORY</span>
            </span>
            <h2 className="font-sans font-extrabold text-xl lg:text-2xl text-black">
              Solo in. Group out.
            </h2>
          </div>

          <div className="text-xs md:text-sm text-gray-dark leading-relaxed font-semibold space-y-4">
            <p>
              Trekking and explore getaways shouldn't be blocked because your friends backed out or are busy with planning schedules. Matka Trails was built to provide premium, safe, and curated travel cohorts. We group solo travelers together into dynamic small batches of 8-12.
            </p>
            <p>
              The <strong>Matka (earthen pot)</strong> symbolizes organic warmth, local grounded experiences, and cozy campsite conversations. The <strong>Trails</strong> represent active adventures, winding pathways, and conquering mountain passes. Combined, they create our signature style of travel.
            </p>
          </div>
        </div>

        {/* Dynamic value cards */}
        <div className="space-y-6">
          <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            <span>Our Travel Philosophy</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="w-5 h-5 text-primary" />,
                title: "Curated Cohorts",
                desc: "We screen traveler profiles, grouping active corporate employees with similar interests.",
              },
              {
                icon: <Shield className="w-5 h-5 text-primary" />,
                title: "Safety Verified",
                desc: "Experienced mountain captains, medical kits, and verified transport routes on every trek.",
              },
              {
                icon: <Compass className="w-5 h-5 text-primary" />,
                title: "Logistics Solved",
                desc: "No permit planning or stay booking stress. Just show up at the assembly point.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-gray-border rounded-2xl p-6 space-y-3 hover:border-primary/20 transition-all shadow-card"
              >
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center border border-primary/20">
                  {card.icon}
                </div>
                <h4 className="font-sans font-bold text-sm text-black">
                  {card.title}
                </h4>
                <p className="text-xs text-gray-mid leading-relaxed font-semibold">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Counter Stats bar component */}
        <div className="rounded-2xl overflow-hidden shadow-card border border-gray-border">
          <StatsBar />
        </div>

        {/* Final call to action banner */}
        <div className="bg-[#111111] text-white rounded-2xl p-8 md:p-12 text-center space-y-6 border border-white/5 shadow-float relative overflow-hidden">
          <h3 className="font-sans font-black italic text-3xl uppercase tracking-tight">
            Ready to find your <span className="text-primary italic">tribe?</span>
          </h3>
          <p className="text-xs md:text-sm text-white/50 max-w-md mx-auto font-semibold leading-relaxed">
            Reserve slots early. Groups are finalized on a rolling basis depending on age metrics, adventure quotients, and preferences.
          </p>
          <div className="pt-2">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-8 py-3.5 rounded-xl shadow-orange transition-colors"
            >
              Browse All Trails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
