import BlogForm from "@/components/admin/blogs/BlogForm";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Write Article — Matka Trails",
};

export default function AdminNewBlogPage() {
  return (
    <QueryProvider>
      <BlogForm />
    </QueryProvider>
  );
}
