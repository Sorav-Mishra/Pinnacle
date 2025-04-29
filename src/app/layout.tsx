import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavBar from "./components/navbar";
import SessionGuard from "./components/SessionGuard";
import SessionWrapper from "./components/SessionWrapper";
import Script from "next/script";
//import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSC PYQs Practice App - Free SSC Preparation | Pinnacle Online",
  description:
    "Prepare for SSC and central govt exams with Pinnacle Online. Practice last 5 years' SSC PYQs for free. Boost your accuracy, speed, and confidence with this all-in-one study tool.",
  keywords: [
    "SSC PYQ",
    "SSC previous year questions",
    "SSC CGL PYQ",
    "SSC CHSL PYQ",
    "SSC MTS PYQ",
    "SSC CPO PYQ",
    "SSC JE previous year questions",
    "SSC GD PYQ",
    "SSC Stenographer PYQ",
    "free SSC practice app",
    "SSC exam preparation",
    "SSC online study",
    "SSC test series free",
    "SSC mock test app",
    "central government job exam",
    "SSC CGL free preparation",
    "SSC Hindi English questions",
    "SSC maths practice",
    "SSC reasoning preparation",
    "SSC general awareness questions",
    "Pinnacle SSC app",
    "government exam app",
    "PYQ SSC app",
    "SSC question bank PDF",
    "SSC all subjects PYQ",
    "SSC online practice test",
    "best SSC practice app",
    "SSC test prep India",
    "govt job preparation",
    "SSC free study platform",
  ],
  robots: "index, follow",
  metadataBase: new URL("https://pinnacleonline.vercel.app"),
  openGraph: {
    title: "Free SSC PYQ Practice App | Pinnacle Online",
    description:
      "Practice SSC previous year questions for free. Covers SSC CGL, CHSL, MTS, GD, CPO, and more. Trusted by aspirants for central govt exam preparation.",
    url: "https://pinnacleonline.vercel.app",
    siteName: "Pinnacle Online",
    type: "website",
    images: [
      {
        url: "https://pinnacleonline.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SSC PYQ Practice App - Pinnacle Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Practice SSC PYQs Free | Pinnacle Online",
    description:
      "Free SSC exam practice app with PYQs from CGL, CHSL, MTS & more. Trusted by lakhs of students.",
    images: ["https://pinnacleonline.vercel.app/og-image.png"],
    site: "@pinnacle0nline", // ← your X (Twitter) handle
  },
  alternates: {
    canonical: "https://pinnacleonline.vercel.app",
  },
  other: {
    "linkedin:profile": "https://www.linkedin.com/in/abhishek-mishra-b18531339",
    "x:profile": "https://x.com/pinnacle0nline",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Inject the Organization Structured Data */}
        <Script
          type="application/ld+json"
          id="organization-schema"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pinnacle Online",
            url: "https://pinnacleonline.vercel.app",
            logo: "https://pinnacleonline.vercel.app/logo.png",
            sameAs: [
              "https://www.linkedin.com/in/abhishek-mishra-b18531339",
              "https://x.com/pinnacle0nline",
            ],
          })}
        </Script>
      </head>

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
