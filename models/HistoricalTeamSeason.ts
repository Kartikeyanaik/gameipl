import mongoose, { Schema, Document, Model } from "mongoose";
import type { TeamCode } from "@/data/types";
import { PlayerSchema, type IPlayerDocument } from "./Player";

export type VerificationStatus = "verified" | "curated" | "pending";

export interface IHistoricalTeamSeason extends Document {
  teamSeasonId: string; // e.g. "csk-2011"
  team: TeamCode;
  season: number;
  franchiseName: string;
  isAvailable: boolean;
  source: string;
  verificationStatus: VerificationStatus;
  notes?: string;
  players: IPlayerDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const HistoricalTeamSeasonSchema = new Schema<IHistoricalTeamSeason>(
  {
    teamSeasonId: { type: String, required: true, unique: true, index: true },
    team: { type: String, required: true, index: true },
    season: { type: Number, required: true, index: true },
    franchiseName: { type: String, required: true },
    isAvailable: { type: Boolean, default: true, index: true },
    source: { type: String, required: true },
    verificationStatus: {
      type: String,
      required: true,
      enum: ["verified", "curated", "pending"],
      default: "verified",
    },
    notes: { type: String },
    players: [PlayerSchema],
  },
  {
    timestamps: true,
  }
);

HistoricalTeamSeasonSchema.index({ team: 1, season: 1 }, { unique: true });

export const HistoricalTeamSeasonModel: Model<IHistoricalTeamSeason> =
  mongoose.models.HistoricalTeamSeason ||
  mongoose.model<IHistoricalTeamSeason>(
    "HistoricalTeamSeason",
    HistoricalTeamSeasonSchema
  );
