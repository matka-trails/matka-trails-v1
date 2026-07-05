"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/stores/uiStore";
import { Menu, X, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { mobileMenuOpen, toggleMobileMenu, openBookingModal } = useUiStore();

  // Hero section is present on Home page. On home page, navbar is transparent at top.
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-300",
          isHomePage
            ? scrolled
              ? "bg-white/95 backdrop-blur-md shadow-card border-b border-gray-border text-foreground"
              : "bg-transparent text-white"
            : "bg-white/95 backdrop-blur-md shadow-card border-b border-gray-border text-foreground"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-50">
            <div className="h-10 w-[140px] relative overflow-hidden rounded-md border border-gray-border/10">
              <Image
                src="/matka.png"
                alt="Matka Trails"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: "Packages", href: "/packages" },
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => {
              const isActive = pathname === link.href;
              const isTransparent = isHomePage && !scrolled;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-sans font-semibold text-[13px] tracking-wide uppercase transition-all relative py-2 group hover:text-primary",
                    isTransparent ? "text-white/90 hover:text-white" : "text-foreground",
                    isActive && (isTransparent ? "text-white" : "text-primary")
                  )}
                >
                  {link.label}
                  {/* Active underline */}
                  {isActive && (
                    <span className={cn("absolute bottom-0 left-0 w-full h-[2px] rounded-full", isTransparent ? "bg-white" : "bg-primary")} />
                  )}
                  {/* Hover underline that grows from left */}
                  {!isActive && (
                    <span className={cn("absolute bottom-0 left-0 w-0 h-[2px] rounded-full group-hover:w-full transition-all duration-200", isTransparent ? "bg-white" : "bg-primary")} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 font-semibold text-xs uppercase tracking-wide px-4 py-2.5 rounded-pill transition-all",
                isHomePage && !scrolled
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : "bg-gray-bg hover:bg-gray-border text-foreground border border-gray-border"
              )}
            >
              <PhoneCall className={cn("w-4 h-4", isHomePage && !scrolled ? "text-white" : "text-primary")} />
              <span>Connect</span>
            </a>

            <button
              onClick={() => openBookingModal()}
              className="bg-primary text-white text-xs font-bold uppercase tracking-wide px-6 py-3 rounded-pill shadow-orange hover:bg-primary-dark transition-all duration-200"
            >
              Book a Trail
            </button>
          </div>

          {/* Mobile Hamburger menu */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "lg:hidden p-2 relative z-50 transition-colors",
              isHomePage && !scrolled
                ? "text-primary hover:text-primary-dark"
                : "text-foreground hover:text-primary"
            )}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Slide-in Mobile Drawer */}
      <MobileNav />
    </>
  );
}
