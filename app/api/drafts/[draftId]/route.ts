import { NextResponse } from "next/server";
import { getServerUserContext } from "@/lib/server/auth-helper";
import { getDraftById, deleteDraftOnServer } from "@/lib/server/draft-engine";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const { userId } = await getServerUserContext();

    const draft = await getDraftById(draftId, userId);
    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Draft not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, draft });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const { userId } = await getServerUserContext();

    const deleted = await deleteDraftOnServer(draftId, userId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Draft not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Draft deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
