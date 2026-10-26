import { z } from "zod";

export const CreateDraftSchema = z.object({
  budgetEnabled: z.boolean().default(true),
  startingBudget: z.number().min(50).max(200).default(100),
  totalRounds: z.number().int().min(5).max(15).default(11),
});

export const SpinDraftSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
});

export const PickPlayerSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
  teamSeasonId: z.string().min(1, "Team Season ID is required"),
  playerId: z.string().min(1, "Player ID is required"),
  round: z.number().int().min(1).max(15),
});

export const DraftIdParamSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
});

export type CreateDraftInput = z.infer<typeof CreateDraftSchema>;
export type SpinDraftInput = z.infer<typeof SpinDraftSchema>;
export type PickPlayerInput = z.infer<typeof PickPlayerSchema>;
