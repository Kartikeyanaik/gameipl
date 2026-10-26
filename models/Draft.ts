import mongoose, { Schema, Document, Model } from "mongoose";
import type { TeamCode, Role, Nationality } from "@/data/types";

export type DraftStatus = "in_progress" | "completed" | "abandoned";

export interface IDraftPick {
  round: number;
  teamSeasonId: string;
  team: TeamCode;
  season: number;
  player: {
    playerId: string;
    name: string;
    role: Role;
    roles?: Role[];
    nationality: Nationality;
    rating: number;
    battingRating: number;
    bowlingRating: number;
    price: number;
  };
  pickedAt: Date;
}

export interface IDraftHistoryEvent {
  round: number;
  teamSeasonId: string;
  team: TeamCode;
  season: number;
  action: "spin" | "pick";
  playerName?: string;
  rating?: number;
  timestamp: Date;
}

export interface IDraftRules {
  minWK: number;
  minBAT: number;
  minAR: number;
  minBOWL: number;
  maxOverseas: number;
  totalPlayers: number;
}

export interface IDraftScore {
  batting: number;
  bowling: number;
  allRound: number;
  balance: number;
  overseas: number;
  overall: number;
}

export interface IDraftVerdict {
  label: string;
  emoji: string;
  color: string;
}

export interface IDraft extends Document {
  draftId: string;
  userId: string; // auth user ID
  status: DraftStatus;
  round: number;
  maxRounds: number;
  currentTeamSeasonId: string | null;
  currentSquad: Array<{
    playerId: string;
    name: string;
    role: Role;
    nationality: Nationality;
    rating: number;
    battingRating: number;
    bowlingRating: number;
    price: number;
  }>;
  usedTeamSeasonIds: string[];
  picks: IDraftPick[];
  draftHistory: IDraftHistoryEvent[];
  config: {
    budgetEnabled: boolean;
    startingBudget: number;
    totalRounds: number;
  };
  rules: IDraftRules;
  budgetUsed: number;
  budgetRemaining: number;
  overseasCount: number;
  score?: IDraftScore | null;
  verdict?: IDraftVerdict | null;
  createdAt: Date;
  updatedAt: Date;
}

const DraftPickSchema = new Schema<IDraftPick>(
  {
    round: { type: Number, required: true },
    teamSeasonId: { type: String, required: true },
    team: { type: String, required: true },
    season: { type: Number, required: true },
    player: {
      playerId: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true, enum: ["WK", "BAT", "AR", "BOWL"] },
      roles: [{ type: String, enum: ["WK", "BAT", "AR", "BOWL"] }],
      nationality: { type: String, required: true, enum: ["IND", "OVERSEAS"] },
      rating: { type: Number, required: true },
      battingRating: { type: Number, required: true },
      bowlingRating: { type: Number, required: true },
      price: { type: Number, required: true },
    },
    pickedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DraftHistorySchema = new Schema<IDraftHistoryEvent>(
  {
    round: { type: Number, required: true },
    teamSeasonId: { type: String, required: true },
    team: { type: String, required: true },
    season: { type: Number, required: true },
    action: { type: String, required: true, enum: ["spin", "pick"] },
    playerName: { type: String },
    rating: { type: Number },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DraftSchema = new Schema<IDraft>(
  {
    draftId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
      index: true,
    },
    round: { type: Number, required: true, default: 1 },
    maxRounds: { type: Number, required: true, default: 11 },
    currentTeamSeasonId: { type: String, default: null },
    currentSquad: [
      {
        playerId: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
        nationality: { type: String, required: true },
        rating: { type: Number, required: true },
        battingRating: { type: Number, required: true },
        bowlingRating: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    usedTeamSeasonIds: [{ type: String }],
    picks: [DraftPickSchema],
    draftHistory: [DraftHistorySchema],
    config: {
      budgetEnabled: { type: Boolean, default: true },
      startingBudget: { type: Number, default: 100 },
      totalRounds: { type: Number, default: 11 },
    },
    rules: {
      minWK: { type: Number, default: 1 },
      minBAT: { type: Number, default: 3 },
      minAR: { type: Number, default: 1 },
      minBOWL: { type: Number, default: 3 },
      maxOverseas: { type: Number, default: 4 },
      totalPlayers: { type: Number, default: 11 },
    },
    budgetUsed: { type: Number, default: 0 },
    budgetRemaining: { type: Number, default: 100 },
    overseasCount: { type: Number, default: 0 },
    score: {
      batting: Number,
      bowling: Number,
      allRound: Number,
      balance: Number,
      overseas: Number,
      overall: Number,
    },
    verdict: {
      label: String,
      emoji: String,
      color: String,
    },
  },
  {
    timestamps: true,
  }
);

DraftSchema.index({ userId: 1, status: 1 });
DraftSchema.index({ userId: 1, updatedAt: -1 });

export const DraftModel: Model<IDraft> =
  mongoose.models.Draft || mongoose.model<IDraft>("Draft", DraftSchema);
