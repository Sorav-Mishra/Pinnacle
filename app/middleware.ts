// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for these paths
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/complete-profile" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("🛡️ MIDDLEWARE CHECK:", {
      pathname,
      hasToken: !!token,
      email: token?.email,
      phone: token?.phone,
      age: token?.age,
      gender: token?.gender,
      dob: token?.dob,
    });

    // If no token, redirect to sign in
    if (!token) {
      console.log("🔒 No token found, redirecting to sign in");
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    // Check if profile is complete
    const isProfileComplete =
      token.phone &&
      token.phone.trim() !== "" &&
      token.gender &&
      token.gender.trim() !== "" &&
      token.dob &&
      token.dob.trim() !== "" &&
      typeof token.age === "number" &&
      !isNaN(token.age) &&
      token.age > 0;

    // console.log("📋 Profile completion check:", {
    //   isProfileComplete,
    //   phone: token.phone,
    //   gender: token.gender,
    //   dob: token.dob,
    //   age: token.age,
    //   phoneValid: token.phone && token.phone.trim() !== "",
    //   genderValid: token.gender && token.gender.trim() !== "",
    //   dobValid: token.dob && token.dob.trim() !== "",
    //   ageValid:
    //     typeof token.age === "number" && !isNaN(token.age) && token.age > 0,
    // });

    // If profile is not complete and not already on complete-profile page
    if (!isProfileComplete && pathname !== "/complete-profile") {
      // console.log("⚠️ Profile incomplete, redirecting to complete profile");
      const url = req.nextUrl.clone();
      url.pathname = "/complete-profile";
      return NextResponse.redirect(url);
    }

    // If profile is complete but trying to access complete-profile page
    if (isProfileComplete && pathname === "/complete-profile") {
      console.log("✅ Profile complete, redirecting to home");
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    // console.error("❌ Middleware error:", error);
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     * - static (static files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|admin|static).*)",
  ],
};
