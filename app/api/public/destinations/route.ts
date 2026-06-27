import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse } from "@/lib/apiResponse";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

/**
 * GET /api/public/destinations
 * List all destinations with package counts
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { deletedAt: null };
  if (featured === "true") where.isFeatured = true;

  const destinations = await prisma.destination.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      coverImage: true,
      isFeatured: true,
      _count: {
        select: {
          packages: { where: { status: "PUBLISHED", deletedAt: null } },
        },
      },
    },
  });

  const optimized = destinations.map((dest: typeof destinations[number]) => ({
    ...dest,
    coverImage: dest.coverImage ? getOptimizedImageUrl(dest.coverImage, 600) : null,
    packageCount: dest._count.packages,
  }));

  return successResponse(optimized);
});
