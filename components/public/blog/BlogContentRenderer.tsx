"use client";

import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/utils";

interface Block {
  type: string; // 'paragraph' | 'heading' | 'image' | 'quote'
  content?: string;
  level?: number; // for headings (2, 3)
  url?: string;
  caption?: string;
}

interface BlogContentRendererProps {
  blocks: any; // Block[] or JSON string
}

export default function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  let parsedBlocks: Block[] = [];

  try {
    parsedBlocks = typeof blocks === "string" ? JSON.parse(blocks) : blocks;
  } catch (err) {
    console.error("Failed to parse blog content blocks", err);
    return <p className="text-sm text-rose-500 font-semibold italic">Error rendering blog content.</p>;
  }

  if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) {
    return <p className="text-xs text-gray-light font-medium italic">No content blocks found.</p>;
  }

  return (
    <div className="space-y-6 font-sans text-xs md:text-sm text-gray-dark leading-relaxed font-semibold">
      {parsedBlocks.map((block, idx) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={idx} className="leading-relaxed">
                {block.content}
              </p>
            );

          case "heading":
            const Level = block.level === 3 ? "h3" : "h2";
            return (
              <Level
                key={idx}
                className={`font-sans font-black italic text-black uppercase mt-8 mb-4 tracking-tight ${
                  block.level === 3 ? "text-base md:text-lg border-l-2 border-primary pl-3" : "text-lg md:text-xl border-l-4 border-primary pl-4"
                }`}
              >
                {block.content}
              </Level>
            );

          case "image":
            return (
              <figure key={idx} className="my-6 space-y-2">
                <div className="relative w-full h-[240px] md:h-[380px] rounded-2xl overflow-hidden border border-gray-border bg-gray-bg">
                  <Image
                    src={getOptimizedImageUrl(block.url, 800)}
                    alt={block.caption || "Blog image"}
                    fill
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-[10px] text-gray-light font-bold uppercase tracking-wider">
                    — {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote
                key={idx}
                className="bg-primary-light border-l-4 border-primary rounded-r-xl p-5 my-6 italic text-primary/80 font-bold"
              >
                "{block.content}"
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
