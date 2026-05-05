import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RARITY_DESIGN } from "@/lib/constants";
import { formatPercent, formatTokenLabel } from "@/lib/math";
import type { Blook, PackRecord } from "@/types";

type PackTableProps = {
  pack: PackRecord;
  blooks: Blook[];
};

function rarityBadgeClasses(rarity: Blook["rarity"]) {
  const rarityStyle = RARITY_DESIGN[rarity];

  if (rarityStyle.color === "amber") {
    return "border-amber-300 bg-amber-100 text-amber-700";
  }

  if (rarityStyle.color === "violet") {
    return "border-violet-300 bg-violet-100 text-violet-700";
  }

  if (rarityStyle.color === "teal") {
    return "border-teal-300 bg-teal-100 text-teal-700";
  }

  if (rarityStyle.color === "sky") {
    return "border-sky-300 bg-sky-100 text-sky-700";
  }

  if (rarityStyle.color === "emerald") {
    return "border-emerald-300 bg-emerald-100 text-emerald-700";
  }

  return "border-slate-300 bg-slate-100 text-slate-700";
}

export default function PackTable({ pack, blooks }: PackTableProps) {
  return (
    <Table className="min-w-[720px]">
      <TableCaption className="px-4 pb-1 text-left text-slate-500">
        Each row links back into the hero engine with the exact pack selection preloaded.
      </TableCaption>
      <TableHeader className="bg-sky-50">
        <TableRow className="hover:bg-sky-50">
          <TableHead className="w-[88px]">Blook</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Rarity</TableHead>
          <TableHead>Drop Rate</TableHead>
          <TableHead>Sell Value</TableHead>
          <TableHead className="text-right">Engine</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blooks.map((blook) => (
          <TableRow
            key={blook.id}
            tabIndex={0}
            aria-label={`${pack.name} pack, ${blook.name}, ${blook.rarity}, ${formatPercent(
              blook.dropRate,
            )} drop rate, ${formatTokenLabel(blook.sellValue)} sell value`}
            className="group/row focus-visible:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300 focus-visible:outline-offset-[-4px]"
          >
            <TableCell>
              <div className="relative size-12 overflow-hidden rounded-2xl bg-sky-50">
                <Image
                  src={blook.imageUrl}
                  alt={blook.name}
                  fill
                  className="object-contain p-2.5"
                  sizes="48px"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium text-slate-900">{blook.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${rarityBadgeClasses(
                  blook.rarity,
                )}`}
              >
                {blook.rarity}
              </span>
            </TableCell>
            <TableCell className="font-mono text-slate-700">
              {formatPercent(blook.dropRate)}
            </TableCell>
            <TableCell className="font-mono text-slate-700">
              {formatTokenLabel(blook.sellValue)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-blue-500 px-3 font-black text-white shadow-[0_4px_0_0_rgba(29,78,216,1)] hover:bg-blue-600"
              >
                <Link href={`/?packId=${pack.id}&autoRun=false`}>Open in Hero Engine</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
