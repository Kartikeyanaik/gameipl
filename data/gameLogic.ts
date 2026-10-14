import type { DraftPick, TeamScore, TeamRequirements, Player, Role } from "./types";

// ─────────────────────────────────────────────────────────────────
// Budget calculation
// ─────────────────────────────────────────────────────────────────
export function calculateBudgetUsed(picks: DraftPick[]): number {
  return picks.reduce((sum, pick) => sum + pick.player.price, 0);
}

// ─────────────────────────────────────────────────────────────────
// Team composition analysis
// ─────────────────────────────────────────────────────────────────
export function getTeamComposition(picks: DraftPick[]) {
  const players = picks.map((p) => p.player);
  return {
    wk: players.filter((p) => p.role === "WK").length,
    bat: players.filter((p) => p.role === "BAT").length,
    ar: players.filter((p) => p.role === "AR").length,
    bowl: players.filter((p) => p.role === "BOWL").length,
    overseas: players.filter((p) => p.nationality === "OVERSEAS").length,
    total: players.length,
  };
}

// ─────────────────────────────────────────────────────────────────
// Scoring engine
// ─────────────────────────────────────────────────────────────────
export function calculateTeamScore(picks: DraftPick[], requirements: TeamRequirements): TeamScore {
  if (picks.length === 0) return { batting: 0, bowling: 0, allRound: 0, balance: 0, overseas: 0, overall: 0 };

  const players = picks.map((p) => p.player);
  const comp = getTeamComposition(picks);

  // Batting score: weighted avg of top 6 batsmen by batting rating
  const batters = [...players].sort((a, b) => b.battingRating - a.battingRating).slice(0, 6);
  const batting = Math.round(batters.reduce((s, p) => s + p.battingRating, 0) / batters.length);

  // Bowling score: weighted avg of top 5 bowlers by bowling rating
  const bowlers = players.filter((p) => p.role === "BOWL" || p.role === "AR");
  const topBowlers = [...bowlers].sort((a, b) => b.bowlingRating - a.bowlingRating).slice(0, 5);
  const bowling =
    topBowlers.length > 0
      ? Math.round(topBowlers.reduce((s, p) => s + p.bowlingRating, 0) / topBowlers.length)
      : 50;

  // All-round score
  const allRounders = players.filter((p) => p.role === "AR");
  const allRound =
    allRounders.length > 0
      ? Math.round(allRounders.reduce((s, p) => s + p.rating, 0) / allRounders.length)
      : 60;

  // Balance score — penalties for missing requirements
  let balance = 85;
  if (comp.wk < requirements.minWK) balance -= 12 * (requirements.minWK - comp.wk);
  if (comp.bat < requirements.minBAT) balance -= 8 * (requirements.minBAT - comp.bat);
  if (comp.ar < requirements.minAR) balance -= 6 * (requirements.minAR - comp.ar);
  if (comp.bowl < requirements.minBOWL) balance -= 8 * (requirements.minBOWL - comp.bowl);
  // Penalty for star-heavy imbalance: if 1 player has > 20 rating gap over avg
  const avgRating = players.reduce((s, p) => s + p.rating, 0) / players.length;
  const topRating = Math.max(...players.map((p) => p.rating));
  if (topRating - avgRating > 20) balance -= Math.min(10, (topRating - avgRating - 20) / 2);
  balance = Math.max(30, Math.round(balance));

  // Overseas score
  const overseasCount = comp.overseas;
  let overseasScore = 80;
  if (overseasCount === requirements.maxOverseas) overseasScore = 92; // optimal use
  else if (overseasCount < 2) overseasScore = 72; // underusing overseas
  else if (overseasCount > requirements.maxOverseas) overseasScore = 50; // illegal (shouldn't happen)
  overseasScore = Math.round(overseasScore);

  // Overall: weighted combination with 1 decimal place
  const rawOverall =
    batting * 0.28 + bowling * 0.28 + allRound * 0.18 + balance * 0.16 + overseasScore * 0.1;
  const overall = Math.round(rawOverall * 10) / 10;

  return { batting, bowling, allRound, balance, overseas: overseasScore, overall };
}

