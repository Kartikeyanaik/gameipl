"use client";

import type { Player } from "@/data/types";
import { ROLE_COLORS, ROLE_SHORT, ROLE_ICONS } from "@/data/gameLogic";
import { soundManager } from "@/utils/sound";

interface PlayerCardProps {
  player: Player;
  alreadyPicked: boolean;
  overseasBlocked: boolean;
  budgetBlocked: boolean;
  onSelect: (playerId: string) => void;
}

export default function PlayerCard({
  player,
  alreadyPicked,
  overseasBlocked,
  budgetBlocked,
  onSelect,
}: PlayerCardProps) {
  const isBlocked = alreadyPicked || overseasBlocked || budgetBlocked;

  const handlePick = () => {
    if (isBlocked) return;
    soundManager.playSelect();
    onSelect(player.id);
  };

  const blockReason = alreadyPicked
    ? "ALREADY PICKED"
    : overseasBlocked
    ? "OVERSEAS LIMIT (4/4)"
    : budgetBlocked
    ? "EXCEEDS SALARY CAP"
    : null;

  // Rating color grading (90+ Gold, 84+ Diamond Green, 78+ Sapphire Blue, standard)
  const ratingBadgeClass =
    player.rating >= 92
      ? "from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 shadow-yellow-500/50"
      : player.rating >= 85
      ? "from-emerald-400 via-teal-300 to-emerald-500 text-slate-950 shadow-emerald-500/40"
      : player.rating >= 78
      ? "from-blue-400 via-cyan-300 to-blue-500 text-slate-950 shadow-blue-500/30"
      : "from-slate-300 via-slate-200 to-slate-400 text-slate-950 shadow-slate-500/20";

  return (
    <div
      onClick={handlePick}
      className={`
        holo-card group relative rounded-2xl border p-4 flex flex-col justify-between gap-3 select-none
        transition-all duration-200
        ${
          isBlocked
            ? "opacity-40 border-white/5 bg-slate-950/60 cursor-not-allowed grayscale-[40%]"
            : "border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 hover:border-yellow-400/60 hover:shadow-[0_10px_25px_rgba(245,158,11,0.15)] cursor-pointer"
        }
      `}
    >
      {/* Blocked Stamped Ribbon */}
      {isBlocked && blockReason && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/60 z-20 backdrop-blur-[2px]">
          <span className="text-[11px] font-display font-black tracking-widest text-red-300 bg-red-950/90 border border-red-500/40 px-3.5 py-1.5 rounded-full shadow-lg">
            ⚠️ {blockReason}
          </span>
        </div>
      )}

      {/* Card Header: Rating Shield + Role Badges */}
      <div className="flex items-start justify-between gap-2">
        {/* Rating Shield */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ratingBadgeClass} flex flex-col items-center justify-center shadow-md font-display font-black leading-none border border-white/40 shrink-0`}
          >
            <span className="text-xl tracking-tight -mb-0.5">{player.rating}</span>
            <span className="text-[8px] tracking-wider uppercase opacity-80">OVR</span>
          </div>

          <div>
            <h3 className="font-display font-black text-lg text-white group-hover:text-yellow-300 transition-colors leading-tight">
              {player.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-bold text-amber-400 font-display">
                ₹{player.price} Cr
              </span>
              <span className="text-slate-600 text-[10px]">•</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {player.nationality === "OVERSEAS" ? "🌍 OVERSEAS" : "🇮🇳 INDIAN"}
              </span>
            </div>
          </div>
        </div>

        {/* Role Pill */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span
            className={`text-xs font-display font-bold px-2.5 py-1 rounded-lg border shadow-sm ${ROLE_COLORS[player.role]}`}
          >
            {ROLE_ICONS[player.role]} {ROLE_SHORT[player.role]}
          </span>
        </div>
      </div>

      {/* Stat Gauges Bar */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-display">
        {/* Batting Metric */}
        <div className="bg-slate-950/60 rounded-xl p-2 border border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">BAT RATING</span>
          <div className="flex items-center gap-1.5">
            <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${player.battingRating}%` }}
              />
            </div>
            <span className="text-xs font-black text-white">{player.battingRating}</span>
          </div>
        </div>

        {/* Bowling Metric */}
        <div className="bg-slate-950/60 rounded-xl p-2 border border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">BWL RATING</span>
          <div className="flex items-center gap-1.5">
            <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                style={{ width: `${player.bowlingRating}%` }}
              />
            </div>
            <span className="text-xs font-black text-white">{player.bowlingRating}</span>
          </div>
        </div>
      </div>

      {/* Select CTA button */}
      {!isBlocked && (
        <div className="pt-1 flex items-center justify-end">
          <span className="text-xs font-display font-black tracking-widest uppercase text-yellow-400 group-hover:text-yellow-300 flex items-center gap-1">
            <span>DRAFT PLAYER</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </span>
        </div>
      )}
    </div>
  );
}
