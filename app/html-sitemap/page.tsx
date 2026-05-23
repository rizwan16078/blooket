import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/data/blog";
import { guideEntries } from "@/data/guides";
import { siteUrl } from "@/lib/site";
import { PACKS } from "@/lib/packs";

export const metadata: Metadata = {
  title: "HTML Sitemap",
  description: "A complete directory of all pages, pack calculators, and resources on the Blooket Calculator website for easy navigation and discovery.",
  keywords: [
    "blooket calculator sitemap",
    "blooket calculator pages",
    "blooket calculator directory",
  ],
  alternates: {
    canonical: `${siteUrl}/html-sitemap`,
    languages: {
      "en-US": `${siteUrl}/html-sitemap`,
      "x-default": `${siteUrl}/html-sitemap`,
    },
  },
};

export default function HTMLSitemapPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Directory
          </div>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            HTML Sitemap
          </h1>
          <p className="text-lg leading-8 text-white/50">
            Find every page, calculator, and resource on our platform.
          </p>
          <p className="text-base leading-8 text-white/40">
            The Blooket Calculator provides exact probability tools for every Blooket pack. Use this sitemap to navigate to any pack’s odds calculator, browse the full Blook library, read our editorial policies, or contact the team. All pages are server-rendered for fast, crawlable access.
          </p>
        </div>

        <article className="mt-12 glass-panel rounded-[2rem] p-6 sm:p-8 text-white/70">
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-black text-white mb-6">Core Pages</h2>
              <ul className="space-y-3">
                <li><Link href="/" className="hover:text-violet-400 transition">Home</Link></li>
                <li><Link href="/guides" className="hover:text-violet-400 transition">Guides & Glossary</Link></li>
                <li><Link href="/blog" className="hover:text-violet-400 transition">Blog</Link></li>
                <li><Link href="/methodology" className="hover:text-violet-400 transition">Methodology</Link></li>
                <li><Link href="/updates" className="hover:text-violet-400 transition">Updates</Link></li>
                <li><Link href="/about" className="hover:text-violet-400 transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-violet-400 transition">Contact Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-violet-400 transition">How It Works</Link></li>
                <li><Link href="/blooks" className="hover:text-violet-400 transition">All Blooks Directory</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white mb-6">Legal & Guidelines</h2>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="hover:text-violet-400 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-violet-400 transition">Terms of Use</Link></li>
                <li><Link href="/editorial-guidelines" className="hover:text-violet-400 transition">Editorial Guidelines</Link></li>
                <li><Link href="/team" className="hover:text-violet-400 transition">Authors & Team</Link></li>
              </ul>
            </div>

            <div className="sm:col-span-2">
              <h2 className="text-2xl font-black text-white mb-6">Pack Calculators</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PACKS.map(pack => (
                  <li key={pack.slug}>
                    <Link href={pack.route} className="hover:text-violet-400 transition">
                      {pack.name} Pack
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2">
              <h2 className="text-2xl font-black text-white mb-6">Guides</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {guideEntries.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`} className="hover:text-violet-400 transition">
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2">
              <h2 className="text-2xl font-black text-white mb-6">Blog Posts</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {blogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="hover:text-violet-400 transition">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
