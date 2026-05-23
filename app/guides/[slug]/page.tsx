import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ContentMeta from "@/components/content/ContentMeta";
import { getGuidePageContent } from "@/components/guides/GuideBody";
import { getGuideBySlug, guideEntries } from "@/data/guides";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return guideEntries.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/guides/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: {
      canonical: `${siteUrl}/guides/${guide.slug}`,
      languages: {
        "en-US": `${siteUrl}/guides/${guide.slug}`,
        "x-default": `${siteUrl}/guides/${guide.slug}`,
      },
    },
    openGraph: {
      title: `${guide.title} | ${siteName}`,
      description: guide.description,
      type: "article",
      url: `${siteUrl}/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);
  const content = getGuidePageContent(slug);

  if (!guide || !content) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", item: siteUrl },
    { name: "Guides", item: `${siteUrl}/guides` },
    { name: guide.title, item: `${siteUrl}/guides/${guide.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <article className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <header className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            {guide.category}
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            {guide.title}
          </h1>
          <p className="text-lg leading-8 text-white/65">{guide.excerpt}</p>
          <ContentMeta
            publishedAt={guide.publishedAt}
            updatedAt={guide.updatedAt}
            sources={content.sources}
            note={content.note}
          />
        </header>

        <div className="mt-10 space-y-10">{content.body}</div>

        <aside className="mt-14 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
            Related next steps
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {content.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      </article>
    </>
  );
}

