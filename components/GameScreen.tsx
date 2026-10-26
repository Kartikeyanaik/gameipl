"use client";

import { useCallback, useState } from "react";
import SpinWheel from "./SpinWheel";
import PlayerCard from "./PlayerCard";
import CurrentXI from "./CurrentXI";
import AuthButton from "./AuthButton";
import type { HistoricalTeam } from "@/data/types";
import { TEAM_COLORS, TEAM_FULL_NAMES } from "@/data/types";
import { getTeamComposition, getWarnings } from "@/data/gameLogic";
import { useGameState } from "@/hooks/useGameState";
import { soundManager } from "@/utils/sound";

interface GameScreenProps {
  gameState: ReturnType<typeof useGameState>;
  onOpenHistory?: () => void;
}

export default function GameScreen({ gameState, onOpenHistory }: GameScreenProps) {
  const {
    state,
    budgetUsed,
    budgetRemaining,
    spinWheel,
    resolveSpinResult,
    selectPlayer,
    resetGame,
  } = gameState;

  const { picks, round, config, requirements, currentTeam, phase, errorMessage } = state;

  const [showPickers, setShowPickers] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [soundOn, setSoundOn] = useState(soundManager.enabled);

  const pickedPlayerIds = new Set(picks.map((p) => p.player.id));
  const comp = getTeamComposition(picks);
  const warnings = getWarnings(picks, requirements);
  const overseasFull = comp.overseas >= requirements.maxOverseas;

  // Spin start trigger calling server-authoritative engine
  const handleSpinStart = useCallback(async (): Promise<HistoricalTeam | null> => {
    setShowPickers(false);
    setRevealed(false);
    const team = await spinWheel();
    return team;
  }, [spinWheel]);

  // Spin finish trigger
  const handleSpinComplete = useCallback(
    (team: HistoricalTeam) => {
      resolveSpinResult(team);
      setTimeout(() => {
        setRevealed(true);
        setShowPickers(true);
      }, 350);
    },
    [resolveSpinResult]
  );

  // Player selection trigger
  const handleSelectPlayer = useCallback(
    (playerId: string) => {
      if (!currentTeam) return;
      selectPlayer(currentTeam, playerId, round);
      setShowPickers(false);
      setRevealed(false);
    },
    [currentTeam, round, selectPlayer]
  );

  const toggleMute = () => {
    const next = soundManager.toggleSound();
    setSoundOn(next);
  };

  const teamColors = currentTeam ? TEAM_COLORS[currentTeam.team] : null;

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-yellow-400 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Stadium Floodlight Cones in Corners */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Broadcast Scoreboard Navigation */}
      <header className="border-b border-white/10 bg-[#070b16]/90 backdrop-blur-xl sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Round Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏏</span>
              <span className="font-display font-black text-2xl tracking-widest text-gold-gradient uppercase">
                IPL DRAFT
              </span>
            </button>

            <div className="h-5 w-px bg-white/20 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 font-display">
              <span className="text-xs font-bold text-slate-400 tracking-wider">ROUND:</span>
              <span className="text-base font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-lg border border-yellow-400/30">
                {round} / {config.totalRounds}
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Round Mini Pills */}
            <div className="hidden md:flex items-center gap-1 bg-slate-950/80 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
              <span className="text-[11px] font-display font-bold text-slate-400 mr-1">
                R{round}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: config.totalRounds }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < picks.length
                        ? "bg-yellow-400 scale-110 shadow-sm shadow-yellow-400/60"
                        : i === picks.length
                        ? "bg-amber-400 ring-2 ring-amber-400/40 animate-pulse"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Budget Indicator */}
            {config.budgetEnabled && (
              <div
                className={`font-display text-xs font-black px-3 py-1.5 rounded-full border flex items-center gap-1.5 shadow-sm ${
                  budgetRemaining < 12
                    ? "text-red-300 border-red-500/50 bg-red-950/60"
                    : "text-emerald-300 border-emerald-500/40 bg-emerald-950/50"
                }`}
              >
                <span>💰</span>
                <span>₹{budgetRemaining} Cr</span>
              </div>
            )}

            {/* Saved Drafts History Button */}
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-yellow-400/40 text-slate-300 hover:text-white text-xs font-display font-bold uppercase transition-all shadow-sm"
                title="View saved drafts"
              >
                <span>📜</span>
                <span className="hidden lg:inline">SAVED DRAFTS</span>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              title={soundOn ? "Mute audio" : "Enable audio"}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors text-xs cursor-pointer shadow-sm"
            >
              {soundOn ? "🔊" : "🔇"}
            </button>

            {/* User Auth Menu */}
            <AuthButton onOpenHistory={onOpenHistory} />
          </div>
        </div>

        {/* Error Toast Banner */}
        {errorMessage && (
          <div className="bg-red-950/90 border-t border-b border-red-500/40 px-4 py-2 text-center text-xs font-display font-bold text-red-300 animate-in fade-in duration-200">
            ⚠️ {errorMessage}
          </div>
        )}
      </header>

      {/* Main Drafting Stadium */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT COLUMN: Wheel, Reveal, and Squad Grid */}
          <div className="flex-1 w-full flex flex-col items-center gap-6">

            {/* 1. Wheel & Spin Section */}
            <div className="w-full flex flex-col items-center">
              <SpinWheel
                onSpinComplete={handleSpinComplete}
                onSpinStart={handleSpinStart}
                selectedTeam={currentTeam}
                isSpinning={phase === "spinning"}
              />
            </div>

            {/* 2. Jumbotron Dramatic Reveal */}
            {revealed && currentTeam && (
              <div
                className="w-full max-w-xl rounded-3xl border-2 p-6 md:p-8 text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-400"
                style={{
                  background: `linear-gradient(135deg, ${teamColors?.primary ?? "#f59e0b"}25 0%, #080d1a 60%, ${teamColors?.secondary ?? "#000"}30 100%)`,
                  borderColor: teamColors?.primary ?? "#f59e0b",
                  boxShadow: `0 0 50px ${teamColors?.primary ?? "#f59e0b"}35`,
                }}
              >
                {/* Jumbotron Header */}
                <div className="relative z-10 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-display font-black tracking-widest text-amber-300 uppercase mb-2">
                    <span>⚡</span> HISTORICAL SQUAD REVEALED
                  </div>

                  <p className="text-xs font-display font-black tracking-widest text-slate-300 uppercase">
                    YOU GOT
                  </p>

                  <h1
                    className="text-6xl md:text-8xl font-display font-black tracking-tight leading-none drop-shadow-2xl"
                    style={{ color: teamColors?.primary ?? "#f59e0b" }}
                  >
                    {currentTeam.team}
                  </h1>

                  <h2 className="text-4xl md:text-5xl font-display font-black text-white/95 tracking-wider">
                    {currentTeam.season}
                  </h2>

                  <p className="text-xs font-semibold text-slate-400 tracking-wider pt-1 uppercase">
                    {TEAM_FULL_NAMES[currentTeam.team]}
                  </p>

                  <div className="pt-3">
                    <span className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-display font-black text-sm tracking-widest uppercase shadow-lg shadow-amber-500/30 animate-pulse">
                      CHOOSE ONE PLAYER
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Available Players Grid */}
            {showPickers && currentTeam && (
              <section className="w-full max-w-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="font-display font-black text-base md:text-lg text-white tracking-wider uppercase flex items-center gap-2">
                    <span>🏏</span>
                    <span>
                      {currentTeam.team} {currentTeam.season} SQUAD ({currentTeam.players.length} PLAYERS)
                    </span>
                  </h3>
                  <span className="text-xs font-display font-bold text-amber-400">
                    SELECT 1 PLAYER
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[65vh] overflow-y-auto pr-1.5 custom-scrollbar">
                  {currentTeam.players.map((player) => {
                    const alreadyPicked = pickedPlayerIds.has(player.id);
                    const overseasBlocked =
                      overseasFull && player.nationality === "OVERSEAS" && !alreadyPicked;
                    const budgetBlocked =
                      config.budgetEnabled && player.price > budgetRemaining && !alreadyPicked;

                    return (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        alreadyPicked={alreadyPicked}
                        overseasBlocked={overseasBlocked}
                        budgetBlocked={budgetBlocked}
                        onSelect={handleSelectPlayer}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Idle state helper */}
            {phase === "spinning" && !showPickers && !revealed && (
              <div className="text-center space-y-2 py-4">
                <p className="font-display font-black text-xl text-slate-300 uppercase tracking-wider">
                  🎡 Spin the wheel to draft your next legend
                </p>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                  {config.totalRounds - picks.length} spot{config.totalRounds - picks.length !== 1 ? "s" : ""} open in your Playing XI
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Dugout / Current XI Panel */}
          <aside className="w-full lg:w-84 xl:w-96 shrink-0 lg:sticky lg:top-20">
            <div className="bg-[#080d1c]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden">
              <CurrentXI
                picks={picks}
                totalRounds={config.totalRounds}
                overseasCount={comp.overseas}
                maxOverseas={requirements.maxOverseas}
                budgetUsed={budgetUsed}
                budgetTotal={config.startingBudget}
                budgetEnabled={config.budgetEnabled}
                warnings={warnings}
              />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
