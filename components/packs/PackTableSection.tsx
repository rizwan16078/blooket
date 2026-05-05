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
        className="relative overflow-hidden rounded-[2rem] border-4 border-sky-200/50 bg-white text-slate-800 shadow-xl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-80"
          style={{
            background: `radial-gradient(circle at top, ${pack.themeColor}30, transparent 72%)`,
          }}
        />

        <CardHeader className="relative gap-4 border-b border-sky-100 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-amber-700">
                  {pack.isLocked ? "Seasonal archive" : "Live in engine"}
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-sky-700">
                  {blooks.length} indexed blooks
                </span>
              </div>

              <CardTitle
                id={`${pack.id}-heading`}
                className="mt-4 font-sans text-3xl font-black tracking-wide text-slate-900 sm:text-4xl"
              >
                {pack.name} Pack
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
                {pack.description}
              </CardDescription>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px] xl:grid-cols-1">
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
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Simulator path
                </p>
                <Button
                  asChild
                  size="sm"
                  className="mt-2 w-full rounded-xl bg-blue-500 text-white shadow-[0_4px_0_0_rgba(29,78,216,1)] hover:bg-blue-600"
                >
                  <Link href={`/?packId=${pack.id}&autoRun=false`}>
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
