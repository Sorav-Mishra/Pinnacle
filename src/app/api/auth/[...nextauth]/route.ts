// types/next-auth.d.ts
//import NextAuth from "next-auth";

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
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import { NextAuthOptions } from "next-auth";

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

        // When update() is triggered on client
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

            // console.log("🔄 JWT UPDATED TOKEN FROM DB:", {
            //   id: token.id,
            //   email: token.email,
            //   phone: token.phone,
            //   age: token.age,
            //   gender: token.gender,
            //   dob: token.dob,
            // });
          }
        }

        return token;
      } catch {
        // console.error("❌ JWT callback error:", error);
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
