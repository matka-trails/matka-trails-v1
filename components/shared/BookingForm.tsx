"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadSchema } from "@/lib/validations/lead";
import { publicApi, PublicPackage } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Calendar, Users, Send, CheckCircle2, AlertCircle, Briefcase, UserRound } from "lucide-react";
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
      gender: "",
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
      const submissionData = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email || undefined,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender || undefined,
        occupation: data.occupation || undefined,
        packageId: data.packageId || undefined,
        groupSize: data.groupSize ? Number(data.groupSize) : 1,
        preferredDate: data.preferredDate || undefined,
        message: data.message || undefined,
        source: data.source || "WEBSITE_FORM",
      };

      await publicApi.submitLead(submissionData);
      setIsSuccess(true);
      toast.success("Expedition slot inquiry logged! We'll call you shortly.");
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
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg">
        <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mb-6 text-primary animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="font-sans font-extrabold text-2xl tracking-tight text-black mb-3">
          You&apos;re on the list!
        </h3>
        <p className="text-sm text-gray-mid max-w-[340px] leading-relaxed mb-6 font-medium">
          Awesome decision! We have received your booking interest request. Our group travel coordinators will call you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-gray-bg hover:bg-gray-border text-foreground font-bold text-xs tracking-wide uppercase px-6 py-3 rounded-md transition-all"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Row 1: Name (Full Width) */}
      <div className="relative">
        <input
          type="text"
          id="name"
          placeholder=" "
          {...register("name")}
          className={cn(
            "w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent",
            errors.name ? "border-primary animate-shake" : "border-gray-border focus:border-primary"
          )}
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
        {errors.name && (
          <span className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.name?.message?.toString()}
          </span>
        )}
      </div>

      {/* Row 2: Phone & Email (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <input
            type="tel"
            id="phone"
            placeholder=" "
            {...register("phone")}
            className={cn(
              "w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent",
              errors.phone ? "border-primary animate-shake" : "border-gray-border focus:border-primary"
            )}
          />
          <label
            htmlFor="phone"
            className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                       peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                       peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                       peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
          >
            Mobile Number *
          </label>
          {errors.phone && (
            <span className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone?.message?.toString()}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder=" "
            {...register("email")}
            className={cn(
              "w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent",
              errors.email ? "border-primary" : "border-gray-border focus:border-primary"
            )}
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                       peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                       peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                       peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
          >
            Email Address
          </label>
          {errors.email && (
            <span className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email?.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Row 3: Age & Gender (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <input
            type="text"
            id="age"
            placeholder=" "
            {...register("age")}
            className={cn(
              "w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent",
              errors.age ? "border-primary" : "border-gray-border focus:border-primary"
            )}
          />
          <label
            htmlFor="age"
            className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                       peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                       peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                       peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
          >
            Age *
          </label>
          {errors.age && (
            <span className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.age?.message?.toString()}
            </span>
          )}
        </div>

        <div className="relative">
          <select
            id="gender"
            {...register("gender")}
            className={cn(
              "w-full px-4 py-3.5 rounded-md bg-gray-bg/50 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 peer appearance-none",
              errors.gender ? "border-primary" : "border-gray-border focus:border-primary"
            )}
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
          {errors.gender && (
            <span className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.gender?.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Row 4: Occupation & Select Trail Package (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <input
            type="text"
            id="occupation"
            placeholder=" "
            {...register("occupation")}
            className={cn(
              "w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent",
              errors.occupation ? "border-primary" : "border-gray-border focus:border-primary"
            )}
          />
          <label
            htmlFor="occupation"
            className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                       peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                       peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                       peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
          >
            Occupation *
          </label>
          {errors.occupation && (
            <span className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.occupation?.message?.toString()}
            </span>
          )}
        </div>

        <div className="relative">
          <select
            id="packageId"
            {...register("packageId")}
            disabled={loadingPackages}
            className="w-full px-4 py-3.5 rounded-md bg-gray-bg/50 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 appearance-none"
          >
            <option value="">-- Custom Trail / General --</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title} ({pkg.durationDays}D/{pkg.durationNights}N)
              </option>
            ))}
          </select>
          <label
            htmlFor="packageId"
            className="absolute left-4 top-[-8px] text-[10px] font-bold text-gray-dark uppercase tracking-wider bg-white px-1.5"
          >
            Trail Package
          </label>
        </div>
      </div>

      {/* Row 5: Group Size & Travel Date (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <select
            id="groupSize"
            {...register("groupSize", { valueAsNumber: true })}
            className="w-full px-4 py-3.5 rounded-md bg-gray-bg/50 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 appearance-none"
          >
            <option value={1}>Just Me (Solo Traveler)</option>
            <option value={2}>2 Travelers</option>
            <option value={3}>3 Travelers</option>
            <option value={4}>4-5 Travelers</option>
            <option value={6}>6+ (Small Group)</option>
            <option value={12}>12+ (Corporate Outing)</option>
          </select>
          <label
            htmlFor="groupSize"
            className="absolute left-4 top-[-8px] text-[10px] font-bold text-gray-dark uppercase tracking-wider bg-white px-1.5"
          >
            Group Size
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="preferredDate"
            placeholder=" "
            {...register("preferredDate")}
            className="w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 peer placeholder-transparent"
          />
          <label
            htmlFor="preferredDate"
            className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                       peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                       peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                       peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
          >
            Preferred Travel Date/Month
          </label>
        </div>
      </div>

      {/* Row 6: Travel Notes / Message (Full Width) */}
      <div className="relative">
        <textarea
          rows={3}
          id="message"
          placeholder=" "
          {...register("message")}
          className="w-full px-4 py-3.5 rounded-md bg-gray-bg/40 border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 resize-none peer placeholder-transparent"
        />
        <label
          htmlFor="message"
          className="absolute left-4 top-3.5 text-xs text-gray-light font-bold uppercase tracking-wider transition-all pointer-events-none origin-top-left -translate-y-0 scale-100
                     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                     peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5
                     peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80 peer-[:not(:placeholder-shown)]:text-gray-dark peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
        >
          Notes for the Captain (Optional)
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wider uppercase py-4 rounded-md shadow-orange transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Request...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Request Callback</span>
          </>
        )}
      </button>

      <p className="text-[9px] text-center text-gray-light font-bold uppercase tracking-wide">
        ✦ No upfront payment required. We will check available slots & group dynamics.
      </p>
    </form>
  );
}
