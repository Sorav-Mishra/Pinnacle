import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./clientPromise";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error", // Redirect OAuth errors like "OAuthAccountNotLinked"
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        const client = await clientPromise;
        const db = client.db("pinnacle");
        const email = user?.email || session?.user?.email || token?.email;

        // If user info updated via session update
        if (trigger === "update" && session?.user) {
          token.phone = session.user.phone || "";
          token.age = session.user.age ?? null;
          token.gender = session.user.gender || "";
          token.dob = session.user.dob || "";
        }

        // Lookup DB for additional info
        if (email) {
          const dbUser = await db.collection("users").findOne({ email });
          if (dbUser) {
            token.id = dbUser._id?.toString();
            token.name = dbUser.name || token.name;
            token.email = dbUser.email;
            token.picture = dbUser.image || token.picture;
            token.phone = dbUser.phone || "";
            token.age = dbUser.age ?? null;
            token.gender = dbUser.gender || "";
            token.dob = dbUser.dob || "";
          }
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.age = token.age;
        session.user.gender = token.gender;
        session.user.dob = token.dob;
      }
      return session;
    },
  },
};

// types/next-auth.d.ts
//import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string;
      age?: number | null;
      gender?: string;
      dob?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string;
    age?: number | null;
    gender?: string;
    dob?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string;
    age?: number | null;
    gender?: string;
    dob?: string;
  }
}
