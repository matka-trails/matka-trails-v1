import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { getOptimizedImageUrl, getOptimizedVideoUrl } from "@/lib/cloudinary";

/**
 * GET /api/public/packages/[slug]
 * Get full public detail for a single package (by slug)
 * Includes: itinerary, approved reviews, testimonials, FAQs, gallery
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const pkg = await prisma.package.findUnique({
      where: { slug, status: "PUBLISHED", deletedAt: null },
      include: {
        destination: {
          select: { id: true, name: true, slug: true, coverImage: true, description: true },
        },
        itinerary: {
          orderBy: [{ sortOrder: "asc" }, { dayNumber: "asc" }],
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
        testimonials: {
          orderBy: { sortOrder: "asc" },
        },
        faqs: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!pkg) {
      return errorResponse("Package not found", "NOT_FOUND", 404);
    }

    // Optimize all media URLs
    const optimizedPkg = {
      ...pkg,
      coverImage: pkg.coverImage ? getOptimizedImageUrl(pkg.coverImage, 1200) : null,
      galleryImages: pkg.galleryImages.map((url: string) => getOptimizedImageUrl(url, 800)),
      pdfUrl: pkg.pdfUrl, // PDFs don't need image optimization
      itinerary: pkg.itinerary.map((day: typeof pkg.itinerary[number]) => ({
        ...day,
        images: day.images.map((url: string) => getOptimizedImageUrl(url, 800)),
      })),
      reviews: pkg.reviews.map((review: typeof pkg.reviews[number]) => ({
        ...review,
        reviewImages: review.reviewImages.map((url: string) => getOptimizedImageUrl(url, 400)),
      })),
      testimonials: pkg.testimonials.map((testimonial: typeof pkg.testimonials[number]) => ({
        ...testimonial,
        videoUrl: getOptimizedVideoUrl(testimonial.videoUrl),
        thumbnail: testimonial.thumbnail ? getOptimizedImageUrl(testimonial.thumbnail, 400) : null,
      })),
      destination: {
        ...pkg.destination,
        coverImage: pkg.destination.coverImage
          ? getOptimizedImageUrl(pkg.destination.coverImage, 600)
          : null,
      },
      // Computed fields for convenience
      reviewCount: pkg.reviews.length,
      averageRating:
        pkg.reviews.length > 0
          ? Math.round(
              (pkg.reviews.reduce((sum: number, r: typeof pkg.reviews[number]) => sum + r.rating, 0) / pkg.reviews.length) * 10
            ) / 10
          : null,
      spotsLeft: pkg.maxGroupSize ? pkg.maxGroupSize - pkg.currentBookings : null,
    };

    return successResponse(optimizedPkg);
  }
);
