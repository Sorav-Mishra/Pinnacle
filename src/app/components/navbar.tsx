"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import staticlogo from "../../../public/images/iiii.jpg";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileImageError, setProfileImageError] = useState(false);

  // Reset image error state when session changes
  useEffect(() => {
    setProfileImageError(false);
  }, [session]);

  const profile = () => {
    router.push("/profile");
  };

  // Handle profile image with proper fallback
  const getProfileImage = () => {
    if (profileImageError || !session?.user?.image) {
      return staticlogo;
    }

    // Return the user's profile image
    return session.user.image;
  };

  return (
    <nav className="bg-blue-700 text-white p-4 fixed top-0 w-full z-50 shadow-lg">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide uppercase text-white font-[Montserrat]"
        >
          Pinnacle
        </Link>

        {/* Centered Links */}
        <div className="flex gap-8 text-lg font-medium">
          <Link
            href="/ssc-cgl-pyq?type=english"
            className="hover:text-gray-200 transition"
          >
            English
          </Link>
          <Link
            href="/ssc-cgl-pyq?type=gk"
            className="hover:text-gray-200 transition"
          >
            GK
          </Link>
        </div>

        {/* Profile Image & Theme Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={profile}
            type="button"
            title={session ? "View your profile" : "Sign in"}
            className="relative"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={getProfileImage()}
                alt="Profile"
                fill
                className="object-cover"
                priority
                onError={() => {
                  console.log("Profile image failed to load, using fallback");
                  setProfileImageError(true);
                }}
              />
            </div>

            {status === "loading" && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-300 rounded-full"></span>
            )}
            {status === "authenticated" && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="text-xl font-bold"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? "✖" : "☰"}
        </button>

        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide uppercase text-white font-[Montserrat]"
        >
          Pinnacle
        </Link>

        {/* Google profile image for mobile */}
        <button
          onClick={profile}
          type="button"
          title={session ? "View your profile" : "Sign in"}
          className="relative"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <Image
              src={getProfileImage()}
              alt="Profile"
              fill
              className="object-cover"
              priority
              onError={() => {
                console.log("Profile image failed to load, using fallback");
                setProfileImageError(true);
              }}
            />
          </div>

          {status === "authenticated" && (
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-800 text-white flex flex-col items-center gap-5 p-5 shadow-md">
          <Link
            href="/ssc-cgl-pyq?type=english"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 text-lg font-medium transition"
          >
            English
          </Link>
          <Link
            href="/ssc-cgl-pyq?type=gk"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 text-lg font-medium transition"
          >
            GK
          </Link>
        </div>
      )}
    </nav>
  );
}
