import { db } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, type DefaultSession } from "next-auth";

import { getAccountByUserId } from "@/data/account";
import { getUserById } from "@/data/user";
import authConfig from "@/server/auth.config";
import { UserRole } from "@prisma/client";

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await getUserById(user?.id || "");

      return !!existingUser;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
  },
  ...authConfig,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth(authOptions);
