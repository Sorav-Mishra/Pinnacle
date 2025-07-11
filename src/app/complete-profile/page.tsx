// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function CompleteProfilePage() {
//   const { update: updateSession } = useSession(); // ✅ valid useSession update
//   const router = useRouter();

//   const [form, setForm] = useState({
//     phone: "",
//     age: "",
//     gender: "",
//     dob: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("/api/user/update-profile", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//       // ✅ Trigger session token update with updated data
//       await updateSession?.({
//         user: {
//           phone: form.phone,
//           age: parseInt(form.age),
//           gender: form.gender,
//           dob: form.dob,
//         },
//       });

//       router.push("/");
//     } else {
//       console.error("❌ Profile update failed");
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <label
//           htmlFor="phone"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Phone
//         </label>
//         <input
//           type="text"
//           id="phone"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Enter your phone number"
//           required
//           className="border p-2 w-full"
//         />

//         <label
//           htmlFor="age"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Age
//         </label>
//         <input
//           type="number"
//           id="age"
//           name="age"
//           value={form.age}
//           onChange={handleChange}
//           placeholder="Enter your age"
//           required
//           className="border p-2 w-full"
//         />

//         <label
//           htmlFor="gender"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Gender
//         </label>
//         <select
//           id="gender"
//           name="gender"
//           value={form.gender}
//           onChange={handleChange}
//           required
//           className="border p-2 w-full"
//         >
//           <option value="">Select gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="other">Other</option>
//         </select>

//         <label
//           htmlFor="dob"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Date of Birth
//         </label>
//         <input
//           type="date"
//           id="dob"
//           name="dob"
//           value={form.dob}
//           onChange={handleChange}
//           required
//           className="border p-2 w-full"
//         />

//         <button type="submit" className="bg-black text-white px-4 py-2 w-full">
//           Save
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteProfilePage() {
  const { update: updateSession } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    phone: "",
    age: "",
    gender: "",
    dob: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      // ✅ Update session with new profile values
      await updateSession?.({
        user: {
          phone: form.phone,
          age: parseInt(form.age),
          gender: form.gender,
          dob: form.dob,
        },
      });

      router.push("/");
    } else {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Complete Your Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          action="javascript:void(0) "
          className="space-y-5"
        >
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
