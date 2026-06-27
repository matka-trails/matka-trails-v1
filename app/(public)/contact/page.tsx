import { Metadata } from "next";
import { Mail, Phone, MapPin, Compass, Sparkles } from "lucide-react";
import BookingForm from "@/components/shared/BookingForm";

export const metadata: Metadata = {
  title: "Contact Matka Trails — Plan Your Weekend Trip",
  description: "Send us a callback request, or contact our coordinators via email or phone. Safe group travel expeditions across India.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* Container */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-12 md:pt-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white border border-gray-border rounded-3xl overflow-hidden shadow-float">
          
          {/* Left Column: Dark Info Panel */}
          <div className="lg:col-span-2 bg-[#111111] text-white p-8 md:p-10 flex flex-col justify-between space-y-12 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
            {/* SVG mountain/trail accent overlay background */}
            <div className="absolute inset-0 opacity-4 pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                <path
                  d="M 0 100 Q 100 200 200 100 T 400 100"
                  stroke="#ff6600"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                />
              </svg>
            </div>

            <div className="space-y-6 relative z-10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>CONNECT WITH US</span>
              </span>
              <h2 className="font-sans font-black italic text-3xl md:text-4xl uppercase leading-none tracking-tight">
                Ready to hit <br />
                the <span className="text-primary italic">trail?</span>
              </h2>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed font-semibold">
                Submit a callback request and our group dynamics captains will contact you within 24 hours.
              </p>
            </div>

            {/* Info Metrics */}
            <div className="space-y-6 text-xs md:text-sm font-semibold text-white/70 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <span>hello@matkatrails.com</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 99999 99999</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">New Delhi, India</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="border-t border-white/10 pt-6 text-[10px] text-white/40 leading-relaxed font-semibold relative z-10">
              ✦ Guaranteed response within 1 business day. We match group interests carefully.
            </div>
          </div>

          {/* Right Column: White Form Panel */}
          <div className="lg:col-span-3 p-8 md:p-10">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>CALLBACK REQUEST</span>
                </span>
                <h3 className="font-sans font-extrabold text-lg text-black">
                  Enter Your Preferences
                </h3>
              </div>

              {/* Renders the lead booking form component directly */}
              <BookingForm />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
