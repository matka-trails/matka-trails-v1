"use client";

import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";
// import SmoothScroll from "@/components/shared/SmoothScroll";
import BookingModal from "@/components/shared/BookingModal";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${isHomePage ? "pt-0" : "pt-[72px]"}`}>
        {children}
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
}
