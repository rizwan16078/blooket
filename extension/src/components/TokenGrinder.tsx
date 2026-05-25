import { useState, useMemo } from "preact/hooks";
import { DAILY_CAP } from "@/lib/math";

const GAME_MODES = [
  { name: "Crypto Hack", tokensPerHour: 350, icon: "\u{1F48E}", type: "Multiplayer", desc: "Hack opponents, steal crypto" },
  { name: "Gold Quest", tokensPerHour: 200, icon: "\u{1F3C6}", type: "Multiplayer", desc: "Find gold, steal from others" },
  { name: "Factory", tokensPerHour: 150, icon: "\u{1F3ED}", type: "Singleplayer", desc: "Build and produce items" },
  { name: "Cafe", tokensPerHour: 130, icon: "\u2615", type: "Singleplayer", desc: "Serve food, earn tips" },
  { name: "Battle Royale", tokensPerHour: 100, icon: "\u2694\uFE0F", type: "Multiplayer", desc: "Last student standing" },
  { name: "Tower Defense", tokensPerHour: 80, icon: "\u{1F5FC}", type: "Singleplayer", desc: "Defend with towers" },
  { name: "Racing", tokensPerHour: 70, icon: "\u{1F3CE}\uFE0F", type: "Multiplayer", desc: "Answer questions to race" },
  { name: "Tower of Doom", tokensPerHour: 60, icon: "\u{1F3D8}\uFE0F", type: "Singleplayer", desc: "Climb the tower" },
];

function formatTime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = Math.floor(hours / 24);
  const remaining = hours % 24;
  return remaining > 0.5 ? `${days}d ${Math.round(remaining)}h` : `${days}d`;
}

export function TokenGrinder() {
  const [tokensNeeded, setTokensNeeded] = useState(1000);

  const recommendations = useMemo(() => {
    return GAME_MODES
      .map((mode) => ({
        ...mode,
        hoursNeeded: tokensNeeded / mode.tokensPerHour,
        daysNeededAtCap: Math.ceil(tokensNeeded / DAILY_CAP),
      }))
      .sort((a, b) => b.tokensPerHour - a.tokensPerHour);
  }, [tokensNeeded]);

  const fastest = recommendations[0];
  const maxRate = GAME_MODES[0].tokensPerHour;

  return (
    <div class="space-y-3">
      {/* Token input */}
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Tokens You Need
        </label>
        <input
          type="number"
          value={tokensNeeded}
          onInput={(e) => setTokensNeeded(Math.max(0, Number((e.target as HTMLInputElement).value)))}
          class="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-lg font-bold text-white placeholder:text-white/20 focus:border-violet-400/40"
          min="0"
          max="100000"
          placeholder="0"
        />
        <div class="flex gap-1 mt-1.5">
          {[500, 1000, 5000, 10000].map((preset) => (
            <button
              key={preset}
              onClick={() => setTokensNeeded(preset)}
              class={`flex-1 rounded-lg border px-2 py-1 text-[10px] font-semibold transition-all ${
                tokensNeeded === preset
                  ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                  : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:text-white"
              }`}
            >
              {preset >= 1000 ? `${preset / 1000}K` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Daily cap info */}
      <div class="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-2.5">
        <div class="flex items-center gap-2">
          <span class="text-amber-400 text-xs">\u26A0</span>
          <div class="flex-1">
            <span class="text-[11px] text-white/50">Daily cap: </span>
            <span class="text-[11px] font-bold text-amber-300">{DAILY_CAP} tkn</span>
            {tokensNeeded > DAILY_CAP && (
              <span class="text-[10px] text-white/30 ml-1">
                &middot; {Math.ceil(tokensNeeded / DAILY_CAP)} day{Math.ceil(tokensNeeded / DAILY_CAP) !== 1 ? "s" : ""} at cap
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fastest recommendation — hero card */}
      {tokensNeeded > 0 && (
        <div class="glass-panel-rim rounded-2xl p-3.5 relative overflow-hidden">
          <div class="pointer-events-none absolute -top-4 right-0 h-12 w-20 rounded-full bg-emerald-400/15 blur-2xl" />
          <div class="relative">
            <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
              Fastest Route
            </div>
            <div class="flex items-center gap-3">
              <span class="text-2xl">{fastest.icon}</span>
              <div class="flex-1">
                <div class="text-sm font-bold text-white">{fastest.name}</div>
                <div class="text-[10px] text-white/40">{fastest.type} &middot; {fastest.tokensPerHour} tkn/hr</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-emerald-300">{formatTime(fastest.hoursNeeded)}</div>
                <div class="text-[9px] text-white/30">estimated</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All modes ranked */}
      <div>
        <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-2">
          Game Modes Ranked
        </div>
        <div class="space-y-1">
          {recommendations.map((mode, i) => (
            <div
              key={mode.name}
              class="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 hover-lift"
            >
              {/* Rank number */}
              <span class={`text-[10px] font-bold w-4 text-center ${i === 0 ? "text-emerald-400" : "text-white/20"}`}>
                {i + 1}
              </span>
              <span class="text-base">{mode.icon}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] font-semibold text-white">{mode.name}</span>
                  <span class="text-[8px] text-white/20 uppercase font-semibold">{mode.type}</span>
                </div>
                {/* Rate bar */}
                <div class="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    class={`h-full rounded-full progress-bar ${i === 0 ? "bg-emerald-400" : i < 3 ? "bg-violet-400" : "bg-white/20"}`}
                    style={{ width: `${(mode.tokensPerHour / maxRate) * 100}%` }}
                  />
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class={`text-[11px] font-bold ${i === 0 ? "text-emerald-300" : "text-white/60"}`}>
                  {tokensNeeded > 0 ? formatTime(mode.hoursNeeded) : "\u2014"}
                </div>
                <div class="text-[9px] text-white/30">{mode.tokensPerHour}/hr</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
