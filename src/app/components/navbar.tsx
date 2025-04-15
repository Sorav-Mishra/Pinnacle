"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const profile = () => {
    router.push("/profile");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 fixed top-0 w-full z-50 flex items-center justify-between px-6 shadow-lg">
      {/* Desktop Navigation */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 text-lg font-medium">
        <Link
          href="/index?type=english"
          className="hover:text-gray-200 transition"
        >
          English
        </Link>
        <Link href="/index?type=gk" className="hover:text-gray-200 transition">
          GK
        </Link>
        <Link href="#" className="hover:text-gray-200 transition">
          Reasoning
        </Link>
        <Link href="#" className="hover:text-gray-200 transition">
          Math
        </Link>
      </div>

      {/* Profile Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={profile}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition hidden md:block"
        >
          Profile
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-lg font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-800 text-white flex flex-col items-center gap-5 p-5 shadow-md md:hidden">
          <Link
            href="/index?type=english"
            className="hover:text-gray-300 text-lg font-medium transition"
            onClick={() => setIsOpen(false)}
          >
            English
          </Link>
          <Link
            href="/index?type=gk"
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
