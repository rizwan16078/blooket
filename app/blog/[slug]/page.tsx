import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeft, Calendar, Calculator, Clock, Eye, User } from "lucide-react";
import ContentMeta from "@/components/content/ContentMeta";
import { blogPosts } from "@/data/blog";
import { blogFaqs } from "@/data/blog-faqs";
import { getBlogPostBySlug } from "@/lib/blog";
import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
      languages: {
        "en-US": `${siteUrl}/blog/${post.slug}`,
        "x-default": `${siteUrl}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: `${siteUrl}/blog/${post.slug}`,
      images: [`${siteUrl}${post.imageUrl}`],
    },
  };
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: `${siteUrl}${post.imageUrl}`,
    author: [
      {
        "@type": "Person",
        name: "Alex M.",
        url: `${siteUrl}/team#alex`,
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", item: siteUrl },
    { name: "Blog", item: `${siteUrl}/blog` },
    { name: post.title, item: `${siteUrl}/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />
      {blogFaqs[post.slug] && blogFaqs[post.slug].length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(blogFaqs[post.slug])) }}
        />
      )}
    <article className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all guides
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-[#1a2333] border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>{post.date}</time>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Eye className="w-4 h-4" />
            {post.views.toLocaleString()} views
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <User className="w-4 h-4" />
            {post.author.name}
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-slate-300 leading-relaxed mb-8">
          {post.excerpt}
        </p>

        <ContentMeta
          author="Alex M."
          authorUrl={`${siteUrl}/team#alex`}
          publishedAt={post.publishedAt}
          updatedAt={post.updatedAt}
          sources={post.sources}
          note="Editorial posts now link back into the calculator, guide hub, and pack tables so each article supports the wider Blooket topic cluster."
        />

        <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {post.hasCalculator && (
            <div className="absolute bottom-4 right-4 bg-emerald-400/90 backdrop-blur-md text-teal-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
              <Calculator className="w-5 h-5" />
              Free Calculator Available
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-lg prose-invert prose-emerald max-w-none prose-headings:font-bold prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-img:rounded-xl">
        {post.content}
      </div>
      
      {post.hasCalculator && (
        <div className="mt-16 p-8 bg-[#0f1629] border border-slate-700 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stop Guessing, Start Calculating</h3>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Use our exact probability models to find out exactly how many tokens you need for your target Blook.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-[#0a0e1a] bg-emerald-400 hover:bg-emerald-500 transition-colors shadow-lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Open Pack Calculator
          </Link>
        </div>
      )}
    </article>

      <aside className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400 mb-4">Related next steps</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/calculators"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            All Calculators
          </Link>
          <Link
            href="/guides"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Guides
          </Link>
          <Link
            href="/blooks"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Blook Library
          </Link>
        </div>
      </aside>
    </>
  );
}
