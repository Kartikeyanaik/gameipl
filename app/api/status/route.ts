import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongoose";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  const googleConfigured = Boolean(
    (process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID) &&
      (process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET)
  );
  const authSecretConfigured = Boolean(process.env.AUTH_SECRET);

  return NextResponse.json({
    status: "ok",
    services: {
      mongodb: {
        configured: mongoConfigured,
        message: mongoConfigured
          ? "Connected / Ready"
          : "MONGODB_URI missing (running in memory/demo mode)",
      },
      googleOAuth: {
        configured: googleConfigured,
        message: googleConfigured
          ? "Google OAuth Credentials Configured"
          : "AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET missing",
      },
      authSecret: {
        configured: authSecretConfigured,
        message: authSecretConfigured
          ? "Configured"
          : "AUTH_SECRET missing (using dev fallback)",
      },
    },
    mode: mongoConfigured && googleConfigured ? "production_ready" : "development_demo",
  });
}
