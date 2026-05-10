import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { calculateEstimatedTokensForBlook, formatPercent, formatTokenLabel } from "@/lib/math";
import { serializeJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

type BlookDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return BLOOKS.map((blook) => ({
    id: blook.id,
  }));
}

export async function generateMetadata({
  params,
}: BlookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const blook = BLOOKS.find((entry) => entry.id === id);

  if (!blook) {
    return {};
  }

  return {
    title: `${blook.name} Blook`,
    description: blook.description,
    keywords: [
      `blooket ${blook.name.toLowerCase()}`,
      `${blook.name.toLowerCase()} blook`,
      `how to get ${blook.name.toLowerCase()}`,
      `${blook.name.toLowerCase()} drop rate`,
      `${blook.name.toLowerCase()} sell value`,
    ],
    alternates: {
      canonical: `${siteUrl}/blooks/${blook.id}`,
      languages: {
        "en-US": `${siteUrl}/blooks/${blook.id}`,
        "x-default": `${siteUrl}/blooks/${blook.id}`,
      },
    },
  };
}

export default async function BlookDetailPage({ params }: BlookDetailPageProps) {
  const { id } = await params;
  const blook = BLOOKS.find((entry) => entry.id === id);

  if (!blook) {
    notFound();
  }

  const pack = PACK_MAP[blook.packId];
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: blook.name,
    image: `${siteUrl}${blook.imageUrl}`,
    description: blook.description,
    url: `${siteUrl}/blooks/${blook.id}`,
    availability: "https://schema.org/InStock",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(productSchema),
        }}
      />

      <main className="mx-auto flex-1 w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl backdrop-blur-sm">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(circle at top, ${pack.themeColor}, transparent 60%)`,
              }}
            />
            <div className="relative aspect-square flex items-center justify-center">
              <Image
                src={blook.imageUrl}
                alt={blook.name}
                width={800}
                height={800}
                className="object-contain p-8 w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              {pack.name} Pack
            </p>
            <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
              {blook.name}
            </h1>
            <p className="text-base leading-8 text-white/50">{blook.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Rarity
                </p>
                <p className="mt-2 text-lg font-black text-white">{blook.rarity}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Drop rate
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatPercent(blook.dropRate)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Sell value
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatTokenLabel(blook.sellValue)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Estimated tokens
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatTokenLabel(calculateEstimatedTokensForBlook(blook, pack))}
                </p>
              </div>
            </div>

            <Link
              href={`/?pack=${pack.id}&blook=${blook.id}&tokens=500`}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
            >
              Try My Luck
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
