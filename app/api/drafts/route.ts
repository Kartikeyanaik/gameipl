import { NextResponse } from "next/server";
import { getServerUserContext } from "@/lib/server/auth-helper";
import { createNewDraft, getActiveDraftForUser } from "@/lib/server/draft-engine";
import { CreateDraftSchema } from "@/lib/server/validations";

export async function GET(_req: Request) {
  try {
    const { userId, isAuthenticated, user } = await getServerUserContext();
    const activeDraft = await getActiveDraftForUser(userId);

    return NextResponse.json({
      success: true,
      isAuthenticated,
      user,
      draft: activeDraft,
    });
  } catch (error: unknown) {
    console.error("GET /api/drafts error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await getServerUserContext();
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty
    }

    const validation = CreateDraftSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const draft = await createNewDraft(userId, validation.data);

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error: unknown) {
    console.error("POST /api/drafts error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
