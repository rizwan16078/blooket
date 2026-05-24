"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Calculator, Clock, Eye, Bookmark, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { BlogPost, ViewMode } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  index: number;
  viewMode: ViewMode;
}

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("blog-bookmarks") ?? "[]");
  } catch {
    return [];
  }
}

function setBookmarks(slugs: string[]) {
  localStorage.setItem("blog-bookmarks", JSON.stringify(slugs));
}

export default function BlogCard({ post, index, viewMode }: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(() => getBookmarks().includes(post.slug));
  const [showShare, setShowShare] = useState(false);

  const toggleBookmark = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const current = getBookmarks();
      const next = current.includes(post.slug)
        ? current.filter((s) => s !== post.slug)
        : [...current, post.slug];
      setBookmarks(next);
      setIsBookmarked(next.includes(post.slug));
    },
    [post.slug]
  );

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({ url: `/blog/${post.slug}`, title: post.title });
      } else {
        setShowShare(!showShare);
      }
    },
    [post.slug, post.title, showShare]
  );

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
    setShowShare(false);
  }, [post.slug]);

  const isPriority = index < 3;

  if (viewMode === "list") {
    return (
      <article className="flex flex-col sm:flex-row bg-[#0f1629] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-emerald-400/5 transition-all duration-300 group relative">
        <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-900">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={isPriority}
            sizes="(max-width: 768px) 100vw, 256px"
            unoptimized
          />
        </div>
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#1a2333]/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            {post.hasCalculator && (
              <span className="bg-emerald-100/90 text-emerald-950 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200/50">
                <Calculator className="w-3 h-3" /> Calculator
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
            <Link href={`/blog/${post.slug}`}><span className="absolute inset-0" />{post.title}</Link>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          <button onClick={toggleBookmark} aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"} className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors">
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-emerald-400 text-emerald-400" : ""}`} />
          </button>
          <button onClick={handleShare} aria-label="Share post" className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        {showShare && (
          <div className="absolute top-12 right-3 z-20 bg-[#1a2333] border border-slate-700 rounded-lg p-2 shadow-xl">
            <button onClick={copyLink} className="text-xs text-slate-300 hover:text-emerald-400 px-3 py-1.5 transition-colors">Copy link</button>
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="flex flex-col bg-[#0f1629] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-emerald-400/5 hover:scale-[1.02] transition-all duration-300 group relative">
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={isPriority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="bg-[#1a2333]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            {post.category}
          </span>
          {post.hasCalculator && (
            <span className="bg-emerald-100/90 backdrop-blur-sm text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-emerald-200/50">
              <Calculator className="w-3.5 h-3.5" />
              Free Calculator Inside
            </span>
          )}
        </div>
        {post.featured && (
          <span className="absolute top-4 left-4 bg-amber-400/90 backdrop-blur-sm text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 text-slate-500 text-xs mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views.toLocaleString()}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
          <Link href={`/blog/${post.slug}`}><span className="absolute inset-0" />{post.title}</Link>
        </h3>

        <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            {post.hasCalculator ? "Read & Calculate" : "Read Full Guide"} <span aria-hidden="true">&rarr;</span>
          </span>
          <div className="ml-auto flex gap-1">
            <button onClick={toggleBookmark} aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors">
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-emerald-400 text-emerald-400" : ""}`} />
            </button>
            <button onClick={handleShare} aria-label="Share post" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showShare && (
        <div className="absolute bottom-20 right-4 z-20 bg-[#1a2333] border border-slate-700 rounded-lg p-2 shadow-xl">
          <button onClick={copyLink} className="text-xs text-slate-300 hover:text-emerald-400 px-3 py-1.5 transition-colors">Copy link</button>
        </div>
      )}
    </article>
  );
}
