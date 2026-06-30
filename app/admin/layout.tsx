"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Compass,
  Users2,
  MapPin,
  BookOpen,
  LogOut,
  Menu,
  ChevronRight,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NextAuthProvider from "@/components/shared/NextAuthProvider";

// Sidebar link definition
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Leads Pipeline", href: "/admin/leads", icon: <Users2 className="w-4 h-4" /> },
  { label: "Trail Packages", href: "/admin/packages", icon: <Compass className="w-4 h-4" /> },
  { label: "Destinations", href: "/admin/destinations", icon: <MapPin className="w-4 h-4" /> },
  { label: "Blogs & Guides", href: "/admin/blogs", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Gallery & Videos", href: "/admin/gallery", icon: <Camera className="w-4 h-4" /> },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, don't show the dashboard shell layout
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream-bg flex font-sans">
      
      {/* ── 1. Desktop Sidebar (240px wide) ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[240px] bg-white border-r border-gray-border shrink-0 sticky top-0 h-screen p-5">
        <div className="space-y-8">
          {/* Logo header */}
          <Link href="/">
            <div className="h-9 w-[130px] relative overflow-hidden rounded-md border border-gray-border bg-gray-bg/40">
              <Image
                src="/logo1.png"
                alt="Matka Trails"
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Navigation link list */}
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    active
                      ? "bg-primary-light text-primary border-l-4 border-primary pl-2.5"
                      : "text-gray-mid hover:bg-gray-bg hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin controls */}
        <div className="space-y-4 border-t border-gray-border pt-4">
          {session?.user && (
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center font-bold text-xs text-primary uppercase border border-primary/20">
                {session.user.name?.[0] || "A"}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold block text-black truncate leading-none">
                  {session.user.name}
                </span>
                <span className="text-[9px] text-gray-light font-bold uppercase tracking-wider block mt-1">
                  {session.user.role || "ADMIN"}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── 2. Mobile Bottom Header & Menu drawers ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 w-[240px] bg-white border-r border-gray-border p-5 flex flex-col justify-between z-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <div className="h-8 w-[120px] relative overflow-hidden rounded">
                <Image src="/logo1.png" alt="Matka Trails" fill sizes="120px" className="object-cover" />
              </div>
            </Link>
          </div>

          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    active
                      ? "bg-primary-light text-primary border-l-4 border-primary pl-2.5"
                      : "text-gray-mid hover:bg-gray-bg"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ── 3. Main Console Viewport ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header bar */}
        <header className="h-[60px] bg-white border-b border-gray-border px-6 flex items-center justify-between lg:justify-end shrink-0 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 rounded-lg border border-gray-border lg:hidden text-gray-dark cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-dark">
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-bg px-3 py-1.5 rounded-lg border border-gray-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>CAPTAIN CONSOLE ONLINE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </NextAuthProvider>
  );
}
