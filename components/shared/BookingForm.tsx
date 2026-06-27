"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadSchema, CreateLeadInput } from "@/lib/validations/lead";
import { publicApi, PublicPackage } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Calendar, Users, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  packageId?: string | null;
  onSuccess?: () => void;
}

export default function BookingForm({ packageId = null, onSuccess }: BookingFormProps) {
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(createLeadSchema) as any,
    defaultValues: {
      packageId: packageId || "",
      groupSize: 1,
      source: packageId ? "PACKAGE_BOOKING" : "WEBSITE_FORM",
    },
  });

  // Pre-select packageId if it changes dynamically
  useEffect(() => {
    if (packageId) {
      setValue("packageId", packageId);
      setValue("source", "PACKAGE_BOOKING");
    }
  }, [packageId, setValue]);

  // Fetch package list for dropdown selector
  useEffect(() => {
    publicApi
      .getPackages({ limit: 100 })
      .then((data) => {
        setPackages(data.packages);
      })
      .catch((err) => {
        console.error("Failed to load packages", err);
      })
      .finally(() => {
        setLoadingPackages(false);
      });
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Map form fields to fit the LeadSubmission API type exactly
      const submissionData = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        packageId: data.packageId || undefined,
        groupSize: data.groupSize ? Number(data.groupSize) : 1,
        preferredDate: data.preferredDate || undefined,
        message: data.message || undefined,
        source: data.source || "WEBSITE_FORM",
      };

      await publicApi.submitLead(submissionData);
      setIsSuccess(true);
      toast.success("Lead request logged! We'll contact you shortly.");
      reset();
      if (onSuccess) {
        setTimeout(onSuccess, 3000);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit booking details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-6 text-primary animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="font-sans font-extrabold text-2xl tracking-tight text-black mb-3">
          You're on the list!
        </h3>
        <p className="text-sm text-gray-mid max-w-[340px] leading-relaxed mb-6 font-medium">
          Awesome decision! We have received your booking interest request. Our group travel coordinators will call you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-gray-bg hover:bg-gray-border text-foreground font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-xl transition-all"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
          Your Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Rahul Sharma"
          {...register("name")}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-gray-bg border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20",
            errors.name ? "border-primary animate-shake" : "border-gray-border"
          )}
        />
        {errors.name && (
          <span className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.name?.message?.toString()}
          </span>
        )}
      </div>

      {/* Grid: Phone & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            placeholder="10-digit number"
            {...register("phone")}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-gray-bg border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20",
              errors.phone ? "border-primary animate-shake" : "border-gray-border"
            )}
          />
          {errors.phone && (
            <span className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone?.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@email.com"
            {...register("email")}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-gray-bg border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20",
              errors.email ? "border-primary" : "border-gray-border"
            )}
          />
          {errors.email && (
            <span className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email?.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Trail Package Selector */}
      <div>
        <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
          Select Trail Package
        </label>
        <select
          {...register("packageId")}
          disabled={loadingPackages}
          className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
        >
          <option value="">-- General Inquiry / Custom Trail --</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.title} ({pkg.durationDays}D/{pkg.durationNights}N)
            </option>
          ))}
        </select>
      </div>

      {/* Grid: Group Size & Travel Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
            Group Size
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 w-4 h-4 text-gray-light" />
            <select
              {...register("groupSize", { valueAsNumber: true })}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value={1}>Just Me (Solo Traveler)</option>
              <option value={2}>2 Travelers</option>
              <option value={3}>3 Travelers</option>
              <option value={4}>4-5 Travelers</option>
              <option value={6}>6+ (Small Group)</option>
              <option value={12}>12+ (Corporate Outing)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
            Preferred Travel Month/Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-light" />
            <input
              type="text"
              placeholder="e.g. October, Next Weekend"
              {...register("preferredDate")}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Travel Notes / Message */}
      <div>
        <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
          Notes for the Captain (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Any custom requests, physical fitness notes or preference queries..."
          {...register("message")}
          className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide uppercase py-4 rounded-xl shadow-orange transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Request...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Request Callback</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-gray-light leading-relaxed">
        ✦ No upfront payment required. We will check available slots & group dynamics before confirming.
      </p>
    </form>
  );
}
