"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", destination: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="w-full py-20 px-4 md:px-6 lg:px-12 bg-[#111111] relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side — Info */}
          <div className="space-y-8 text-white">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                GET IN TOUCH
              </span>
              <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl leading-none tracking-tight">
                Plan your next <br />
                <span className="text-primary italic">adventure.</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed font-semibold max-w-md">
                Have a question about our packages? Want to book a custom group trip? 
                Drop us a message and our team will reach out within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Call Us</p>
                  <a href="tel:+919999999999" className="text-sm font-bold text-white hover:text-primary transition-colors">
                    +91 99999 99999
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Email Us</p>
                  <a href="mailto:hello@matkatrails.in" className="text-sm font-bold text-white hover:text-primary transition-colors">
                    hello@matkatrails.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Based In</p>
                  <p className="text-sm font-bold text-white">Delhi NCR, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side — Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sans font-bold text-xl text-white">Message Sent!</h3>
                <p className="text-sm text-white/50 font-semibold max-w-xs">
                  Thanks for reaching out! Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Anuj Sharma"
                      className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="anuj@email.com"
                      className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      Interested In
                    </label>
                    <select
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none"
                    >
                      <option value="" className="bg-[#1a1a1a]">Select destination</option>
                      <option value="Kedarnath" className="bg-[#1a1a1a]">Kedarnath Trek</option>
                      <option value="Rishikesh" className="bg-[#1a1a1a]">Rishikesh Adventure</option>
                      <option value="Manali" className="bg-[#1a1a1a]">Manali Explorer</option>
                      <option value="Spiti" className="bg-[#1a1a1a]">Spiti Cold Desert</option>
                      <option value="Other" className="bg-[#1a1a1a]">Other / Custom</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your plans, preferred dates, group size..."
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 font-semibold">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide uppercase py-4 rounded-xl shadow-orange transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
