"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  DraftPick,
  GamePhase,
  HistoricalTeam,
  GameConfig,
  TeamRequirements,
  TeamScore,
  TeamCode,
  Role,
  Nationality,
} from "@/data/types";
import { DEFAULT_REQUIREMENTS, DEFAULT_GAME_CONFIG } from "@/data/types";
import HISTORICAL_TEAMS from "@/data/historicalTeams";
import {
  getTeamComposition,
  shuffleArray,
  calculateBudgetUsed,
  calculateTeamScore,
  getTeamVerdict,
} from "@/data/gameLogic";
import type { IDraft } from "@/models/Draft";

export interface GameState {
  draftId: string | null;
  phase: GamePhase;
  round: number;
  picks: DraftPick[];
  currentTeam: HistoricalTeam | null;
  usedTeamIds: Set<string>;
  config: GameConfig;
  requirements: TeamRequirements;
  serverScore: TeamScore | null;
  serverVerdict: { label: string; emoji: string; color: string } | null;
  isLoading: boolean;
  errorMessage: string | null;
}

const INITIAL_STATE: GameState = {
  draftId: null,
  phase: "home",
  round: 0,
  picks: [],
  currentTeam: null,
  usedTeamIds: new Set(),
  config: DEFAULT_GAME_CONFIG,
  requirements: DEFAULT_REQUIREMENTS,
  serverScore: null,
  serverVerdict: null,
  isLoading: false,
  errorMessage: null,
};

