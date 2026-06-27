import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

/**
 * GET /api/public/blogs/[slug]
 * Get a full blog post with content blocks and FAQs
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
      where: { slug, status: "PUBLISHED", deletedAt: null },
      include: {
        author: { select: { name: true, avatar: true } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!blog) {
      return errorResponse("Blog not found", "NOT_FOUND", 404);
    }

    // Optimize content block images
    const contentBlocks = (
      blog.contentBlocks as Array<{ type: string; url?: string; [key: string]: unknown }>
    ).map((block) => {
      if (block.type === "image" && block.url) {
        return { ...block, url: getOptimizedImageUrl(block.url as string, 1000) };
      }
      return block;
    });

    // Generate table of contents from heading blocks
    const tableOfContents = contentBlocks
      .filter((block) => block.type === "heading")
      .map((block, index) => ({
        id: `heading-${index}`,
        text: block.content as string,
        level: (block.level as number) || 2,
      }));

    const optimizedBlog = {
      ...blog,
      coverImage: blog.coverImage ? getOptimizedImageUrl(blog.coverImage, 1200) : null,
      contentBlocks,
      tableOfContents,
      author: blog.author
        ? {
            ...blog.author,
            avatar: blog.author.avatar ? getOptimizedImageUrl(blog.author.avatar, 100) : null,
          }
        : null,
    };

    return successResponse(optimizedBlog);
  }
);
