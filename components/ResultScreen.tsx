"use client";

import { useEffect, useState } from "react";
import type { DraftPick, TeamScore } from "@/data/types";
import { TEAM_COLORS } from "@/data/types";
import { getTeamVerdict, arrangePlayersForDisplay, ROLE_COLORS, ROLE_SHORT, ROLE_ICONS } from "@/data/gameLogic";
import { soundManager } from "@/utils/sound";

interface ResultScreenProps {
  picks: DraftPick[];
  score: TeamScore;
  onPlayAgain: () => void;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-display font-bold text-slate-300 w-32 shrink-0 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden shadow-inner p-0.5">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 shadow-sm`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-base font-display font-black text-white w-10 text-right">
        {value}
      </span>
    </div>
  );
}

function FinalPlayerCard({ pick, index }: { pick: DraftPick; index: number }) {
  const { player, team, season } = pick;
  const teamColors = TEAM_COLORS[team];
  const roleColor = ROLE_COLORS[player.role];

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
      className="holo-card relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 flex flex-col justify-between gap-3 shadow-xl hover:border-yellow-400/50 transition-all select-none"
      style={{ borderTopColor: teamColors?.primary ?? "#f59e0b", borderTopWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-display font-black text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
            #{index + 1}
          </span>
          <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-lg border ${roleColor}`}>
            {ROLE_ICONS[player.role]} {ROLE_SHORT[player.role]}
          </span>
          {player.nationality === "OVERSEAS" && (
            <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🌍 INT
            </span>
          )}
        </div>

        {/* Rating Shield */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ratingBadgeClass} flex flex-col items-center justify-center font-display font-black leading-none border border-white/30 shrink-0 shadow-md`}
        >
          <span className="text-base tracking-tight leading-none">{player.rating}</span>
          <span className="text-[7px] tracking-wider uppercase opacity-80 leading-none">OVR</span>
        </div>
      </div>

      <div>
        <h4 className="font-display font-black text-lg text-white leading-tight">{player.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
            style={{ background: teamColors?.primary ?? "#fff" }}
          />
          <span className="font-display font-bold text-xs text-slate-300 tracking-wider uppercase">
            {team} • {season}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 font-display text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>BAT {player.battingRating}</span>
          <span>•</span>
          <span>BWL {player.bowlingRating}</span>
        </div>
        <span className="text-amber-400 font-bold">₹{player.price} Cr</span>
      </div>
    </div>
  );
}

export default function ResultScreen({ picks, score, onPlayAgain }: ResultScreenProps) {
  const [viewMode, setViewMode] = useState<"pitch" | "cards">("pitch");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    soundManager.playVictory();
  }, []);

  const verdict = getTeamVerdict(score.overall);
  const arranged = arrangePlayersForDisplay(picks);

  const byRole = {
    WK: arranged.filter((p) => p.player.role === "WK"),
    BAT: arranged.filter((p) => p.player.role === "BAT"),
    AR: arranged.filter((p) => p.player.role === "AR"),
    BOWL: arranged.filter((p) => p.player.role === "BOWL"),
  };

  const handleCopyLineup = () => {
    const lines = [
      `🏏 MY IPL PLAYING XI — Final Score: ${score.overall.toFixed(1)}/100`,
      `🏆 Verdict: ${verdict.label} ${verdict.emoji}`,
      `📊 Batting: ${score.batting} | Bowling: ${score.bowling} | Balance: ${score.balance}`,
      `--------------------------------------------------`,
      ...arranged.map(
        (p, i) =>
          `${i + 1}. ${p.player.name} [${p.player.role}] (${p.team} ${p.season}) — ${p.player.rating} OVR`
      ),
      `--------------------------------------------------`,
      `⚡ Built in BUILD YOUR IPL XI`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-yellow-400 selection:text-slate-950 font-sans py-12 px-4 relative overflow-x-hidden">
      {/* Stadium Floodlight Radiance */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-yellow-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">

        {/* Hero Score Showcase */}
        <div className="text-center space-y-4 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 font-display font-black text-xs tracking-widest uppercase shadow-md">
            <span>🏆</span> OFFICIAL DRAFT AUDIT COMPLETE
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight uppercase drop-shadow-2xl">
            YOUR IPL XI
          </h1>

          <div className="inline-flex flex-col items-center">
            <div className="text-8xl md:text-[140px] font-display font-black leading-none text-gold-gradient drop-shadow-[0_15px_45px_rgba(245,158,11,0.5)]">
              {score.overall.toFixed(1)}
            </div>
            <div className="font-display font-bold text-slate-400 text-sm md:text-base tracking-widest uppercase -mt-2">
              OVERALL SQUAD RATING OUT OF 100
            </div>
          </div>

          <div className={`text-2xl md:text-4xl font-display font-black ${verdict.color} flex items-center justify-center gap-3 drop-shadow-lg pt-1`}>
            <span className="text-4xl">{verdict.emoji}</span>
            <span className="tracking-wider uppercase">{verdict.label}</span>
          </div>
        </div>

        {/* Action Controls: Share & Play Again */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleCopyLineup}
            className="cursor-pointer px-6 py-3.5 rounded-xl font-display font-black text-sm tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white border border-white/15 hover:border-yellow-400/50 transition-all flex items-center gap-2 shadow-xl"
          >
            <span>{copied ? "✅ COPIED TO CLIPBOARD!" : "📋 SHARE / COPY LINEUP"}</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="cursor-pointer px-8 py-3.5 rounded-xl font-display font-black text-base tracking-widest uppercase bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-950 shadow-xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            🔄 DRAFT AGAIN
          </button>
        </div>

        {/* Algorithmic Breakdown Card */}
        <div className="bg-[#080d1c]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-display font-black text-xl text-white tracking-wider uppercase flex items-center gap-2">
              <span>📊</span> TEAM ANALYSIS BREAKDOWN
            </h2>
            <span className="text-xs font-display font-bold text-slate-400 uppercase tracking-widest">
              COMPOSITE CRICKET METRICS
            </span>
          </div>

          <div className="space-y-4">
            <ScoreBar label="🏏 Batting Depth" value={score.batting} color="bg-gradient-to-r from-blue-500 to-cyan-400" />
            <ScoreBar label="🎯 Bowling Attack" value={score.bowling} color="bg-gradient-to-r from-orange-500 to-amber-400" />
            <ScoreBar label="⚡ All-Round Impact" value={score.allRound} color="bg-gradient-to-r from-emerald-500 to-green-400" />
            <ScoreBar label="⚖️ Lineup Balance" value={score.balance} color="bg-gradient-to-r from-purple-500 to-indigo-400" />
            <ScoreBar label="🌍 Overseas Quota" value={score.overseas} color="bg-gradient-to-r from-amber-500 to-yellow-400" />
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-wide uppercase">
            THE PLAYING XI
          </h2>

          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-white/10 shadow-inner">
            <button
              onClick={() => setViewMode("pitch")}
              className={`cursor-pointer px-4 py-2 rounded-lg font-display text-xs font-black tracking-wider uppercase transition-all ${
                viewMode === "pitch"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🏟️ PITCH FORMATION
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`cursor-pointer px-4 py-2 rounded-lg font-display text-xs font-black tracking-wider uppercase transition-all ${
                viewMode === "cards"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🃏 TRADING CARDS
            </button>
          </div>
        </div>

        {/* PITCH VIEW: Visual Authentic Cricket Turf Formation */}
        {viewMode === "pitch" && (
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#064e3b] p-6 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] select-none">
            {/* Outer Oval Stadium Boundary Rope */}
            <div className="absolute inset-4 rounded-[40px] border-2 border-dashed border-white/20 pointer-events-none" />

            {/* 30-Yard Inner Circle */}
            <div className="absolute inset-x-12 top-16 bottom-16 rounded-[100px] border border-white/15 pointer-events-none" />

            {/* Center Pitch Dirt Strip */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-80 border border-amber-700/50 rounded-lg pointer-events-none bg-amber-900/15" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-72 border-y-2 border-white/30 pointer-events-none" />

            {/* Stadium Pitch Formations */}
            <div className="relative z-10 flex flex-col gap-9 text-center">

              {/* 1. Wicket Keeper Position */}
              <div>
                <span className="text-[11px] font-display font-black tracking-widest text-emerald-300 uppercase bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-400/30 shadow-md">
                  🧤 WICKET-KEEPER
                </span>
                <div className="flex flex-wrap justify-center gap-4 mt-3">
                  {byRole.WK.map((p) => (
                    <PitchToken key={p.player.id} pick={p} />
                  ))}
                </div>
              </div>

              {/* 2. Top-Order & Specialist Batsmen */}
              <div>
                <span className="text-[11px] font-display font-black tracking-widest text-emerald-300 uppercase bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-400/30 shadow-md">
                  🏏 SPECIALIST BATSMEN
                </span>
                <div className="flex flex-wrap justify-center gap-4 mt-3">
                  {byRole.BAT.map((p) => (
                    <PitchToken key={p.player.id} pick={p} />
                  ))}
                </div>
              </div>

              {/* 3. All-Rounders */}
              <div>
                <span className="text-[11px] font-display font-black tracking-widest text-emerald-300 uppercase bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-400/30 shadow-md">
                  ⚡ ALL-ROUNDERS
                </span>
                <div className="flex flex-wrap justify-center gap-4 mt-3">
                  {byRole.AR.map((p) => (
                    <PitchToken key={p.player.id} pick={p} />
                  ))}
                </div>
              </div>

              {/* 4. Bowling Specialists */}
              <div>
                <span className="text-[11px] font-display font-black tracking-widest text-emerald-300 uppercase bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-400/30 shadow-md">
                  🎯 BOWLING ATTACK
                </span>
                <div className="flex flex-wrap justify-center gap-4 mt-3">
                  {byRole.BOWL.map((p) => (
                    <PitchToken key={p.player.id} pick={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CARDS VIEW */}
        {viewMode === "cards" && (
          <div className="space-y-8">
            {(["WK", "BAT", "AR", "BOWL"] as const).map((role) => {
              const rolePicks = byRole[role];
              if (rolePicks.length === 0) return null;
              const labels = {
                WK: "🧤 WICKET-KEEPER",
                BAT: "🏏 SPECIALIST BATTERS",
                AR: "⚡ ALL-ROUNDERS",
                BOWL: "🎯 SPECIALIST BOWLERS",
              };
              return (
                <div key={role} className="space-y-3">
                  <h3 className="font-display font-black text-sm text-slate-400 tracking-widest uppercase">
                    {labels[role]} ({rolePicks.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {rolePicks.map((pick) => (
                      <FinalPlayerCard
                        key={pick.player.id}
                        pick={pick}
                        index={picks.indexOf(pick)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Draft Journey History */}
        <div className="bg-[#080d1c]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-display font-black text-xl text-white tracking-wider uppercase flex items-center gap-2">
              <span>🎡</span> DRAFT JOURNEY HISTORY
            </h2>
            <span className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest">
              11 ROUNDS RECAP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {picks.map((pick, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center font-display font-black text-xs text-yellow-400 shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-black text-white text-base truncate leading-none">
                      {pick.player.name}
                    </span>
                    {pick.player.nationality === "OVERSEAS" && (
                      <span className="text-[10px] text-amber-300">🌍</span>
                    )}
                  </div>
                  <div className="font-display text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <span className="text-amber-400 font-bold">🎡 {pick.team} {pick.season}</span>
                    <span>•</span>
                    <span>{pick.player.role}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-black text-base text-yellow-400 leading-none">
                    {pick.player.rating}
                  </div>
                  <div className="font-display text-[11px] font-bold text-slate-500">
                    ₹{pick.player.price}Cr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big CTA */}
        <div className="text-center py-6">
          <button
            onClick={onPlayAgain}
            className="cursor-pointer px-16 py-5 rounded-2xl font-display font-black text-3xl tracking-widest uppercase bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-950 shadow-[0_20px_50px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all border border-yellow-200/50"
          >
            🎡 BUILD ANOTHER XI
          </button>
        </div>

      </div>
    </div>
  );
}

// Compact pitch token used in the cricket field view
function PitchToken({ pick }: { pick: DraftPick }) {
  const { player, team, season } = pick;
  const teamColors = TEAM_COLORS[team];

  return (
    <div
      className="inline-flex flex-col items-center bg-[#070d18]/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 hover:border-yellow-400 transition-all duration-150 hover:scale-105 shadow-2xl max-w-[170px]"
      style={{ borderBottomColor: teamColors?.primary ?? "#f59e0b", borderBottomWidth: 3 }}
    >
      <div className="flex items-center gap-1.5 w-full justify-between">
        <span className="font-display text-xs font-black text-yellow-400">{player.rating}</span>
        <span className="font-display text-[10px] font-bold text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
          {team} &apos;{String(season).slice(2)}
        </span>
      </div>
      <div className="font-display font-black text-white text-sm mt-1 text-center truncate w-full leading-tight">
        {player.name}
      </div>
      <div className="font-display text-[11px] text-emerald-400 font-bold mt-0.5">
        {ROLE_ICONS[player.role]} {ROLE_SHORT[player.role]}
      </div>
    </div>
  );
}
