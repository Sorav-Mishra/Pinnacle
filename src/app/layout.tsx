import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavBar from "./components/navbar";
import SessionGuard from "./components/SessionGuard";
import SessionWrapper from "./components/SessionWrapper";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSC PYQ Practice App - Free Govt Exam Preparation | Pinnacle Online",
  description:
    "Prepare for SSC and central govt exams with Pinnacle Online. Practice last 5 years' SSC PYQs for free. Boost your accuracy, speed, and confidence with this all-in-one study tool.",
  keywords: [
    "SSC PYQ",
    "SSC CGL PYQ",
    "SSC CHSL PYQ",
    "SSC MTS PYQ",
    "SSC CPO PYQ",
    "SSC JE previous year questions",
    "free SSC practice app",
    "government exam app",
    "SSC CGL free preparation",
    "central govt exams",
    "free SSC test series",
    "SSC online practice",
    "SSC question bank",
    "pinnacle SSC",
    "SSC study app",
    "SSC practice papers",
    "SSC mock tests",
    "SSC exam questions",
    "PYQ SSC app",
    "SSC test prep",
    "government job preparation app",
    "free exam prep India",
    "SSC Hindi questions",
    "SSC English questions",
    "SSC maths practice",
    "SSC reasoning questions",
    "SSC general awareness",
    "SSC all subjects",
    "SSC online study platform",
  ],
  robots: "index, follow",
  metadataBase: new URL("https://pinnacleonline.vercel.app"),
  openGraph: {
    title: "Free SSC PYQ Practice App | Pinnacle Online",
    description:
      "Practice SSC previous year questions for free. Covers SSC CGL, CHSL, MTS, and more. Trusted by aspirants for central govt exam preparation.",
    url: "https://pinnacleonline.vercel.app",
    siteName: "Pinnacle Online",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>PinnacleOnline</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white`}
        suppressHydrationWarning
      >
        <SessionWrapper>
          <SessionGuard>
            <NavBar />
            {children}
          </SessionGuard>
        </SessionWrapper>
      </body>
    </html>
  );
}
