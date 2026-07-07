"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Send, CheckCircle, Loader2, PhoneCall } from "lucide-react";
import { toast } from "react-hot-toast";

interface QuickCallFormProps {
  packageId?: string | null;
  defaultDestination?: string;
  onSuccess?: () => void;
}

export default function QuickCallForm({
  packageId = null,
  defaultDestination = "",
  onSuccess,
}: QuickCallFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    destination: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { data: destinations = [] } = useQuery({
    queryKey: ["public-destinations"],
    queryFn: () => publicApi.getDestinations(),
  });

  // Pre-populate destination if provided as a prop
  useEffect(() => {
    if (defaultDestination) {
      setForm((prev) => ({ ...prev, destination: defaultDestination }));
    }
  }, [defaultDestination]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.age || !form.gender) {
      toast.error("Please fill out Name, Phone, Age, and Gender.");
      return;
    }

    setStatus("loading");

    try {
      await publicApi.submitLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        age: Number(form.age),
        gender: form.gender,
        city: form.destination || undefined,
        message: form.message.trim() || undefined,
        packageId: packageId || undefined,
        source: packageId ? "PACKAGE_BOOKING" : "WEBSITE_FORM",
      });

      setStatus("success");
      toast.success("Callback request submitted successfully!");
      setForm({
        name: "",
        phone: "",
        age: "",
        gender: "",
        destination: defaultDestination || "",
        message: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      toast.error(err.message || "Failed to submit request. Please try again.");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div className="bg-white border border-gray-border rounded-3xl p-6 md:p-8 shadow-card relative overflow-hidden select-none">
      {/* Visual background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-reminder text-2xl text-black">Callback Requested!</h3>
          <p className="text-xs text-gray-mid font-semibold max-w-xs leading-relaxed">
            Our trip curator will reach out to you on your phone number within 24 hours.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>QUICK CALLBACK</span>
            </span>
            <h3 className="font-reminder text-3xl text-black leading-none capitalize">
              Get a Call <span className="text-primary italic">Back</span>
            </h3>
            <p className="text-[10px] text-gray-mid font-semibold leading-relaxed">
              Planning a trip? Fill out this quick form and let our experts guide you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                placeholder=" "
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent border-gray-border focus:border-primary"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                           peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                           peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                           peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
              >
                Your Name *
              </label>
            </div>

            {/* Row 2: Phone */}
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder=" "
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent border-gray-border focus:border-primary"
              />
              <label
                htmlFor="phone"
                className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider pointer-events-none origin-top-left transition-all
                           peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                           peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                           peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
              >
                Mobile Number *
              </label>
            </div>

            {/* Row 3: Age & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age */}
              <div className="relative">
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder=" "
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent border-gray-border focus:border-primary"
                />
                <label
                  htmlFor="age"
                  className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider pointer-events-none origin-top-left transition-all
                             peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                             peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                             peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
                >
                  Age *
                </label>
              </div>

              {/* Gender */}
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-md bg-gray-bg/50 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <label
                  htmlFor="gender"
                  className="absolute left-4 top-[-8px] text-[10px] font-bold text-gray-dark uppercase tracking-wider bg-white px-1.5"
                >
                  Gender *
                </label>
              </div>
            </div>

            {/* Row 4: Destination Dropdown */}
            <div className="relative">
              <select
                id="destination"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-md bg-gray-bg/50 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="">-- General Query / Custom Trail --</option>
                {destinations.map((d: any) => (
                  <option key={d.id} value={d.name}>
                    {d.name} Territory
                  </option>
                ))}
              </select>
              <label
                htmlFor="destination"
                className="absolute left-4 top-[-8px] text-[10px] font-bold text-gray-dark uppercase tracking-wider bg-white px-1.5"
              >
                Interested Territory
              </label>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-mid">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Row 5: Message */}
            <div className="relative">
              <textarea
                rows={3}
                id="message"
                name="message"
                placeholder=" "
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 resize-none peer placeholder-transparent"
              />
              <label
                htmlFor="message"
                className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider pointer-events-none origin-top-left transition-all
                           peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                           peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                           peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
              >
                Notes / Custom Requirements
              </label>
            </div>

            {status === "error" && (
              <p className="text-[10px] text-rose-500 font-semibold leading-none">
                Something went wrong. Please check your network and try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wider uppercase py-4 rounded-md shadow-orange transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Request Callback
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
