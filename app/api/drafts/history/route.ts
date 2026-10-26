import { NextResponse } from "next/server";
import { getServerUserContext } from "@/lib/server/auth-helper";
import { getUserCompletedDrafts } from "@/lib/server/draft-engine";

export async function GET(_req: Request) {
  try {
    const { userId, isAuthenticated } = await getServerUserContext();
    const history = await getUserCompletedDrafts(userId);

    return NextResponse.json({
      success: true,
      isAuthenticated,
      history,
    });
  } catch (error: unknown) {
    console.error("GET /api/drafts/history error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
