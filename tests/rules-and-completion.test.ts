import { describe, it, expect } from "vitest";
import {
  createNewDraft,
  spinDraftOnServer,
  pickPlayerOnServer,
  getDraftById,
} from "../lib/server/draft-engine";
import { calculateTeamScore, getTeamVerdict } from "../data/gameLogic";
import type { DraftPick } from "../data/types";

describe("Draft Rules, Overseas Limits, Completion & Scoring Tests", () => {
  const testUser = "user_test_charlie_789";

  it("enforces maximum 4 overseas player limit", async () => {
    const draft = await createNewDraft(testUser, { totalRounds: 11 });

    // Manually simulate 4 overseas picks
    draft.overseasCount = 4;

    // Spin a team
    const spin = await spinDraftOnServer(draft.draftId, testUser);
    const overseasPlayer = spin.squad.find((p) => p.nationality === "OVERSEAS");

    if (overseasPlayer) {
      await expect(
        pickPlayerOnServer(
          draft.draftId,
          testUser,
          overseasPlayer.playerId,
          spin.teamSeasonId,
          draft.round
        )
      ).rejects.toThrow("Overseas player limit (maximum 4) reached");
    }
  });

  it("completes full 11-round draft, computes final score and assigns verdict", async () => {
    const draft = await createNewDraft(testUser, { totalRounds: 11, budgetEnabled: false });

    for (let r = 1; r <= 11; r++) {
      const spin = await spinDraftOnServer(draft.draftId, testUser);
      // Pick first player that hasn't been picked yet
      const pickedIds = new Set(draft.picks.map((p) => p.player.playerId));
      const playerToPick = spin.squad.find((p) => !pickedIds.has(p.playerId)) || spin.squad[0];

      const updated = await pickPlayerOnServer(
        draft.draftId,
        testUser,
        playerToPick.playerId,
        spin.teamSeasonId,
        r
      );

      if (r < 11) {
        expect(updated.status).toBe("in_progress");
        expect(updated.round).toBe(r + 1);
      } else {
        // Round 11 completes the draft
        expect(updated.status).toBe("completed");
        expect(updated.picks).toHaveLength(11);
        expect(updated.score).toBeDefined();
        expect(updated.score?.overall).toBeGreaterThan(0);
        expect(updated.score?.overall).toBeLessThanOrEqual(100);
        expect(updated.verdict).toBeDefined();
        expect(updated.verdict?.label).toBeDefined();
      }
    }
  });

  it("calculates realistic balanced team score and verdict accurately", () => {
    const mockPicks: DraftPick[] = [
      {
        round: 1,
        teamId: "csk-2011",
        team: "CSK",
        season: 2011,
        player: { id: "1", name: "MS Dhoni", role: "WK", nationality: "IND", rating: 94, battingRating: 90, bowlingRating: 0, price: 15 },
      },
      {
        round: 2,
        teamId: "rcb-2016",
        team: "RCB",
        season: 2016,
        player: { id: "2", name: "Virat Kohli", role: "BAT", nationality: "IND", rating: 98, battingRating: 99, bowlingRating: 0, price: 17 },
      },
      {
        round: 3,
        teamId: "mi-2019",
        team: "MI",
        season: 2019,
        player: { id: "3", name: "Rohit Sharma", role: "BAT", nationality: "IND", rating: 92, battingRating: 91, bowlingRating: 0, price: 16 },
      },
      {
        round: 4,
        teamId: "csk-2011",
        team: "CSK",
        season: 2011,
        player: { id: "4", name: "Suresh Raina", role: "BAT", nationality: "IND", rating: 88, battingRating: 88, bowlingRating: 30, price: 12 },
      },
      {
        round: 5,
        teamId: "kkr-2012",
        team: "KKR",
        season: 2012,
        player: { id: "5", name: "Gautam Gambhir", role: "BAT", nationality: "IND", rating: 88, battingRating: 89, bowlingRating: 0, price: 12 },
      },
      {
        round: 6,
        teamId: "kkr-2012",
        team: "KKR",
        season: 2012,
        player: { id: "6", name: "Sunil Narine", role: "AR", nationality: "OVERSEAS", rating: 90, battingRating: 70, bowlingRating: 95, price: 12 },
      },
      {
        round: 7,
        teamId: "csk-2021",
        team: "CSK",
        season: 2021,
        player: { id: "7", name: "Ravindra Jadeja", role: "AR", nationality: "IND", rating: 90, battingRating: 84, bowlingRating: 88, price: 14 },
      },
      {
        round: 8,
        teamId: "mi-2020",
        team: "MI",
        season: 2020,
        player: { id: "8", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 90, battingRating: 87, bowlingRating: 82, price: 13 },
      },
      {
        round: 9,
        teamId: "mi-2019",
        team: "MI",
        season: 2019,
        player: { id: "9", name: "Jasprit Bumrah", role: "BOWL", nationality: "IND", rating: 95, battingRating: 20, bowlingRating: 98, price: 16 },
      },
      {
        round: 10,
        teamId: "srh-2016",
        team: "SRH",
        season: 2016,
        player: { id: "10", name: "Rashid Khan", role: "BOWL", nationality: "OVERSEAS", rating: 92, battingRating: 50, bowlingRating: 95, price: 14 },
      },
      {
        round: 11,
        teamId: "mi-2013",
        team: "MI",
        season: 2013,
        player: { id: "11", name: "Lasith Malinga", role: "BOWL", nationality: "OVERSEAS", rating: 92, battingRating: 15, bowlingRating: 96, price: 13 },
      },
    ];

    const rules = {
      minWK: 1,
      minBAT: 3,
      minAR: 1,
      minBOWL: 3,
      maxOverseas: 4,
      totalPlayers: 11,
    };

    const score = calculateTeamScore(mockPicks, rules);
    expect(score.overall).toBeGreaterThanOrEqual(88);
    expect(score.batting).toBeGreaterThanOrEqual(88);
    expect(score.bowling).toBeGreaterThanOrEqual(88);

    const verdict = getTeamVerdict(score.overall);
    expect(["CHAMPIONSHIP MATERIAL", "TITLE CONTENDER"]).toContain(verdict.label);
  });
});
