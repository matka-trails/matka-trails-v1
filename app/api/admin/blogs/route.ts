import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";
import { createBlogSchema } from "@/lib/validations/blog";
import { generateUniqueSlug } from "@/lib/slugify";

/**
 * GET /api/admin/blogs
 * List all blogs with pagination, search, and status filter
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { deletedAt: null };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { tags: { hasSome: [search] } },
    ];
  }
  if (status) where.status = status;

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { faqs: true } },
      },
    }),
    prisma.blog.count({ where }),
  ]);

  return paginatedResponse(blogs, total, pagination);
});

/**
 * POST /api/admin/blogs
 * Create a new blog post
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const validated = createBlogSchema.parse(body);

  // Generate unique slug
  const slug = await generateUniqueSlug(validated.title, async (s) => {
    const existing = await prisma.blog.findUnique({ where: { slug: s } });
    return existing !== null;
  });

  const blog = await prisma.blog.create({
    data: {
      ...validated,
      slug,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  return successResponse(blog, 201);
});
