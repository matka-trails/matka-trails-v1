"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <div className="h-10 w-[140px] relative overflow-hidden rounded-md border border-white/10 bg-white/5">
              <Image
                src="/logo1.png"
                alt="Matka Trails"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <p className="text-xs text-white/50 leading-relaxed max-w-[240px] font-medium">
            Winding trails, group travel, adventure-filled weekends. Solo in, group out. Discover the magic of trekking.
          </p>
          <a
            href="mailto:hello@matkatrails.com"
            className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
          >
            <Mail className="w-4 h-4" />
            <span>hello@matkatrails.com</span>
          </a>
        </div>

        {/* Navigation links */}
        <div>
          <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3 font-semibold text-sm">
            {[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: "Packages", href: "/packages" },
              { label: "Travel Blog", href: "/blog" },
              { label: "About Us", href: "/about" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/60 hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations quick filter links */}
        <div>
          <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">
            Popular Trails
          </h4>
          <ul className="flex flex-col gap-3 font-semibold text-sm text-white/60">
            <li>
              <Link href="/packages?destination=Kedarnath" className="hover:text-primary transition-colors">
                Kedarnath Trek
              </Link>
            </li>
            <li>
              <Link href="/packages?destination=Rishikesh" className="hover:text-primary transition-colors">
                Rishikesh Rafting
              </Link>
            </li>
            <li>
              <Link href="/packages?destination=Manali" className="hover:text-primary transition-colors">
                Hampta Pass Trek
              </Link>
            </li>
            <li>
              <Link href="/packages?destination=Spiti" className="hover:text-primary transition-colors">
                Spiti Valley Expedition
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="flex flex-col gap-6 text-sm text-white/60 font-semibold">
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6 text-white">
              Contact Office
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <p className="leading-relaxed">New Delhi, India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary shrink-0" />
            <p>+91 99999 99999</p>
          </div>
        </div>
      </div>

      {/* Footer bottom links & socials */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/40">
        <p>© {currentYear} Matka Trails Private Limited. All rights reserved.</p>
        
        {/* Social Icons */}
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/matkatrails"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a
            href="https://youtube.com/matkatrails"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
