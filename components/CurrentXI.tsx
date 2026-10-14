"use client";

import type { DraftPick } from "@/data/types";
import { ROLE_COLORS, ROLE_SHORT, ROLE_ICONS } from "@/data/gameLogic";
import { TEAM_COLORS } from "@/data/types";

interface CurrentXIProps {
  picks: DraftPick[];
  totalRounds: number;
  overseasCount: number;
  maxOverseas: number;
  budgetUsed: number;
  budgetTotal: number;
  budgetEnabled: boolean;
  warnings: string[];
}

interface PickSlotProps {
  pick: DraftPick | null;
  index: number;
}

const SLOT_HINTS = [
  "Top Order Batter",
  "Top Order Batter",
  "Anchor / Wicketkeeper",
  "Power Hitter",
  "All-Rounder",
  "Finisher / All-Rounder",
  "Spin / Pace Bowling",
  "Specialist Bowler",
  "Specialist Bowler",
  "Specialist Bowler",
  "Death Overs Specialist",
];

function PickSlot({ pick, index }: PickSlotProps) {
  if (!pick) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-white/10 bg-slate-950/40 hover:border-yellow-500/20 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-display font-black text-xs text-slate-500 shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-display font-semibold tracking-wider text-slate-500 uppercase">
            {SLOT_HINTS[index] ?? `Position #${index + 1}`}
          </span>
          <div className="h-1.5 w-16 rounded bg-white/5 mt-1" />
        </div>
        <span className="text-[10px] text-slate-600 font-bold uppercase">EMPTY</span>
      </div>
    );
  }

  const { player, team, season } = pick;
  const teamColors = TEAM_COLORS[team];
  const roleColor = ROLE_COLORS[player.role];

  return (
    <div
      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 hover:border-white/20 transition-all shadow-md"
      style={{
        borderLeftColor: teamColors?.primary ?? "#f59e0b",
        borderLeftWidth: 3.5,
      }}
    >
      {/* Slot Index */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-xs shrink-0 shadow-inner"
        style={{
          background: `${teamColors?.primary ?? "#f59e0b"}25`,
          color: teamColors?.primary ?? "#f59e0b",
          border: `1px solid ${teamColors?.primary ?? "#f59e0b"}50`,
        }}
      >
        {index + 1}
      </div>

      {/* Player Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-black text-sm text-white truncate leading-none">
            {player.name}
          </span>
          {player.nationality === "OVERSEAS" && (
            <span className="text-[10px] text-amber-300" title="Overseas Player">
              🌍
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`text-[10px] font-display font-bold px-1.5 py-0.2 rounded border ${roleColor}`}>
            {ROLE_ICONS[player.role]} {ROLE_SHORT[player.role]}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            {team} &apos;{String(season).slice(2)}
          </span>
        </div>
      </div>

      {/* Player Rating & Price */}
      <div className="text-right shrink-0">
        <div className="font-display font-black text-base text-yellow-400 leading-none">
          {player.rating}
        </div>
        <div className="text-[10px] font-bold text-slate-500 font-display">
          ₹{player.price}Cr
        </div>
      </div>
    </div>
  );
}

export default function CurrentXI({
  picks,
  totalRounds,
  overseasCount,
  maxOverseas,
  budgetUsed,
  budgetTotal,
  budgetEnabled,
  warnings,
}: CurrentXIProps) {
  const slots = Array.from({ length: totalRounds }, (_, i) => picks[i] ?? null);
  const budgetPercent = Math.min(100, (budgetUsed / budgetTotal) * 100);

  return (
    <div className="flex flex-col gap-4 h-full select-none">
      {/* Dugout Board Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="font-display font-black text-xl text-white tracking-wider uppercase flex items-center gap-2">
            <span>🏏</span>
            <span>PLAYING XI DUGOUT</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {picks.length} of {totalRounds} Players Drafted
          </span>
        </div>

        {/* Circular Progress Badge */}
        <div className="w-10 h-10 rounded-full border-2 border-yellow-400/40 bg-yellow-500/10 flex items-center justify-center font-display font-black text-sm text-yellow-400 shadow-sm">
          {picks.length}/{totalRounds}
        </div>
      </div>

      {/* Tactical Status Cards: Overseas & Salary Cap */}
      <div className="grid grid-cols-2 gap-2.5 font-display">
        {/* Overseas Tracker */}
        <div className="bg-slate-950/80 rounded-2xl p-3 border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
            <span>🌍</span> OVERSEAS SLOTS
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-2xl font-black ${
                overseasCount >= maxOverseas ? "text-red-400" : "text-white"
              }`}
            >
              {overseasCount}
            </span>
            <span className="text-slate-500 text-xs font-bold">/ {maxOverseas} MAX</span>
          </div>

          {/* Mini Visual Globe Slots */}
          <div className="flex gap-1 mt-1.5">
            {Array.from({ length: maxOverseas }).map((_, idx) => (
              <span
                key={idx}
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] border ${
                  idx < overseasCount
                    ? "bg-amber-500 border-amber-300 text-black"
                    : "bg-white/5 border-white/10 text-slate-600"
                }`}
              >
                {idx < overseasCount ? "🌍" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Salary Cap Tracker */}
        {budgetEnabled ? (
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
              <span>💰</span> REMAINING PURSE
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`text-xl font-black ${
                  budgetTotal - budgetUsed < 12 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                ₹{budgetTotal - budgetUsed}
              </span>
              <span className="text-slate-500 text-xs font-bold">/ ₹{budgetTotal} Cr</span>
            </div>

            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetPercent > 85
                    ? "bg-red-500"
                    : budgetPercent > 65
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-white/10 flex flex-col justify-center text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              SALARY CAP
            </span>
            <span className="text-xs font-black text-slate-400 uppercase mt-1">
              UNLIMITED PURSE
            </span>
          </div>
        )}
      </div>

      {/* Coach Tactical Alerts */}
      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="text-xs font-display font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* The 11 Playing XI Slots */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[50vh] lg:max-h-[58vh]">
        {slots.map((pick, i) => (
          <PickSlot key={i} pick={pick} index={i} />
        ))}
      </div>
    </div>
  );
}
