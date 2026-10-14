"use client";

import { useState, useCallback } from "react";
import type {
  DraftPick,
  GamePhase,
  HistoricalTeam,
  GameConfig,
  TeamRequirements,
} from "@/data/types";
import { DEFAULT_REQUIREMENTS, DEFAULT_GAME_CONFIG } from "@/data/types";
import HISTORICAL_TEAMS from "@/data/historicalTeams";
import {
  getTeamComposition,
  shuffleArray,
  calculateBudgetUsed,
} from "@/data/gameLogic";

export interface GameState {
  phase: GamePhase;
  round: number;
  picks: DraftPick[];
  currentTeam: HistoricalTeam | null;
  usedTeamIds: Set<string>;
  config: GameConfig;
  requirements: TeamRequirements;
}

const INITIAL_STATE: GameState = {
  phase: "home",
  round: 0,
  picks: [],
  currentTeam: null,
  usedTeamIds: new Set(),
  config: DEFAULT_GAME_CONFIG,
  requirements: DEFAULT_REQUIREMENTS,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // ── Start a fresh game ─────────────────────────────────────────
  const startGame = useCallback(() => {
    setState({ ...INITIAL_STATE, phase: "spinning", round: 1 });
  }, []);

  // ── Reset to home ─────────────────────────────────────────────
  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // ── Spin: pick a random team-season that:
  //   1. Hasn't been used this draft
  //   2. Has at least one player not already in the XI
  //   3. Respects overseas quota (rerolls if all eligible are overseas)
  //   4. Safeguards: if user reaches round 10 without a WK, ensure next team has an eligible WK!
  // ──────────────────────────────────────────────────────────────
  const spinWheel = useCallback(
    (currentPicks: DraftPick[], usedTeamIds: Set<string>): HistoricalTeam | null => {
      const pickedPlayerIds = new Set(currentPicks.map((p) => p.player.id));
      const comp = getTeamComposition(currentPicks);
      const overseasFull = comp.overseas >= DEFAULT_REQUIREMENTS.maxOverseas;
      const needsWKUrgent = comp.wk === 0 && currentPicks.length >= 9;

      const available = shuffleArray(HISTORICAL_TEAMS).filter((team) => {
        // Don't reuse teams from this draft (if possible)
        if (usedTeamIds.has(team.id) && usedTeamIds.size < HISTORICAL_TEAMS.length) return false;

        // Must have at least one unpicked player
        const unpickedPlayers = team.players.filter((p) => !pickedPlayerIds.has(p.id));
        if (unpickedPlayers.length === 0) return false;

        // If overseas full, must have at least one Indian player available
        if (overseasFull) {
          const hasIndian = unpickedPlayers.some((p) => p.nationality === "IND");
          if (!hasIndian) return false;
        }

        // If urgent need for wicketkeeper (round 10 or 11 with 0 WK):
        if (needsWKUrgent) {
          const hasEligibleWK = unpickedPlayers.some((p) => {
            if (p.role !== "WK") return false;
            if (overseasFull && p.nationality === "OVERSEAS") return false;
            return true;
          });
          if (!hasEligibleWK) return false;
        }

        return true;
      });

      // If strict filter yielded no results (e.g. rare edge case), fall back gracefully
      if (available.length === 0) {
        const fallback = HISTORICAL_TEAMS.filter((team) =>
          team.players.some((p) => !pickedPlayerIds.has(p.id))
        );
        return fallback.length > 0 ? shuffleArray(fallback)[0] : null;
      }

      return available[0];
    },
    []
  );

  // ── Called after spin animation finishes ─────────────────────
  const resolveSpinResult = useCallback(
    (team: HistoricalTeam) => {
      setState((prev) => ({
        ...prev,
        phase: "picking",
        currentTeam: team,
        usedTeamIds: new Set([...prev.usedTeamIds, team.id]),
      }));
    },
    []
  );

  // ── Player selected from squad ────────────────────────────────
  const selectPlayer = useCallback(
    (team: HistoricalTeam, playerId: string, round: number) => {
      setState((prev) => {
        const player = team.players.find((p) => p.id === playerId);
        if (!player) return prev;

        const pick: DraftPick = {
          round,
          teamId: team.id,
          team: team.team,
          season: team.season,
          player,
        };

        const newPicks = [...prev.picks, pick];
        const totalRounds = prev.config.totalRounds;
        const isComplete = newPicks.length >= totalRounds;

        return {
          ...prev,
          picks: newPicks,
          phase: isComplete ? "complete" : "spinning",
          round: isComplete ? round : round + 1,
          currentTeam: null,
        };
      });
    },
    []
  );

  // ── Budget calculation ─────────────────────────────────────────
  const budgetUsed = calculateBudgetUsed(state.picks);
  const budgetRemaining = state.config.startingBudget - budgetUsed;

  // ── Budget toggle ──────────────────────────────────────────────
  const toggleBudget = useCallback(() => {
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        budgetEnabled: !prev.config.budgetEnabled,
      },
    }));
  }, []);

  return {
    state,
    budgetUsed,
    budgetRemaining,
    startGame,
    resetGame,
    toggleBudget,
    spinWheel,
    resolveSpinResult,
    selectPlayer,
  };
}
