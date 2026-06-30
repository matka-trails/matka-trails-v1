"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Eye,
  Tag,
  Calendar,
  User,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function BlogsConsole() {
  const queryClient = useQueryClient();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Fetch blogs
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => adminApi.getBlogs(),
  });

  // Mutate delete blog
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post deleted successfully!");
      setDeleteTargetId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete blog post.");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            Blogs & Guides
          </h1>
        </div>

        <Link
          href="/admin/blogs/new"
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Write Article</span>
        </Link>
      </div>

      {/* Blogs list */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-dark border-collapse">
            <thead>
              <tr className="bg-gray-bg border-b border-gray-border uppercase text-[10px] font-bold tracking-wider text-gray-light">
                <th className="p-4">Cover Image</th>
                <th className="p-4">Article Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-xs text-gray-light italic font-semibold">
                    Loading articles...
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((b: any) => (
                  <tr key={b.id} className="border-b border-gray-border hover:bg-gray-bg/25 animate-fadeIn">
                    <td className="p-4">
                      {b.coverImage ? (
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-border">
                          <Image src={b.coverImage} alt={b.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-gray-bg border border-gray-border flex items-center justify-center text-gray-light text-[9px]">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-black text-sm max-w-sm truncate">{b.title}</div>
                      <div className="text-[9px] text-gray-light font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                        <span>Slug: /{b.slug}</span>
                        {b.tags && b.tags.length > 0 && (
                          <span className="flex items-center gap-1 text-[9px] text-primary">
                            <Tag className="w-2.5 h-2.5" />
                            {b.tags.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-light" />
                        <span>{b.author?.name || "Captain Coordinator"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "text-[9px] font-extrabold px-2.5 py-1 rounded border uppercase tracking-wider",
                          b.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-gray-bg text-gray-mid border-gray-border"
                        )}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-light">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-light" />
                        <span>{formatDate(b.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="p-2 border border-gray-border hover:border-black text-gray-dark hover:text-black rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Preview Article"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/blogs/${b.id}/edit`}
                        className="p-2 border border-gray-border hover:border-black text-gray-dark hover:text-black rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${b.title}"?`)) {
                            handleDelete(b.id);
                          }
                        }}
                        className="p-2 border border-gray-border hover:border-red-500 text-gray-dark hover:text-red-500 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-xs text-gray-light italic font-semibold">
                    No travel articles logged in system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
