import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes cleanly, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Indian Rupees currency (INR).
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats a Date or date string to a clean human-readable representation.
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Client-safe Cloudinary image optimizer.
 * Replaces "/upload/" in Cloudinary URLs with transformation parameters.
 */
export function getOptimizedImageUrl(url: string | null | undefined, width?: number): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;

  let transformation = "f_auto,q_auto";
  if (width) {
    transformation += `,w_${width},c_limit`;
  }

  return url.replace("/upload/", `/upload/${transformation}/`);
}

/**
 * Client-safe Cloudinary video optimizer.
 */
export function getOptimizedVideoUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/**
 * Client-safe Cloudinary video thumbnail generator.
 */
export function getVideoThumbnailUrl(videoUrl: string | null | undefined, width = 400): string {
  if (!videoUrl) return "";
  if (!videoUrl.includes("cloudinary.com")) return videoUrl;
  return videoUrl
    .replace("/video/upload/", `/video/upload/f_auto,q_auto,w_${width},so_0/`)
    .replace(/\.(mp4|mov|avi|webm)$/i, ".jpg");
}
