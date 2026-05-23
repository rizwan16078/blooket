/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: `Blog & Guides`,
  description: "High-quality strategies, odds breakdowns, and guides for Blooket players.",
};

export default function BlogIndexPage() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Blooket <span className="text-emerald-400">Strategies & Guides</span>
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Stop guessing and start optimizing. From token farming strategies to deep statistical breakdowns of drop rates, we've got the math to back up your gameplay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            category={post.category}
            imageUrl={post.imageUrl}
            hasCalculator={post.hasCalculator}
          />
        ))}
      </div>
    </main>
  );
}
