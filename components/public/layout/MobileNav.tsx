"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/stores/uiStore";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneCall, ChevronRight } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, openBookingModal } = useUiStore();

  // Close mobile nav when clicking a link (pathname changes)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Packages", href: "/packages" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as any,
      },
    },
    open: {
      opacity: 0.98,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as any,
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -30 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" as any },
    },
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-30 bg-[#111111] text-white flex flex-col pt-24 px-6 pb-8"
        >
          {/* Main Links */}
          <div className="flex-1 flex flex-col gap-1 justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-3 border-b border-white/5 font-sans font-extrabold text-[22px] tracking-tight hover:text-primary transition-colors text-white"
                  >
                    <span className={isActive ? "text-primary" : ""}>
                      {item.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-white/20" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions & Contacts */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 mt-8"
          >
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full border border-white/10 hover:border-primary/50 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>Connect on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(() => openBookingModal(), 300);
              }}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-colors"
            >
              Find Your Group
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