// Helper to convert server pick to client DraftPick
function convertServerPickToClient(p: IDraft["picks"][0]): DraftPick {
  return {
    round: p.round,
    teamId: p.teamSeasonId,
    team: p.team as TeamCode,
    season: p.season,
    player: {
      id: p.player.playerId,
      name: p.player.name,
      role: p.player.role as Role,
      nationality: p.player.nationality as Nationality,
      rating: p.player.rating,
      battingRating: p.player.battingRating,
      bowlingRating: p.player.bowlingRating,
      price: p.player.price,
    },
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const isHydratedRef = useRef(false);

  // ── Restore active draft from server on mount ───────────────────
  useEffect(() => {
    if (isHydratedRef.current) return;
    isHydratedRef.current = true;

    async function checkServerDraft() {
      try {
        const res = await fetch("/api/drafts");
        if (!res.ok) return;
        const data = await res.json();

        if (data.success && data.draft && data.draft.status === "in_progress") {
          const d = data.draft as IDraft;
          const picks = (d.picks || []).map(convertServerPickToClient);

          let currentTeam: HistoricalTeam | null = null;
          if (d.currentTeamSeasonId && d.currentSquad && d.currentSquad.length > 0) {
            const teamCode = (d.currentSquad[0]?.playerId ? d.currentTeamSeasonId.split("-")[0].toUpperCase() : "CSK") as TeamCode;
            const season = parseInt(d.currentTeamSeasonId.split("-")[1] || "2011", 10);
            currentTeam = {
              id: d.currentTeamSeasonId,
              team: teamCode,
              season: season,
              players: d.currentSquad.map((p) => ({
                id: p.playerId,
                name: p.name,
                role: p.role as Role,
                nationality: p.nationality as Nationality,
                rating: p.rating,
                battingRating: p.battingRating,
                bowlingRating: p.bowlingRating,
                price: p.price,
              })),
            };
          }

          setState((prev) => ({
            ...prev,
            draftId: d.draftId,
            phase: currentTeam ? "picking" : "spinning",
            round: d.round,
            picks,
            currentTeam,
            usedTeamIds: new Set(d.usedTeamSeasonIds || []),
            config: {
              budgetEnabled: d.config?.budgetEnabled ?? true,
              startingBudget: d.config?.startingBudget ?? 100,
              totalRounds: d.maxRounds ?? 11,
            },
          }));
        }
      } catch (err) {
        console.warn("Could not retrieve active draft from server:", err);
      }
    }

    checkServerDraft();
  }, []);

  // ── Start a fresh draft (persisted to server) ───────────────────
  const startGame = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMessage: null }));

    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetEnabled: state.config.budgetEnabled,
          startingBudget: state.config.startingBudget,
          totalRounds: state.config.totalRounds,
        }),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setState({
          ...INITIAL_STATE,
          draftId: data.draft.draftId,
          phase: "spinning",
          round: 1,
          config: state.config,
        });
        return;
      }
    } catch (err) {
      console.warn("Server draft creation fallback to local:", err);
    }

    // Fallback if offline
    setState({
      ...INITIAL_STATE,
      draftId: `local_${Date.now()}`,
      phase: "spinning",
      round: 1,
      config: state.config,
    });
  }, [state.config]);

  // ── Reset to home screen ────────────────────────────────────────
  const resetGame = useCallback(() => {
    setState((prev) => ({ ...INITIAL_STATE, config: prev.config }));
  }, []);

  // ── Spin: Calls server to get authoritative team selection ──────
  const spinWheel = useCallback(
    async (): Promise<HistoricalTeam | null> => {
      const currentDraftId = state.draftId;

      if (currentDraftId && !currentDraftId.startsWith("local_")) {
        try {
          const res = await fetch(`/api/drafts/${currentDraftId}/spin`, {
            method: "POST",
          });
          const data = await res.json();

          if (data.success && data.teamSeasonId && data.squad) {
            const serverTeam: HistoricalTeam = {
              id: data.teamSeasonId,
              team: data.team,
              season: data.season,
              players: data.squad.map((p: any) => ({
                id: p.playerId,
                name: p.name,
                role: p.role,
                nationality: p.nationality,
                rating: p.rating,
                battingRating: p.battingRating,
                bowlingRating: p.bowlingRating,
                price: p.price,
              })),
            };
            return serverTeam;
          }
        } catch (err) {
          console.warn("Server spin error, using client fallback:", err);
        }
      }

      // Local client fallback
      const pickedPlayerIds = new Set(state.picks.map((p) => p.player.id));
      const comp = getTeamComposition(state.picks);
      const overseasFull = comp.overseas >= state.requirements.maxOverseas;
      const needsWKUrgent = comp.wk === 0 && state.picks.length >= 9;

      const available = shuffleArray(HISTORICAL_TEAMS).filter((team) => {
        if (state.usedTeamIds.has(team.id) && state.usedTeamIds.size < HISTORICAL_TEAMS.length) {
          return false;
        }

        const unpickedPlayers = team.players.filter((p) => !pickedPlayerIds.has(p.id));
        if (unpickedPlayers.length === 0) return false;

        if (overseasFull && !unpickedPlayers.some((p) => p.nationality === "IND")) {
          return false;
        }

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

      return available.length > 0 ? available[0] : HISTORICAL_TEAMS[0];
    },
    [state.draftId, state.picks, state.usedTeamIds, state.requirements]
  );

  // ── Called when spin animation finishes ────────────────────────
  const resolveSpinResult = useCallback((team: HistoricalTeam) => {
    setState((prev) => ({
      ...prev,
      phase: "picking",
      currentTeam: team,
      usedTeamIds: new Set([...prev.usedTeamIds, team.id]),
    }));
  }, []);

  // ── Player selected from squad (persisted on server) ───────────
  const selectPlayer = useCallback(
    async (team: HistoricalTeam, playerId: string, round: number) => {
      const currentDraftId = state.draftId;

      // Server-authoritative pick
      if (currentDraftId && !currentDraftId.startsWith("local_")) {
        try {
          const res = await fetch(`/api/drafts/${currentDraftId}/pick`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              draftId: currentDraftId,
              teamSeasonId: team.id,
              playerId,
              round,
            }),
          });

          const data = await res.json();
          if (data.success && data.draft) {
            const d = data.draft as IDraft;
            const updatedPicks = d.picks.map(convertServerPickToClient);
            const isComplete = d.status === "completed" || updatedPicks.length >= d.maxRounds;

            setState((prev) => ({
              ...prev,
              picks: updatedPicks,
              phase: isComplete ? "complete" : "spinning",
              round: isComplete ? round : d.round,
              currentTeam: null,
              serverScore: d.score || null,
              serverVerdict: d.verdict || null,
              errorMessage: null,
            }));
            return;
          } else if (data.error) {
            setState((prev) => ({ ...prev, errorMessage: data.error }));
          }
        } catch (err) {
          console.warn("Server pick error, falling back locally:", err);
        }
      }

      // Local fallback
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
        const isComplete = newPicks.length >= prev.config.totalRounds;
        let score: TeamScore | null = null;
        let verdict = null;

        if (isComplete) {
          score = calculateTeamScore(newPicks, prev.requirements);
          verdict = getTeamVerdict(score.overall);
        }

        return {
          ...prev,
          picks: newPicks,
          phase: isComplete ? "complete" : "spinning",
          round: isComplete ? round : round + 1,
          currentTeam: null,
          serverScore: score,
          serverVerdict: verdict,
          errorMessage: null,
        };
      });
    },
    [state.draftId]
  );

  // ── Resume a specific saved draft ──────────────────────────────
  const resumeDraft = useCallback(async (draftId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/drafts/${draftId}`);
      const data = await res.json();
      if (data.success && data.draft) {
        const d = data.draft as IDraft;
        const picks = (d.picks || []).map(convertServerPickToClient);
        const isComplete = d.status === "completed" || picks.length >= d.maxRounds;

        let currentTeam: HistoricalTeam | null = null;
        if (!isComplete && d.currentTeamSeasonId && d.currentSquad?.length) {
          const teamCode = d.currentTeamSeasonId.split("-")[0].toUpperCase() as TeamCode;
          const season = parseInt(d.currentTeamSeasonId.split("-")[1] || "2011", 10);
          currentTeam = {
            id: d.currentTeamSeasonId,
            team: teamCode,
            season,
            players: d.currentSquad.map((p) => ({
              id: p.playerId,
              name: p.name,
              role: p.role as Role,
              nationality: p.nationality as Nationality,
              rating: p.rating,
              battingRating: p.battingRating,
              bowlingRating: p.bowlingRating,
              price: p.price,
            })),
          };
        }

        setState((prev) => ({
          ...prev,
          draftId: d.draftId,
          phase: isComplete ? "complete" : currentTeam ? "picking" : "spinning",
          round: d.round,
          picks,
          currentTeam,
          usedTeamIds: new Set(d.usedTeamSeasonIds || []),
          serverScore: d.score || (isComplete ? calculateTeamScore(picks, prev.requirements) : null),
          serverVerdict: d.verdict || (isComplete ? getTeamVerdict(d.score?.overall ?? 85) : null),
          isLoading: false,
        }));
      }
    } catch (err) {
      console.error("Failed to resume draft:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // ── Budget calculations ─────────────────────────────────────────
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
    resumeDraft,
    toggleBudget,
    spinWheel,
    resolveSpinResult,
    selectPlayer,
  };
}
