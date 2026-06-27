import BlogsConsole from "@/components/admin/blogs/BlogsConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Admin Blogs — Matka Trails",
};

export default function AdminBlogsPage() {
  return (
    <QueryProvider>
      <BlogsConsole />
    </QueryProvider>
  );
}
