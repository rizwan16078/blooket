"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LinkIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PackRecord } from "@/types";

type PackNavSidebarProps = {
  packs: PackRecord[];
  liveCount: number;
  lockedCount: number;
};

function useActiveHash(defaultId: string) {
  const [activeId, setActiveId] = useState(defaultId);

  useEffect(() => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";

    const syncHash = () => {
      const nextHash = window.location.hash.slice(1);
      setActiveId(nextHash || defaultId);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      window.removeEventListener("hashchange", syncHash);
    };
  }, [defaultId]);

  return activeId;
}

export default function PackNavSidebar({
  packs,
  liveCount,
  lockedCount,
}: PackNavSidebarProps) {
  const activeId = useActiveHash(packs[0]?.id ?? "space");
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <div className="lg:hidden">
        <Card className="rounded-xl border border-white/[0.06] bg-white/[0.02] text-white shadow-xl">
          <CardHeader className="border-b border-white/[0.06] px-5 py-5">
            <CardTitle className="font-sans text-lg font-black text-white">Pack Index</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <Accordion type="single" collapsible defaultValue="packs">
              <AccordionItem value="packs">
                <AccordionTrigger>Jump to a pack table</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {packs.map((pack) => (
                      <a
                        key={pack.id}
                        href={`#${pack.id}`}
                        aria-current={activeId === pack.id ? "location" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border px-3 py-3 text-sm transition",
                          activeId === pack.id
                            ? "border-violet-500/25 bg-violet-500/[0.06] text-violet-400"
                            : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.1] hover:text-white",
                        )}
                      >
                        <span>{pack.name}</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                          {pack.isLocked ? "Locked" : "Live"}
                        </span>
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="notes">
                <AccordionTrigger>Hub snapshot</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 text-sm text-white/40">
                    <p>{packs.length} total pack datasets are indexed on this route.</p>
                    <p>{liveCount} packs route directly into the hero engine.</p>
                    <p>{lockedCount} packs stay available as archived economics references.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden lg:block lg:sticky lg:top-28"
      >
        <Card className="rounded-2xl border border-white/[0.06] bg-white/[0.02] text-white shadow-xl">
          <CardHeader className="border-b border-white/[0.06] px-5 py-5">
            <CardTitle className="font-sans text-xl font-black text-white">Pack Navigation Index</CardTitle>
            <p className="text-sm leading-7 text-white/40">
              Deep-link into any pack dataset, audit the drop table, then jump back into
              the simulation engine.
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-5">
            <div className="grid gap-2">
              {packs.map((pack) => (
                <a
                  key={pack.id}
                  href={`#${pack.id}`}
                  aria-current={activeId === pack.id ? "location" : undefined}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl border px-3 py-3 transition",
                    activeId === pack.id
                      ? "border-violet-500/25 bg-violet-500/[0.06] text-violet-400 shadow-sm"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.1] hover:text-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                      <LinkIcon className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{pack.name}</p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                        {pack.isLocked ? "Locked archive" : "Live simulator"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                    #{pack.id}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Live packs
                </p>
                <p className="mt-2 text-xl font-black text-white">{liveCount}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Archived packs
                </p>
                <p className="mt-2 text-xl font-black text-white">{lockedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
