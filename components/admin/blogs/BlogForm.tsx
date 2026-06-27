"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminApi } from "@/lib/api";
import { cn, getOptimizedImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Sparkles,
  Heading,
  AlignLeft,
  Image as ImageIcon,
  Quote,
  Check,
} from "lucide-react";
import Image from "next/image";

// Simple client-side Zod validation for base article details
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().max(70, "SEO title must be under 70 characters").optional().nullable(),
  metaDescription: z.string().max(160, "SEO description must be under 160 characters").optional().nullable(),
});

type BlogFormInput = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content blocks sequence state
  const [contentBlocks, setContentBlocks] = useState<any[]>(
    initialData?.contentBlocks || [
      { id: "init-1", type: "paragraph", content: "" }
    ]
  );

  // Tags state
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      status: initialData?.status || "DRAFT",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const titleValue = watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && titleValue) {
      const generated = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generated);
    }
  }, [titleValue, setValue, initialData]);

  // Uploader helper for cover image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const sigData = await adminApi.getUploadSignature("matka-trails/blogs");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.api_key);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.secure_url) {
        setCoverImage(json.secure_url);
        toast.success("Cover image uploaded!");
      } else {
        toast.error("Failed to upload cover.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  // Uploader helper for inline block images
  const handleBlockImageUpload = async (blockIndex: number, file: File) => {
    try {
      const sigData = await adminApi.getUploadSignature("matka-trails/blogs");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.api_key);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.secure_url) {
        updateBlock(blockIndex, "url", json.secure_url);
        toast.success("Block image uploaded!");
      } else {
        toast.error("Failed to upload block image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Block image upload connection failed.");
    }
  };

  // Block management functions
  const addBlock = (type: "paragraph" | "heading" | "image" | "quote") => {
    const newBlock: any = {
      id: Math.random().toString(36).substr(2, 9),
      type,
    };
    if (type === "paragraph") newBlock.content = "";
    if (type === "heading") {
      newBlock.content = "";
      newBlock.level = 2;
    }
    if (type === "image") {
      newBlock.url = "";
      newBlock.caption = "";
      newBlock.alt = "";
    }
    if (type === "quote") {
      newBlock.content = "";
      newBlock.author = "";
    }
    setContentBlocks((prev) => [...prev, newBlock]);
  };

  const removeBlock = (index: number) => {
    if (contentBlocks.length === 1) {
      toast.error("An article must contain at least one content block.");
      return;
    }
    setContentBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contentBlocks.length) return;

    setContentBlocks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const updateBlock = (index: number, key: string, val: any) => {
    setContentBlocks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: val };
      return copy;
    });
  };

  // Submit trigger
  const onSubmit = async (data: BlogFormInput) => {
    // Basic validations
    if (contentBlocks.some((b) => b.type !== "image" && !b.content?.trim())) {
      toast.error("Please fill in the content for all headings, paragraphs, and quotes.");
      return;
    }
    if (contentBlocks.some((b) => b.type === "image" && !b.url)) {
      toast.error("Please upload or provide URLs for all image blocks.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format tags array
      const tags = tagsInput
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      // Clean block fields according to backend strict zod validation rules
      const cleanedBlocks = contentBlocks.map((b) => {
        if (b.type === "paragraph") {
          return { type: "paragraph", content: b.content };
        } else if (b.type === "heading") {
          return { type: "heading", content: b.content, level: Number(b.level || 2) };
        } else if (b.type === "image") {
          return {
            type: "image",
            url: b.url,
            caption: b.caption || null,
            alt: b.alt || null,
          };
        } else if (b.type === "quote") {
          return {
            type: "quote",
            content: b.content,
            author: b.author || null,
          };
        }
        return b;
      });

      const payload = {
        title: data.title,
        status: data.status,
        coverImage: coverImage || null,
        contentBlocks: cleanedBlocks,
        tags,
        authorId: (session?.user as any)?.id || initialData?.authorId || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      };

      if (initialData) {
        await adminApi.updateBlog(initialData.id, payload);
        toast.success("Blog article updated!");
      } else {
        await adminApi.createBlog(payload);
        toast.success("Blog article created successfully!");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            {initialData ? "Edit Travel Article" : "Write Travel Article"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Status selector */}
          <select
            {...register("status")}
            className="px-4 py-3 rounded-xl bg-white border border-gray-border text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-6 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Save Article"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Dynamic Blocks Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Article Details */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wider pb-2 border-b border-gray-border">
              Article Meta & Details
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                Article Title *
              </label>
              <input
                type="text"
                placeholder="e.g. 10 Places to Visit in Delhi on Father's Day 2026"
                {...register("title")}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-gray-bg border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20",
                  errors.title ? "border-primary" : "border-gray-border"
                )}
              />
              {errors.title && (
                <span className="text-xs text-primary font-semibold mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                placeholder="e.g. guide-places-visit-delhi"
                {...register("slug")}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-gray-bg border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20",
                  errors.slug ? "border-primary" : "border-gray-border"
                )}
              />
              {errors.slug && (
                <span className="text-xs text-primary font-semibold mt-1 block">
                  {errors.slug.message}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Flexible Content Blocks Editor */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-border">
              <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wider">
                Article Content Layout Builder
              </h3>
              <span className="text-[10px] bg-primary-light text-primary font-extrabold px-2.5 py-1 rounded-md">
                {contentBlocks.length} content blocks
              </span>
            </div>

            {/* Content Blocks List */}
            <div className="space-y-4">
              {contentBlocks.map((block, idx) => (
                <div
                  key={block.id || idx}
                  className="bg-gray-bg/25 border border-gray-border rounded-xl p-4 space-y-4 hover:border-gray-border/60 transition-all relative group"
                >
                  {/* Block Actions Header */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-gray-light">
                      {block.type === "paragraph" && <AlignLeft className="w-3.5 h-3.5 text-primary" />}
                      {block.type === "heading" && <Heading className="w-3.5 h-3.5 text-primary" />}
                      {block.type === "image" && <ImageIcon className="w-3.5 h-3.5 text-primary" />}
                      {block.type === "quote" && <Quote className="w-3.5 h-3.5 text-primary" />}
                      <span>
                        Block #{idx + 1}: {block.type}
                      </span>
                    </span>

                    {/* Block Action Buttons */}
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 border border-gray-border hover:border-black rounded text-gray-dark hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Block Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, "down")}
                        disabled={idx === contentBlocks.length - 1}
                        className="p-1 border border-gray-border hover:border-black rounded text-gray-dark hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Block Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(idx)}
                        className="p-1 border border-gray-border hover:border-red-500 hover:text-red-500 rounded text-gray-dark transition-all cursor-pointer"
                        title="Remove Block"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Inputs Based on Block Type */}
                  {block.type === "paragraph" && (
                    <textarea
                      placeholder="Write your article paragraph here. Keep paragraphs clean and readable..."
                      rows={4}
                      value={block.content}
                      onChange={(e) => updateBlock(idx, "content", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}

                  {block.type === "heading" && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Heading text..."
                          value={block.content}
                          onChange={(e) => updateBlock(idx, "content", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <select
                          value={block.level}
                          onChange={(e) => updateBlock(idx, "level", Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value={2}>Heading H2</option>
                          <option value={3}>Sub-heading H3</option>
                          <option value={4}>Mini-heading H4</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {block.type === "quote" && (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Write the highlight quote here..."
                        rows={2}
                        value={block.content}
                        onChange={(e) => updateBlock(idx, "content", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 italic"
                      />
                      <input
                        type="text"
                        placeholder="Author (e.g. Mahatma Gandhi or leave blank)"
                        value={block.author || ""}
                        onChange={(e) => updateBlock(idx, "author", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="space-y-4">
                      {/* Image Preview & Upload options */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {block.url ? (
                          <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-gray-border shrink-0 bg-gray-bg">
                            <Image src={block.url} alt="Block image preview" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => updateBlock(idx, "url", "")}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-black p-1 rounded-full text-white transition-all cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-20 rounded-xl bg-gray-bg border-2 border-dashed border-gray-border flex items-center justify-center shrink-0">
                            <ImageIcon className="w-6 h-6 text-gray-light" />
                          </div>
                        )}

                        <div className="flex-1 w-full space-y-2">
                          <label className="flex items-center justify-center gap-2 border border-gray-border hover:border-black rounded-xl p-3.5 cursor-pointer hover:bg-gray-bg/15 transition-all text-center">
                            <Upload className="w-4 h-4 text-gray-dark" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-dark">
                              Upload Image File
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleBlockImageUpload(idx, file);
                              }}
                              className="hidden"
                            />
                          </label>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-[10px] font-bold text-gray-light uppercase tracking-wider">
                              OR URL
                            </span>
                            <input
                              type="url"
                              placeholder="Paste image URL direct link..."
                              value={block.url}
                              onChange={(e) => updateBlock(idx, "url", e.target.value)}
                              className="w-full pl-20 pr-4 py-3 rounded-xl bg-white border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Caption & Alt text */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Image caption (visible on hover/below)"
                          value={block.caption || ""}
                          onChange={(e) => updateBlock(idx, "caption", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <input
                          type="text"
                          placeholder="Alt description for search engines"
                          value={block.alt || ""}
                          onChange={(e) => updateBlock(idx, "alt", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Block Type Selection Panel */}
            <div className="border-t border-gray-border pt-6 space-y-3">
              <h4 className="text-xs font-bold text-gray-dark uppercase tracking-wider text-center">
                Insert Content Block
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => addBlock("paragraph")}
                  className="flex flex-col items-center gap-1.5 p-4 border border-gray-border hover:border-black rounded-xl hover:bg-gray-bg/15 transition-all text-center cursor-pointer font-bold text-[10px] uppercase tracking-wider text-gray-dark"
                >
                  <AlignLeft className="w-5 h-5 text-primary" />
                  <span>Paragraph</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading")}
                  className="flex flex-col items-center gap-1.5 p-4 border border-gray-border hover:border-black rounded-xl hover:bg-gray-bg/15 transition-all text-center cursor-pointer font-bold text-[10px] uppercase tracking-wider text-gray-dark"
                >
                  <Heading className="w-5 h-5 text-primary" />
                  <span>Heading</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("image")}
                  className="flex flex-col items-center gap-1.5 p-4 border border-gray-border hover:border-black rounded-xl hover:bg-gray-bg/15 transition-all text-center cursor-pointer font-bold text-[10px] uppercase tracking-wider text-gray-dark"
                >
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <span>Image Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("quote")}
                  className="flex flex-col items-center gap-1.5 p-4 border border-gray-border hover:border-black rounded-xl hover:bg-gray-bg/15 transition-all text-center cursor-pointer font-bold text-[10px] uppercase tracking-wider text-gray-dark"
                >
                  <Quote className="w-5 h-5 text-primary" />
                  <span>Highlight Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Meta Properties */}
        <div className="space-y-6">
          {/* Article Cover Image */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wider">
              Main Cover Image
            </h3>

            {coverImage ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-border bg-gray-bg">
                <Image src={coverImage} alt="Main cover image" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black p-1.5 rounded-full text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-gray-bg border-2 border-dashed border-gray-border flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-light" />
              </div>
            )}

            <label className="flex items-center justify-center gap-2 border border-gray-border hover:border-black rounded-xl p-4 cursor-pointer hover:bg-gray-bg/15 transition-all text-center">
              <Upload className="w-5 h-5 text-gray-dark" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-dark">
                {uploadingCover ? "Uploading..." : "Upload Cover Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={uploadingCover}
                className="hidden"
              />
            </label>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wider">
              Categorization Tags
            </h3>
            <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider">
              Comma-Separated Tags
            </label>
            <input
              type="text"
              placeholder="e.g. trekking, Kedarnath, solo-travel"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* SEO Metadata Settings */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wider flex items-center gap-2 border-b border-gray-border pb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>SEO Parameters</span>
            </h3>

            {/* SEO Title */}
            <div>
              <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                Meta Title (Max 70 chars)
              </label>
              <input
                type="text"
                maxLength={70}
                placeholder="Target SEO phrase..."
                {...register("metaTitle")}
                className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                Meta Description (Max 160 chars)
              </label>
              <textarea
                maxLength={160}
                placeholder="Google listing description copy..."
                rows={4}
                {...register("metaDescription")}
                className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
