// // In a types/next-auth.d.ts file in your project
// import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// // Then in your route.js file
// //import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "../../../lib/mongodb";

// const authHandler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       //redirectUri: process.env.NEXTAUTH_URL as string,
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   secret: process.env.NEXTAUTH_URL,
//   session: {
//     strategy: "database",
//   },
//   callbacks: {
//     async session({ session, user }) {
//       if (session.user && user) {
//         session.user.image = user.image;
//         session.user.id = user.id; // Now TypeScript knows about this property
//       }
//       return session;
//     },
//   },
// });

// export { authHandler as GET, authHandler as POST };

// route.js file
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET, // This should be NEXTAUTH_SECRET, not NEXTAUTH_URL
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.image = user.image;
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Add these cookie options to persist sessions
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      },
    },
  },
});

export { authHandler as GET, authHandler as POST };
