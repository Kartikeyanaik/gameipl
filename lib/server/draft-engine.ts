import { connectMongoose, isMongoConfigured } from "@/lib/mongoose";
import { DraftModel, type IDraft, type DraftStatus } from "@/models/Draft";
import { HistoricalTeamSeasonModel } from "@/models/HistoricalTeamSeason";
import HISTORICAL_TEAMS from "@/data/historicalTeams";
import { calculateTeamScore, getTeamVerdict } from "@/data/gameLogic";
import type { HistoricalTeam, Player, TeamCode } from "@/data/types";
import { randomUUID } from "crypto";

// Memory store fallback for development/demo mode when MONGODB_URI is not provided
const demoDraftStore = new Map<string, IDraft>();

/**
 * Fetch available historical teams (from MongoDB if connected, or static verified data)
 */
export async function getAuthoritativeTeams(): Promise<HistoricalTeam[]> {
  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      const docs = await HistoricalTeamSeasonModel.find({ isAvailable: true }).lean();
      if (docs && docs.length > 0) {
        return docs.map((doc) => ({
          id: doc.teamSeasonId,
          team: doc.team as TeamCode,
          season: doc.season,
          players: doc.players.map((p) => ({
            id: p.playerId,
            name: p.name,
            role: p.role,
            nationality: p.nationality,
            rating: p.rating,
            battingRating: p.battingRating,
            bowlingRating: p.bowlingRating,
            price: p.price,
          })),
        }));
      }
    } catch (e) {
      console.warn("Could not query HistoricalTeamSeasonModel from MongoDB, falling back to static data:", e);
    }
  }

  return HISTORICAL_TEAMS;
}

/**
 * Create a new draft for a user
 */
export async function createNewDraft(
  userId: string,
  config?: { budgetEnabled?: boolean; startingBudget?: number; totalRounds?: number }
) {
  const budgetEnabled = config?.budgetEnabled ?? true;
  const startingBudget = config?.startingBudget ?? 100;
  const totalRounds = config?.totalRounds ?? 11;
  const draftId = `draft_${randomUUID().replace(/-/g, "").slice(0, 16)}`;

  const newDraftData = {
    draftId,
    userId,
    status: "in_progress" as DraftStatus,
    round: 1,
    maxRounds: totalRounds,
    currentTeamSeasonId: null,
    currentSquad: [],
    usedTeamSeasonIds: [],
    picks: [],
    draftHistory: [],
    config: {
      budgetEnabled,
      startingBudget,
      totalRounds,
    },
    rules: {
      minWK: 1,
      minBAT: 3,
      minAR: 1,
      minBOWL: 3,
      maxOverseas: 4,
      totalPlayers: totalRounds,
    },
    budgetUsed: 0,
    budgetRemaining: startingBudget,
    overseasCount: 0,
    score: null,
    verdict: null,
  };

  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      // Mark any existing in_progress draft as abandoned so user has only 1 active draft
      await DraftModel.updateMany(
        { userId, status: "in_progress" },
        { $set: { status: "abandoned" } }
      );
      const doc = await DraftModel.create(newDraftData);
      return doc.toObject();
    } catch (err) {
      console.warn("MongoDB create draft failed, falling back to demo store:", err);
    }
  }

  // Demo fallback
  demoDraftStore.set(draftId, newDraftData as unknown as IDraft);
  return newDraftData;
}

/**
 * Get active draft for a user
 */
export async function getActiveDraftForUser(userId: string) {
  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      const doc = await DraftModel.findOne({ userId, status: "in_progress" }).lean();
      if (doc) return doc;
    } catch (err) {
      console.warn("MongoDB getActiveDraftForUser error, falling back to demo store:", err);
    }
  }

  for (const draft of demoDraftStore.values()) {
    if (draft.userId === userId && draft.status === "in_progress") {
      return draft;
    }
  }
  return null;
}

/**
 * Get draft by ID with strict ownership validation
 */
export async function getDraftById(draftId: string, userId: string) {
  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      const doc = await DraftModel.findOne({ draftId }).lean();
      if (doc) {
        if (doc.userId !== userId) {
          throw new Error("FORBIDDEN: You do not own this draft.");
        }
        return doc;
      }
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("FORBIDDEN")) throw err;
      console.warn("MongoDB getDraftById error, falling back to demo store:", err);
    }
  }

  const draft = demoDraftStore.get(draftId);
  if (!draft) return null;
  if (draft.userId !== userId) {
    throw new Error("FORBIDDEN: You do not own this draft.");
  }
  return draft;
}

/**
 * Spin for next eligible team-season
 */
