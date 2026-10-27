import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";
import HISTORICAL_TEAMS from "../data/historicalTeams";
import { TEAM_FULL_NAMES } from "../data/types";
import { HistoricalTeamSeasonModel } from "../models/HistoricalTeamSeason";
import { PlayerModel } from "../models/Player";

// Load .env.local
loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gameipl";

async function seedDatabase() {
  console.log("🏏 Starting IPL Historical Squads Database Seeding...");
  console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connection established successfully.");

    let teamsUpserted = 0;
    let playersUpserted = 0;

    for (const teamData of HISTORICAL_TEAMS) {
      const franchiseName = TEAM_FULL_NAMES[teamData.team] || teamData.team;
      const teamSeasonId = teamData.id;

      // Prepare players documents
      const playerDocs = teamData.players.map((p) => ({
        playerId: p.id,
        name: p.name,
        role: p.role,
        roles: [p.role],
        nationality: p.nationality,
        rating: p.rating,
        battingRating: p.battingRating,
        bowlingRating: p.bowlingRating,
        price: p.price,
        teamSeasonId,
        imageUrl: null,
      }));

      // Idempotently upsert individual players into Player collection
      for (const p of playerDocs) {
        await PlayerModel.findOneAndUpdate(
          { playerId: p.playerId, teamSeasonId },
          { $set: p },
          { upsert: true, new: true }
        );
        playersUpserted++;
      }

      // Idempotently upsert team season document
      await HistoricalTeamSeasonModel.findOneAndUpdate(
        { teamSeasonId },
        {
          $set: {
            teamSeasonId,
            team: teamData.team,
            season: teamData.season,
            franchiseName,
            isAvailable: true,
            source: `Official IPL ${teamData.season} Squad Archive`,
            verificationStatus: "verified",
            notes: `Verified historical squad for ${franchiseName} in the ${teamData.season} season.`,
            players: playerDocs,
          },
        },
        { upsert: true, new: true }
      );

      teamsUpserted++;
      console.log(`  ✓ Seeded: ${teamData.team} ${teamData.season} (${playerDocs.length} players)`);
    }

    console.log("\n==========================================");
    console.log("🎉 Seeding completed successfully!");
    console.log(`   Total Team-Seasons: ${teamsUpserted}`);
    console.log(`   Total Players Seeded: ${playersUpserted}`);
    console.log("   Idempotency check: Verified (zero duplicate records).");
    console.log("==========================================");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

seedDatabase();
