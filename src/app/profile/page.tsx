// "use client";

// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import Image from "next/image";

// export default function Profile() {
//   const { data: session, status } = useSession();
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState("");

//   useEffect(() => {
//     if (session?.user?.name) {
//       setName(session.user.name);
//     }
//   }, [session]);

//   if (status === "loading") {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (status === "unauthenticated" || !session) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//         <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full text-center">
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//             Access Denied
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             Please sign in to view your profile
//           </p>
//           <Link
//             href="/api/auth/signin"
//             className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-200"
//           >
//             Sign In
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const handleSave = async () => {
//     console.log("Saving name:", name);
//     setIsEditing(false);
//     // You can add your own API call here to save updated name
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 sm:py-12 px-4">
//       <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
//         <div className="bg-blue-500 p-4 text-white text-center">
//           <h1 className="text-2xl font-bold">User Profile</h1>
//         </div>

//         <div className="flex flex-col items-center p-6 sm:p-8">
//           {session.user?.image ? (
//             <div className="mb-6 relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
//               <Image
//                 src={session.user.image}
//                 alt="Profile picture"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           ) : (
//             <div className="mb-6 h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 text-2xl font-bold border-4 border-white shadow-md">
//               {session.user?.name?.charAt(0) || "U"}
//             </div>
//           )}

//           <div className="w-full space-y-6">
//             {/* User ID */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 User ID
//               </label>
//               <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 text-sm font-mono">
//                 {session.user?.id || "Not available"}
//               </p>
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email
//               </label>
//               <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
//                 {session.user?.email || "Not available"}
//               </p>
//             </div>

//             {/* Name (editable) */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Name
//               </label>
//               {isEditing ? (
//                 <div className="flex flex-col w-full">
//                   <label htmlFor="profile-name-input" className="sr-only">
//                     Edit your name
//                   </label>
//                   <div className="flex flex-col sm:flex-row gap-2">
//                     <input
//                       type="text"
//                       id="profile-name-input"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter your name"
//                       className="flex-grow p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     />
//                     <button
//                       onClick={handleSave}
//                       className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
//                   <p className="text-gray-800 dark:text-gray-200">
//                     {session.user?.name || "Not set"}
//                   </p>
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Phone */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Phone
//               </label>
//               <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
//                 {session.user?.phone || "Not available"}
//               </p>
//             </div>

//             {/* Age */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Age
//               </label>
//               <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
//                 {session.user?.age !== null
//                   ? session.user.age
//                   : "Not available"}
//               </p>
//             </div>

//             {/* Gender */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Gender
//               </label>
//               <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 capitalize">
//                 {session.user?.gender || "Not available"}
//               </p>
//             </div>

//             {/* DOB */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Date of Birth
//               </label>
//               <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
//                 {session.user?.dob
//                   ? new Date(session.user.dob).toDateString()
//                   : "Not available"}
//               </p>
//             </div>

//             {/* Sign Out */}
//             <button
//               onClick={() => (window.location.href = "/api/auth/signout")}
//               className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Profile() {
  const { data: session, status, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please sign in to view your profile
          </p>
          <Link
            href="/api/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: session.user?.phone,
          age: session.user?.age,
          gender: session.user?.gender,
          dob: session.user?.dob,
        }),
      });

      if (res.ok) {
        const updated = await res.json();

        await updateSession?.({
          user: {
            ...session.user,
            name,
            phone: updated.data.phone,
            age: updated.data.age,
            gender: updated.data.gender,
            dob: updated.data.dob,
          },
        });

        setIsEditing(false);
      } else {
        // console.error("❌ Failed to update name");
      }
    } catch {
      // console.error("❌ Error updating profile:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 sm:py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 p-4 text-white text-center">
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        <div className="flex flex-col items-center p-6 sm:p-8">
          {session.user?.image ? (
            <div className="mb-6 relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src={session.user.image}
                alt="Profile picture"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mb-6 h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 text-2xl font-bold border-4 border-white shadow-md">
              {session.user?.name?.charAt(0) || "U"}
            </div>
          )}

          <div className="w-full space-y-6">
            {/* User ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                User ID
              </label>
              <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 text-sm font-mono">
                {session.user?.id || "Not available"}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
                {session.user?.email || "Not available"}
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <p className="text-gray-800 dark:text-gray-200">
                    {session.user?.name || "Not set"}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
                {session.user?.phone || "Not available"}
              </p>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
                {session.user?.age ?? "Not available"}
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 capitalize">
                {session.user?.gender || "Not available"}
              </p>
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">
                {session.user?.dob
                  ? new Date(session.user.dob).toDateString()
                  : "Not available"}
              </p>
            </div>

            {/* Sign Out */}
            <button
              onClick={() => (window.location.href = "/api/auth/signout")}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
