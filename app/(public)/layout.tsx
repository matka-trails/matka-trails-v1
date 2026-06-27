import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";
import SmoothScroll from "@/components/shared/SmoothScroll";
import QueryProvider from "@/components/shared/QueryProvider";
import BookingModal from "@/components/shared/BookingModal";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <SmoothScroll>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-[72px]">
            {children}
          </main>
          <Footer />
          <BookingModal />
        </div>
      </SmoothScroll>
    </QueryProvider>
  );
}
