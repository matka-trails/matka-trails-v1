"use client";

import Image from "next/image";
import Link from "next/link";
import { Quote, Compass, Heart, Plane, ArrowRight, Sparkles, Users } from "lucide-react";

export default function FounderSection() {
  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-white via-cream-bg/30 to-orange-50/20 relative overflow-hidden select-none">
      
      {/* ── 1. HUGE FADED BACKGROUND WATERMARK TEXT: SAMEER (Responsive watermark) ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden flex justify-center">
        <span className="font-black text-[18.5vw] sm:text-[130px] md:text-[170px] text-gray-300/50 uppercase tracking-[0.11em] sm:tracking-[0.22em] leading-none block whitespace-nowrap">
          SAMEER
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">

        {/* ── 2. HERO PORTRAIT WITH LARGER, RICHER BOTTOM GLOW & TIGHT SIDE TEXT ── */}
        <div className="relative pt-2">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-3 md:gap-2">
            
            {/* Left Info: Meet Sameer Kumar */}
            <div className="w-full md:w-auto md:max-w-[200px] text-center md:text-left space-y-0.5 md:mb-14 shrink-0 order-2 md:order-1">
              <span className="font-reminder text-primary text-xl md:text-2xl block leading-none">
                Meet
              </span>
              <h2 className="font-sans font-black text-xl md:text-2xl text-black leading-tight tracking-tight">
                Sameer Kumar
              </h2>
              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest pt-0.5">
                FOUNDER, MATKA TRAILS
              </p>
            </div>

            {/* Center: Sameer's Cutout Portrait (/sameer1.png) with Bigger, Darker Brand-Orange Glow */}
            <div className="relative w-56 sm:w-64 md:w-72 h-64 sm:h-72 md:h-80 shrink-0 flex items-end justify-center order-1 md:order-2 z-30">
              {/* Bigger & Richer brand-orange radial glow fading UPWARDS behind portrait */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-96 md:w-[400px] h-52 sm:h-64 md:h-72 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,102,0,0.35)_0%,_rgba(255,120,30,0.18)_40%,_transparent_75%)] pointer-events-none" />
              
              {/* Cutout image sitting cleanly over the rich glow */}
              <div className="relative w-full h-full">
                <Image
                  src="/founder.png"
                  alt="Sameer Kumar — Founder of Matka Trails"
                  fill
                  className="object-cover object-top rounded-2xl drop-shadow-lg"
                  priority
                  sizes="(max-width: 768px) 250px, 300px"
                />
              </div>
            </div>

            {/* Right Info: Quote pill */}
            <div className="w-full md:w-auto md:max-w-[210px] flex items-center justify-center md:justify-start gap-2 text-center md:text-left md:mb-14 shrink-0 order-3">
              <div className="w-1 h-9 bg-primary rounded-full hidden md:block shrink-0 shadow-xs" />
              <p className="font-sans font-extrabold text-xs md:text-sm text-gray-900 leading-snug">
                &ldquo;From corporate burnout to a movement of{" "}
                <span className="font-reminder text-primary text-base md:text-lg font-normal marker-zigzag">
                  weekend escapes.
                </span>&rdquo;
              </p>
            </div>

          </div>
        </div>

        {/* ── 3. MY STORY CARD (White bg with lift shadow & primary accent top tag) ── */}
        <div className="bg-white shadow-xl rounded-3xl p-5 sm:p-7 pt-8 sm:pt-10 max-w-3xl mx-auto space-y-3 relative -mt-10 sm:-mt-14 md:-mt-16 z-10">
          
          {/* Header Tag */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-primary/30 px-3.5 py-0.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                MY STORY
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center font-sans font-black text-base sm:text-lg md:text-xl text-black leading-snug max-w-xl mx-auto pt-1">
            I spent 3 years chasing deadlines across 7 companies…{" "}
            <span className="font-reminder text-primary text-lg sm:text-xl font-normal">until I realized corporate</span>{" "}
            life was swallowing <span className="marker-zigzag">our weekends.</span>
          </h3>

          {/* 2 Columns Story Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-gray-700 leading-relaxed font-medium">
            <div className="space-y-2">
              <p>
                Hi, I&apos;m <strong>Sameer Kumar</strong>, Founder of <strong>Matka Trails</strong>. Like thousands of young professionals, I spent the first few years of my career chasing deadlines, promotions, and waiting for the next weekend.
              </p>
              <p>
                Over three years, I worked across seven different companies. Every workplace was different, but one problem was the same everywhere—
                <strong className="text-primary">corporate burnout</strong>.
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-orange-100 md:pl-5">
              <p>
                People weren&apos;t unhappy because they hated their jobs; they were exhausted because they had forgotten how to truly live.
              </p>
              <p>
                Monday to Friday became survival, and weekends disappeared into sleep, pending chores, or scrolling endlessly on a phone.
              </p>
            </div>
          </div>

        </div>

        {/* ── 4. DARK MOUNTAIN QUOTE BANNER ── */}
        <div className="bg-neutral-950 text-white rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-float max-w-3xl mx-auto space-y-3 border border-white/10">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary/25 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
              <Quote className="w-4 h-4 text-primary" />
            </div>

            <div className="space-y-2 flex-1">
              <p className="font-sans font-bold italic text-xs sm:text-sm md:text-base text-white/95 leading-relaxed">
                &ldquo;People don&apos;t remember hotels. They don&apos;t remember itineraries. They remember the people they met, the stories they shared, and how a journey made them feel.&rdquo;
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] font-black tracking-widest text-primary uppercase">
                <span>BEFORE MATKA TRAILS: SPENT 2 YEARS CAPTAINING TRIPS ACROSS INDIA</span>
                <Sparkles className="w-3 h-3 text-primary shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. MOVEMENT STORY & IF YOU FEEL CARD ── */}
        <div className="max-w-3xl mx-auto space-y-5">
          
          {/* Paragraphs */}
          <div className="space-y-3 text-xs text-gray-700 leading-relaxed font-medium">
            <p>
              We&apos;re not just building another travel company. We&apos;re building a movement that helps people disconnect from stress and reconnect with life. Our vision is simple—to make every weekend feel like a mini reset.
            </p>
            <p>
              At Matka Trails, we bring together strangers who share the same mindset, the same energy, and the same desire to escape the routine. Every weekend, we host community trips where <strong className="text-black">conversations replace notifications</strong>, <strong className="text-black">sunrises replace alarms</strong>, and <strong className="text-black">memories replace meetings</strong>.
            </p>
          </div>

          {/* IF YOU FEEL… Card */}
          <div className="bg-orange-50/70 border border-orange-200/90 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="w-4 h-4 fill-primary text-primary" />
            </div>

            <div className="space-y-2 flex-1">
              <h4 className="font-black text-[11px] text-primary uppercase tracking-widest">
                IF YOU FEEL…
              </h4>

              <ul className="text-xs font-semibold text-gray-800 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>Tired of waiting for the &ldquo;perfect time&rdquo; to travel…</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>Work has started feeling heavier than life…</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>You want to meet incredible people and collect stories instead of just weekends…</span>
                </li>
              </ul>

              <p className="font-black text-xs text-primary pt-1">
                Then welcome home. This is just the beginning.
              </p>
            </div>
          </div>

          {/* Concluding Quote & Signature Block */}
          <div className="text-center space-y-2 pt-2">
            <Quote className="w-5 h-5 text-primary mx-auto opacity-70" />
            <p className="font-sans font-black italic text-sm sm:text-base text-black max-w-xl mx-auto leading-snug">
              &ldquo;We&apos;re not here to sell trips. We&apos;re here to build experiences, communities, and a generation that chooses memories over burnout.&rdquo;
            </p>

            {/* Sameer Signature using Gistesy font */}
            <div className="pt-1">
              <p className="font-gistesy text-4xl sm:text-5xl text-primary font-normal tracking-wide drop-shadow-xs">
                Sameer
              </p>
            </div>

            {/* See you on the next adventure with Airplane Dotted Line */}
            <div className="pt-3 max-w-2xl mx-auto flex items-center justify-between gap-3">
              <span className="font-reminder text-primary text-sm sm:text-base shrink-0">
                See you on the next adventure!
              </span>

              {/* Dotted line with Airplane icon pointing slightly up */}
              <div className="flex-1 relative flex items-center">
                <div className="w-full border-b-2 border-dashed border-primary/40" />
                <Plane className="w-4 h-4 text-primary shrink-0 -rotate-12 -translate-y-0.5 ml-1" />
              </div>

              <div className="text-right shrink-0">
                <p className="font-black text-xs text-black uppercase tracking-wider">
                  — SAMEER KUMAR
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Founder, Matka Trails
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ── 6. BOTTOM FULL-WIDTH CTA BANNER: MEET OUR WHOLE TEAM ── */}
        <div className="bg-neutral-950 text-white rounded-2xl p-5 md:p-6 border border-white/10 shadow-float max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 hidden sm:flex">
              <Users className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                THE PEOPLE BEHIND THE TRAILS
              </span>
              <h4 className="font-sans font-black text-base text-white">
                Meet Our Whole Team & Tribe!
              </h4>
              <p className="text-xs text-white/60 font-medium">
                Meet our trip captains, trip hosts & exceptional tech team!
              </p>
            </div>
          </div>

          <Link
            href="/about"
            className="shrink-0 bg-primary hover:bg-primary-dark text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-orange flex items-center gap-2 transition-all hover:gap-3"
          >
            <span>MEET OUR WHOLE TEAM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}





