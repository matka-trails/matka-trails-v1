"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  Shield,
  Users,
  MapPin,
  Star,
  Heart,
  Eye,
  ArrowRight,
  ArrowDown,
  Linkedin,
  Instagram,
  Mail,
  Github,
  User,
  Mountain,
} from "lucide-react";
import { useUiStore } from "@/stores/uiStore";

// ─── Team Members Data ────────────────────────────────────────────────────────
interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge: string;
  image?: string;
  bio: string;
  socials?: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    email?: string;
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "sameer",
    name: "Sameer Kumar",
    role: "Founder & Trip Captain",
    badge: "FOUNDER",
    image: "/founder.png",
    bio: "The dreamer who started it all. Loves mountains, storytelling, and connecting meaningful people.",
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      email: "sameer@matkatrails.com",
    },
  },
  {
    id: "saurabh",
    name: "Saurabh Bhagat",
    role: "Chief Operating Officer",
    badge: "COO",
    image: "/saurabh.png",
    bio: "Ensures every trip runs smoothly, logistics are seamless, and every traveler feels right at home.",

  },
  {
    id: "anuj",
    name: "Anuj Gupta",
    role: "Chief Technology Officer",
    // image: "/anuj.png",
    badge: "CTO",
    bio: "The tech brain behind Matka Trails platform, crafting digital experiences as smooth as mountain breezes.",

  },
  // {
  //   id: "XYZ",
  //   name: "XYZ",
  //   role: "Head of XYZ",
  //   badge: "HEAD - XYZ",
  //   bio: "Curates magical routes, campfire rituals, and unforgettable moments for every single cohort.",
  // },

];

