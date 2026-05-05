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
          className={`group relative overflow-hidden rounded-[2rem] border-4 p-5 text-left transition ${
            pack.isLocked
              ? "border-sky-100 bg-white grayscale"
              : "border-sky-200/50 bg-white hover:-translate-y-1"
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
                <span className="text-xs font-black uppercase tracking-[0.26em] text-slate-500">
                  {pack.isLocked ? "Seasonal lock" : "Live pack"}
                </span>
                <h2 className="font-sans text-2xl font-black tracking-wide text-slate-900">{pack.name}</h2>
              </div>

              {pack.isLocked ? (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_4px_0_0_rgba(185,28,28,1)]">
                  <LockIcon className="h-4 w-4" />
                </div>
              ) : (
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-sky-50">
                  <Image
                    src={pack.imageUrl}
                    alt={pack.name}
                    fill
                    className="object-contain p-2"
                    sizes="56px"
                  />
                </div>
              )}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-500">{pack.summary}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Cost per pull
                </p>
                <p className="mt-2 text-base font-black text-slate-900">
                  {formatTokenLabel(pack.costPerPull)}
                </p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Effective cost
                </p>
                <p className="mt-2 text-base font-black text-slate-900">
                  {formatTokenLabel(pack.effectiveCost)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {pack.isLocked ? "Currently unavailable" : "Try this pack"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full bg-sky-100 text-slate-600 hover:bg-sky-200 hover:text-slate-900"
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
                    router.push(`/?packId=${pack.id}&tokens=500`);
                  }}
                  className={`rounded-xl px-3 font-black ${
                    pack.isLocked
                      ? "bg-slate-200 text-slate-500"
                      : "bg-green-500 text-white shadow-[0_4px_0_0_rgba(21,128,61,1)] hover:bg-green-600"
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
