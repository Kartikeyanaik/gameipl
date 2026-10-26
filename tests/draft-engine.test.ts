import { describe, it, expect, beforeEach } from "vitest";
import {
  createNewDraft,
  spinDraftOnServer,
  pickPlayerOnServer,
  getDraftById,
  deleteDraftOnServer,
} from "../lib/server/draft-engine";
import { CreateDraftSchema, PickPlayerSchema } from "../lib/server/validations";

describe("Server-Side Draft Engine & Security Suite", () => {
  const userA = "user_test_alice_123";
  const userB = "user_test_bob_456";

  beforeEach(() => {
    // Fresh test context
  });

  it("creates a draft with valid initial state", async () => {
    const draft = await createNewDraft(userA, {
      budgetEnabled: true,
      startingBudget: 100,
      totalRounds: 11,
    });

    expect(draft.draftId).toBeDefined();
    expect(draft.userId).toBe(userA);
    expect(draft.round).toBe(1);
    expect(draft.status).toBe("in_progress");
    expect(draft.picks).toHaveLength(0);
    expect(draft.budgetRemaining).toBe(100);
    expect(draft.overseasCount).toBe(0);
  });

  it("enforces draft ownership and rejects unauthorized access", async () => {
    const draft = await createNewDraft(userA);

    // User A can access their draft
    const retrieved = await getDraftById(draft.draftId, userA);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.draftId).toBe(draft.draftId);

    // User B is forbidden from accessing User A's draft
    await expect(getDraftById(draft.draftId, userB)).rejects.toThrow("FORBIDDEN");
  });

  it("spins for an eligible historical squad and records round spin state", async () => {
    const draft = await createNewDraft(userA);
    const spinResult = await spinDraftOnServer(draft.draftId, userA);

    expect(spinResult.teamSeasonId).toBeDefined();
    expect(spinResult.squad.length).toBeGreaterThan(0);
    expect(spinResult.team).toBeDefined();
    expect(spinResult.season).toBeGreaterThan(2000);

    // Verification: Draft now has active teamSeasonId set
    const updated = await getDraftById(draft.draftId, userA);
    expect(updated?.currentTeamSeasonId).toBe(spinResult.teamSeasonId);
    expect(updated?.usedTeamSeasonIds).toContain(spinResult.teamSeasonId);
  });

  it("prevents selecting a player not in the actively spun squad", async () => {
    const draft = await createNewDraft(userA);
    const spinResult = await spinDraftOnServer(draft.draftId, userA);

    // Attempt to pick a nonexistent player
    await expect(
      pickPlayerOnServer(
        draft.draftId,
        userA,
        "fake-player-9999",
        spinResult.teamSeasonId,
        1
      )
    ).rejects.toThrow("Player does not exist in the active historical squad");
  });

  it("prevents selecting a player with mismatched teamSeasonId", async () => {
    const draft = await createNewDraft(userA);
    const spinResult = await spinDraftOnServer(draft.draftId, userA);
    const validPlayer = spinResult.squad[0];

    // Attempt to pass wrong teamSeasonId
    await expect(
      pickPlayerOnServer(
        draft.draftId,
        userA,
        validPlayer.playerId,
        "wrong-team-season-id",
        1
      )
    ).rejects.toThrow("Selected player does not belong to the actively spun team-season");
  });

  it("prevents concurrency / round mismatch", async () => {
    const draft = await createNewDraft(userA);
    const spinResult = await spinDraftOnServer(draft.draftId, userA);
    const validPlayer = spinResult.squad[0];

    // Submit with wrong round number (e.g. client sending round 2 when draft is at round 1)
    await expect(
      pickPlayerOnServer(
        draft.draftId,
        userA,
        validPlayer.playerId,
        spinResult.teamSeasonId,
        2
      )
    ).rejects.toThrow("Round mismatch");
  });

  it("records a valid pick and advances round", async () => {
    const draft = await createNewDraft(userA);
    const spinResult = await spinDraftOnServer(draft.draftId, userA);
    const playerToPick = spinResult.squad[0];

    const updated = await pickPlayerOnServer(
      draft.draftId,
      userA,
      playerToPick.playerId,
      spinResult.teamSeasonId,
      1
    );

    expect(updated.picks).toHaveLength(1);
    expect(updated.picks[0].player.name).toBe(playerToPick.name);
    expect(updated.round).toBe(2);
    expect(updated.currentTeamSeasonId).toBeNull();
    expect(updated.budgetUsed).toBe(playerToPick.price);
  });

  it("prevents selecting the same player twice in a draft", async () => {
    const draft = await createNewDraft(userA);

    // Pick round 1
    const spin1 = await spinDraftOnServer(draft.draftId, userA);
    const player = spin1.squad[0];
    await pickPlayerOnServer(draft.draftId, userA, player.playerId, spin1.teamSeasonId, 1);

    // Try to pick the same player in round 2 (simulate team with duplicate or re-pick)
    const spin2 = await spinDraftOnServer(draft.draftId, userA);
    // If spin2 has the player, or if we force pick:
    await expect(
      pickPlayerOnServer(draft.draftId, userA, player.playerId, spin2.teamSeasonId, 2)
    ).rejects.toThrow();
  });

  it("validates Zod request schemas", () => {
    // Valid create draft
    expect(CreateDraftSchema.safeParse({ budgetEnabled: true }).success).toBe(true);

    // Invalid budget
    expect(CreateDraftSchema.safeParse({ startingBudget: 10 }).success).toBe(false);

    // Invalid pick input
    expect(
      PickPlayerSchema.safeParse({
        draftId: "",
        teamSeasonId: "csk-2011",
        playerId: "dhoni",
        round: 1,
      }).success
    ).toBe(false);
  });

  it("supports draft deletion / abandonment with ownership check", async () => {
    const draft = await createNewDraft(userA);

    // User B cannot delete User A's draft
    const deletedByB = await deleteDraftOnServer(draft.draftId, userB);
    expect(deletedByB).toBe(false);

    // User A can delete their draft
    const deletedByA = await deleteDraftOnServer(draft.draftId, userA);
    expect(deletedByA).toBe(true);
  });
});
