"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { ShieldAlert, LogIn, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setErrorShake(true);
        toast.error("Invalid administrator credentials.");
        setTimeout(() => setErrorShake(false), 500);
      } else {
        toast.success("Welcome back, Captain!");
        // Hard redirect so the browser sends the newly-set session cookie
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#111111] flex items-center justify-center p-6">
      
      {/* Login Card */}
      <div
        className={cn(
          "bg-white border border-gray-border w-full max-w-[400px] rounded-3xl overflow-hidden shadow-float transition-all",
          errorShake ? "animate-shake border-primary ring-2 ring-primary/20" : ""
        )}
      >
        {/* Header banner */}
        <div className="bg-[#1a1a1a] text-white p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-10 w-[140px] relative overflow-hidden rounded-md border border-white/10 bg-white/5">
            <Image
              src="/logo1.png"
              alt="Matka Trails"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-lg tracking-tight">
              Captain Console
            </h3>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Admin Access Authorization
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Email input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-light" />
              <input
                type="email"
                placeholder="admin@matkatrails.com"
                {...register("email")}
                className={cn(
                  "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-bg border text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.email ? "border-primary" : "border-gray-border"
                )}
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {errors.email.message}
              </span>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-light" />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(
                  "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-bg border text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.password ? "border-primary" : "border-gray-border"
                )}
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#111111] hover:bg-primary text-white hover:text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing Session...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Verify & Login</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-gray-light font-semibold">
            Protected console. Unauthorized attempts will be logged.
          </p>
        </form>
      </div>

    </div>
  );
}
