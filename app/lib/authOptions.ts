import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // ✅ Forces Google to ask user to choose account
        },
      },
    }),
  ],

  session: {
    strategy: "jwt", // ✅ Uses JWT-based session
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // ✅ Add user's email to token on initial sign-in
      if (account && profile?.email) {
        token.email = profile.email;
      }
      return token;
    },

    async session({ session, token }) {
      // ✅ Safely assign email to session
      if (session.user && token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
};
