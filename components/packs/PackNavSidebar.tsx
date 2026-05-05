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
        <Card className="rounded-[1.8rem] border-4 border-sky-200/50 bg-white text-slate-800 shadow-xl">
          <CardHeader className="border-b border-sky-100 px-5 py-5">
            <CardTitle className="font-sans text-lg font-black text-slate-900">Pack Index</CardTitle>
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
                            ? "border-sky-300 bg-sky-100 text-sky-700"
                            : "border-sky-100 bg-white text-slate-600 hover:border-sky-200 hover:text-slate-900",
                        )}
                      >
                        <span>{pack.name}</span>
                        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
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
                  <div className="grid gap-2 text-sm text-slate-500">
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
        <Card className="rounded-[2rem] border-4 border-sky-200/50 bg-white text-slate-800 shadow-xl">
          <CardHeader className="border-b border-sky-100 px-5 py-5">
            <CardTitle className="font-sans text-xl font-black text-slate-900">Pack Navigation Index</CardTitle>
            <p className="text-sm leading-7 text-slate-500">
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
                      ? "border-sky-300 bg-sky-100 text-sky-700 shadow-sm"
                      : "border-sky-100 bg-white text-slate-600 hover:border-sky-200 hover:text-slate-900",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                      <LinkIcon className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{pack.name}</p>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                        {pack.isLocked ? "Locked archive" : "Live simulator"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                    #{pack.id}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Live packs
                </p>
                <p className="mt-2 text-xl font-black text-slate-900">{liveCount}</p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Archived packs
                </p>
                <p className="mt-2 text-xl font-black text-slate-900">{lockedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
