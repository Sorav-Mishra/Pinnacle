"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// -------------------- Types --------------------
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  number: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
}

interface EditableFields {
  fullName: string;
  city: string;
  state: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// -------------------- Main Component --------------------
export default function Profile() {
  const { data: session, status, update: updateSession } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable form state
  const [editableFields, setEditableFields] = useState<EditableFields>({
    fullName: "",
    city: "",
    state: "",
  });

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(session.user.email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<UserProfile> = await response.json();

      if (result.success && result.data) {
        setUserProfile(result.data);
        setEditableFields({
          fullName: result.data.fullName || "",
          city: result.data.city || "",
          state: result.data.state || "",
        });
      } else {
        throw new Error(result.error || "Failed to fetch profile data");
      }
    } catch (err) {
      // console.error("Error fetching profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load profile data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  // Load profile data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session?.user?.email, fetchUserProfile]);

  // Handle form input changes
  const handleInputChange = useCallback(
    (field: keyof EditableFields, value: string) => {
      setEditableFields((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear any existing messages when user starts editing
      if (error) setError(null);
      if (successMessage) setSuccessMessage(null);
    },
    [error, successMessage]
  );

  // Save profile changes
  const handleSaveProfile = useCallback(async () => {
    if (!session?.user?.email || !userProfile) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          ...editableFields,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result: ApiResponse<UserProfile> = await response.json();

      if (result.success && result.data) {
        setUserProfile(result.data);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");

        // Update session if needed
        if (updateSession) {
          await updateSession({
            user: {
              ...session.user,
              name: result.data.fullName,
            },
          });
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (err) {
      // console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }, [session?.user?.email, userProfile, editableFields, updateSession]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    if (userProfile) {
      setEditableFields({
        fullName: userProfile.fullName || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  }, [userProfile]);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      //console.error("Error signing out:", err);
    }
  }, []);

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Please sign in to view your profile
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Error Loading Profile
          </h1>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            User Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your personal information
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-800 dark:text-green-200 font-medium">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 dark:text-red-200 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {session.user?.image || userProfile?.image ? (
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={
                        session.user?.image ||
                        userProfile?.image ||
                        "/default-avatar.png"
                      }
                      alt="Profile picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                    {userProfile?.fullName?.charAt(0) ||
                      session.user?.name?.charAt(0) ||
                      "U"}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {userProfile?.fullName || session.user?.name || "User"}
                  </h2>
                  <p className="text-blue-100">
                    {userProfile?.email || session.user?.email}
                  </p>
                  {userProfile?.lastLoginAt && (
                    <p className="text-blue-200 text-sm">
                      Last login:{" "}
                      {new Date(userProfile.lastLoginAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Edit/Save Button */}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition duration-200 backdrop-blur-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Personal Information
                </h3>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableFields.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                      {userProfile?.fullName || "Not available"}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                    {userProfile?.emailVerified && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Verified
                      </span>
                    )}
                  </label>
                  <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                    {userProfile?.email || "Not available"}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                    {userProfile?.phoneVerified && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Verified
                      </span>
                    )}
                  </label>
                  <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                    {userProfile?.number || "Not available"}
                  </p>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Age
                  </label>
                  <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                    {userProfile?.age
                      ? `${userProfile.age} years old`
                      : "Not available"}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Additional Information
                </h3>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender
                  </label>
                  <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 capitalize">
                    {userProfile?.gender || "Not specified"}
                  </p>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableFields.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your city"
                    />
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                      {userProfile?.city || "Not available"}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableFields.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your state"
                    />
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                      {userProfile?.state || "Not available"}
                    </p>
                  )}
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userProfile?.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {userProfile?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">User ID:</span>
                  <span className="ml-2 font-mono">
                    {userProfile?.id || "Not available"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Member since:</span>
                  <span className="ml-2">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => fetchUserProfile()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Refresh Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
