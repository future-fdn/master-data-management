import { db } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, type DefaultSession } from "next-auth";

import authConfig from "@/server/auth.config";

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth(authOptions);
