import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

/**
 * GET /api/public/destinations/[slug]
 * Get a destination with its gallery and published packages
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const destination = await prisma.destination.findUnique({
      where: { slug, deletedAt: null },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
        packages: {
          where: { status: "PUBLISHED", deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            coverImage: true,
            durationDays: true,
            durationNights: true,
            priceOriginal: true,
            priceDiscounted: true,
            groupType: true,
            isFeatured: true,
            startDate: true,
            maxGroupSize: true,
            currentBookings: true,
            _count: { select: { reviews: { where: { isApproved: true } } } },
          },
        },
      },
    });

    if (!destination) {
      return errorResponse("Destination not found", "NOT_FOUND", 404);
    }

    // Optimize image URLs
    const optimized = {
      ...destination,
      coverImage: destination.coverImage ? getOptimizedImageUrl(destination.coverImage, 1200) : null,
      gallery: destination.gallery.map((img: typeof destination.gallery[number]) => ({
        ...img,
        imageUrl: getOptimizedImageUrl(img.imageUrl, 800),
      })),
      packages: destination.packages.map((pkg: typeof destination.packages[number]) => ({
        ...pkg,
        coverImage: pkg.coverImage ? getOptimizedImageUrl(pkg.coverImage, 600) : null,
      })),
    };

    return successResponse(optimized);
  }
);