// ─────────────────────────────────────────────────────────────────
// Team verdict
// ─────────────────────────────────────────────────────────────────
export function getTeamVerdict(overall: number): { label: string; emoji: string; color: string } {
  if (overall >= 92) return { label: "CHAMPIONSHIP MATERIAL", emoji: "🏆", color: "text-yellow-400" };
  if (overall >= 88) return { label: "TITLE CONTENDER", emoji: "🔥", color: "text-orange-400" };
  if (overall >= 83) return { label: "PLAYOFFS BOUND", emoji: "⚡", color: "text-blue-400" };
  if (overall >= 77) return { label: "SOLID XI", emoji: "💪", color: "text-green-400" };
  if (overall >= 70) return { label: "MID-TABLE MERCHANT", emoji: "😭", color: "text-gray-400" };
  return { label: "BRO WHAT DID YOU BUILD", emoji: "💀", color: "text-red-500" };
}

// ─────────────────────────────────────────────────────────────────
// Requirement warnings
// ─────────────────────────────────────────────────────────────────
export function getWarnings(picks: DraftPick[], requirements: TeamRequirements): string[] {
  const warnings: string[] = [];
  const comp = getTeamComposition(picks);
  const remaining = requirements.totalPlayers - picks.length;

  if (comp.wk === 0 && remaining <= 3) {
    warnings.push("⚠️ No wicketkeeper yet — you need one!");
  }
  if (comp.bowl < requirements.minBOWL && remaining <= 3) {
    const needed = requirements.minBOWL - comp.bowl;
    warnings.push(`⚠️ You need ${needed} more bowler${needed > 1 ? "s" : ""}!`);
  }
  if (comp.overseas >= requirements.maxOverseas) {
    warnings.push("🌍 Overseas quota full — 4/4 used");
  }
  return warnings;
}

// ─────────────────────────────────────────────────────────────────
// Player arrangement for display
// ─────────────────────────────────────────────────────────────────
const ROLE_ORDER: Role[] = ["WK", "BAT", "AR", "BOWL"];

export function arrangePlayersForDisplay(picks: DraftPick[]): DraftPick[] {
  return [...picks].sort((a, b) => {
    return ROLE_ORDER.indexOf(a.player.role) - ROLE_ORDER.indexOf(b.player.role);
  });
}

// ─────────────────────────────────────────────────────────────────
// Role display helpers
// ─────────────────────────────────────────────────────────────────
export const ROLE_LABELS: Record<Role, string> = {
  WK: "Wicket-Keeper",
  BAT: "Batter",
  AR: "All-Rounder",
  BOWL: "Bowler",
};

export const ROLE_SHORT: Record<Role, string> = {
  WK: "WK",
  BAT: "BAT",
  AR: "AR",
  BOWL: "BOWL",
};

export const ROLE_COLORS: Record<Role, string> = {
  WK: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  BAT: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  AR: "bg-green-500/20 text-green-300 border-green-500/30",
  BOWL: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export const ROLE_ICONS: Record<Role, string> = {
  WK: "🧤",
  BAT: "🏏",
  AR: "⚡",
  BOWL: "🎯",
};

// ─────────────────────────────────────────────────────────────────
// Player price from rating
// ─────────────────────────────────────────────────────────────────
export function priceFromRating(rating: number): number {
  if (rating >= 95) return 20;
  if (rating >= 90) return Math.round(14 + (rating - 90) * 1.2);
  if (rating >= 85) return Math.round(10 + (rating - 85) * 0.8);
  if (rating >= 80) return Math.round(6 + (rating - 80) * 0.8);
  return Math.max(3, Math.round(3 + (rating - 70) * 0.3));
}

// ─────────────────────────────────────────────────────────────────
// Shuffle util (Fisher-Yates)
// ─────────────────────────────────────────────────────────────────
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
