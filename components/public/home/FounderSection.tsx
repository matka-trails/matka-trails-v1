"use client";

import Image from "next/image";
import { Compass, Star, Award, Map, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FounderSection() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-white via-cream-bg/20 to-orange-50/10 relative overflow-hidden select-none">
      
      {/* Abstract Design Elements in Background */}
      <div className="absolute top-1/4 -left-32 w-[450px] h-[450px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-24 w-[380px] h-[380px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative subtle trail paths */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,200 Q200,300 400,100 T900,400" fill="none" stroke="#ff6600" strokeWidth="4" strokeDasharray="10 8" />
          <path d="M100,600 Q500,450 800,700 T1500,500" fill="none" stroke="#ff6600" strokeWidth="3" strokeDasharray="12 10" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title Area */}
        <div className="text-center lg:text-left mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/8 px-4.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] lg:text-xs font-black text-primary uppercase tracking-widest">
              Behind the Trails
            </span>
          </div>
          <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none capitalize">
            Meet our founder, <span className="text-primary">Sameer Gupta</span>
          </h2>
          <p className="font-sans text-xs md:text-sm font-bold text-gray-light uppercase tracking-widest mt-1">
            Why believe in Matka Trails?
          </p>
        </div>

        {/* Unique Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* ── LEFT: Unique Offset Portrait Layout ── */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[350px] aspect-[4/5]">
              {/* Outer offset frame */}
              <div className="absolute -inset-4 border-2 border-dashed border-primary/30 rounded-[3rem] -rotate-3 scale-102" />
              
              {/* Glass decorative shadow box */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-amber-500/5 rounded-[2.5rem] rotate-3 translate-x-3 translate-y-3" />

              {/* Main Image Frame */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
                  alt="Sameer Gupta — Founder of Matka Trails"
                  fill
                  className="object-cover hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 768px) 350px, 400px"
                  priority
                />
                
                {/* Clean gradient shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Subtitle Label (no stats badge as requested) */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-black uppercase text-primary bg-white px-2.5 py-1 rounded-md tracking-wider">
                    Sameer Gupta
                  </span>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Founder, Creator & Capt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Trust Story & Glowing Badges ── */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            
            {/* Story text */}
            <div className="space-y-5">
              <h3 className="font-sans font-black text-xl lg:text-2xl text-black leading-snug">
                Built on Real Trails & Unfiltered Travel Experience.
              </h3>
              
              <div className="font-sans text-xs md:text-sm text-gray-mid font-medium space-y-4 leading-relaxed">
                <p>
                  A true wanderer at heart, <strong>Sameer Gupta</strong> has been leading expeditions across the
                  roughest terrains of India for over six years. Before starting <strong>Matka Trails</strong>,
                  he was a principal travel lead at <strong>Tripper Trails</strong>, where he designed and captained
                  tailor-made departures.
                </p>
                <p>
                  Sameer has personally guided over <strong>50+ tour groups</strong> to destinations like Ladakh, Spiti
                  Valley, and Kedarnath, maintaining a perfect <strong>5.0 rating</strong> from hundreds of travelers.
                  He is also a travel creator and influencer, bringing unfiltered road experiences to his community.
                </p>
                <p>
                  Matka Trails is the culmination of his travel learnings. We believe that traveling shouldn&apos;t
                  be transactional. We offer handcrafted itineraries, zero hidden costs, and trip captains who
                  care for your experience like their own.
                </p>
              </div>
            </div>

            {/* Unique Grid Badges */}
            <div className="grid grid-cols-2 gap-4">
              {/* Badge 1 */}
              <div className="bg-white border border-gray-150/70 p-4.5 rounded-2xl shadow-xs hover:border-primary/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-black uppercase tracking-wider">
                  50+ Tours Led
                </h4>
                <p className="text-[10px] text-gray-light font-medium mt-1 leading-normal">
                  Captained across the Himalayas
                </p>
              </div>

              {/* Badge 2 */}
              <div className="bg-white border border-gray-150/70 p-4.5 rounded-2xl shadow-xs hover:border-primary/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/8 flex items-center justify-center text-emerald-600 mb-3">
                  <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                </div>
                <h4 className="font-extrabold text-xs text-black uppercase tracking-wider">
                  5.0 Rated
                </h4>
                <p className="text-[10px] text-gray-light font-medium mt-1 leading-normal">
                  Consistent 5-star trip reviews
                </p>
              </div>

              {/* Badge 3 */}
              <div className="bg-white border border-gray-150/70 p-4.5 rounded-2xl shadow-xs hover:border-primary/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-500/8 flex items-center justify-center text-blue-600 mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-black uppercase tracking-wider">
                  Ex-Tripper Trails
                </h4>
                <p className="text-[10px] text-gray-light font-medium mt-1 leading-normal">
                  Senior travel lead captain
                </p>
              </div>

              {/* Badge 4 */}
              <div className="bg-white border border-gray-150/70 p-4.5 rounded-2xl shadow-xs hover:border-primary/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-500/8 flex items-center justify-center text-orange-600 mb-3">
                  <Map className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-black uppercase tracking-wider">
                  Creator & Host
                </h4>
                <p className="text-[10px] text-gray-light font-medium mt-1 leading-normal">
                  Authentic tour departures
                </p>
              </div>
            </div>

            {/* Custom CTA link */}
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary-dark uppercase tracking-wider group"
              >
                Our Complete Story
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
