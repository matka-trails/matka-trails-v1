import { v2 as cloudinary } from "cloudinary";

// ─── Configure Cloudinary ──────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// ─── Folder Organization ──────────────────────────────

export const CLOUDINARY_FOLDERS = {
  packages: "matka-trails/packages",
  destinations: "matka-trails/destinations",
  blogs: "matka-trails/blogs",
  testimonials: "matka-trails/testimonials",
  reviews: "matka-trails/reviews",
  gallery: "matka-trails/gallery",
  pdfs: "matka-trails/pdfs",
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

// ─── Signed Upload Params ─────────────────────────────
// Returns params for Cloudinary's direct browser upload (signed).
// The frontend uses these to upload directly to Cloudinary
// without routing files through our server.

export function getSignedUploadParams(folder: CloudinaryFolder) {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    folder,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
  };
}

// ─── Optimized URL Helpers ────────────────────────────
// Applies f_auto (format) and q_auto (quality) transformations
// to Cloudinary URLs for optimal delivery and reduced bandwidth.

/**
 * Get an optimized image URL with automatic format/quality.
 * Converts raw Cloudinary URLs to include f_auto,q_auto transformations.
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  let transformation = "f_auto,q_auto";
  if (width) {
    transformation += `,w_${width},c_limit`; // limit width, maintain aspect ratio
  }

  return url.replace("/upload/", `/upload/${transformation}/`);
}

/**
 * Get an optimized video URL with automatic format/quality.
 */
export function getOptimizedVideoUrl(url: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/**
 * Get a thumbnail from a video URL.
 */
export function getVideoThumbnailUrl(videoUrl: string, width = 400): string {
  if (!videoUrl || !videoUrl.includes("cloudinary.com")) return videoUrl;
  // Replace video extension with jpg and add thumbnail transformation
  return videoUrl
    .replace("/video/upload/", `/video/upload/f_auto,q_auto,w_${width},so_0/`)
    .replace(/\.(mp4|mov|avi|webm)$/i, ".jpg");
}

// ─── Delete Resource ──────────────────────────────────

/**
 * Delete a resource from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, error);
    // Don't throw — deletion failures shouldn't block the main operation
    return null;
  }
}
