import { auth } from "@/auth";
import { headers } from "next/headers";

export interface ServerUserContext {
  userId: string;
  isAuthenticated: boolean;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

/**
 * Retrieve user context from Auth.js session or request headers.
 * Provides guest user fallback when unauthenticated so local testing works.
 */
export async function getServerUserContext(): Promise<ServerUserContext> {
  try {
    const session = await auth();
    if (session?.user && session.user.id) {
      return {
        userId: session.user.id,
        isAuthenticated: true,
        user: session.user,
      };
    }
  } catch (err) {
    // Auth.js may throw if AUTH_SECRET or cookies are unconfigured
    console.warn("Auth session check warning:", err);
  }

  let guestId = "guest_default_user";
  try {
    const headerList = await headers();
    const guestHeader = headerList.get("x-guest-user-id");
    if (guestHeader && guestHeader.trim().length > 0) {
      guestId = guestHeader;
    }
  } catch {
    // Expected during static build prerendering
  }

  return {
    userId: guestId,
    isAuthenticated: false,
    user: null,
  };
}