export async function spinDraftOnServer(draftId: string, userId: string) {
  const draft = await getDraftById(draftId, userId);
  if (!draft) {
    throw new Error("Draft not found");
  }

  if (draft.status !== "in_progress") {
    throw new Error("Draft is already completed or abandoned");
  }

  // If already spun and waiting for a pick in this round, return current squad
  if (draft.currentTeamSeasonId && draft.currentSquad && draft.currentSquad.length > 0) {
    return {
      draft,
      teamSeasonId: draft.currentTeamSeasonId,
      squad: draft.currentSquad,
    };
  }

  const allTeams = await getAuthoritativeTeams();
  const pickedPlayerIds = new Set(draft.picks.map((p) => p.player.playerId));
  const usedTeamIds = new Set(draft.usedTeamSeasonIds);
  const overseasFull = draft.overseasCount >= draft.rules.maxOverseas;
  const remainingPicks = draft.maxRounds - draft.picks.length;
  const currentWKCount = draft.picks.filter((p) => p.player.role === "WK").length;
  const needsWKUrgent = currentWKCount === 0 && remainingPicks <= 2;

  // Filter eligible teams
  const eligible = allTeams.filter((team) => {
    // Avoid reusing teams already spun in this draft unless pool exhausted
    if (usedTeamIds.has(team.id) && usedTeamIds.size < allTeams.length) {
      return false;
    }

    // Must have at least one unpicked player
    const unpicked = team.players.filter((p) => !pickedPlayerIds.has(p.id));
    if (unpicked.length === 0) return false;

    // If overseas quota full, must have at least one unpicked Indian player
    if (overseasFull) {
      const hasIndian = unpicked.some((p) => p.nationality === "IND");
      if (!hasIndian) return false;
    }

    // If urgent need for wicketkeeper (round 10 or 11 with 0 WK)
    if (needsWKUrgent) {
      const hasEligibleWK = unpicked.some((p) => {
        if (p.role !== "WK") return false;
        if (overseasFull && p.nationality === "OVERSEAS") return false;
        return true;
      });
      if (!hasEligibleWK) return false;
    }

    return true;
  });

  const selectedTeam =
    eligible.length > 0
      ? eligible[Math.floor(Math.random() * eligible.length)]
      : allTeams[Math.floor(Math.random() * allTeams.length)];

  const squadDTO = selectedTeam.players.map((p) => ({
    playerId: p.id,
    name: p.name,
    role: p.role,
    nationality: p.nationality,
    rating: p.rating,
    battingRating: p.battingRating,
    bowlingRating: p.bowlingRating,
    price: p.price,
  }));

  const historyEvent = {
    round: draft.round,
    teamSeasonId: selectedTeam.id,
    team: selectedTeam.team,
    season: selectedTeam.season,
    action: "spin" as const,
    timestamp: new Date(),
  };

  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      const updated = await DraftModel.findOneAndUpdate(
        { draftId, userId, round: draft.round, status: "in_progress" },
        {
          $set: {
            currentTeamSeasonId: selectedTeam.id,
            currentSquad: squadDTO,
          },
          $addToSet: { usedTeamSeasonIds: selectedTeam.id },
          $push: { draftHistory: historyEvent },
        },
        { new: true }
      ).lean();

      if (updated) {
        return {
          draft: updated,
          teamSeasonId: selectedTeam.id,
          team: selectedTeam.team,
          season: selectedTeam.season,
          squad: squadDTO,
        };
      }
    } catch (err) {
      console.warn("MongoDB spinDraft error, falling back to demo store:", err);
    }
  }

  // Demo fallback
  draft.currentTeamSeasonId = selectedTeam.id;
  draft.currentSquad = squadDTO;
  if (!draft.usedTeamSeasonIds.includes(selectedTeam.id)) {
    draft.usedTeamSeasonIds.push(selectedTeam.id);
  }
  draft.draftHistory.push(historyEvent);
  demoDraftStore.set(draftId, draft);

  return {
    draft,
    teamSeasonId: selectedTeam.id,
    team: selectedTeam.team,
    season: selectedTeam.season,
    squad: squadDTO,
  };
}

/**
 * Pick player for active round
 */
