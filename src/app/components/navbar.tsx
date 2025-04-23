"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const profile = () => {
    router.push("/profile");
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
            href="/index2?type=english"
            className="hover:text-gray-200 transition"
          >
            English
          </Link>
          <Link
            href="/index2?type=gk"
            className="hover:text-gray-200 transition"
          >
            GK
          </Link>
          <Link href="#" className="hover:text-gray-200 transition">
            Reasoning
          </Link>
          <Link href="#" className="hover:text-gray-200 transition">
            Math
          </Link>
        </div>

        {/* Profile Image Icon */}
        <button
          onClick={profile}
          type="button"
          aria-label="Go to profile"
          title="Go to profile"
        >
          <Image
            src="/images/iiii.jpg" // Replace with your image path or external URL
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full border-2 border-white"
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between w-full">
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label="Toggle menu"
          className="text-xl font-bold"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Center Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide uppercase text-white font-[Montserrat]"
        >
          Pinnacle
        </Link>

        {/* Profile Icon */}
        <button
          onClick={profile}
          type="button"
          aria-label="Go to profile"
          title="Go to profile"
        >
          <Image
            src="/images/iiii.jpg"
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full border-2 border-white"
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-800 text-white flex flex-col items-center gap-5 p-5 shadow-md">
          <Link
            href="/index2?type=english"
            className="hover:text-gray-300 text-lg font-medium transition"
            onClick={() => setIsOpen(false)}
          >
            English
          </Link>
          <Link
            href="/index2?type=gk"
            className="hover:text-gray-300 text-lg font-medium transition"
            onClick={() => setIsOpen(false)}
          >
            GK
          </Link>
          <Link
            href="#"
            className="hover:text-gray-300 text-lg font-medium transition"
            onClick={() => setIsOpen(false)}
          >
            Reasoning
          </Link>
          <Link
            href="#"
            className="hover:text-gray-300 text-lg font-medium transition"
            onClick={() => setIsOpen(false)}
          >
            Math
          </Link>
        </div>
      )}
    </nav>
  );
}
