import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

/**
 * GET /api/public/blogs
 * Public listing of published blogs with pagination
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);
  const tag = searchParams.get("tag");
  const search = searchParams.get("search") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: "PUBLISHED",
    deletedAt: null,
  };

  if (tag) {
    where.tags = { has: tag };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
    ];
  }

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        tags: true,
        createdAt: true,
        author: { select: { name: true } },
        // Return only the first paragraph for preview
        contentBlocks: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);

  // Optimize images and create excerpt
  const optimizedBlogs = blogs.map((blog: typeof blogs[number]) => {
    // Extract first paragraph as excerpt
    const blocks = (blog.contentBlocks as Array<{ type: string; content?: string }>) || [];
    const firstParagraph = blocks.find((b) => b.type === "paragraph");
    const excerpt = firstParagraph?.content
      ? firstParagraph.content.substring(0, 200) + (firstParagraph.content.length > 200 ? "..." : "")
      : "";

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      coverImage: blog.coverImage ? getOptimizedImageUrl(blog.coverImage, 600) : null,
      tags: blog.tags,
      createdAt: blog.createdAt,
      author: blog.author,
      excerpt,
    };
  });

  return paginatedResponse(optimizedBlogs, total, pagination);
});