export async function pickPlayerOnServer(
  draftId: string,
  userId: string,
  playerId: string,
  teamSeasonId: string,
  clientRound: number
) {
  const draft = await getDraftById(draftId, userId);
  if (!draft) {
    throw new Error("Draft not found");
  }

  if (draft.status !== "in_progress") {
    throw new Error("Draft is already completed or abandoned");
  }

  // Concurrency guard: verify round matches
  if (draft.round !== clientRound) {
    throw new Error(`Round mismatch: current round is ${draft.round}, received ${clientRound}`);
  }

  // Verify teamSeasonId matches active spin
  if (draft.currentTeamSeasonId !== teamSeasonId) {
    throw new Error("Selected player does not belong to the actively spun team-season.");
  }

  // Authoritative squad check
  const playerInSquad = draft.currentSquad.find((p) => p.playerId === playerId);
  if (!playerInSquad) {
    throw new Error("Player does not exist in the active historical squad.");
  }

  // Check duplicate pick
  const alreadyPicked = draft.picks.some((p) => p.player.playerId === playerId);
  if (alreadyPicked) {
    throw new Error(`Player ${playerInSquad.name} has already been selected in this draft.`);
  }

  // Check overseas quota
  if (playerInSquad.nationality === "OVERSEAS" && draft.overseasCount >= draft.rules.maxOverseas) {
    throw new Error("Overseas player limit (maximum 4) reached.");
  }

  // Check budget constraint
  if (draft.config.budgetEnabled && playerInSquad.price > draft.budgetRemaining) {
    throw new Error(`Exceeds remaining salary cap (Player: ₹${playerInSquad.price}Cr, Purse: ₹${draft.budgetRemaining}Cr).`);
  }

  // Extract team and season from teamSeasonId (e.g. "csk-2011")
  const allTeams = await getAuthoritativeTeams();
  const teamDoc = allTeams.find((t) => t.id === teamSeasonId);
  const team = (teamDoc?.team ?? "CSK") as TeamCode;
  const season = teamDoc?.season ?? 2011;

  const newPick = {
    round: draft.round,
    teamSeasonId,
    team,
    season,
    player: {
      playerId: playerInSquad.playerId,
      name: playerInSquad.name,
      role: playerInSquad.role,
      nationality: playerInSquad.nationality,
      rating: playerInSquad.rating,
      battingRating: playerInSquad.battingRating,
      bowlingRating: playerInSquad.bowlingRating,
      price: playerInSquad.price,
    },
    pickedAt: new Date(),
  };

  const historyEvent = {
    round: draft.round,
    teamSeasonId,
    team,
    season,
    action: "pick" as const,
    playerName: playerInSquad.name,
    rating: playerInSquad.rating,
    timestamp: new Date(),
  };

  const nextPicks = [...draft.picks, newPick];
  const newBudgetUsed = draft.budgetUsed + playerInSquad.price;
  const newBudgetRemaining = draft.config.startingBudget - newBudgetUsed;
  const newOverseasCount = draft.overseasCount + (playerInSquad.nationality === "OVERSEAS" ? 1 : 0);
  const isFinished = nextPicks.length >= draft.maxRounds;

  let score = null;
  let verdict = null;

  if (isFinished) {
    // Format picks for scoring engine
    const picksForScoring = nextPicks.map((p) => ({
      round: p.round,
      teamId: p.teamSeasonId,
      team: p.team,
      season: p.season,
      player: {
        id: p.player.playerId,
        name: p.player.name,
        role: p.player.role,
        nationality: p.player.nationality,
        rating: p.player.rating,
        battingRating: p.player.battingRating,
        bowlingRating: p.player.bowlingRating,
        price: p.player.price,
      },
    }));

    score = calculateTeamScore(picksForScoring, draft.rules);
    verdict = getTeamVerdict(score.overall);
  }

  const updateData = {
    $push: {
      picks: newPick,
      draftHistory: historyEvent,
    },
    $set: {
      round: isFinished ? draft.round : draft.round + 1,
      status: isFinished ? ("completed" as const) : ("in_progress" as const),
      currentTeamSeasonId: null,
      currentSquad: [],
      budgetUsed: newBudgetUsed,
      budgetRemaining: newBudgetRemaining,
      overseasCount: newOverseasCount,
      score: score,
      verdict: verdict,
    },
  };

  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      // Atomic update guarded by current round
      const updated = await DraftModel.findOneAndUpdate(
        { draftId, userId, round: draft.round, status: "in_progress" },
        updateData,
        { new: true }
      ).lean();

      if (updated) {
        return updated;
      }
    } catch (err) {
      console.warn("MongoDB pickPlayer error, falling back to demo store:", err);
    }
  }

  // Demo fallback
  draft.picks.push(newPick);
  draft.draftHistory.push(historyEvent);
  draft.budgetUsed = newBudgetUsed;
  draft.budgetRemaining = newBudgetRemaining;
  draft.overseasCount = newOverseasCount;
  draft.currentTeamSeasonId = null;
  draft.currentSquad = [];
  if (isFinished) {
    draft.status = "completed";
    draft.score = score;
    draft.verdict = verdict;
  } else {
    draft.round += 1;
  }
  demoDraftStore.set(draftId, draft);
  return draft;
}

/**
 * List completed past drafts for a user
 */
export async function getUserCompletedDrafts(userId: string) {
  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      const docs = await DraftModel.find({ userId, status: "completed" })
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();
      if (docs) return docs;
    } catch (err) {
      console.warn("MongoDB getUserCompletedDrafts error, falling back to demo store:", err);
    }
  }

  const userDrafts: IDraft[] = [];
  for (const draft of demoDraftStore.values()) {
    if (draft.userId === userId && draft.status === "completed") {
      userDrafts.push(draft);
    }
  }
  return userDrafts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

/**
 * Delete draft
 */
export async function deleteDraftOnServer(draftId: string, userId: string) {
  if (isMongoConfigured()) {
    try {
      await connectMongoose();
      const result = await DraftModel.deleteOne({ draftId, userId });
      return result.deletedCount > 0;
    } catch (err) {
      console.warn("MongoDB deleteDraft error, falling back to demo store:", err);
    }
  }

  const draft = demoDraftStore.get(draftId);
  if (draft && draft.userId === userId) {
    demoDraftStore.delete(draftId);
    return true;
  }
  return false;
}
