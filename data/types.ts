// Core type definitions for IPL Draft game

export type Role = "WK" | "BAT" | "AR" | "BOWL";
export type Nationality = "IND" | "OVERSEAS";

export interface Player {
  id: string;
  name: string;
  role: Role;
  nationality: Nationality;
  rating: number;
  battingRating: number;
  bowlingRating: number;
  price: number; // in Crores
}

export interface HistoricalTeam {
  id: string;
  team: TeamCode;
  season: number;
  players: Player[];
}

export type TeamCode =
  | "CSK"
  | "MI"
  | "RCB"
  | "KKR"
  | "SRH"
  | "RR"
  | "DC"
  | "PBKS"
  | "GT"
  | "LSG"
  | "PWI"
  | "KTK"
  | "DD"
  | "GL"
  | "RPS";

export const TEAM_COLORS: Record<TeamCode, { primary: string; secondary: string; accent: string }> = {
  CSK: { primary: "#F5A623", secondary: "#003366", accent: "#FFD700" },
  MI: { primary: "#004BA0", secondary: "#FFFFFF", accent: "#5BC8F5" },
  RCB: { primary: "#EC1C24", secondary: "#000000", accent: "#C8A951" },
  KKR: { primary: "#3A225D", secondary: "#B3A123", accent: "#F2C500" },
  SRH: { primary: "#F7A721", secondary: "#E05D00", accent: "#FF6B00" },
  RR: { primary: "#254AA5", secondary: "#FF69B4", accent: "#F28500" },
  DC: { primary: "#0078BC", secondary: "#EF1C25", accent: "#D1AB3E" },
  PBKS: { primary: "#ED1C24", secondary: "#A7A9AC", accent: "#FFD700" },
  GT: { primary: "#1C2B59", secondary: "#C8A84B", accent: "#0B4973" },
  LSG: { primary: "#004C93", secondary: "#A8CBF0", accent: "#B3D4F5" },
  PWI: { primary: "#9D2235", secondary: "#F0A500", accent: "#F7B733" },
  KTK: { primary: "#C00B0B", secondary: "#FFD700", accent: "#FFD700" },
  DD: { primary: "#17479E", secondary: "#EF1C25", accent: "#D1AB3E" },
  GL: { primary: "#6B2D8B", secondary: "#D1A64D", accent: "#F7C65A" },
  RPS: { primary: "#1C3F94", secondary: "#E41E26", accent: "#F5A800" },
};

export const TEAM_FULL_NAMES: Record<TeamCode, string> = {
  CSK: "Chennai Super Kings",
  MI: "Mumbai Indians",
  RCB: "Royal Challengers Bangalore",
  KKR: "Kolkata Knight Riders",
  SRH: "Sunrisers Hyderabad",
  RR: "Rajasthan Royals",
  DC: "Delhi Capitals",
  PBKS: "Punjab Kings",
  GT: "Gujarat Titans",
  LSG: "Lucknow Super Giants",
  PWI: "Pune Warriors India",
  KTK: "Kochi Tuskers Kerala",
  DD: "Delhi Daredevils",
  GL: "Gujarat Lions",
  RPS: "Rising Pune Supergiant",
};

// Game state types
export interface DraftPick {
  round: number;
  teamId: string;
  team: TeamCode;
  season: number;
  player: Player;
}

export interface TeamRequirements {
  minWK: number;
  minBAT: number;
  minAR: number;
  minBOWL: number;
  maxOverseas: number;
  totalPlayers: number;
}

export const DEFAULT_REQUIREMENTS: TeamRequirements = {
  minWK: 1,
  minBAT: 3,
  minAR: 1,
  minBOWL: 3,
  maxOverseas: 4,
  totalPlayers: 11,
};

export interface TeamScore {
  batting: number;
  bowling: number;
  allRound: number;
  balance: number;
  overseas: number;
  overall: number;
}

export type GamePhase = "home" | "spinning" | "picking" | "complete";

export interface GameConfig {
  budgetEnabled: boolean;
  startingBudget: number;
  totalRounds: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  budgetEnabled: true,
  startingBudget: 100,
  totalRounds: 11,
};

// Wheel event types (for future use)
export type WheelEventType = "normal" | "reroll" | "wildcard" | "discount" | "double_pick" | "chaos";
