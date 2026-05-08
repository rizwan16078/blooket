import Link from "next/link";

import PackTable from "@/components/packs/PackTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTokenLabel } from "@/lib/math";
import type { Blook, PackRecord } from "@/types";

type PackTableSectionProps = {
  pack: PackRecord;
  blooks: Blook[];
};

export default function PackTableSection({
  pack,
  blooks,
}: PackTableSectionProps) {
  return (
    <section
      id={pack.id}
      aria-labelledby={`${pack.id}-heading`}
      className="packs-target scroll-mt-[120px]"
    >
      <Card
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] text-white shadow-xl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-80"
          style={{
            background: `radial-gradient(circle at top, ${pack.themeColor}30, transparent 72%)`,
          }}
        />

        <CardHeader className="relative gap-4 border-b border-white/[0.06] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400">
                  {pack.isLocked ? "Seasonal archive" : "Live in engine"}
                </span>
                <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
                  {blooks.length} indexed blooks
                </span>
              </div>

              <CardTitle
                id={`${pack.id}-heading`}
                className="mt-4 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl"
              >
                {pack.name} Pack
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl text-base leading-8 text-white/40">
                {pack.description}
              </CardDescription>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px] xl:grid-cols-1">
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
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Simulator path
                </p>
                <Button
                  asChild
                  size="sm"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/15 hover:brightness-110"
                >
                  <Link href={`/?pack=${pack.id}&autorun=false`}>
                    Open in Hero Engine
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative px-0 pb-0 pt-0">
          <PackTable pack={pack} blooks={blooks} />
        </CardContent>
      </Card>
    </section>
  );
}
