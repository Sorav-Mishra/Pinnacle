// src/app/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";

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
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        const client = await clientPromise;
        const db = client.db("test");

        const email = user?.email || session?.user?.email || token.email;

        if (trigger === "update" && session?.user) {
          token.phone = session.user.phone || "";
          token.age = session.user.age ?? null;
          token.gender = session.user.gender || "";
          token.dob = session.user.dob || "";
          return token;
        }

        if (email) {
          const dbUser = await db.collection("users").findOne({ email });
          if (dbUser) {
            token.id = dbUser._id?.toString();
            token.email = dbUser.email;
            token.phone = dbUser.phone || "";
            token.age = dbUser.age ?? null;
            token.gender = dbUser.gender || "";
            token.dob = dbUser.dob || "";
            token.name = dbUser.name || token.name;
            token.picture = dbUser.image || token.picture;
          }
        }

        return token;
      } catch {
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

// Module augmentation (✅ place here too if you want type safety globally)
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
