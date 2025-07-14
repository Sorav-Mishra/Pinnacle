import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for these paths
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/user/update-profile") || // ✅ Added this
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

    if (!token) {
      console.log("🔒 No token found, redirecting to sign in");
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    const isProfileComplete =
      token.phone?.trim() &&
      token.gender?.trim() &&
      token.dob?.trim() &&
      typeof token.age === "number" &&
      !isNaN(token.age) &&
      token.age > 0;

    if (!isProfileComplete && pathname !== "/complete-profile") {
      const url = req.nextUrl.clone();
      url.pathname = "/complete-profile";
      return NextResponse.redirect(url);
    }

    if (isProfileComplete && pathname === "/complete-profile") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
}

// ✅ Updated matcher to also exclude your update-profile API route
export const config = {
  matcher: [
    "/((?!api/auth|api/user/update-profile|_next/static|_next/image|favicon.ico|admin|static).*)",
  ],
};
