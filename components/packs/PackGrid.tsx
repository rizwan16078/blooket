"use client";

import Image from "next/image";
import Link from "next/link";
import { InfoIcon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PACKS } from "@/lib/constants";
import { formatTokenLabel } from "@/lib/math";

export default function PackGrid() {
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {PACKS.map((pack) => (
        <article
          key={pack.id}
          className={`group relative overflow-hidden rounded-xl border p-5 text-left transition ${
            pack.isLocked
              ? "border-white/[0.04] bg-white/[0.01] grayscale"
              : "border-white/[0.06] bg-white/[0.02] hover:-translate-y-1"
          }`}
          style={{
            boxShadow: pack.isLocked
              ? "none"
              : `0 18px 50px -36px ${pack.themeColor}`,
          }}
        >
          <div
            className={`absolute inset-0 ${
              pack.isLocked ? "opacity-35 blur-md" : "opacity-70"
            }`}
            style={{
              background: `radial-gradient(circle at top, ${pack.themeColor}22, transparent 58%)`,
            }}
          />

          <div className={`relative ${pack.isLocked ? "blur-[1px]" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.26em] text-white/35">
                  {pack.isLocked ? "Seasonal lock" : "Live pack"}
                </span>
                <h2 className="font-sans text-2xl font-black tracking-wide text-white">{pack.name}</h2>
              </div>

              {pack.isLocked ? (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/80 text-white">
                  <LockIcon className="h-4 w-4" />
                </div>
              ) : (
                <div className="relative h-14 w-14 flex items-center justify-center overflow-hidden rounded-xl bg-white/[0.03]">
                  <Image
                    src={pack.imageUrl}
                    alt={pack.name}
                    width={56}
                    height={56}
                    className="object-contain p-2 w-full h-full"
                  />
                </div>
              )}
            </div>

            <p className="mt-4 text-sm leading-7 text-white/40">{pack.summary}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Cost per pull
                </p>
                <p className="mt-2 text-base font-black text-white">
                  {formatTokenLabel(pack.costPerPull)}
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Effective cost
                </p>
                <p className="mt-2 text-base font-black text-white">
                  {formatTokenLabel(pack.effectiveCost)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-white/35">
                {pack.isLocked ? "Currently unavailable" : "Try this pack"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                >
                  <Link
                    href={`/packs#${pack.id}`}
                    aria-label={`Open ${pack.name} pack data table`}
                  >
                    <InfoIcon />
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={pack.isLocked}
                  aria-label={
                    pack.isLocked ? `${pack.name} pack locked` : `Try ${pack.name} pack`
                  }
                  onClick={() => {
                    router.push(`/?pack=${pack.id}&tokens=500`);
                  }}
                  className={`rounded-xl px-3 font-bold ${
                    pack.isLocked
                      ? "bg-white/[0.04] text-white/30"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/15 hover:brightness-110"
                  }`}
                >
                  {pack.isLocked ? "Locked" : "Launch"}
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
