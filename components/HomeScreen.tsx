"use client";

import { useState } from "react";
import { soundManager } from "@/utils/sound";
import AuthButton from "./AuthButton";

interface HomeScreenProps {
  onStart: () => void;
  budgetEnabled: boolean;
  onToggleBudget: () => void;
  onOpenHistory?: () => void;
}

const PREVIEW_CARDS = [
  { team: "CSK", year: "2011", player: "MS Dhoni", role: "WK", rating: 94, color: "#F5A623" },
  { team: "RCB", year: "2016", player: "Virat Kohli", role: "BAT", rating: 98, color: "#EC1C24" },
  { team: "MI", year: "2019", player: "Jasprit Bumrah", role: "BOWL", rating: 95, color: "#004BA0" },
  { team: "KKR", year: "2012", player: "Sunil Narine", role: "AR", rating: 90, color: "#3A225D" },
];

export default function HomeScreen({
  onStart,
  budgetEnabled,
  onToggleBudget,
  onOpenHistory,
}: HomeScreenProps) {
  const [soundOn, setSoundOn] = useState(soundManager.enabled);

  const toggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundOn(next);
  };

  const handleStart = () => {
    soundManager.playSelect();
    onStart();
  };

  return (
    <div className="min-h-screen bg-[#050811] flex flex-col justify-between items-center px-4 py-6 sm:py-8 relative overflow-hidden select-none font-sans">
      {/* Stadium Atmospheric Lighting Rays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-to-br from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-tl from-blue-600/15 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-stadium-grid opacity-30 pointer-events-none" />

      {/* Top Bar with Auth and mode toggle */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏏</span>
          <span className="font-display font-black text-sm tracking-widest text-gold-gradient uppercase">
            IPL DRAFT CHAMPIONSHIP
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Salary Cap Mode Toggle */}
          <button
            onClick={onToggleBudget}
            className={`cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-bold border transition-all shadow-md ${
              budgetEnabled
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-slate-900/80 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <span>💰 SALARY CAP:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                budgetEnabled ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}
            >
              {budgetEnabled ? "₹100 Cr" : "OFF"}
            </span>
          </button>

          {/* Saved Drafts Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-yellow-400/40 text-slate-300 hover:text-white text-xs font-display font-bold uppercase transition-all shadow-md"
              title="View past completed drafts"
            >
              <span>📜</span>
              <span className="hidden md:inline">SAVED DRAFTS</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="cursor-pointer p-2 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white text-xs shadow-md"
            title={soundOn ? "Mute audio" : "Enable audio"}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>

          {/* Google Auth Button */}
          <AuthButton onOpenHistory={onOpenHistory} />
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-4xl w-full text-center space-y-8 my-auto py-6">

        {/* Athletic Championship Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-display font-black text-xs tracking-widest uppercase shadow-sm">
            <span>🏆</span> OFFICIAL HISTORICAL SQUADS 2008–2025
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black text-white leading-none tracking-tight uppercase drop-shadow-2xl">
            BUILD YOUR
            <br />
            <span className="text-gold-gradient drop-shadow-[0_10px_35px_rgba(245,158,11,0.4)]">
              IPL XI
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 font-semibold tracking-wide max-w-xl mx-auto">
            Every spin gives you a team. You pick the player.
          </p>
        </div>

        {/* Visual Preview Flow: 🎡 → CSK 2011 → 🏏 → YOUR XI */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap py-2">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0b1222]/90 border border-white/10 shadow-xl">
            <span className="text-2xl">🎡</span>
            <span className="font-display font-black text-base text-white tracking-wider">SPIN</span>
          </div>

          <span className="text-yellow-400 text-xl font-black">→</span>

          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0b1222]/90 border border-yellow-500/40 shadow-xl shadow-yellow-500/10">
            <span className="w-3 h-3 rounded-full bg-[#F5A623] inline-block shadow-sm" />
            <span className="font-display font-black text-base text-yellow-400 tracking-wider">
              CSK 2011
            </span>
          </div>

          <span className="text-yellow-400 text-xl font-black">→</span>

          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0b1222]/90 border border-white/10 shadow-xl">
            <span className="text-2xl">🏏</span>
            <span className="font-display font-black text-base text-white tracking-wider">PICK</span>
          </div>

          <span className="text-yellow-400 text-xl font-black">→</span>

          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-400/60 shadow-xl shadow-amber-500/20">
            <span className="text-2xl">⭐</span>
            <span className="font-display font-black text-base text-yellow-300 tracking-wider">
              YOUR XI
            </span>
          </div>
        </div>

        {/* Sample Draftable Legends Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          {PREVIEW_CARDS.map((card, i) => (
            <div
              key={i}
              className="holo-card rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 text-left shadow-lg hover:border-yellow-400/50 transition-all"
              style={{ borderTopColor: card.color, borderTopWidth: 3 }}
            >
              <div className="flex items-center justify-between text-[11px] font-display font-bold text-slate-400 uppercase tracking-wider">
                <span>{card.team} &apos;{card.year.slice(2)}</span>
                <span className="text-amber-400">{card.role}</span>
              </div>
              <div className="font-display font-black text-base text-white leading-tight mt-1 truncate">
                {card.player}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">HISTORIC RATING</span>
                <span className="font-display font-black text-sm text-yellow-400">
                  {card.rating}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA Button: START DRAFT */}
        <div className="space-y-4 pt-4">
          <button
            onClick={handleStart}
            className="group cursor-pointer relative px-16 py-5 rounded-2xl font-display font-black text-3xl tracking-widest uppercase bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-950 shadow-[0_15px_40px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 hover:shadow-[0_20px_50px_rgba(245,158,11,0.7)] transition-all duration-200 border border-yellow-200/50"
          >
            <span className="flex items-center gap-3">
              <span>START DRAFT</span>
              <span className="text-3xl group-hover:rotate-45 transition-transform duration-300">
                🎡
              </span>
            </span>
          </button>

          {/* Secondary Information */}
          <p className="font-display font-black text-base text-slate-400 tracking-widest uppercase">
            11 spins. 11 players. One XI.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center font-display text-xs text-slate-600 font-bold uppercase tracking-widest z-10 pt-2">
        🏏 Powered by authentic IPL Squad Archives • Rajasthan 2008 to Bengaluru 2025
      </footer>
    </div>
  );
}
