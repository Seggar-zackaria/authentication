import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow oAuth without email verification
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      console.log("SignIn callback:", { user, account});
      // Prevent sign in if user doesn't exist or email isn't verified
      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith(DEFAULT_LOGIN_REDIRECT);
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth");

      // If user is on auth page and is logged in, redirect to dashboard
      if (isOnAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return true;
      }

      // If user is trying to access dashboard but not logged in
      if (isOnDashboard) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/auth/login", nextUrl));
        }
        return true;
      }

      return true;
    },
    
    async session({ session, token }) {
      if (token.sub && session.user ) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
});
