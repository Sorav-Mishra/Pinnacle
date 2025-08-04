"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  number?: string;
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session?.user]);

  const renderField = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <div className="flex flex-col mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-base font-medium text-white">{value}</span>
      </div>
    );
  };

  const displayName =
    userProfile?.fullName || session?.user?.name || "Guest User";

  const displayEmail =
    userProfile?.email || session?.user?.email || "No Email Provided";

  const avatarInitial =
    displayName?.charAt(0).toUpperCase() ||
    displayEmail?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1120] to-[#1F2937] text-white p-6 mt-14">
      <div className="max-w-4xl mx-auto bg-[#111827] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 gap-6">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-2 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg">
              {avatarInitial}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-1">
              {displayName}
            </h2>
            <p className="text-gray-300 text-sm">{displayEmail}</p>
            <p className="text-xs text-gray-500 mt-1">
              Last login: {new Date().toLocaleDateString()}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                href="/edit-profile"
                className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm shadow-md"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md text-sm shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 bg-[#0F172A] px-6 py-6 sm:py-8">
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">
              Personal Information
            </h3>
            {renderField("Full Name", userProfile?.fullName)}
            {renderField("Email Address", userProfile?.email)}
            {renderField("Phone Number", userProfile?.number)}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">
              Additional Information
            </h3>
            {renderField("Age", userProfile?.age)}
            {renderField("Gender", userProfile?.gender)}
            {renderField("City", userProfile?.city)}
            {renderField("State", userProfile?.state)}
            {renderField("Pincode", userProfile?.pincode)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
