"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PACKS } from "@/lib/packs";
import { CalculatorBanner } from "@/components/calculators/CalculatorBanner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const TOKEN_PRESETS = [500, 1000, 2500, 5000, 10000, 25000];

export default function TokenConverterInteractive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tokens, setTokens] = useState(
    Number(searchParams.get("tokens")) || 1000,
  );
  const [dupes, setDupes] = useState(
    searchParams.get("dupes") !== "false",
  );

  const updateUrl = (updates: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const results = useMemo(() => {
    return PACKS.map((pack) => {
      const standardPacks = Math.floor(tokens / pack.costPerPull);
      const withResellPacks = Math.floor(tokens / pack.effectiveCost);
      const bonus = withResellPacks - standardPacks;

      return { pack, standardPacks, withResellPacks, bonus };
    }).sort((a, b) => b.withResellPacks - a.withResellPacks);
  }, [tokens]);

  return (
    <div className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <CalculatorBanner />

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Token Converter
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Token → Pack Converter
          <span className="mt-2 block text-xl font-medium text-violet-300">
            How many packs can your tokens buy?
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Enter your exact token count and see how many packs you can open —
          with and without duplicate resell.
        </p>
      </section>

      {/* Interactive Controls */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400 mb-2 block">
              How many tokens do you have?
            </label>
            <input
              type="number"
              value={tokens}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                setTokens(val);
                updateUrl({ tokens: val });
              }}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-2xl font-bold text-white focus:border-teal-400/40 focus:outline-none"
              min={0}
              max={100000}
            />
            <div className="flex gap-2 flex-wrap mt-3">
              {TOKEN_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTokens(preset);
                    updateUrl({ tokens: preset });
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                    tokens === preset
                      ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
                  )}
                >
                  {preset >= 1000 ? `${preset / 1000}K` : preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 md:pt-8">
            <Switch
              checked={dupes}
              onCheckedChange={(checked) => {
                setDupes(checked);
                updateUrl({ dupes: checked });
              }}
            />
            <label className="text-sm text-white/70">
              Include duplicate resell
            </label>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                <th className="py-3 px-4 font-bold text-white/70">Cost / Pull</th>
                <th className="py-3 px-4 font-bold text-white/70 text-right">
                  Standard
                </th>
                {dupes && (
                  <>
                    <th className="py-3 px-4 font-bold text-white/70 text-right">
                      With Resell
                    </th>
                    <th className="py-3 px-4 font-bold text-white/70 text-right">
                      Bonus
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={result.pack.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    <Link
                      href={
                        result.pack.isLocked
                          ? "/packs"
                          : `/packs#${result.pack.id}`
                      }
                      className="hover:text-violet-300"
                    >
                      {result.pack.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-white/60">
                    {result.pack.costPerPull} tkn
                  </td>
                  <td className="py-3 px-4 text-right text-white font-bold tabular-nums">
                    {result.standardPacks.toLocaleString()}
                  </td>
                  {dupes && (
                    <>
                      <td className="py-3 px-4 text-right text-emerald-300 font-bold tabular-nums">
                        {result.withResellPacks.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400/70 text-sm tabular-nums">
                        +{result.bonus.toLocaleString()}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-white">
          How duplicate resell stretches your tokens
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
          <p>
            When you open a pack and get a duplicate blook, you can sell it back
            for tokens. The{" "}
            <strong className="text-white">effective cost</strong> is the pack
            price minus the average sell-back value. This means your tokens go
            further than the raw price suggests.
          </p>
          <p>
            For example, the Space Pack costs 20 tokens per pull, but the
            average sell-back is about 3.2 tokens, making the effective cost
            roughly 16.8 tokens. With 500 tokens, that jumps from 25 standard
            opens to 29 with resell — almost 4 extra pulls.
          </p>
          <p>
            The resell advantage grows with your token budget because more opens
            means more duplicates means more sell-back. Use the{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              main calculator
            </Link>{" "}
            with &quot;Include Resell&quot; enabled for exact numbers.
          </p>
        </div>
      </section>

      <aside className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/calculators"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          All Calculators
        </Link>
        <Link
          href="/calculators/pack-odds"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Pack Odds
        </Link>
        <Link
          href="/calculators/roi"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          ROI Calculator
        </Link>
        <Link
          href="/guides/blooket-tokens"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Token Guide
        </Link>
      </aside>
    </div>
  );
}
