"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { adminApi } from "@/lib/api";
import BlogForm from "@/components/admin/blogs/BlogForm";
import QueryProvider from "@/components/shared/QueryProvider";

function EditBlogContent() {
  const params = useParams();
  const id = params?.id as string;

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => adminApi.getBlogById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    notFound();
  }

  return <BlogForm initialData={blog} />;
}

export default function EditBlogPage() {
  return (
    <QueryProvider>
      <EditBlogContent />
    </QueryProvider>
  );
}
