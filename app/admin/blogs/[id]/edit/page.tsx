import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/blogs/BlogForm";
import QueryProvider from "@/components/shared/QueryProvider";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Article — Matka Trails",
};

async function getBlogData(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id, deletedAt: null },
  });
  return blog;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await getBlogData(id);

  if (!blog) {
    notFound();
  }

  // Convert dates and other complex objects into plain JSON for Next.js Client Components hydration safety
  const serializedBlog = JSON.parse(JSON.stringify(blog));

  return (
    <QueryProvider>
      <BlogForm initialData={serializedBlog} />
    </QueryProvider>
  );
}