// ─── Reusable Square Team Card Component ──────────────────────────────────────
function TeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-neutral-950 text-white rounded-3xl overflow-hidden border border-neutral-800 shadow-xl flex flex-col justify-between h-full group hover:border-primary/50 transition-all duration-300"
    >
      <div>
        {/* Square 1:1 Photo Frame */}
        <div className="relative w-full aspect-square bg-neutral-900 overflow-hidden shrink-0">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 80vw, 25vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex items-center justify-center">
              <User className="w-16 h-16 text-neutral-700" />
            </div>
          )}

          {/* Gradient overlay for photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

          {/* Position Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-primary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
              {member.badge}
            </span>
          </div>
        </div>

        {/* Member Info */}
        <div className="p-5 space-y-2">
          <h3 className="font-sans font-extrabold text-base text-white tracking-wide leading-tight group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-primary/90 text-xs font-semibold">
            {member.role}
          </p>
          <p className="text-neutral-400 text-xs font-normal leading-relaxed pt-1">
            {member.bio}
          </p>
        </div>
      </div>

      {/* Social links - Only rendered if socials exist */}
      {member.socials && (
        <div className="px-5 pb-5 pt-3 border-t border-neutral-900 text-neutral-400 flex items-center gap-3">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-1"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socials.instagram && (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-1"
              aria-label={`${member.name} Instagram`}
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-1"
              aria-label={`${member.name} GitHub`}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.socials.email && (
            <a
              href={`mailto:${member.socials.email}`}
              className="hover:text-primary transition-colors p-1"
              aria-label={`Email ${member.name}`}
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function AboutPage() {
  const { openBookingModal } = useUiStore();

  const scrollToOrigin = () => {
    document.getElementById("origin-story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen text-slate-900 overflow-hidden font-sans">
      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO SECTION (Compact Height with font-reminder)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[420px] lg:min-h-[480px] bg-neutral-950 flex items-center justify-center pt-20 pb-12 px-6 lg:px-12 select-none overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/aboutus.png"
            alt="Matka Trails Mountain Campfire"
            fill
            priority
            quality={95}
            className="object-cover object-center opacity-70"
          />
          {/* Heavy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-center items-start space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>ABOUT US</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-reminder text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-none capitalize"
          >
            WE ARE <span className="text-primary font-reminder">MATKA TRAILS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-sm sm:text-base font-medium leading-relaxed max-w-2xl"
          >
            Born from a simple idea — that weekends should be about experiences, not exhaustion. We design journeys that bring strangers together and turn them into a tribe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2"
          >
            <button
              onClick={scrollToOrigin}
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full shadow-orange transition-all hover:scale-105 cursor-pointer"
            >
              <span>DISCOVER OUR JOURNEY</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. OUR ORIGIN STORY SECTION (Reduced top gap)
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="origin-story" className="py-12 md:py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-12 shadow-xl shadow-slate-200/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>OUR ORIGIN STORY</span>
            </div>

            <h2 className="font-sans font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-tight">
              Solo in. Group out.
            </h2>

            <div className="space-y-4 text-neutral-600 text-sm md:text-base leading-relaxed font-medium">
              <p>
                Trekking and explore getaways shouldn&apos;t be blocked because your friends backed out or are busy with planning schedules. Matka Trails was built to provide premium, safe, and curated travel cohorts.
              </p>
              <p>
                We group solo travelers together into dynamic small batches of <strong className="text-neutral-900 font-bold">8-12</strong>.
              </p>
              <p>
                The <strong className="text-primary font-bold">Matka</strong> (earthen pot) symbolizes organic warmth, local grounded experiences, and cozy campsite conversations. The <strong className="text-neutral-900 font-bold">Trails</strong> represent active adventures, winding pathways, and conquering mountain passes. Combined, they create our signature style of travel.
              </p>
            </div>

            {/* Sameer Kumar Founder Signature */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col space-y-1">
              <span className="font-reminder text-3xl text-primary tracking-wide">
                Sameer Kumar
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Founder, Matka Trails
              </span>
            </div>
          </div>

          {/* Right Image Feature with Quote Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[14/10] rounded-2xl overflow-hidden shadow-2xl border border-neutral-100 group">
              <Image
                src="/aboutus.png"
                alt="Matka Trails Trailside Campfire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Glass Quote Card */}
            <div className="relative lg:absolute -bottom-6 lg:-bottom-6 right-0 lg:-left-6 bg-neutral-900/90 backdrop-blur-md border border-white/10 text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm mt-4 lg:mt-0">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/90 leading-snug">
                Every trip is a story. <br />
                <span className="text-primary font-bold">Every traveler is family.</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. IMPACT STATS BAR (Dark Premium Bar)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-16">
        <div className="bg-neutral-950 text-white rounded-3xl p-8 lg:p-10 border border-neutral-800 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          
          <div className="flex flex-col items-center text-center space-y-2 pt-4 md:pt-0">
            <Mountain className="w-7 h-7 text-primary mb-1" />
            <span className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
              500+
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Trails Logged
            </span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 pt-4 md:pt-0">
            <MapPin className="w-7 h-7 text-primary mb-1" />
            <span className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
              30+
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Destinations Map
            </span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 pt-4 md:pt-0">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500 mb-1" />
            <span className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
              5.0★
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Group Rating
            </span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 pt-4 md:pt-0">
            <Users className="w-7 h-7 text-primary mb-1" />
            <span className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
              100%
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Captains Guided
            </span>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. OUR PURPOSE / PILLARS (4 Cards)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-neutral-100/60 border-y border-neutral-200/60 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              OUR PURPOSE
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight">
              More Than Trips, We Build Tribes.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Compass className="w-6 h-6 text-primary" />,
                title: "Our Mission",
                desc: "To help young professionals step out of their routine, explore the unexplored, and find their tribe.",
              },
              {
                icon: <Eye className="w-6 h-6 text-primary" />,
                title: "Our Vision",
                desc: "To become India's most trusted community travel brand for authentic weekend adventures.",
              },
              {
                icon: <Heart className="w-6 h-6 text-primary" />,
                title: "What We Believe",
                desc: "Travel is not an escape. It's an investment in your happiness, mental clarity, and growth.",
              },
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Our Promise",
                desc: "Curated trails, verified captains, safe journeys, and memories that last a lifetime.",
              },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white border border-neutral-200/80 rounded-2xl p-7 space-y-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <h3 className="font-sans font-extrabold text-lg text-neutral-900">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. WHY TRAVEL WITH US (Timeline / Value Flow)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-neutral-950 text-white relative overflow-hidden px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-14 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              WHY TRAVEL WITH US?
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              We Take Care Of Everything, <br className="hidden sm:inline" />
              <span className="text-primary italic">You Take Care Of Memories.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              { title: "Curated Experiences", desc: "Handpicked trails, stays & activities." },
              { title: "Expert Captains", desc: "Trained, verified & passionate leaders." },
              { title: "Hassle-Free Travel", desc: "We handle logistics, you enjoy the journey." },
              { title: "Small Group Sizes", desc: "8-12 travelers for real connections." },
              { title: "Safe & Responsible", desc: "Your safety and the mountains come first." },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="font-sans font-bold text-sm text-white">{step.title}</span>
                </div>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          6. MEET THE TRIBE BEHIND THE TRAILS (TEAM CARDS SECTION)
          Desktop: 4 Cards per row
          Mobile: Horizontal Snap Scroll (1 card full + 20% peek)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          <div className="text-center space-y-3 px-6">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              OUR TEAM
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight">
              Meet The Tribe Behind The Trails.
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-medium max-w-xl mx-auto">
              Passionate explorers, tech builders, and mountain captains bringing every weekend journey to life.
            </p>
          </div>

          {/* Mobile Snap Scroll (1 card full + peek of next card) */}
          <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 scrollbar-hide">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="w-[82%] min-w-[82%] shrink-0 snap-center"
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>

          {/* Desktop 4-Column Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 px-12">
            {TEAM_MEMBERS.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>

        </div>

        {/* Scrollbar hide styling */}
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          7. BOTTOM CTA BANNER
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 border border-neutral-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              YOUR NEXT ADVENTURE AWAITS
            </span>
            <h2 className="font-sans font-black italic text-3xl sm:text-5xl uppercase tracking-tight leading-tight">
              Ready to find your <span className="text-primary italic">tribe?</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
              Join thousands of solo travelers who found more than destinations. They found friends, stories and a second home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-orange transition-all hover:scale-105 cursor-pointer"
              >
                FIND YOUR GROUP
              </button>
              <Link
                href="/packages"
                className="w-full sm:w-auto border border-neutral-700 hover:border-white text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
              >
                BROWSE ALL TRAILS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
