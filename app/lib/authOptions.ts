// lib/authOptions.ts - UPDATED VERSION
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./clientPromise";

// Dynamic base URL detection
const getBaseUrl = () => {
  // Production environment
  if (process.env.NODE_ENV === "production") {
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "https://pinnacleonline.vercel.app";
  }

  // Development environment
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error", // Redirect OAuth errors like "OAuthAccountNotLinked"
  },
  debug: process.env.NODE_ENV === "development", // Enable debug in development
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        const client = await clientPromise;
        const db = client.db();
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
            token.name = dbUser.fullName || dbUser.name || token.name; // Prefer fullName from form
            token.email = dbUser.email;
            token.picture = dbUser.image || token.picture;
            token.phone = dbUser.number || dbUser.phone || "";
            token.age = dbUser.age ?? null;
            token.gender = dbUser.gender || "";
            token.dob = dbUser.dob || "";
            token.city = dbUser.city || "";
            token.state = dbUser.state || "";
            token.formSubmitted = dbUser.formSubmitted || false;
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
        session.user.city = token.city;
        session.user.state = token.state;
        session.user.formSubmitted = token.formSubmitted;

        // Update name to use fullName if available
        if (token.name) {
          session.user.name = token.name;
        }
      }
      return session;
    },

    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const client = await clientPromise;
          const db = client.db();

          // Check if user already has form data
          const existingUser = await db.collection("users").findOne({
            email: user.email?.toLowerCase(),
          });

          if (existingUser && existingUser.formSubmitted) {
            // User submitted form before OAuth - merge Google data with existing form data
            console.log(
              "Merging Google OAuth data with existing form data for:",
              user.email
            );

            await db.collection("users").updateOne(
              { email: user.email?.toLowerCase() },
              {
                $set: {
                  name: existingUser.fullName || user.name, // Keep fullName as primary name
                  image: user.image,
                  emailVerified: new Date(),
                  // Keep all existing form data (fullName, number, age, gender, city, state)
                  updatedAt: new Date(),
                  oauthCompletedAt: new Date(),
                },
              }
            );
          } else if (existingUser) {
            // User exists but no form data - update with Google info
            await db.collection("users").updateOne(
              { email: user.email?.toLowerCase() },
              {
                $set: {
                  name: user.name,
                  image: user.image,
                  emailVerified: new Date(),
                  updatedAt: new Date(),
                  oauthCompletedAt: new Date(),
                },
              }
            );
          }
          // If no existing user, NextAuth adapter will create new user automatically

          console.log("Google sign-in successful for:", user.email);
        }
        return true;
      } catch (error) {
        console.error("Sign-in callback error:", error);
        return false;
      }
    },

    async redirect({ url }) {
      const actualBaseUrl = getBaseUrl();

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${actualBaseUrl}${url}`;

      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === actualBaseUrl) return url;
      } catch {
        // Invalid URL, return base URL
        return actualBaseUrl;
      }

      return actualBaseUrl;
    },
  },
};

// Updated types to include new fields
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
      city?: string;
      state?: string;
      formSubmitted?: boolean;
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
    city?: string;
    state?: string;
    formSubmitted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string;
    age?: number | null;
    gender?: string;
    dob?: string;
    city?: string;
    state?: string;
    formSubmitted?: boolean;
  }
}
