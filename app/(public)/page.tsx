import HeroNew from "@/components/public/home/HeroNew";
import DestinationExplorer from "@/components/public/home/DestinationExplorer";
import TrustStrip from "@/components/public/home/TrustStrip";
import TickerSection from "@/components/public/home/TickerSection";
import PackagesShowcase from "@/components/public/home/PackagesShowcase";
import HowItWorks from "@/components/public/home/HowItWorks";
import DestinationsShowcase from "@/components/public/home/DestinationsShowcase";
import GalleryFramesSection from "@/components/public/home/GalleryFramesSection";
import WhyMatkaTrails from "@/components/public/home/WhyMatkaTrails";
import VideoTestimonialsSection from "@/components/public/home/VideoTestimonialsSection";
import StatsBar from "@/components/public/home/StatsBar";
import BlogPreview from "@/components/public/home/BlogPreview";
import ContactSection from "@/components/public/home/ContactSection";
import QueryProvider from "@/components/shared/QueryProvider";

export default function Home() {
  return (
    <QueryProvider>
      <div className="flex flex-col w-full min-h-screen">
        {/* 1. New Immersive Hero */}
        <HeroNew />

        {/* 2. Destination Explorer — Story circles + packages grid */}
        <DestinationExplorer />

        {/* 2. Trust Credentials Strip */}
        {/* <TrustStrip /> */}

        {/* 3. Bidirectional CSS Ticker */}
        {/* <TickerSection /> */}

        {/* 4. Featured Packages — zig-zag 3-card carousel */}
        <PackagesShowcase />

        {/* 5. SVG connecting How It Works */}
        <HowItWorks />

        {/* 6. Staggered "hanging cards" destinations */}
        <DestinationsShowcase />

        {/* 7. Pitch Value Propositions */}
        <WhyMatkaTrails />

        {/* 7.2 Journey in Frames Panorama Gallery */}
        <GalleryFramesSection />

        {/* 7.5 Real People Real Stories Video Testimonials */}
        <VideoTestimonialsSection />

        {/* 8. Stats count-ups */}
        {/* <StatsBar /> */}

        {/* 9. Blogs Grid & call-to-action */}
        <BlogPreview />

        {/* 10. Contact Form */}
        <ContactSection />
      </div>
    </QueryProvider>
  );
}
