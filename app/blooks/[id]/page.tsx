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
    alternates: {
      canonical: `${siteUrl}/blooks/${blook.id}`,
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

      <main className="mx-auto flex-1 w-full max-w-5xl bg-gradient-to-b from-sky-400 to-sky-500 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-sky-200/50 bg-white p-6 shadow-xl">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(circle at top, ${pack.themeColor}, transparent 60%)`,
              }}
            />
            <div className="relative aspect-square">
              <Image
                src={blook.imageUrl}
                alt={blook.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/85 drop-shadow-sm">
              {pack.name} Pack
            </p>
            <h1 className="font-sans text-4xl font-black tracking-wide text-white drop-shadow-md sm:text-5xl">
              {blook.name}
            </h1>
            <p className="text-base leading-8 text-white/90">{blook.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border-4 border-sky-200/50 bg-white p-4 shadow-lg">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Rarity
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">{blook.rarity}</p>
              </div>
              <div className="rounded-3xl border-4 border-sky-200/50 bg-white p-4 shadow-lg">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Drop rate
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {formatPercent(blook.dropRate)}
                </p>
              </div>
              <div className="rounded-3xl border-4 border-sky-200/50 bg-white p-4 shadow-lg">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Sell value
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {formatTokenLabel(blook.sellValue)}
                </p>
              </div>
              <div className="rounded-3xl border-4 border-sky-200/50 bg-white p-4 shadow-lg">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Estimated tokens
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {formatTokenLabel(calculateEstimatedTokensForBlook(blook, pack))}
                </p>
              </div>
            </div>

            <Link
              href={`/?packId=${pack.id}&blookId=${blook.id}&tokens=500`}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 px-5 text-sm font-black text-white shadow-[0_4px_0_0_rgba(21,128,61,1)] transition-all hover:bg-green-600 active:translate-y-1 active:shadow-none"
            >
              Try My Luck
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
