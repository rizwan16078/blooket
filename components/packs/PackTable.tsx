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
    return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  }

  if (rarityStyle.color === "violet") {
    return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  }

  if (rarityStyle.color === "teal") {
    return "border-teal-500/30 bg-teal-500/10 text-teal-400";
  }

  if (rarityStyle.color === "sky") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-400";
  }

  if (rarityStyle.color === "emerald") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }

  return "border-white/10 bg-white/[0.04] text-white/50";
}

export default function PackTable({ pack, blooks }: PackTableProps) {
  return (
    <Table className="min-w-[720px]">
      <TableCaption className="px-4 pb-1 text-left text-white/35">
        Each row links back into the hero engine with the exact pack selection preloaded.
      </TableCaption>
      <TableHeader className="bg-white/[0.02]">
        <TableRow className="hover:bg-white/[0.02]">
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
            className="group/row focus-visible:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/40 focus-visible:outline-offset-[-4px]"
          >
            <TableCell>
              <div className="relative size-12 flex items-center justify-center overflow-hidden rounded-xl bg-white/[0.03]">
                <Image
                  src={blook.imageUrl}
                  alt={blook.name}
                  width={48}
                  height={48}
                  className="object-contain p-2.5 w-full h-full"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium text-white">{blook.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${rarityBadgeClasses(
                  blook.rarity,
                )}`}
              >
                {blook.rarity}
              </span>
            </TableCell>
            <TableCell className="font-mono text-white/50">
              {formatPercent(blook.dropRate)}
            </TableCell>
            <TableCell className="font-mono text-white/50">
              {formatTokenLabel(blook.sellValue)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 font-bold text-white shadow-lg shadow-violet-500/15 hover:brightness-110"
              >
                <Link href={`/?pack=${pack.id}&autorun=false`}>Open in Hero Engine</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
