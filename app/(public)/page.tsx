import HeroSection from "@/components/public/home/HeroSection";
import TrustStrip from "@/components/public/home/TrustStrip";
import TickerSection from "@/components/public/home/TickerSection";
import PackagesSection from "@/components/public/home/PackagesSection";
import HowItWorks from "@/components/public/home/HowItWorks";
import DestinationsGrid from "@/components/public/home/DestinationsGrid";
import GalleryFramesSection from "@/components/public/home/GalleryFramesSection";
import WhyMatkaTrails from "@/components/public/home/WhyMatkaTrails";
import VideoTestimonialsSection from "@/components/public/home/VideoTestimonialsSection";
import StatsBar from "@/components/public/home/StatsBar";
import BlogPreview from "@/components/public/home/BlogPreview";
import QueryProvider from "@/components/shared/QueryProvider";

export default function Home() {
  return (
    <QueryProvider>
      <div className="flex flex-col w-full min-h-screen">
        {/* 1. Immersive Hero showcase */}
        <HeroSection />

        {/* 2. Trust Credentials Strip */}
        <TrustStrip />

        {/* 3. Bidirectional CSS Ticker */}
        <TickerSection />

        {/* 4. Featured Packages scroll lane */}
        <PackagesSection />

        {/* 5. SVG connecting How It Works */}
        <HowItWorks />

        {/* 6. Pinterest-style destinations masonry */}
        <DestinationsGrid />

        {/* 6.5 Journey in Frames Panorama Gallery */}
        <GalleryFramesSection />

        {/* 7. Pitch Value Propositions */}
        <WhyMatkaTrails />

        {/* 7.5 Real People Real Stories Video Testimonials */}
        <VideoTestimonialsSection />

        {/* 8. Stats count-ups */}
        <StatsBar />

        {/* 9. Blogs Grid & call-to-action */}
        <BlogPreview />
      </div>
    </QueryProvider>
  );
}
