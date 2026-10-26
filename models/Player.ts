import mongoose, { Schema, Document, Model } from "mongoose";
import type { Role, Nationality } from "@/data/types";

export interface IPlayerDocument extends Document {
  playerId: string;
  name: string;
  role: Role;
  roles: Role[];
  nationality: Nationality;
  rating: number;
  battingRating: number;
  bowlingRating: number;
  price: number;
  teamSeasonId: string;
  imageUrl?: string | null;
  statistics?: {
    runs?: number;
    wickets?: number;
    strikeRate?: number;
    economy?: number;
    matches?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const PlayerSchema = new Schema<IPlayerDocument>(
  {
    playerId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ["WK", "BAT", "AR", "BOWL"] },
    roles: [{ type: String, enum: ["WK", "BAT", "AR", "BOWL"] }],
    nationality: { type: String, required: true, enum: ["IND", "OVERSEAS"] },
    rating: { type: Number, required: true, min: 50, max: 100 },
    battingRating: { type: Number, required: true, min: 0, max: 100 },
    bowlingRating: { type: Number, required: true, min: 0, max: 100 },
    price: { type: Number, required: true, min: 1 },
    teamSeasonId: { type: String, required: true, index: true },
    imageUrl: { type: String, default: null },
    statistics: {
      runs: { type: Number },
      wickets: { type: Number },
      strikeRate: { type: Number },
      economy: { type: Number },
      matches: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

PlayerSchema.index({ playerId: 1, teamSeasonId: 1 }, { unique: true });

export const PlayerModel: Model<IPlayerDocument> =
  mongoose.models.Player || mongoose.model<IPlayerDocument>("Player", PlayerSchema);
