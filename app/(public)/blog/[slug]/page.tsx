import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getOptimizedImageUrl, formatDate } from "@/lib/utils";
import { Compass, Calendar, Sparkles, HelpCircle } from "lucide-react";
import BlogContentRenderer from "@/components/public/blog/BlogContentRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug, deletedAt: null },
  });

  if (!blog) return { title: "Article Not Found" };

  return {
    title: `${blog.title} — Matka Trails Blog`,
    description: blog.metaDescription || `Read ${blog.title} on the Matka Trails Travel Blog. Discover tips, guides, and stories from our captains.`,
  };
}

async function getBlogData(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug, deletedAt: null },
    include: {
      author: {
        select: { name: true, avatar: true },
      },
      faqs: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return blog;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  // Fetch 3 related posts for the bottom grid
  const relatedPosts = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      NOT: { id: blog.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* ── Page Header Hero Cover ── */}
      <div className="relative w-full h-[320px] md:h-[400px] bg-black overflow-hidden flex items-end pb-8 px-6 md:px-16 lg:px-24">
        {/* Background Image */}
        {blog.coverImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={getOptimizedImageUrl(blog.coverImage, 1920)}
              alt={blog.title}
              fill
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          </div>
        )}

        <div className="relative z-10 space-y-3 text-white w-full max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="font-sans font-black italic text-3xl md:text-5xl uppercase leading-none tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-semibold text-white/70">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            {blog.author && (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span>Written by {blog.author.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content grid (Centered Column) ── */}
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Core block content renderer */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-10 shadow-card">
          <BlogContentRenderer blocks={blog.contentBlocks} />
        </div>

        {/* FAQs Section (if any are attached to the blog post) */}
        {blog.faqs && blog.faqs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary shrink-0" />
              <span>Frequently Asked Questions</span>
            </h3>
            <div className="space-y-3 bg-white border border-gray-border rounded-2xl p-6 shadow-card">
              {blog.faqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-border last:border-0 pb-4 last:pb-0 space-y-1.5">
                  <h4 className="font-sans font-bold text-sm text-black">
                    Q: {faq.question}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-mid font-semibold leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts Grid */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-gray-border">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-primary shrink-0" />
              <h3 className="font-sans font-extrabold text-lg text-black uppercase tracking-tight">
                Related Stories
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white border border-gray-border hover:border-primary/20 hover:shadow-card hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden h-[280px]"
                >
                  <div className="relative h-[120px] bg-gray-bg shrink-0">
                    {post.coverImage && (
                      <Image
                        src={getOptimizedImageUrl(post.coverImage, 400)}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
                      {post.tags[0] || "Story"}
                    </span>
                    <h4 className="font-sans font-extrabold text-xs text-black group-hover:text-primary transition-colors leading-snug line-clamp-3 mt-1">
                      {post.title}
                    </h4>
                    <span className="text-[9px] font-bold text-gray-light uppercase tracking-wider block mt-2">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
