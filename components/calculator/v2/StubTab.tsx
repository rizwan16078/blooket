"use client";

import { Lock } from "lucide-react";
import { CyberGhost, GlassPanel, MonoLabel } from "./parts";

type StubTabProps = {
  title: string;
  description: string;
  features: string[];
  onSwitchToOdds: () => void;
};

export default function StubTab({
  title,
  description,
  features,
  onSwitchToOdds,
}: StubTabProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10">
        <Lock className="h-6 w-6 text-cyan-300" />
      </div>
      <div className="max-w-xl space-y-3">
        <MonoLabel className="!text-cyan-300">Coming online soon</MonoLabel>
        <h3 className="cyber-display text-3xl text-white sm:text-4xl">
          {title}
        </h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      <ul className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="cyber-mono cyber-glass-sub px-3 py-2 text-left text-xs text-slate-300"
          >
            <span className="text-cyan-300">▸</span> {feature}
          </li>
        ))}
      </ul>

      <CyberGhost onClick={onSwitchToOdds}>← Back to Odds</CyberGhost>
    </div>
  );
}
