import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        console.log(credentials);
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
