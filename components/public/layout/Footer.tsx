"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      label: "Instagram",
      href: "https://instagram.com/matkatrails",
      social: "instagram",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://youtube.com/matkatrails",
      social: "youtube",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/918294709846",
      social: "whatsapp",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.357.627 4.663 1.817 6.685L2.667 29.333l6.814-1.787A13.28 13.28 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.003 2.667zm0 2.4c5.946 0 10.797 4.85 10.797 10.933s-4.851 10.933-10.797 10.933a10.73 10.73 0 0 1-5.455-1.488l-.39-.234-4.045 1.06 1.08-3.941-.256-.405A10.69 10.69 0 0 1 5.204 16c0-6.083 4.851-10.933 10.799-10.933zm-3.244 5.946c-.197 0-.517.074-.787.37-.27.296-1.032 1.008-1.032 2.458 0 1.45 1.057 2.851 1.204 3.048.148.197 2.063 3.148 5.009 4.293 2.434.96 2.947.77 3.476.722.53-.048 1.711-.7 1.952-1.376.24-.676.24-1.255.168-1.376-.072-.12-.268-.192-.563-.336-.295-.144-1.744-.86-2.015-.958-.27-.097-.467-.144-.663.144-.196.288-.76.958-.931 1.155-.17.197-.34.22-.634.073-.295-.144-1.245-.459-2.372-1.462-.876-.78-1.468-1.743-1.64-2.038-.17-.295-.017-.455.128-.601.13-.13.295-.336.443-.504.148-.168.197-.288.296-.48.098-.196.049-.37-.025-.516-.073-.146-.655-1.6-.904-2.19-.236-.57-.477-.494-.657-.503l-.56-.01z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto pb-12 border-b border-white/10">

        {/* ── DESKTOP: 4-col grid ── */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <div className="h-10 w-[140px] relative overflow-hidden rounded-md border border-white/10 bg-white/5">
                <Image src="/matka.png" alt="Matka Trails" fill className="object-cover" />
              </div>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed max-w-[240px] font-medium">
              Winding trails, group travel, adventure-filled weekends. Solo in, group out. Discover the magic of trekking.
            </p>
            <a href="mailto:hello@matkatrails.com" className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
              <Mail className="w-4 h-4" />
              <span>hello@matkatrails.com</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-semibold text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/destinations" },
                { label: "Packages", href: "/packages" },
                { label: "Travel Blog", href: "/blog" },
                { label: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Trails */}
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">Popular Trails</h4>
            <ul className="flex flex-col gap-3 font-semibold text-sm text-white/60">
              <li><Link href="/packages?destination=Kedarnath" className="hover:text-primary transition-colors">Kedarnath Trek</Link></li>
              <li><Link href="/packages?destination=Rishikesh" className="hover:text-primary transition-colors">Rishikesh Rafting</Link></li>
              <li><Link href="/packages?destination=Manali" className="hover:text-primary transition-colors">Hampta Pass Trek</Link></li>
              <li><Link href="/packages?destination=Spiti" className="hover:text-primary transition-colors">Spiti Valley Expedition</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6 text-sm text-white/60 font-semibold">
            <div>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6 text-white">Contact Office</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <p className="leading-relaxed">New Delhi, India</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <a href="tel:+918294709846" className="hover:text-primary transition-colors">+91 82947 09846</a>
            </div>

            {/* Social Icons — pill boxes with tooltip */}
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Follow Us</p>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <div key={s.label} className="social-icon-wrap">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="social-icon-btn"
                      data-social={s.social}
                    >
                      {s.icon}
                    </a>
                    <span className="social-tooltip">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── MOBILE layout ── */}
        <div className="flex flex-col gap-10 lg:hidden">

          {/* Row 1: Brand — centered */}
          <div className="flex flex-col items-center text-center gap-4">
            <Link href="/">
              <div className="h-10 w-[140px] relative overflow-hidden rounded-md border border-white/10 bg-white/5">
                <Image src="/matka.png" alt="Matka Trails" fill className="object-cover" />
              </div>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed max-w-[260px] font-medium">
              Winding trails, group travel, adventure-filled weekends. Solo in, group out. Discover the magic of trekking.
            </p>
            <a href="mailto:hello@matkatrails.com" className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
              <Mail className="w-4 h-4" />
              <span>hello@matkatrails.com</span>
            </a>
          </div>

          {/* Row 2: Quick Links + Popular Trails — side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-3 font-semibold text-sm">
                {[
                  { label: "Home", href: "/" },
                  { label: "Destinations", href: "/destinations" },
                  { label: "Packages", href: "/packages" },
                  { label: "Travel Blog", href: "/blog" },
                  { label: "About Us", href: "/about" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Trails */}
            <div>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Popular Trails</h4>
              <ul className="flex flex-col gap-3 font-semibold text-sm text-white/60">
                <li><Link href="/packages?destination=Kedarnath" className="hover:text-primary transition-colors">Kedarnath Trek</Link></li>
                <li><Link href="/packages?destination=Rishikesh" className="hover:text-primary transition-colors">Rishikesh Rafting</Link></li>
                <li><Link href="/packages?destination=Manali" className="hover:text-primary transition-colors">Hampta Pass Trek</Link></li>
                <li><Link href="/packages?destination=Spiti" className="hover:text-primary transition-colors">Spiti Valley Expedition</Link></li>
              </ul>
            </div>
          </div>

          {/* Row 3: Contact + Socials — centered */}
          <div className="flex flex-col items-center text-center gap-4 text-sm text-white/60 font-semibold">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest text-white">Contact Office</h4>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <p>New Delhi, India</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <a href="tel:+918294709846" className="hover:text-primary transition-colors">+91 82947 09846</a>
            </div>

            {/* Social Icons mobile */}
            <div className="flex items-center gap-2 mt-2">
              {socials.map((s) => (
                <div key={s.label} className="social-icon-wrap">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="social-icon-btn"
                    data-social={s.social}
                  >
                    {s.icon}
                  </a>
                  <span className="social-tooltip">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-medium text-white/35">
        <p>© {currentYear} Matka Trails Private Limited. All rights reserved.</p>

        {/* Legal Links — center */}
        <div className="flex items-center gap-1">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-white/5">
            Privacy Policy
          </Link>
          <span className="text-white/15">·</span>
          <Link href="/terms-and-conditions" className="hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-white/5">
            Terms &amp; Conditions
          </Link>
        </div>

        {/* Empty spacer to keep copyright left / legal center on desktop */}
        <div className="hidden md:block w-[220px]" />
      </div>

      <style jsx global>{`
        /* ── Social Icon Pill Boxes ── */
        .social-icon-wrap {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }

        .social-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
        }

        .social-icon-btn:hover {
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
          border-color: transparent;
          color: #fff;
        }

        /* Instagram — multi-stop gradient */
        .social-icon-btn[data-social="instagram"]:hover {
          background: linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%);
          box-shadow: 0 8px 24px rgba(238, 42, 123, 0.45);
        }

        /* YouTube — brand red */
        .social-icon-btn[data-social="youtube"]:hover {
          background: #ff0000;
          box-shadow: 0 8px 24px rgba(255, 0, 0, 0.4);
        }

        /* WhatsApp — brand green */
        .social-icon-btn[data-social="whatsapp"]:hover {
          background: #25d366;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
        }

        /* Tooltip */
        .social-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) scale(0.85);
          background: #1a1a1a;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }

        .social-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #1a1a1a;
        }

        .social-icon-wrap:hover .social-tooltip {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }
      `}</style>
    </footer>
  );
}
