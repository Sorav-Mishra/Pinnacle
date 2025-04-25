// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// //import ThemeToggle from "./ThemeToggle"; // 👈 Import the theme toggle button

// export default function NavBar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();

//   const profile = () => {
//     router.push("/profile");
//   };

//   return (
//     <nav className="bg-blue-700 text-white p-4 fixed top-0 w-full z-50 shadow-lg">
//       {/* Desktop Navigation */}
//       <div className="hidden md:flex items-center justify-between px-6">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-2xl font-extrabold tracking-wide uppercase text-white font-[Montserrat]"
//         >
//           Pinnacle
//         </Link>

//         {/* Centered Links */}
//         <div className="flex gap-8 text-lg font-medium">
//           <Link
//             href="/ssc-cgl-pyq?type=english"
//             className="hover:text-gray-200 transition"
//           >
//             English
//           </Link>
//           <Link
//             href="/ssc-cgl-pyq?type=gk"
//             className="hover:text-gray-200 transition"
//           >
//             GK
//           </Link>
//         </div>

//         {/* Profile Image & Theme Toggle */}
//         <div className="flex items-center gap-4">
//           {/* <ThemeToggle /> */}
//           <button onClick={profile} type="button" title="Go to profile">
//             <Image
//               src="/images/iiii.jpg"
//               alt="Profile"
//               width={32}
//               height={32}
//               className="rounded-full border-2 border-white"
//             />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <div className="md:hidden flex items-center justify-between w-full">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           type="button"
//           className="text-xl font-bold"
//         >
//           {isOpen ? "✖" : "☰"}
//         </button>

//         <Link
//           href="/"
//           className="text-2xl font-extrabold tracking-wide uppercase text-white font-[Montserrat]"
//         >
//           Pinnacle
//         </Link>

//         <button onClick={profile} type="button" title="Go to profile">
//           <Image
//             src="/images/iiii.jpg"
//             alt="Profile"
//             width={32}
//             height={32}
//             className="rounded-full border-2 border-white"
//           />
//         </button>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden absolute top-full left-0 w-full bg-blue-800 text-white flex flex-col items-center gap-5 p-5 shadow-md">
//           <Link
//             href="/ssc-cgl-pyq?type=english"
//             onClick={() => setIsOpen(false)}
//             className="hover:text-gray-300 text-lg font-medium transition"
//           >
//             English
//           </Link>
//           <Link
//             href="/ssc-cgl-pyq?type=gk"
//             onClick={() => setIsOpen(false)}
//             className="hover:text-gray-300 text-lg font-medium transition"
//           >
//             GK
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status

  const profile = () => {
    router.push("/profile");
  };

  // Determine the profile image source based on auth status
  const profileImageSrc = session?.user?.image || "/images/default-profile.jpg";

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
            <Image
              src={profileImageSrc}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-white"
              priority
            />
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
          <Image
            src={profileImageSrc}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full border-2 border-white"
            priority
          />
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
