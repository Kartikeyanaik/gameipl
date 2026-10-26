import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";

const hasGoogleAuth = Boolean(
  (process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID) &&
    (process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET)
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: clientPromise ? MongoDBAdapter(clientPromise) : undefined,
  providers: hasGoogleAuth
    ? [
        Google({
          clientId:
            process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
          clientSecret:
            process.env.AUTH_GOOGLE_SECRET ||
            process.env.GOOGLE_CLIENT_SECRET ||
            "",
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : [],
  session: {
    // If MongoDB adapter is available, use database sessions; otherwise JWT
    strategy: clientPromise ? "database" : "jwt",
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session?.user) {
        if (user) {
          session.user.id = user.id;
        } else if (token?.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.AUTH_SECRET || "ipl-draft-fallback-secret-development-key-32chars",
  trustHost: true,
});
