import { NextResponse } from "next/server";
import { getServerUserContext } from "@/lib/server/auth-helper";
import { pickPlayerOnServer } from "@/lib/server/draft-engine";
import { PickPlayerSchema } from "@/lib/server/validations";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const { userId } = await getServerUserContext();
    const body = await req.json();

    const validation = PickPlayerSchema.safeParse({ ...body, draftId });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { playerId, teamSeasonId, round } = validation.data;
    const updatedDraft = await pickPlayerOnServer(
      draftId,
      userId,
      playerId,
      teamSeasonId,
      round
    );

    return NextResponse.json({
      success: true,
      draft: updatedDraft,
    });
  } catch (error: unknown) {
    console.error("POST /api/drafts/[draftId]/pick error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("FORBIDDEN") ? 403 : message.includes("not found") ? 404 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
