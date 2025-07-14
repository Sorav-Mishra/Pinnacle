"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  dob?: string;
  totalTimeSpent?: number;
  lastLoginAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-screen-lg mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin: All Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2 text-left dark:border-gray-700">
                  Name
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  Email
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  Phone
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  Age
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  Gender
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  DOB
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  Time Spent (sec)
                </th>
                <th className="border p-2 text-left dark:border-gray-700">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border p-2 dark:border-gray-700">
                    {user.name || "N/A"}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.email}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.phone || "—"}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.age ?? "—"}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.gender || "—"}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.dob || "—"}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.totalTimeSpent ?? 0}
                  </td>
                  <td className="border p-2 dark:border-gray-700">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
