import { NextResponse } from "next/server";
import { getServerUserContext } from "@/lib/server/auth-helper";
import { spinDraftOnServer } from "@/lib/server/draft-engine";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const { userId } = await getServerUserContext();

    const result = await spinDraftOnServer(draftId, userId);

    return NextResponse.json({
      success: true,
      draft: result.draft,
      teamSeasonId: result.teamSeasonId,
      team: result.team,
      season: result.season,
      squad: result.squad,
    });
  } catch (error: unknown) {
    console.error("POST /api/drafts/[draftId]/spin error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("FORBIDDEN") ? 403 : message.includes("not found") ? 404 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
