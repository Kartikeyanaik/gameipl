import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserPreferences {
  soundEnabled?: boolean;
  favoriteTeam?: string;
  defaultBudgetMode?: boolean;
}

export interface IUser extends Document {
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String },
    preferences: {
      soundEnabled: { type: Boolean, default: true },
      favoriteTeam: { type: String, default: null },
      defaultBudgetMode: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
